// events.js — Events Module UI
(function(){
  const el = document.getElementById('panel-events');

  function render() {
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">Events Master</div>
          <div class="page-subtitle">${CES.events.length} total events · ${CES.events.filter(e=>e.status==='Active').length} active</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline" onclick="exportEvents()">⬇ Export</button>
          <button class="btn btn-outline" onclick="openNewEventModal()">+ New Event</button>
        </div>
      </div>
      <div class="filter-bar">
        <div class="search-box"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input id="evt-search" placeholder="Search events..." oninput="filterEvents()"></div>
        <select class="filter-select" id="evt-status" onchange="filterEvents()"><option value="">All Status</option><option>Active</option><option>Confirmed</option><option>Planning</option><option>Tentative</option><option>Completed</option></select>
        <select class="filter-select" id="evt-type" onchange="filterEvents()"><option value="">All Types</option><option>Holiday</option><option>Corporate</option><option>College</option><option>Private / Social</option><option>Mitzvah</option><option>Party Planners / DJ Companies</option></select>
      </div>
      <div style="display:flex;gap:20px;align-items:flex-start;margin-bottom:20px">
        <div class="card" style="flex:1;min-width:0">
          <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>All Events</span><span class="badge badge-info" id="evt-count">${CES.events.length} events</span></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Day / Date</th><th>Event Name</th><th>Client</th><th>Contact Name</th><th>Contact Phone</th><th>Contact Email</th><th>Venue</th><th>Manager</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody id="evt-table-body"></tbody>
            </table>
          </div>
        </div>
        <div style="width:280px;flex-shrink:0">
          <div class="card" style="margin-bottom:16px">
            <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Event Stats</span></div>
            <div class="card-body">
              ${statRow('Total Events',CES.events.length)}
              ${statRow('Active Now',CES.events.filter(e=>e.status==='Active').length)}
              ${statRow('Confirmed',CES.events.filter(e=>e.status==='Confirmed').length)}
              ${statRow('Conflict Alerts',CES.events.filter(e=>hasConflict(e)).length)}
            </div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Timeline Generator</span></div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:10px">
              <select class="filter-select" style="width:100%" id="timeline-evt-sel">${CES.events.map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}</select>
              <button class="btn btn-primary" style="width:100%" onclick="showTimeline()">Generate Timeline</button>
              <div id="timeline-output"></div>
            </div>
          </div>
        </div>
      </div>`;
    renderEvtTable(sortByDate(CES.events));
  }

  function statRow(l,v){ return `<div class="stat-row"><span class="stat-label">${l}</span><span class="stat-value">${v}</span></div>`; }

  function sortByDate(arr) {
    return arr.slice().sort(function(a, b) {
      const da = a.date && a.date !== 'TBD' ? new Date(a.date) : new Date('9999-12-31');
      const db = b.date && b.date !== 'TBD' ? new Date(b.date) : new Date('9999-12-31');
      return da - db;
    });
  }

  window.filterEvents = function() {
    const q = document.getElementById('evt-search').value.toLowerCase();
    const s = document.getElementById('evt-status').value;
    const t = document.getElementById('evt-type').value;
    const filtered = sortByDate(CES.events.filter(e =>
      (!q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.clientName.toLowerCase().includes(q)) &&
      (!s || e.status===s) && (!t || e.type===t)
    ));
    document.getElementById('evt-count').textContent = filtered.length + ' events';
    renderEvtTable(filtered);
  };

  function hasConflict(e) {
    if (!e.date || e.date === 'TBD') return false;
    const sameDate = CES.events.filter(x => x.id !== e.id && x.date === e.date);
    let conflict = false;
    if (e.truck && e.truck !== '—' && sameDate.some(x => x.truck === e.truck)) conflict = true;
    if (e.staff && e.staff.length && sameDate.some(x => x.staff && x.staff.some(s => e.staff.includes(s)))) conflict = true;
    return conflict;
  }

  function renderEvtTable(evts) {
    document.getElementById('evt-table-body').innerHTML = evts.map(e=>{
      const isConflicted = hasConflict(e);
      return `
      <tr ondblclick="editEvent('${e.id}')" style="cursor:pointer" title="Double-click to edit">
        <td style="min-width:90px">
          <div style="color:var(--ces-blue);font-weight:700;font-size:11px;line-height:1.3">${e.date && e.date!=='TBD' ? new Date(e.date+'T00:00:00').toLocaleDateString('en-US',{weekday:'short'}).toUpperCase() : '—'}</div>
          <div style="color:var(--ces-blue);font-size:10px;opacity:0.85">${e.date || 'TBD'}</div>
        </td>
        <td><strong>${e.name}</strong></td>
        <td>${e.clientName}</td>
        <td style="font-size:11px">${e.contactName || '—'}</td>
        <td style="font-size:11px">${e.contactPhone || '—'}</td>
        <td style="font-size:11px">${e.contactEmail || '—'}</td>
        <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.venue}</td>
        <td>${e.manager}</td>
        <td><span class="badge ${statusBadge(e.status)}">${e.status}</span></td>
        <td title="" ondblclick="event.stopPropagation()">
          <div style="display:flex;gap:4px">
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();editEvent('${e.id}')">✏️ Edit</button>
            <button class="btn btn-outline btn-sm ${isConflicted ? 'btn-conflict' : ''}" onclick="event.stopPropagation();checkConflicts('${e.id}')">⚡</button>
            <button class="btn btn-outline btn-sm" style="color:#f44336;border-color:rgba(244,67,54,0.3)" onclick="event.stopPropagation();deleteEvent('${e.id}')">🗑️</button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  window.checkConflicts = function(id) {
    const e = CES.events.find(x=>x.id===id);
    const truckConflicts = CES.events.filter(x=>x.id!==id && x.truck===e.truck && x.date===e.date);
    if(truckConflicts.length) alert(`⚠️ CONFLICT DETECTED!\n\nTruck ${e.truck} is also assigned to:\n${truckConflicts.map(c=>c.name+' ('+c.date+')').join('\n')}`);
    else alert(`✅ No conflicts detected for ${e.name}`);
  };

  window.showTimeline = function() {
    const id = document.getElementById('timeline-evt-sel').value;
    const e = CES.events.find(x=>x.id===id);
    const steps = [
      {time:'T-24h','icon':'📦','task':'Inventory Pull from Warehouse'},
      {time:'T-4h','icon':'🚛','task':'Truck Loading'},
      {time:e.setupTime,'icon':'🔧','task':'Setup Begins at Venue'},
      {time:e.setupTime.replace(/(\d+)/,(m,h)=>String(+h+2).padStart(2,'0')),'icon':'✅','task':'Setup Complete — Venue Ready'},
      {time:e.strikeTime,'icon':'🔄','task':'Strike Begins'},
      {time:'T+2h','icon':'🏭','task':'Inventory Return to Warehouse'}
    ];
    document.getElementById('timeline-output').innerHTML = steps.map((s,i)=>`
      <div style="display:flex;gap:10px;margin-bottom:8px;align-items:flex-start">
        <div style="width:50px;font-size:10px;color:var(--ces-cyan);font-weight:700;flex-shrink:0;font-family:monospace">${s.time}</div>
        <div style="width:1px;background:var(--border);flex-shrink:0;margin:4px 0;align-self:stretch"></div>
        <div style="font-size:11px;color:var(--text-secondary)">${s.icon} ${s.task}</div>
      </div>`).join('');
  };

  // ── OPEN MODAL (Add mode) ──────────────────────────────────────────────────
  window.openNewEventModal = function() {
    document.getElementById('edit-event-id').value = '';
    document.getElementById('event-modal-title').textContent = '➕ New Event';
    document.getElementById('btn-submit-event').textContent = '✅ Create Event';
    document.getElementById('btn-delete-event').style.display = 'none';
    document.getElementById('new-event-status').value = 'Planning';
    // Clear fields
    ['new-event-name','new-event-client','new-event-venue','new-event-notes'].forEach(id=>{
      const el = document.getElementById(id); if(el) el.value='';
    });
    window.CESDTP.initDate(document.getElementById('ces-dtp-event-date-wrap'), 'new-event-date', '');
    window.CESDTP.initTime(document.getElementById('ces-dtp-setup-wrap'),       'new-event-setup',       '08:00');
    window.CESDTP.initTime(document.getElementById('ces-dtp-strike-wrap'),      'new-event-strike',      '22:00');
    window.CESDTP.initTime(document.getElementById('ces-dtp-event-start-wrap'), 'new-event-event-start', '18:00');
    window.CESDTP.initTime(document.getElementById('ces-dtp-event-end-wrap'),   'new-event-event-end',   '23:00');
    document.getElementById('new-event-type').selectedIndex = 0;
    document.getElementById('new-event-contact-name').value  = '';
    document.getElementById('new-event-contact-phone').value = '';
    document.getElementById('new-event-contact-email').value = '';
    document.getElementById('new-event-truck').value = '';
    openModal('modal-add-event');
    renderStaffPicker([]);
    renderInvPicker([]);
  };

  // ── EDIT EVENT ─────────────────────────────────────────────────────────────
  window.editEvent = function(id) {
    const e = CES.events.find(x=>x.id===id);
    if (!e) return;
    document.getElementById('edit-event-id').value = id;
    document.getElementById('event-modal-title').textContent = '✏️ Edit — ' + e.name;
    document.getElementById('btn-submit-event').textContent = '✅ Save Changes';
    document.getElementById('btn-delete-event').style.display = 'block';
    document.getElementById('new-event-name').value   = e.name;
    document.getElementById('new-event-client').value = e.clientName !== '—' ? e.clientName : '';
    document.getElementById('new-event-venue').value  = e.venue !== '—' ? e.venue : '';
    document.getElementById('new-event-type').value   = e.type;
    window.CESDTP.initDate(document.getElementById('ces-dtp-event-date-wrap'), 'new-event-date',   e.date !== 'TBD' ? e.date : '');
    window.CESDTP.initTime(document.getElementById('ces-dtp-setup-wrap'),       'new-event-setup',        e.setupTime  || '08:00');
    window.CESDTP.initTime(document.getElementById('ces-dtp-strike-wrap'),      'new-event-strike',       e.strikeTime || '22:00');
    window.CESDTP.initTime(document.getElementById('ces-dtp-event-start-wrap'), 'new-event-event-start',  e.eventStart || '18:00');
    window.CESDTP.initTime(document.getElementById('ces-dtp-event-end-wrap'),   'new-event-event-end',    e.eventEnd   || '23:00');
    document.getElementById('new-event-mgr').value           = e.manager;
    document.getElementById('new-event-contact-name').value  = e.contactName  || '';
    document.getElementById('new-event-contact-phone').value = e.contactPhone || '';
    document.getElementById('new-event-contact-email').value = e.contactEmail || '';
    document.getElementById('new-event-truck').value         = e.truck !== '—' ? e.truck : '';
    document.getElementById('new-event-notes').value         = e.notes || '';
    document.getElementById('new-event-status').value = e.status;
    openModal('modal-add-event');
    renderStaffPicker(e.staff || []);
    renderInvPicker(e.inventory || []);
  };

  // ── DELETE EVENT ───────────────────────────────────────────────────────────
  window.deleteEvent = function(id) {
    const e = CES.events.find(x=>x.id===id);
    if (!e) return;
    if (!confirm(`⚠️ Delete "${e.name}"?\n\nStaff assignments will be released. This cannot be undone.`)) return;
    // Release staff
    (e.staff || []).forEach(sid => {
      const s = CES.staff.find(x=>x.id===sid);
      if (s && s.availability==='Busy') s.availability = 'Available';
    });
    CES.events = CES.events.filter(x=>x.id!==id);
    closeModal('modal-add-event');
    render();
  };

  // ── STAFF PICKER ───────────────────────────────────────────────────────────
  function renderStaffPicker(selectedIds) {
    const grid = document.getElementById('staff-picker-grid');
    if (!grid) return;
    const catIcons = {Management:'🎯',Coordination:'📋','AV/Tech':'💻',Inventory:'📦',Driving:'🚛',Setup:'🔧',CRM:'🤝',Audio:'🔊',Lighting:'💡'};
    grid.innerHTML = CES.staff.map(s => {
      const avatarHtml = s.photo
        ? `<img src="${s.photo}" class="staff-pick-avatar" style="object-fit:cover;border-radius:50%">`
        : `<div class="staff-pick-avatar">${s.name.split(' ').map(n=>n[0]).join('')}</div>`;
      return `
      <div class="staff-pick-card${selectedIds.includes(s.id)?' selected':''}" id="spc-${s.id}" onclick="toggleStaffPick('${s.id}')">
        ${avatarHtml}
        <div class="staff-pick-info">
          <div class="staff-pick-name">${s.name}</div>
          <div class="staff-pick-role">${catIcons[s.skill]||'👤'} ${s.role}</div>
          <div style="margin-top:3px">
            <span style="font-size:8px;padding:1px 5px;border-radius:99px;background:${s.availability==='Available'?'rgba(0,200,81,0.15)':'rgba(255,214,0,0.15)'};color:${s.availability==='Available'?'var(--success)':'var(--warning)'}">${s.availability}</span>
            <span style="font-size:8px;color:var(--text-muted);margin-left:4px">$${s.rate}/hr</span>
          </div>
        </div>
        <div class="staff-pick-check" id="spc-chk-${s.id}">✓</div>
      </div>`;
    }).join('');
    updateStaffCount();
  }

  window.toggleStaffPick = function(id) {
    const card = document.getElementById('spc-'+id);
    card.classList.toggle('selected');
    updateStaffCount();
  };

  function updateStaffCount() {
    const selected = document.querySelectorAll('#staff-picker-grid .staff-pick-card.selected').length;
    const badge = document.getElementById('staff-selected-count');
    if (badge) badge.textContent = selected + ' staff selected';
  }

  function getSelectedStaffIds() {
    return [...document.querySelectorAll('#staff-picker-grid .staff-pick-card.selected')]
      .map(el => el.id.replace('spc-',''));
  }

  // ── INVENTORY PICKER ───────────────────────────────────────────────────────
  function renderInvPicker(selectedIds) {
    const grid = document.getElementById('inv-picker-grid');
    if (!grid) return;
    const available = CES.inventory.filter(i => i.available > 0);
    grid.innerHTML = available.map(i => `
      <div class="inv-pick-card${selectedIds.includes(i.id)?' selected':''}" id="ipc-${i.id}" onclick="toggleInvPick('${i.id}')">
        <div class="inv-pick-icon">${i.emoji && i.emoji.startsWith('assets/') ? `<img src="${i.emoji}" style="width:20px;height:20px;opacity:0.85;filter:brightness(1.2)">` : (i.emoji || '📦')}</div>
        <div style="flex:1;min-width:0">
          <div class="inv-pick-name">${i.name}</div>
          <div class="inv-pick-avail">${i.available}/${i.qty} avail · ${i.location}</div>
        </div>
        <div class="inv-pick-check" id="ipc-chk-${i.id}">✓</div>
      </div>`).join('');
    updateInvCount();
  }

  window.toggleInvPick = function(id) {
    const card = document.getElementById('ipc-'+id);
    card.classList.toggle('selected');
    updateInvCount();
  };

  function updateInvCount() {
    const selected = document.querySelectorAll('#inv-picker-grid .inv-pick-card.selected').length;
    const badge = document.getElementById('inv-selected-count');
    if (badge) badge.textContent = selected + (selected===1?' item':' items') + ' selected';
  }

  function getSelectedInvIds() {
    return [...document.querySelectorAll('#inv-picker-grid .inv-pick-card.selected')]
      .map(el => el.id.replace('ipc-',''));
  }

  // ── SAVE EVENT (Add + Edit) ────────────────────────────────────────────────
  window.addEvent = function() {
    const name = document.getElementById('new-event-name').value.trim();
    if (!name) { alert('⚠️ Event Name is required!'); return; }

    const editId        = document.getElementById('edit-event-id').value;
    const selectedStaff = getSelectedStaffIds();
    const selectedInv   = getSelectedInvIds();
    const staffNames    = selectedStaff.map(id => { const s = CES.staff.find(x=>x.id===id); return s ? s.name : id; });
    const date          = document.getElementById('new-event-date').value || 'TBD';
    const truck         = document.getElementById('new-event-truck').value || '—';

    if (editId) {
      // ── EDIT MODE ────────────────────────────────────────────────────────
      const evt = CES.events.find(x=>x.id===editId);
      if (!evt) return;

      // Release old staff before reassigning
      (evt.staff || []).forEach(sid => {
        const s = CES.staff.find(x=>x.id===sid);
        if (s) s.availability = 'Available';
      });

      evt.name       = name;
      evt.clientName = document.getElementById('new-event-client').value  || '—';
      evt.venue      = document.getElementById('new-event-venue').value   || '—';
      evt.type       = document.getElementById('new-event-type').value;
      evt.date       = date;
      evt.setupTime  = document.getElementById('new-event-setup').value        || '08:00';
      evt.strikeTime = document.getElementById('new-event-strike').value       || '22:00';
      evt.eventStart = document.getElementById('new-event-event-start').value  || '18:00';
      evt.eventEnd   = document.getElementById('new-event-event-end').value    || '23:00';
      evt.manager      = document.getElementById('new-event-mgr').value;
      evt.contactName  = document.getElementById('new-event-contact-name').value  || '';
      evt.contactPhone = document.getElementById('new-event-contact-phone').value || '';
      evt.contactEmail = document.getElementById('new-event-contact-email').value || '';
      evt.staff        = selectedStaff;
      evt.staffNames   = staffNames;
      evt.inventory    = selectedInv;
      evt.truck        = truck;
      evt.status     = document.getElementById('new-event-status').value;
      evt.notes      = document.getElementById('new-event-notes').value   || '';

      // Reassign staff as Busy
      selectedStaff.forEach(sid => {
        const s = CES.staff.find(x=>x.id===sid);
        if (s) s.availability = 'Busy';
      });

      closeModal('modal-add-event');
      render();
      switchPanel('events', document.querySelector('[data-panel=events]'));

    } else {
      // ── ADD MODE ─────────────────────────────────────────────────────────
      // Conflict check
      if (date !== 'TBD') {
        const sameDate = CES.events.filter(x => x.date === date);
        let conflictMsg = '';
        if (truck !== '—' && sameDate.some(x => x.truck === truck)) {
          conflictMsg += `- Truck ${truck} is already booked on ${date}.\n`;
        }
        if (selectedStaff.length > 0) {
          const busyStaff = sameDate.filter(x => x.staff && x.staff.some(s => selectedStaff.includes(s)));
          if (busyStaff.length > 0) conflictMsg += `- One or more selected staff are already booked on ${date}.\n`;
        }
        if (conflictMsg && !confirm(`⚠️ CONFLICT DETECTED!\n\n${conflictMsg}\nDo you still want to create this event?`)) return;
      }

      const newEvt = {
        id:          'CES-EVT-2026-' + String(CES.events.length + 1).padStart(4, '0'),
        name,
        clientName:  document.getElementById('new-event-client').value  || '—',
        venue:       document.getElementById('new-event-venue').value   || '—',
        type:        document.getElementById('new-event-type').value,
        date,
        setupTime:   document.getElementById('new-event-setup').value        || '08:00',
        strikeTime:  document.getElementById('new-event-strike').value       || '22:00',
        eventStart:  document.getElementById('new-event-event-start').value  || '18:00',
        eventEnd:    document.getElementById('new-event-event-end').value    || '23:00',

        manager:      document.getElementById('new-event-mgr').value,
        contactName:  document.getElementById('new-event-contact-name').value  || '',
        contactPhone: document.getElementById('new-event-contact-phone').value || '',
        contactEmail: document.getElementById('new-event-contact-email').value || '',
        staff:        selectedStaff,
        staffNames,
        inventory:   selectedInv,
        truck,
        status:      'Planning',
        notes:       document.getElementById('new-event-notes').value   || ''
      };

      CES.events.push(newEvt);

      // Mark staff as Busy
      selectedStaff.forEach(id => {
        const s = CES.staff.find(x => x.id === id);
        if (s) { s.availability = 'Busy'; s.events++; }
      });

      // Immediate Firebase sync
      if (window.CES_DB && window.CES_DB.triggerSync) window.CES_DB.triggerSync();

      closeModal('modal-add-event');
      render();
      switchPanel('events');
    }
  };

  render();
  window.__cesRender = window.__cesRender || {};
  window.__cesRender['events'] = render;
})();
