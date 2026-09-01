// staff.js — Staff Operations Module
(function(){
  const el = document.getElementById('panel-staff');

  function render() {
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">Staff Operations</div>
          <div class="page-subtitle">${CES.staff.length} team members · ${CES.staff.filter(s=>s.availability==='Available').length} available</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline" onclick="exportStaff()">⬇ Export</button>
          <button class="btn btn-outline" onclick="openAddStaffModal()">+ Add Staff</button>
        </div>
      </div>
      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
        ${kpi('Total Staff',CES.staff.length,'Members enrolled')}
        ${kpi('Available',CES.staff.filter(s=>s.availability==='Available').length,'Ready to assign')}
        ${kpi('On Duty',CES.staff.filter(s=>s.availability==='Busy').length,'Currently deployed')}
        ${kpi('Avg Performance',Math.round(CES.staff.reduce((a,s)=>a+s.performance,0)/CES.staff.length)+'%','Team average')}
      </div>
      <div style="display:flex;gap:20px;align-items:flex-start;margin-bottom:20px">
        <div class="card" style="flex:1;min-width:0">
          <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Staff Directory</span></div>
          <div class="filter-bar" style="padding:12px 12px 0">
            <div class="search-box"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input id="stf-search" placeholder="Search staff..." oninput="filterStaff()"></div>
            <select class="filter-select" id="stf-avail" onchange="filterStaff()"><option value="">All</option><option>Available</option><option>Busy</option></select>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Staff ID</th><th>Name</th><th>Role</th><th>Skill</th><th>Availability</th><th>Email</th><th>Events</th><th>Performance</th><th>Actions</th></tr></thead>
              <tbody id="stf-table"></tbody>
            </table>
          </div>
        </div>
        <div style="width:280px;flex-shrink:0">
          <div class="card" style="margin-bottom:16px">
            <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Top Performers</span></div>
            <div class="card-body" style="padding:8px">
              ${[...CES.staff].sort((a,b)=>b.performance-a.performance).slice(0,5).map(s=>`
                <div class="staff-card">
                  ${staffAvatarHtml(s, '36px', '13px')}
                  <div class="staff-info"><div class="staff-name">${s.name}</div><div class="staff-role">${s.role}</div></div>
                  <div class="staff-score">${s.performance}</div>
                </div>`).join('')}
            </div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Workload Chart</span></div>
            <div class="card-body"><canvas id="staffChart" height="160"></canvas></div>
          </div>
        </div>
      </div>`;
    renderStaffTable(CES.staff);
    renderStaffChart();
  }

  function kpi(l,v,s){ return `<div class="kpi-card"><div class="kpi-label">${l}</div><div class="kpi-value">${v}</div><div class="kpi-sub">${s}</div></div>`; }

  // Returns a photo img or initials avatar for a staff member
  function staffAvatarHtml(s, size, fontSize) {
    size     = size     || '28px';
    fontSize = fontSize || '10px';
    if (s.photo) {
      return `<img src="${s.photo}" style="width:${size};height:${size};border-radius:50%;object-fit:cover;flex-shrink:0">`;
    }
    return `<div class="staff-avatar" style="width:${size};height:${size};font-size:${fontSize}">${s.name.split(' ').map(function(n){return n[0];}).join('')}</div>`;
  }

  function renderStaffTable(staff) {
    document.getElementById('stf-table').innerHTML = staff.map(s=>`
      <tr ondblclick="editStaff('${s.id}')" style="cursor:pointer" title="Double-click to edit">
        <td><span class="id-cell">${s.id}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            ${staffAvatarHtml(s, '30px', '10px')}
            <strong>${s.name}</strong>
          </div>
        </td>
        <td>${s.role}</td>
        <td><span class="badge badge-info">${s.skill}</span></td>
        <td><span class="badge ${s.availability==='Available'?'badge-success':'badge-warning'}">${s.availability}</span></td>
        <td style="font-size:11px;color:var(--text-secondary)">${s.email || '—'}</td>
        <td>${s.events}</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <div class="progress-bar" style="width:60px"><div class="progress-fill ${s.performance>90?'success':''}" style="width:${s.performance}%"></div></div>
            <span style="font-size:10px;font-weight:700">${s.performance}%</span>
          </div>
        </td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-outline btn-sm" onclick="editStaff('${s.id}')">✏️ Edit</button>
            <button class="btn btn-outline btn-sm" style="color:#f44336;border-color:rgba(244,67,54,0.3)" onclick="deleteStaff('${s.id}')">🗑️</button>
          </div>
        </td>
      </tr>`).join('');
  }

  window.filterStaff = function() {
    const q = document.getElementById('stf-search').value.toLowerCase();
    const a = document.getElementById('stf-avail').value;
    renderStaffTable(CES.staff.filter(s=>(!q||s.name.toLowerCase().includes(q)||s.role.toLowerCase().includes(q))&&(!a||s.availability===a)));
  };

  window.openAddStaffModal = function() {
    document.getElementById('edit-staff-id').value = '';
    document.getElementById('staff-modal-title').textContent = '➕ Add New Staff';
    document.getElementById('new-staff-name').value = '';
    document.getElementById('new-staff-phone').value = '';
    document.getElementById('new-staff-email').value = '';
    document.getElementById('new-staff-role').value = '';
    document.getElementById('new-staff-skill').selectedIndex = 0;
    document.getElementById('new-staff-avail').value = 'Available';
    document.getElementById('btn-delete-staff').style.display = 'none';
    document.getElementById('btn-submit-staff').textContent = '✅ Add Staff';
    resetStaffPhotoUI(null, '?');
    openModal('modal-add-staff');
  };

  window.editStaff = function(id) {
    const s = CES.staff.find(x=>x.id===id);
    if (!s) return;
    document.getElementById('edit-staff-id').value = id;
    document.getElementById('staff-modal-title').textContent = '✏️ Edit Staff — ' + s.name;
    document.getElementById('new-staff-name').value = s.name;
    document.getElementById('new-staff-phone').value = s.phone !== '—' ? s.phone : '';
    document.getElementById('new-staff-email').value = s.email || '';
    document.getElementById('new-staff-role').value = s.role;
    document.getElementById('new-staff-skill').value = s.skill;
    document.getElementById('new-staff-avail').value = s.availability;
    document.getElementById('btn-delete-staff').style.display = 'block';
    document.getElementById('btn-submit-staff').textContent = '✅ Save Changes';
    const initials = s.name.split(' ').map(n=>n[0]).join('');
    resetStaffPhotoUI(s.photo || null, initials);
    openModal('modal-add-staff');
  };

  window.deleteStaff = function(id) {
    const s = CES.staff.find(x=>x.id===id);
    if (!s) return;
    if (!confirm(`⚠️ Remove ${s.name} from the system?\n\nThis action cannot be undone.`)) return;
    CES.staff = CES.staff.filter(x=>x.id!==id);
    closeModal('modal-add-staff');
    render();
  };

  window.submitNewStaff = function() {
    const name = document.getElementById('new-staff-name').value.trim();
    if (!name) { alert('⚠️ Full Name is required!'); return; }

    const phone        = document.getElementById('new-staff-phone').value.trim() || '—';
    const email        = document.getElementById('new-staff-email').value.trim() || '';
    const role         = document.getElementById('new-staff-role').value.trim() || 'General Staff';
    const skill        = document.getElementById('new-staff-skill').value;
    const availability = document.getElementById('new-staff-avail').value;
    const editId       = document.getElementById('edit-staff-id').value;
    const photo        = window._staffPhotoData;   // null=no-change, ''=removed, 'data:...'=new photo

    if (editId) {
      // ── EDIT MODE ──────────────────────────────────────────────
      const s = CES.staff.find(x=>x.id===editId);
      if (s) {
        s.name=name; s.phone=phone; s.email=email; s.role=role; s.skill=skill; s.availability=availability;
        if (photo !== null) s.photo = photo;   // null means "no change"; empty string means "removed"
      }
      closeModal('modal-add-staff');
      render();
    } else {
      // ── ADD MODE ───────────────────────────────────────────────
      const id = 'CES-STF-' + String(CES.staff.length + 1).padStart(3, '0');
      CES.staff.push({ id, name, role, skill, availability, performance: 0, events: 0, phone, email, photo: photo || '' });
      if (window.CES_DB && window.CES_DB.triggerSync) window.CES_DB.triggerSync();
      closeModal('modal-add-staff');
      render();
      setTimeout(() => alert(`✅ Staff Added!\n\n${name} has been added as ${role}.\nPerformance score initialised to 0% until assigned to an event.`), 100);
    }
  };

  // ── PHOTO UPLOAD HELPERS ───────────────────────────────────────────────────
  // _staffPhotoData: null = no change; '' = photo removed; 'data:...' = new photo
  window._staffPhotoData = null;

  function resetStaffPhotoUI(photoSrc, initials) {
    window._staffPhotoData = null;
    const preview  = document.getElementById('staff-photo-preview');
    const initialsEl = document.getElementById('staff-photo-initials');
    const removeBtn  = document.getElementById('btn-remove-photo');
    const fileInput  = document.getElementById('staff-photo-input');
    if (!preview) return;
    // Clear previous state
    preview.innerHTML = '';
    fileInput.value = '';
    if (photoSrc) {
      const img = document.createElement('img');
      img.src = photoSrc;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%';
      preview.appendChild(img);
      if (removeBtn) removeBtn.style.display = 'block';
    } else {
      const span = document.createElement('span');
      span.id = 'staff-photo-initials';
      span.style.cssText = 'font-size:26px;font-weight:700;color:var(--ces-blue);pointer-events:none';
      span.textContent = initials || '?';
      preview.appendChild(span);
      if (removeBtn) removeBtn.style.display = 'none';
    }
  }

  window.handleStaffPhotoUpload = function(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) { alert('⚠️ Photo must be under 5 MB.'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
      window._staffPhotoData = e.target.result;
      const preview = document.getElementById('staff-photo-preview');
      preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
      const removeBtn = document.getElementById('btn-remove-photo');
      if (removeBtn) removeBtn.style.display = 'block';
    };
    reader.readAsDataURL(file);
  };

  window.removeStaffPhoto = function() {
    window._staffPhotoData = '';   // empty string signals "remove"
    const nameVal = document.getElementById('new-staff-name').value.trim();
    const initials = nameVal ? nameVal.split(' ').map(n=>n[0]).join('') : '?';
    resetStaffPhotoUI(null, initials);
  };

  window.updateStaffPhotoInitials = function() {
    // Only update initials if no photo is currently shown
    const preview = document.getElementById('staff-photo-preview');
    if (!preview) return;
    const img = preview.querySelector('img');
    if (img) return;   // photo is loaded — don't overwrite
    const nameVal = document.getElementById('new-staff-name').value.trim();
    const initialsEl = document.getElementById('staff-photo-initials');
    if (initialsEl) initialsEl.textContent = nameVal ? nameVal.split(' ').map(n=>n[0]).join('') : '?';
  };

  window.exportStaff = function() {
    const rows=[['ID','Name','Role','Skill','Availability','Email','Phone','Events','Performance']];
    CES.staff.forEach(s=>rows.push([s.id,s.name,s.role,s.skill,s.availability,s.email||'',s.phone||'',s.events,s.performance+'%']));
    const csv=rows.map(r=>r.join(',')).join('\n');
    const a=document.createElement('a');a.href='data:text/csv,'+encodeURIComponent(csv);a.download='CES_Staff.csv';a.click();
  };

  function renderStaffChart() {
    const ctx = document.getElementById('staffChart').getContext('2d');
    new Chart(ctx,{
      type:'bar',
      data:{
        labels:CES.staff.map(s=>s.name.split(' ')[0]),
        datasets:[{label:'Performance %',data:CES.staff.map(s=>s.performance),backgroundColor:'rgba(0,146,200,0.7)',borderRadius:4}]
      },
      options:{
        responsive:true,indexAxis:'y',
        plugins:{legend:{display:false}},
        scales:{x:{max:100,ticks:{color:'#8892A4',font:{size:9}},grid:{color:'rgba(255,255,255,0.04)'}},y:{ticks:{color:'#8892A4',font:{size:9}},grid:{display:false}}}
      }
    });
  }

  render();
  window.__cesRender = window.__cesRender || {};
  window.__cesRender['staff'] = render;
})();
