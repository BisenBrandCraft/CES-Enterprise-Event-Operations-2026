// ════════════════════════════════════════════════════════════════════════════
// CES ENTERPRISE OPERATIONS SYSTEM — auth.js
// Login, Session Management & Role-Based Access Control
// ════════════════════════════════════════════════════════════════════════════
(function () {

  const USERS_KEY   = 'CES_USERS';
  const SESSION_KEY = 'CES_SESSION';
  const LOGIN_REQUIRED = window.CES_LOGIN_REQUIRED === true;
  const DEMO_OWNER = {
    id: 'demo-owner', name: 'Demo User', email: '', role: 'owner'
  };

  // ── STORAGE HELPERS ───────────────────────────────────────────────────────
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch (e) { return []; }
  }
  function setUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch (e) { return null; }
  }
  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      id: user.id, name: user.name, email: user.email,
      role: user.role, loginTime: new Date().toISOString()
    }));
  }
  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  // ── ROLE BADGE STYLE HELPER ───────────────────────────────────────────────
  function roleBadgeStyle(role) {
    const s = {
      owner:  'background:rgba(255,214,0,0.15);color:#FFD600;border:1px solid rgba(255,214,0,0.3)',
      editor: 'background:rgba(0,146,200,0.15);color:#00A8E0;border:1px solid rgba(0,146,200,0.3)',
      viewer: 'background:rgba(78,90,110,0.2);color:#8892A4;border:1px solid rgba(255,255,255,0.06)'
    };
    return s[role] || s.viewer;
  }

  // ── GLOBAL CES_AUTH OBJECT ────────────────────────────────────────────────
  window.CES_AUTH = {
    session: null,
    loginRequired: LOGIN_REQUIRED,

    canEdit:  function () { return this.session && ['owner', 'editor'].includes(this.session.role); },
    isOwner:  function () { return this.session && this.session.role === 'owner'; },
    isViewer: function () { return this.session && this.session.role === 'viewer'; },

    // Apply role restrictions to current DOM
    applyUI: function () {
      if (!this.session) return;
      const viewer = this.isViewer();
      const owner  = this.isOwner();

      // Hide Add/New/Dispatch buttons for viewers
      document.querySelectorAll('.page-actions button').forEach(function (btn) {
        const txt = btn.textContent.trim();
        if (/^\+/.test(txt) || /^New |^Add |^New\b/.test(txt)) {
          btn.style.display = viewer ? 'none' : '';
        }
      });

      // Hide Edit & Delete buttons in table rows for viewers
      document.querySelectorAll('td button').forEach(function (btn) {
        const txt = btn.textContent.trim();
        if (txt.includes('Edit') || txt === '🗑️' || txt.includes('✏️') || txt.includes('Delete')) {
          btn.style.display = viewer ? 'none' : '';
        }
      });

      // Team Access section — owner only
      const teamSection = document.getElementById('settings-team-access');
      if (teamSection) teamSection.style.display = owner && LOGIN_REQUIRED ? '' : 'none';

      // Reset section — owner only
      const resetSection = document.getElementById('settings-reset-section');
      if (resetSection) resetSection.style.display = owner ? '' : 'none';
    },

    getUsers: getUsers,

    addUser: function (name, email, password, role) {
      const existing = getUsers();
      if (existing.find(function (u) { return u.email === email; })) {
        return { error: 'This email is already registered' };
      }
      const newUser = {
        id: 'usr-' + Date.now(), name: name, email: email,
        password: password, role: role, createdAt: new Date().toISOString()
      };
      existing.push(newUser);
      setUsers(existing);
      // Also save to Firestore if enabled
      if (window.CES_DB) window.CES_DB.saveUser(newUser);
      return { success: true };
    },

    removeUser: function (id) {
      if (this.session && this.session.id === id) return { error: 'Cannot remove yourself' };
      setUsers(getUsers().filter(function (u) { return u.id !== id; }));
      // Also delete from Firestore if enabled
      if (window.CES_DB) window.CES_DB.deleteUser(id);
      return { success: true };
    },

    logout: function () {
      if (confirm('Sign out of CES?')) { clearSession(); location.reload(); }
    }
  };

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  window.cesLogin = async function () {
    const email    = (document.getElementById('login-email').value || '').trim();
    const password = document.getElementById('login-password').value || '';

    if (!email || !password) {
      showLoginError('Please enter your email and password'); return;
    }

    // Fetch users — from Firestore if enabled, else localStorage
    let users = getUsers();
    if (window.CES_DB) {
      try { const fb = await window.CES_DB.getUsers(); if (fb.length) { users = fb; setUsers(fb); } } catch (e) {}
    }

    // Try to find user in list
    let user = users.find(function (u) { return u.email === email && u.password === password; });

    if (!user) {
      showLoginError('Invalid email or password');
      const card = document.getElementById('login-card');
      if (card) {
        card.classList.add('shake');
        setTimeout(function () { card.classList.remove('shake'); }, 450);
      }
      return;
    }

    setSession(user);
    window.CES_AUTH.session = { id: user.id, name: user.name, email: user.email, role: user.role };

    // Hide login overlay
    document.getElementById('ces-login-overlay').style.display = 'none';

    // If Firebase enabled — init DB (loads Firestore data) before showing app
    if (window.CES_DB) {
      await window.CES_DB.init();
    }

    document.querySelector('.app-layout').style.display = 'flex';
    updateTopbarUser();
    setTimeout(function () { window.CES_AUTH.applyUI(); }, 200);

    // Re-render dashboard with fresh Firestore data
    if (window.__cesRender && window.__cesRender['dashboard']) {
      window.__cesRender['dashboard']();
    }
  };

  function showLoginError(msg) {
    const el = document.getElementById('login-error');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  // ── TOPBAR USER ───────────────────────────────────────────────────────────
  function updateTopbarUser() {
    const s = window.CES_AUTH.session;
    if (!s) return;
    const initials = s.name.split(' ').map(function (n) { return n[0] || ''; }).join('').toUpperCase().slice(0, 2);
    const avatar = document.getElementById('user-avatar');
    if (avatar) { avatar.textContent = initials; }
    const nameEl = document.getElementById('topbar-user-name');
    if (nameEl) nameEl.textContent = s.name;
    const roleEl = document.getElementById('topbar-user-role');
    if (roleEl) {
      roleEl.textContent = s.role.charAt(0).toUpperCase() + s.role.slice(1);
      roleEl.className = 'topbar-role-tag role-' + s.role;
    }
  }

  window.toggleUserMenu = function () {
    const menu = document.getElementById('user-dropdown-menu');
    if (!menu) return;
    const s = window.CES_AUTH.session;
    if (s) {
      const n = document.getElementById('dd-user-name');
      const e = document.getElementById('dd-user-email');
      const r = document.getElementById('dd-user-role');
      if (n) n.textContent = s.name;
      if (e) e.textContent = s.email;
      if (r) { r.textContent = s.role.charAt(0).toUpperCase() + s.role.slice(1); r.style.cssText = roleBadgeStyle(s.role) + ';font-size:9px;font-weight:700;padding:2px 8px;border-radius:99px;letter-spacing:0.5px'; }
    }
    const visible = menu.style.display !== 'none';
    menu.style.display = visible ? 'none' : 'block';
    if (!visible) {
      setTimeout(function () {
        document.addEventListener('click', function closeDD(e) {
          if (!e.target.closest('#user-dropdown-menu') && !e.target.closest('#topbar-user-btn')) {
            menu.style.display = 'none';
            document.removeEventListener('click', closeDD);
          }
        });
      }, 10);
    }
  };

  window.cesLogout = function () {
    clearSession(); location.reload();
  };

  // ── TEAM MANAGEMENT (Settings modal) ─────────────────────────────────────
  window.renderTeamAccess = async function () {
    const listEl = document.getElementById('team-members-list');
    if (!listEl) return;
    // Load from Firestore if enabled, fallback to localStorage
    let users = getUsers();
    if (window.CES_DB) {
      try { const fb = await window.CES_DB.getUsers(); if (fb.length) { users = fb; setUsers(fb); } } catch (e) {}
    }
    const session = window.CES_AUTH.session;
    listEl.innerHTML = users.map(function (u) {
      const isSelf   = session && session.id === u.id;
      const initials = u.name.split(' ').map(function (n) { return n[0] || ''; }).join('').toUpperCase().slice(0, 2);
      const roleOpts = ['editor','viewer'].map(function(r){
        return `<option value="${r}" ${u.role===r?'selected':''}>${r.charAt(0).toUpperCase()+r.slice(1)}</option>`;
      }).join('');
      return `
        <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border-subtle)">
          <div style="width:30px;height:30px;border-radius:50%;background:var(--info-bg);border:1px solid var(--ces-blue);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--ces-cyan);flex-shrink:0">${initials}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:600;color:var(--text-primary)">${u.name}${isSelf ? ' <span style="font-size:9px;color:var(--text-muted)">(you)</span>' : ''}</div>
            <div style="font-size:10px;color:var(--text-muted)">${u.email}</div>
          </div>
          ${isSelf
            ? `<span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:99px;letter-spacing:0.5px;${roleBadgeStyle(u.role)}">${u.role.toUpperCase()}</span>`
            : `<select onchange="updateTeamMemberRole('${u.id}',this.value)" style="background:var(--bg-input);border:1px solid var(--border);border-radius:6px;color:var(--text-primary);font-size:11px;font-weight:600;padding:3px 8px;cursor:pointer">${roleOpts}</select>
               <button onclick="removeTeamMember('${u.id}')" style="background:transparent;border:1px solid rgba(244,67,54,0.3);border-radius:6px;color:#f44336;font-size:10px;font-weight:600;padding:3px 9px;cursor:pointer;transition:background 0.15s;white-space:nowrap" onmouseover="this.style.background='rgba(244,67,54,0.1)'" onmouseout="this.style.background='transparent'">Remove</button>`
          }
        </div>`;
    }).join('') || '<div style="font-size:11px;color:var(--text-muted);padding:8px 0">No team members yet</div>';
  };

  window.addTeamMember = function () {
    const name     = (document.getElementById('new-member-name').value     || '').trim();
    const email    = (document.getElementById('new-member-email').value    || '').trim();
    const password = (document.getElementById('new-member-password').value || '').trim();
    const role     = document.getElementById('new-member-role').value;
    const errEl    = document.getElementById('team-add-error');

    if (!name || !email || !password) {
      errEl.textContent = 'All fields are required'; errEl.style.display = 'block'; return;
    }
    if (!email.includes('@')) {
      errEl.textContent = 'Please enter a valid email'; errEl.style.display = 'block'; return;
    }

    const result = window.CES_AUTH.addUser(name, email, password, role);
    if (result.error) {
      errEl.textContent = result.error; errEl.style.display = 'block'; return;
    }

    errEl.style.display = 'none';
    document.getElementById('new-member-name').value     = '';
    document.getElementById('new-member-email').value    = '';
    document.getElementById('new-member-password').value = '';
    document.getElementById('new-member-role').value     = 'editor';
    renderTeamAccess();
  };

  window.removeTeamMember = function (id) {
    if (!confirm('Remove this team member? They will no longer be able to log in.')) return;
    const result = window.CES_AUTH.removeUser(id);
    if (result.error) { alert(result.error); return; }
    renderTeamAccess();
  };

  window.updateTeamMemberRole = function (id, newRole) {
    const users = getUsers();
    const user  = users.find(function(u){ return u.id === id; });
    if (!user) return;
    user.role = newRole;
    setUsers(users);
    if (window.CES_DB) window.CES_DB.saveUser(user);
    renderTeamAccess();
  };

  // ── INIT ON DOM READY ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', async function () {
    const overlay   = document.getElementById('ces-login-overlay');
    const appLayout = document.querySelector('.app-layout');
    const session   = getSession();

    if (!LOGIN_REQUIRED) {
      // Public development/demo mode: no credentials are read, created or stored.
      clearSession();
      window.CES_AUTH.session = DEMO_OWNER;
      if (overlay) overlay.style.display = 'none';

      if (window.CES_DB) await window.CES_DB.init();

      if (appLayout) appLayout.style.display = 'flex';
      updateTopbarUser();
      setTimeout(function () {
        window.CES_AUTH.applyUI();
        if (window.__cesRender && window.__cesRender['dashboard']) {
          window.__cesRender['dashboard']();
        }
      }, 100);
    } else if (session) {
      window.CES_AUTH.session = session;
      if (overlay) overlay.style.display = 'none';

      // If Firebase enabled — load fresh data before showing app
      if (window.CES_DB) {
        await window.CES_DB.init();
        // Also sync users from Firestore to localStorage
        try {
          const fbUsers = await window.CES_DB.getUsers();
          if (fbUsers.length) setUsers(fbUsers);
        } catch (e) {}
      }

      if (appLayout) appLayout.style.display = 'flex';
      updateTopbarUser();
      setTimeout(function () {
        window.CES_AUTH.applyUI();
        if (window.__cesRender && window.__cesRender['dashboard']) {
          window.__cesRender['dashboard']();
        }
      }, 100);
    } else {
      if (overlay)   overlay.style.display = 'flex';
      if (appLayout) appLayout.style.display = 'none';
    }

    // Enter key support on login form
    var pwInput = document.getElementById('login-password');
    var emInput = document.getElementById('login-email');
    if (pwInput) pwInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') cesLogin(); });
    if (emInput) emInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') pwInput && pwInput.focus(); });
  });

})();
