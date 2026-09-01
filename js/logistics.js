// logistics.js — Logistics Module
(function(){
  const el = document.getElementById('panel-logistics');

  function render() {
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">Logistics Control</div>
          <div class="page-subtitle">Truck dispatch, routes and delivery tracking</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline" onclick="openAddDispatchModal()">+ New Dispatch</button>
        </div>
      </div>
      <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
        ${kpi('Trucks',BASE_FLEET.length,'Fleet size')}
        ${kpi('Active Dispatches',CES.logistics.length,'This period')}
        ${kpi('Delivered',CES.logistics.filter(l=>l.status==='Delivered').length,'Completed runs')}
      </div>
      <div style="display:flex;gap:20px;align-items:flex-start;margin-bottom:20px">
        <div class="card" style="flex:1;min-width:0">
          <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Dispatch Log</span></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th style="min-width:180px">Event</th><th>Truck</th><th>Driver</th><th>Actions</th></tr></thead>
              <tbody>${CES.logistics.map(l=>`
                <tr ondblclick="editDispatch('${l.id}')" style="cursor:pointer" title="Double-click to edit">
                  <td style="min-width:180px"><strong>${l.eventName}</strong><br><span style="font-size:10px;color:var(--text-muted)">${l.eventId}</span></td>
                  <td>${l.truckType==='rental'
                    ? `<span class="badge badge-warning" style="font-size:9px">🔑 RENTAL</span><div style="font-size:10px;color:var(--text-muted);margin-top:2px">${l.truck}</div>`
                    : `<span class="badge badge-info">${l.truck}</span>`
                  }</td>
                  <td>${l.driver}</td>
                  <td>
                    <div style="display:flex;gap:4px">
                      <button class="btn btn-outline btn-sm" onclick="editDispatch('${l.id}')">✏️ Edit</button>
                      <button class="btn btn-outline btn-sm" style="color:#f44336;border-color:rgba(244,67,54,0.3)" onclick="deleteDispatch('${l.id}')">🗑️</button>
                    </div>
                  </td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
        <div style="width:280px;flex-shrink:0">
          <div class="card" style="margin-bottom:16px">
            <div class="card-header" onclick="toggleFleetStatus()" style="cursor:pointer;user-select:none">
              <span class="card-title"><span class="card-title-icon"></span>Fleet Status</span>
              <span id="fleet-toggle-icon" style="font-size:10px;color:var(--ces-blue);margin-left:auto;font-weight:600">See All ▼</span>
            </div>
            <div class="card-body" id="fleet-status-body" style="padding-top:8px;max-height:248px;overflow-y:scroll;scrollbar-width:thin;scrollbar-color:var(--ces-blue) transparent;transition:max-height 0.3s ease">
              ${BASE_FLEET.map((t,i)=>{
                const d=CES.logistics.find(l=>l.truck===t && l.truckType!=='rental');
                return `<div class="stat-row fleet-row">
                  <div>
                    <div style="font-size:12px;font-weight:700">🚛 ${t}</div>
                    <div style="font-size:10px;color:var(--text-muted)">${d?d.eventName:'No active dispatch'}</div>
                  </div>
                  <span class="badge ${d?logBadge(d.status):'badge-success'}">${d?d.status:'Available'}</span>
                </div>`;
              }).join('')}
              ${CES.logistics.filter(l=>l.truckType==='rental').length ? `
              <div id="fleet-rental-section" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border-subtle)">
                <div style="font-size:9px;font-weight:700;letter-spacing:1px;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px">Rental Trucks</div>
                ${CES.logistics.filter(l=>l.truckType==='rental').map(l=>`
                <div class="stat-row">
                  <div>
                    <div style="font-size:12px;font-weight:700">🔑 ${l.truck}</div>
                    <div style="font-size:10px;color:var(--text-muted)">${l.eventName}</div>
                  </div>
                  <span class="badge ${logBadge(l.status)}">${l.status}</span>
                </div>`).join('')}
              </div>` : ''}
            </div>
          </div>
        </div>
      </div>`;
  }

  // ── FLEET STATUS COLLAPSE ──────────────────────────────────────────────────
  let _fleetExpanded = false;
  window.toggleFleetStatus = function() {
    _fleetExpanded = !_fleetExpanded;
    const body = document.getElementById('fleet-status-body');
    const icon = document.getElementById('fleet-toggle-icon');
    if (body) body.style.maxHeight = _fleetExpanded ? '600px' : '248px';
    if (icon) icon.textContent = _fleetExpanded ? 'Collapse ▲' : 'See All ▼';
  };

  function kpi(l,v,s){ return `<div class="kpi-card"><div class="kpi-label">${l}</div><div class="kpi-value">${v}</div><div class="kpi-sub">${s}</div></div>`; }

  // ── TRUCK TYPE TOGGLE ──────────────────────────────────────────────────────
  window.setTruckType = function(type) {
    document.getElementById('new-dsp-truck-type').value = type;
    const isRental = type === 'rental';
    // toggle buttons style — dono outline, active wala blue tint
    const activeStyle   = 'flex:1;padding:9px 14px;font-size:12px;text-align:left;border-color:var(--ces-blue);color:var(--ces-blue);background:rgba(0,146,200,0.12);text-transform:uppercase;letter-spacing:0.5px';
    const inactiveStyle = 'flex:1;padding:9px 14px;font-size:12px;text-align:left;text-transform:uppercase;letter-spacing:0.5px';
    document.getElementById('btn-truck-own').className    = 'btn btn-outline btn-sm';
    document.getElementById('btn-truck-rental').className = 'btn btn-outline btn-sm';
    document.getElementById('btn-truck-own').style.cssText    = isRental ? inactiveStyle : activeStyle;
    document.getElementById('btn-truck-rental').style.cssText = isRental ? activeStyle   : inactiveStyle;
    // show/hide sections
    document.getElementById('dsp-own-section').style.display            = isRental ? 'none' : '';
    document.getElementById('dsp-rental-company-section').style.display = isRental ? ''     : 'none';
    document.getElementById('dsp-rental-cost-section').style.display    = isRental ? ''     : 'none';
  };

  function logBadge(s){
    const m={Preparing:'badge-neutral',Loading:'badge-warning',Dispatched:'badge-info',Delivered:'badge-success',Returning:'badge-warning',Completed:'badge-neutral'};
    return m[s]||'badge-neutral';
  }

  window.updateDispatch = function(id, newStatus) {
    const d = CES.logistics.find(l=>l.id===id);
    if(d){ d.status=newStatus; render(); }
  };

  // ── OPEN ADD MODAL ─────────────────────────────────────────────────────────
  window.openAddDispatchModal = function() {
    document.getElementById('edit-dsp-id').value = '';
    document.getElementById('dispatch-modal-title').textContent = '➕ New Dispatch';
    document.getElementById('btn-submit-dispatch').textContent = '✅ Create Dispatch';
    document.getElementById('btn-delete-dispatch').style.display = 'none';

    // Populate event dropdown
    const evtSel = document.getElementById('new-dsp-event');
    evtSel.innerHTML = `<option value="" disabled selected>Select event to link this dispatch</option>` +
      CES.events.map(e=>`<option value="${e.id}">${e.name} — ${e.date} · ${e.venue}</option>`).join('');

    // Reset to Own Fleet mode
    setTruckType('own');
    document.getElementById('new-dsp-truck').value = 'CES TRUCK';
    document.getElementById('new-dsp-rental-company').value = '';
    document.getElementById('new-dsp-rental-cost').value = '0';

    document.getElementById('new-dsp-driver').value = '';

    openModal('modal-add-dispatch');
  };

  // ── EDIT DISPATCH ──────────────────────────────────────────────────────────
  window.editDispatch = function(id) {
    const d = CES.logistics.find(l=>l.id===id);
    if (!d) return;

    document.getElementById('edit-dsp-id').value = id;
    document.getElementById('dispatch-modal-title').textContent = '✏️ Edit Dispatch — ' + d.id;
    document.getElementById('btn-submit-dispatch').textContent = '✅ Save Changes';
    document.getElementById('btn-delete-dispatch').style.display = 'block';

    const evtSel = document.getElementById('new-dsp-event');
    evtSel.innerHTML = `<option value="" disabled>Select event to link this dispatch</option>` +
      CES.events.map(e=>`<option value="${e.id}" ${e.id===d.eventId?'selected':''}>${e.name} — ${e.date} · ${e.venue}</option>`).join('');

    // Set truck type
    const isRental = d.truckType === 'rental';
    setTruckType(isRental ? 'rental' : 'own');
    if (isRental) {
      document.getElementById('new-dsp-rental-company').value = d.truck;
      document.getElementById('new-dsp-rental-cost').value   = d.rental || 0;
    } else {
      document.getElementById('new-dsp-truck').value = d.truck;
      document.getElementById('new-dsp-rental-cost').value = 0;
    }

    document.getElementById('new-dsp-driver').value = d.driver !== 'TBD' ? d.driver : '';

    openModal('modal-add-dispatch');
  };

  // ── DELETE DISPATCH ────────────────────────────────────────────────────────
  window.deleteDispatch = function(id) {
    const d = CES.logistics.find(l=>l.id===id);
    if (!d) return;
    if (!confirm(`⚠️ Delete dispatch ${d.id} for "${d.eventName}"?\n\nThis cannot be undone.`)) return;
    CES.logistics = CES.logistics.filter(l=>l.id!==id);
    closeModal('modal-add-dispatch');
    render();
  };

  // ── SUBMIT (Add + Edit) ────────────────────────────────────────────────────
  window.submitDispatch = function() {
    const evtId  = document.getElementById('new-dsp-event').value;
    const evt    = CES.events.find(e=>e.id===evtId);
    if (!evt) { alert('⚠️ Please select a valid event.'); return; }

    const truckType   = document.getElementById('new-dsp-truck-type').value;
    const isRental    = truckType === 'rental';
    const truck       = isRental
                          ? (document.getElementById('new-dsp-rental-company').value.trim() || 'Rental Truck')
                          : document.getElementById('new-dsp-truck').value;
    const rentalCost  = isRental ? (Number(document.getElementById('new-dsp-rental-cost').value) || 0) : 0;
    const driver      = document.getElementById('new-dsp-driver').value.trim() || 'TBD';
    const editId      = document.getElementById('edit-dsp-id').value;

    if (editId) {
      // EDIT
      const d = CES.logistics.find(l=>l.id===editId);
      if (d) {
        d.eventId = evtId; d.eventName = evt.name;
        d.truck = truck; d.truckType = truckType;
        d.driver = driver;
        d.rental = rentalCost;
      }
    } else {
      // ADD
      const id = 'CES-DSP-' + String(CES.logistics.length + 1).padStart(3, '0');
      CES.logistics.push({ id, eventId: evtId, eventName: evt.name, truck, truckType, driver, rental: rentalCost, status: 'Preparing' });
    }

    if (window.CES_DB && window.CES_DB.triggerSync) window.CES_DB.triggerSync();
    closeModal('modal-add-dispatch');
    render();
  };

  // ── TRUCK COMBOBOX ─────────────────────────────────────────────────────────
  const BASE_FLEET = [
    'CES TRUCK', 'CES VAN',
    'RYDER # 1', 'RYDER # 2', 'RYDER # 3', 'RYDER # 4', 'RYDER # 5',
    'PENSKE # 1', 'PENSKE # 2', 'PENSKE # 3',
    'UHAUL # 1', 'UHAUL # 2', 'UHAUL # 3'
  ];

  function getAllTrucks() {
    return BASE_FLEET;
  }

  function renderTruckSuggestions(trucks, query) {
    const el = document.getElementById('truck-suggestions');
    if (!el) return;
    const q = (query || '').toLowerCase();

    const matchedItems = trucks
      .filter(t => !q || t.toLowerCase().includes(q))
      .map(t => {
        const isBase = BASE_FLEET.includes(t);
        return `<div onmousedown="selectTruck('${t}')"
          style="display:flex;align-items:center;gap:10px;padding:9px 14px;cursor:pointer;
                 border-bottom:1px solid var(--border-subtle);font-size:12px;
                 color:var(--text-primary);transition:background 0.1s"
          onmouseover="this.style.background='var(--bg-card-hover)'"
          onmouseout="this.style.background=''">
          <span style="font-size:14px">${isBase ? '🚛' : '🔧'}</span>
          <span style="flex:1;font-weight:600">${t}</span>
          ${isBase ? '' : '<span style="font-size:9px;color:var(--text-muted);background:var(--bg-input);padding:2px 6px;border-radius:4px">Custom</span>'}
        </div>`;
      }).join('');

    // "Add new" option if typed value doesn't match any existing truck exactly
    const exactMatch = trucks.some(t => t.toLowerCase() === q);
    const addNew = q && !exactMatch
      ? `<div onmousedown="selectTruck('${query}')"
           style="display:flex;align-items:center;gap:10px;padding:9px 14px;cursor:pointer;
                  font-size:12px;color:var(--ces-cyan);transition:background 0.1s"
           onmouseover="this.style.background='var(--bg-card-hover)'"
           onmouseout="this.style.background=''">
           <span style="font-size:14px">➕</span>
           <span>Add "<strong>${query}</strong>" as new truck</span>
         </div>`
      : '';

    const content = matchedItems + addNew;
    el.innerHTML = content || `<div style="padding:10px 14px;font-size:11px;color:var(--text-muted)">No trucks found</div>`;
    el.style.display = 'block';
  }

  window.showTruckSuggestions = function() {
    renderTruckSuggestions(getAllTrucks(), '');
  };

  window.filterTruckSuggestions = function(val) {
    renderTruckSuggestions(getAllTrucks(), val);
  };

  window.selectTruck = function(val) {
    const input = document.getElementById('new-dsp-truck');
    if (input) input.value = val;
    hideTruckSuggestions();
  };

  window.hideTruckSuggestions = function() {
    const el = document.getElementById('truck-suggestions');
    if (el) el.style.display = 'none';
  };

  render();
   window.__cesRender = window.__cesRender || {};
  window.__cesRender['logistics'] = render;
})();
