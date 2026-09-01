// settings.js — CES System Settings
(function () {

  // ── DEFAULT CONFIG ──────────────────────────────────────────────────────────
  const DEFAULTS = {
    companyName : 'Creative Event Services',
    managerName : 'Shane Williams',
    email       : '',
    currency    : '$',
    dateFormat  : 'MM/DD/YYYY',
    compactMode : false
  };

  // Load from localStorage (persists permanently)
  function loadConfig() {
    try {
      const raw = localStorage.getItem('ces_settings');
      return raw ? Object.assign({}, DEFAULTS, JSON.parse(raw)) : Object.assign({}, DEFAULTS);
    } catch(e) { return Object.assign({}, DEFAULTS); }
  }

  function saveConfig(cfg) {
    try { localStorage.setItem('ces_settings', JSON.stringify(cfg)); } catch(e) {}
  }

  // Expose on CES global so other modules can read currency / company name
  CES.config = loadConfig();

  // ── OPEN SETTINGS MODAL ─────────────────────────────────────────────────────
  window.openSettings = function () {
    const c = CES.config;
    document.getElementById('cfg-company-name').value   = c.companyName;
    document.getElementById('cfg-manager-name').value   = c.managerName;
    document.getElementById('cfg-email').value          = c.email;
    document.getElementById('cfg-currency').value       = c.currency;
    document.getElementById('cfg-date-format').value    = c.dateFormat;
    // cfg-compact-mode removed from UI
    // Render team list + apply role restrictions
    if (typeof renderTeamAccess === 'function') renderTeamAccess();
    if (window.CES_AUTH) window.CES_AUTH.applyUI();
    openModal('modal-settings');
  };

  // ── SAVE SETTINGS ───────────────────────────────────────────────────────────
  window.saveSettings = function () {
    const c = {
      companyName : document.getElementById('cfg-company-name').value.trim()  || DEFAULTS.companyName,
      managerName : document.getElementById('cfg-manager-name').value.trim()  || DEFAULTS.managerName,
      email       : document.getElementById('cfg-email').value.trim()         || DEFAULTS.email,
      currency    : document.getElementById('cfg-currency').value,
      dateFormat  : document.getElementById('cfg-date-format').value,
      compactMode : false
    };

    CES.config = c;
    saveConfig(c);
    applyCompactMode(c.compactMode);
    closeModal('modal-settings');

    // Flash confirmation on gear button
    const btn = document.querySelector('[title="Settings"]');
    if (btn) {
      btn.style.color = 'var(--ces-cyan)';
      setTimeout(() => btn.style.color = '', 1500);
    }
  };

  // ── COMPACT MODE ────────────────────────────────────────────────────────────
  window.applyCompactMode = function (on) {
    document.body.classList.toggle('compact-mode', !!on);
  };

  // Apply compact mode on load if previously set
  applyCompactMode(CES.config.compactMode);

  // ── EXPORT ALL DATA ─────────────────────────────────────────────────────────
  window.exportAllData = function () {
    const ts = new Date().toISOString().slice(0, 10);

    const modules = [
      {
        name: 'Events',
        data: CES.events,
        cols: ['id','name','clientName','venue','date','setupTime','strikeTime','eventStart','eventEnd','type','manager','revenue','status','notes']
      },
      {
        name: 'Staff',
        data: CES.staff,
        cols: ['id','name','role','skill','phone','email','availability','performance','events']
      },
      {
        name: 'Inventory',
        data: CES.inventory,
        cols: ['id','name','category','qty','available','status','condition','value','location']
      },
      {
        name: 'Logistics',
        data: CES.logistics,
        cols: ['id','eventId','eventName','truck','truckType','driver','departure','arrival','fuel','rental','route','status']
      },
    ];

    modules.forEach(m => {
      if (!m.data || !m.data.length) return;
      const header = m.cols.join(',');
      const rows   = m.data.map(row =>
        m.cols.map(k => {
          const v = row[k] !== undefined ? row[k] : '';
          const s = String(v).replace(/"/g, '""');
          return s.includes(',') || s.includes('\n') ? `"${s}"` : s;
        }).join(',')
      );
      const csv = [header, ...rows].join('\n');
      downloadFile(`CES_${m.name}_${ts}.csv`, 'text/csv', csv);
    });
  };

  function downloadFile(filename, type, content) {
    const a  = document.createElement('a');
    const bl = new Blob([content], { type });
    a.href   = URL.createObjectURL(bl);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

})();
