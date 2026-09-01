// crm.js — Client CRM Module
(function(){
  const el = document.getElementById('panel-crm');

  function render() {
    const totalLTV = CES.clients.reduce((s,c)=>s+c.revenue,0);
    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">Client CRM</div>
          <div class="page-subtitle">${CES.clients.length} clients · $${totalLTV.toLocaleString()} lifetime value</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline btn-sm" onclick="exportClients()">⬇ Export</button>
          <button class="btn btn-primary" onclick="openAddClientModal()">➕ Add Client</button>
        </div>
      </div>
      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
        ${kpi('Total Clients',CES.clients.length,'In database')}
        ${kpi('VIP Clients',CES.clients.filter(c=>c.tier==='VIP').length,'Top tier')}
        ${kpi('Lifetime Value','$'+totalLTV.toLocaleString(),'All-time revenue')}
        ${kpi('Avg Events/Client',Math.round(CES.clients.reduce((s,c)=>s+c.events,0)/CES.clients.length),'Repeat rate')}
      </div>
      <div class="grid-21">
        <div class="card">
          <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Client Directory</span></div>
          <div class="filter-bar" style="padding:12px 12px 0">
            <div class="search-box"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input id="crm-search" placeholder="Search clients..." oninput="filterClients()"></div>
            <select class="filter-select" id="crm-tier" onchange="filterClients()"><option value="">All Tiers</option><option>VIP</option><option>Regular</option><option>New</option></select>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Client ID</th><th>Company</th><th>Contact</th><th>Email</th><th>Events</th><th>Revenue</th><th>Tier</th><th>Last Event</th><th>Actions</th></tr></thead>
              <tbody id="crm-table"></tbody>
            </table>
          </div>
        </div>
        <div>
          <div class="card" style="margin-bottom:16px">
            <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Top Clients by LTV</span></div>
            <div class="card-body" style="padding:12px">
              ${[...CES.clients].sort((a,b)=>b.revenue-a.revenue).map((c,i)=>`
                <div class="stat-row">
                  <div style="display:flex;align-items:center;gap:8px">
                    <span style="font-size:11px;color:var(--text-muted);width:16px">#${i+1}</span>
                    <div>
                      <div style="font-size:12px;font-weight:600">${c.company}</div>
                      <div style="font-size:10px;color:var(--text-muted)">${c.events} events</div>
                    </div>
                  </div>
                  <div style="text-align:right">
                    <div style="font-size:12px;font-weight:700;color:var(--ces-cyan)">$${c.revenue.toLocaleString()}</div>
                    <span class="badge ${tierBadge(c.tier)}">${c.tier}</span>
                  </div>
                </div>`).join('')}
            </div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Tier Distribution</span></div>
            <div class="card-body"><canvas id="crmChart" height="140"></canvas></div>
          </div>
        </div>
      </div>`;
    renderCRMTable(CES.clients);
    renderCRMChart();
  }

  function kpi(l,v,s){ return `<div class="kpi-card"><div class="kpi-label">${l}</div><div class="kpi-value">${v}</div><div class="kpi-sub">${s}</div></div>`; }
  function tierBadge(t){ return t==='VIP'?'badge-success':t==='Regular'?'badge-info':'badge-neutral'; }

  function renderCRMTable(clients) {
    document.getElementById('crm-table').innerHTML = clients.map(c=>`
      <tr>
        <td><span class="id-cell">${c.id}</span></td>
        <td><strong>${c.company}</strong></td>
        <td>${c.contact}</td>
        <td style="font-size:11px">${c.email}</td>
        <td>${c.events}</td>
        <td><strong>$${c.revenue.toLocaleString()}</strong></td>
        <td><span class="badge ${tierBadge(c.tier)}">${c.tier}</span></td>
        <td style="font-size:11px">${c.lastEvent}</td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-outline btn-sm" onclick="editClient('${c.id}')">✏️ Edit</button>
            <button class="btn btn-primary btn-sm" onclick="generateProposal('${c.id}')">Proposal</button>
            <button class="btn btn-outline btn-sm" style="color:#f44336;border-color:rgba(244,67,54,0.3)" onclick="deleteClient('${c.id}')">🗑️</button>
          </div>
        </td>
      </tr>`).join('');
  }

  window.filterClients = function() {
    const q=document.getElementById('crm-search').value.toLowerCase();
    const t=document.getElementById('crm-tier').value;
    renderCRMTable(CES.clients.filter(c=>
      (!q||c.company.toLowerCase().includes(q)||c.contact.toLowerCase().includes(q))&&
      (!t||c.tier===t)
    ));
  };

  // ── OPEN ADD MODAL ─────────────────────────────────────────────────────────
  window.openAddClientModal = function() {
    document.getElementById('edit-cli-id').value = '';
    document.getElementById('client-modal-title').textContent = '➕ Add New Client';
    document.getElementById('btn-submit-client').textContent  = '✅ Add Client';
    document.getElementById('btn-delete-client').style.display = 'none';
    ['new-cli-company','new-cli-contact','new-cli-email','new-cli-phone','new-cli-lastEvent'].forEach(id=>{
      const el = document.getElementById(id); if(el) el.value='';
    });
    document.getElementById('new-cli-tier').value = 'New';
    openModal('modal-add-client');
  };

  // ── EDIT CLIENT ────────────────────────────────────────────────────────────
  window.editClient = function(id) {
    const c = CES.clients.find(x=>x.id===id);
    if (!c) return;
    document.getElementById('edit-cli-id').value = id;
    document.getElementById('client-modal-title').textContent = '✏️ Edit — ' + c.company;
    document.getElementById('btn-submit-client').textContent  = '✅ Save Changes';
    document.getElementById('btn-delete-client').style.display = 'block';
    document.getElementById('new-cli-company').value   = c.company;
    document.getElementById('new-cli-contact').value   = c.contact !== '—' ? c.contact : '';
    document.getElementById('new-cli-email').value     = c.email !== '—' ? c.email : '';
    document.getElementById('new-cli-phone').value     = c.phone !== '—' ? c.phone : '';
    document.getElementById('new-cli-tier').value      = c.tier;
    document.getElementById('new-cli-lastEvent').value = c.lastEvent !== '—' ? c.lastEvent : '';
    openModal('modal-add-client');
  };

  // ── DELETE CLIENT ──────────────────────────────────────────────────────────
  window.deleteClient = function(id) {
    const c = CES.clients.find(x=>x.id===id);
    if (!c) return;
    if (!confirm(`⚠️ Delete client "${c.company}"?\n\nThis cannot be undone.`)) return;
    CES.clients = CES.clients.filter(x=>x.id!==id);
    closeModal('modal-add-client');
    render();
  };

  // ── SUBMIT (Add + Edit) ────────────────────────────────────────────────────
  window.submitClient = function() {
    const company = document.getElementById('new-cli-company').value.trim();
    if (!company) { alert('⚠️ Company Name is required!'); return; }

    const contact   = document.getElementById('new-cli-contact').value.trim()   || '—';
    const email     = document.getElementById('new-cli-email').value.trim()     || '—';
    const phone     = document.getElementById('new-cli-phone').value.trim()     || '—';
    const tier      = document.getElementById('new-cli-tier').value;
    const lastEvent = document.getElementById('new-cli-lastEvent').value.trim() || '—';
    const editId    = document.getElementById('edit-cli-id').value;

    if (editId) {
      // EDIT
      const c = CES.clients.find(x=>x.id===editId);
      if (c) { c.company=company; c.contact=contact; c.email=email; c.phone=phone; c.tier=tier; c.lastEvent=lastEvent; }
      closeModal('modal-add-client');
      render();
    } else {
      // ADD
      const id = 'CES-CLT-' + String(CES.clients.length + 1).padStart(3, '0');
      CES.clients.push({ id, company, contact, email, phone, events: 0, revenue: 0, tier, lastEvent });
      closeModal('modal-add-client');
      render();
    }
  };

  window.generateProposal = function(id) {
    const c=CES.clients.find(x=>x.id===id);
    const text=`PROPOSAL — Creative Event Services\n\nDate: ${new Date().toLocaleDateString()}\nProposed for: ${c.company}\nContact: ${c.contact}\n\nDear ${c.contact},\n\nThank you for your continued partnership with Creative Event Services.\nWe are pleased to propose our comprehensive event solutions for your upcoming event.\n\nOur Services Include:\n• Full Event Planning & Coordination\n• Premium AV & LED Technology\n• Interactive AI & Robotic Experiences\n• Logistics & Crew Management\n• On-site Support Team\n\nEstimated Investment: [To be confirmed]\nAvailability: [Event date TBD]\n\nWe look forward to creating another exceptional experience with you.\n\nBest regards,\nShane Williams\nOperations Manager — Creative Event Services`;
    const a=document.createElement('a');a.href='data:text/plain,'+encodeURIComponent(text);a.download='Proposal_'+c.company.replace(/\s/g,'_')+'.txt';a.click();
  };

  window.exportClients = function() {
    const rows=[['ID','Company','Contact','Email','Events','Revenue','Tier','Last Event']];
    CES.clients.forEach(c=>rows.push([c.id,c.company,c.contact,c.email,c.events,'$'+c.revenue,c.tier,c.lastEvent]));
    const csv=rows.map(r=>r.join(',')).join('\n');
    const a=document.createElement('a');a.href='data:text/csv,'+encodeURIComponent(csv);a.download='CES_Clients.csv';a.click();
  };

  function renderCRMChart() {
    const ctx=document.getElementById('crmChart').getContext('2d');
    const vip=CES.clients.filter(c=>c.tier==='VIP').length;
    const reg=CES.clients.filter(c=>c.tier==='Regular').length;
    const newC=CES.clients.filter(c=>c.tier==='New').length;
    new Chart(ctx,{type:'doughnut',data:{labels:['VIP','Regular','New'],datasets:[{data:[vip,reg,newC],backgroundColor:['rgba(0,200,81,0.8)','rgba(0,146,200,0.8)','rgba(255,255,255,0.2)'],borderWidth:0}]},options:{plugins:{legend:{labels:{color:'#8892A4',font:{size:11}}}},cutout:'65%'}});
  }

  render();
})();
