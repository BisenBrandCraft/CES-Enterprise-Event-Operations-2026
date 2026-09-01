// automation.js — Automation Engine & Reports Module
(function(){

  // ── AUTOMATION PANEL ──────────────────────────────────────────────────────
  const autoEl = document.getElementById('panel-automation');

  const automations = [
    { id:'AUTO-001', name:'Daily Operations Report', trigger:'Every day 07:00 AM', action:'Email summary to Owner & Shane', status:'Active', lastRun:'Today 07:00', runs:128 },
    { id:'AUTO-002', name:'Inventory Alert', trigger:'Item unavailable or not returned', action:'Alert to Warehouse Lead', status:'Active', lastRun:'Today 06:00', runs:45 },
    { id:'AUTO-003', name:'Staff Assignment Notification', trigger:'Staff assigned to event', action:'Email/SMS to staff member', status:'Active', lastRun:'2 days ago 14:30', runs:67 },
    { id:'AUTO-004', name:'Conflict Detection', trigger:'On any sheet edit', action:'Flag conflict in dashboard alerts', status:'Active', lastRun:'Today 13:00', runs:312 },
    { id:'AUTO-005', name:'Weekly Executive Report', trigger:'Every Monday 08:00 AM', action:'PDF report to Owner email', status:'Active', lastRun:'Mon 08:00', runs:18 },
    { id:'AUTO-007', name:'Event Reminder — 48 Hours', trigger:'48 hours before event date', action:'Email crew confirmation to Event Manager', status:'Active', lastRun:'Yesterday 10:00', runs:41 },
    { id:'AUTO-008', name:'Post-Event Debrief', trigger:'24 hours after event strike time', action:'Send debrief form to Event Manager', status:'Active', lastRun:'2 days ago 22:00', runs:29 }
  ];

  const notifLog = [
    { time:'12:00', type:'info', msg:'Conflict Detection scan completed — 1 truck overlap flagged' },
    { time:'10:00', type:'warning', msg:'48-hr reminder sent: Gala Dinner — crew confirmation pending' },
    { time:'07:00', type:'info', msg:'Daily Operations Report sent to Shane Williams' },
    { time:'06:00', type:'warning', msg:'Inventory: Stage Lighting Rig not returned from EVT-0001' }
  ];

  function renderAutomation() {
    autoEl.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">Automation Engine</div>
          <div class="page-subtitle">${automations.filter(a=>a.status==='Active').length} active automations running</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline" onclick="runAllNow()">▶ Run All Now</button>
        </div>
      </div>
      <div style="display:flex;gap:20px;align-items:flex-start;margin-bottom:20px">
        <div class="card" style="flex:1;min-width:0">
          <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Automation Rules</span></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Automation Name</th><th>Trigger</th><th>Action</th><th>Runs</th><th>Last Run</th><th>Status</th><th>Control</th></tr></thead>
              <tbody id="auto-table"></tbody>
            </table>
          </div>
        </div>
        <div style="width:280px;flex-shrink:0">
          <div class="card" style="margin-bottom:16px">
            <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Live Alerts</span></div>
            <div class="card-body" id="auto-alerts" style="padding:8px"></div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Notification Log</span></div>
            <div class="card-body" id="auto-log" style="padding:8px 12px"></div>
          </div>
        </div>
      </div>`;
    renderAutoTable();
    renderAutoAlerts();
    renderAutoLog();
  }

  function renderAutoTable() {
    document.getElementById('auto-table').innerHTML = automations.map(a=>`
      <tr>
        <td><span class="id-cell">${a.id}</span></td>
        <td><strong>${a.name}</strong></td>
        <td style="font-size:11px">${a.trigger}</td>
        <td style="font-size:11px">${a.action}</td>
        <td>${a.runs}</td>
        <td style="font-size:11px">${a.lastRun}</td>
        <td><span class="badge ${a.status==='Active'?'badge-success':'badge-neutral'}">${a.status}</span></td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="btn-ctrl" onclick="runAutomation('${a.id}')">▶ Run</button>
            <button class="btn-ctrl" onclick="toggleAuto('${a.id}')">${a.status==='Active'?'⏸ Pause':'▶ Resume'}</button>
          </div>
        </td>
      </tr>`).join('');
  }

  function buildLiveAlerts() {
    const alerts = [];
    const today  = new Date();

    // 1. Truck conflicts — same truck on same date across events
    const truckEvents = CES.events.filter(e => e.truck && e.truck !== '—' && e.date && e.date !== 'TBD');
    truckEvents.forEach(e => {
      const clash = truckEvents.find(x => x.id !== e.id && x.truck === e.truck && x.date === e.date);
      if (clash && !alerts.some(a => a.text.includes(e.truck) && a.text.includes(e.date))) {
        alerts.push({ type:'danger', title:'Conflict: Truck Overlap', text:`${e.truck} double-booked on ${e.date} — ${e.name} & ${clash.name}` });
      }
    });

    // 2. Inventory items In Repair
    const repairItems = CES.inventory.filter(i => i.status === 'In Repair');
    repairItems.forEach(i => {
      alerts.push({ type:'warning', title:'Inventory In Repair', text:`${i.name} (${i.id}) — condition: ${i.condition}` });
    });

    // 3. Events in next 48 hours (Active or Confirmed)
    CES.events.filter(e => ['Active','Confirmed'].includes(e.status) && e.date && e.date !== 'TBD').forEach(e => {
      const diff = (new Date(e.date) - today) / (1000*60*60);
      if (diff >= 0 && diff <= 48) {
        alerts.push({ type:'info', title:'Event in 48hrs', text:`${e.name} — ${e.date} @ ${e.venue || '—'} · Manager: ${e.manager}` });
      }
    });

    // 4. Paused automations
    const paused = automations.filter(a => a.status === 'Paused');
    if (paused.length) {
      alerts.push({ type:'warning', title:'Automations Paused', text:`${paused.length} rule${paused.length>1?'s':''} paused: ${paused.map(a=>a.name).join(', ')}` });
    }

    // If nothing flagged
    if (!alerts.length) {
      alerts.push({ type:'info', title:'All Clear', text:'No active alerts — all systems running normally' });
    }

    return alerts;
  }

  function renderAutoAlerts() {
    const liveAlerts = buildLiveAlerts();
    const dotColor = { danger:'var(--danger)', warning:'var(--warning)', info:'var(--ces-blue)' };
    document.getElementById('auto-alerts').innerHTML = liveAlerts.map(a=>`
      <div style="display:flex;gap:9px;padding:8px 10px;margin-bottom:6px;border-radius:8px;background:${a.type==='danger'?'rgba(255,68,68,0.07)':a.type==='warning'?'rgba(255,214,0,0.07)':'rgba(0,146,200,0.07)'};border:1px solid ${a.type==='danger'?'rgba(255,68,68,0.2)':a.type==='warning'?'rgba(255,214,0,0.2)':'rgba(0,146,200,0.2)'}">
        <div style="width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:3px;background:${dotColor[a.type]||'var(--text-muted)'}"></div>
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--text-secondary);margin-bottom:2px">${a.title}</div>
          <div style="font-size:10px;color:var(--text-muted);line-height:1.4">${a.text}</div>
        </div>
      </div>`).join('');
  }

  function renderAutoLog() {
    document.getElementById('auto-log').innerHTML=notifLog.map(n=>`
      <div style="display:flex;gap:8px;padding:7px 0;border-bottom:1px solid var(--border-subtle);font-size:11px;align-items:flex-start">
        <span style="color:var(--text-muted);flex-shrink:0;font-family:monospace;padding-top:1px">${n.time}</span>
        <span style="width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:4px;background:${n.type==='info'?'var(--info)':n.type==='warning'?'var(--warning)':'var(--danger)'}"></span>
        <span style="color:var(--text-secondary)">${n.msg}</span>
      </div>`).join('');
  }

  window.runAutomation = function(id) {
    const a = automations.find(x=>x.id===id);
    if (a.status === 'Paused') {
      // Flash the row to indicate it's paused
      const rows = document.querySelectorAll('#auto-table tr');
      rows.forEach(row => {
        if (row.querySelector('.id-cell') && row.querySelector('.id-cell').textContent === id) {
          row.style.transition = 'background 0.2s';
          row.style.background = 'rgba(255,214,0,0.08)';
          setTimeout(() => row.style.background = '', 800);
        }
      });
      notifLog.unshift({time:new Date().toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit'}),type:'warning',msg:`Run blocked: ${a.name} is Paused — Resume it first`});
      renderAutoLog();
      return;
    }
    a.lastRun='Just now'; a.runs++;
    notifLog.unshift({time:new Date().toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit'}),type:'info',msg:`Manual run: ${a.name} — completed`});
    renderAutomation();
  };

  window.toggleAuto = function(id) {
    const a=automations.find(x=>x.id===id);
    a.status=a.status==='Active'?'Paused':'Active';
    renderAutomation();
  };

  window.runAllNow = function() {
    automations.forEach(a=>{a.runs++;a.lastRun='Just now';});
    notifLog.unshift({time:new Date().toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit'}),type:'info',msg:'All automations triggered manually — completed successfully'});
    renderAutomation();
  };

  renderAutomation();

  // ── REPORTS PANEL ─────────────────────────────────────────────────────────
  const repEl = document.getElementById('panel-reports');

  function renderReports() {
    const totalEvents   = CES.events.length;
    const activeEvents  = CES.events.filter(e=>e.status==='Active').length;
    const completedEvts = CES.events.filter(e=>e.status==='Completed').length;
    const byType        = [...new Set(CES.events.map(e=>e.type))].map(t=>({ type:t, count:CES.events.filter(e=>e.type===t).length }));

    repEl.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">Reports & Analytics</div>
          <div class="page-subtitle">Executive insights and operations overview</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline" onclick="exportReport()">⬇ Export Report</button>
        </div>
      </div>
      <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
        <div class="kpi-card"><div class="kpi-label">Total Events</div><div class="kpi-value">${totalEvents}</div><div class="kpi-sub">2026 Pipeline</div></div>
        <div class="kpi-card"><div class="kpi-label">Active Now</div><div class="kpi-value">${activeEvents}</div><div class="kpi-sub">In progress today</div></div>
        <div class="kpi-card"><div class="kpi-label">Completed</div><div class="kpi-value">${completedEvts}</div><div class="kpi-sub">Successfully delivered</div></div>
      </div>
      <div class="grid-2" style="margin-bottom:20px">
        <div class="card">
          <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Events by Type</span></div>
          <div class="card-body" id="rep-type-bars"></div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Top Events by Revenue</span></div>
          <div class="card-body">
            ${[...CES.events].sort((a,b)=>b.revenue-a.revenue).slice(0,5).map((e,i)=>`
              <div class="stat-row">
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:10px;color:var(--text-muted);width:14px">#${i+1}</span>
                  <div><div style="font-size:11px;font-weight:600">${e.name}</div><div style="font-size:10px;color:var(--text-muted)">${e.type} · ${e.date}</div></div>
                </div>
                <span style="font-size:13px;font-weight:700;color:var(--success)">$${(e.revenue||0).toLocaleString()}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Executive Summary — May 2026</span></div>
        <div class="card-body">
          <div class="grid-3">
            <div>
              <div style="font-size:10px;color:var(--text-muted);margin-bottom:8px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Events</div>
              ${[['Total Events',totalEvents],['Active',activeEvents],['Completed',completedEvts]].map(r=>`<div class="stat-row"><span class="stat-label">${r[0]}</span><span class="stat-value">${r[1]}</span></div>`).join('')}
            </div>
            <div>
              <div style="font-size:10px;color:var(--text-muted);margin-bottom:8px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Operations</div>
              ${[['Staff Members',CES.staff.length],['Trucks (Fleet)','3'],['Dispatches',CES.logistics.length],['Inventory Items',CES.inventory.length]].map(r=>`<div class="stat-row"><span class="stat-label">${r[0]}</span><span class="stat-value">${r[1]}</span></div>`).join('')}
            </div>
            <div>
              <div style="font-size:10px;color:var(--text-muted);margin-bottom:8px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Automations</div>
              ${[['Active Rules',automations.filter(a=>a.status==='Active').length],['Total Runs',automations.reduce((s,a)=>s+a.runs,0)],['Staff Avg Performance',Math.round(CES.staff.reduce((a,s)=>a+s.performance,0)/CES.staff.length)+'%'],['Conflict Alerts',CES.events.filter(e=>{ if(!e.date||e.date==='TBD')return false; const sd=CES.events.filter(x=>x.id!==e.id&&x.date===e.date); return e.truck&&e.truck!=='—'&&sd.some(x=>x.truck===e.truck); }).length]].map(r=>`<div class="stat-row"><span class="stat-label">${r[0]}</span><span class="stat-value">${r[1]}</span></div>`).join('')}
            </div>
          </div>
        </div>
      </div>`;
    renderTypeChart();
  }

  function renderTypeChart() {
    const el = document.getElementById('rep-type-bars');
    if (!el) return;
    const types = [...new Set(CES.events.map(e=>e.type))];
    const maxCount = Math.max(...types.map(t=>CES.events.filter(e=>e.type===t).length));
    el.innerHTML = types.map(t => {
      const count = CES.events.filter(e=>e.type===t).length;
      const pct   = Math.round(count/maxCount*100);
      return `<div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px">
          <span style="color:var(--text-secondary);font-weight:600">${t}</span>
          <span style="color:var(--text-muted)">${count} event${count!==1?'s':''}</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>`;
    }).join('');
  }

  window.exportReport = function() {
    const text=`EXECUTIVE REPORT — CREATIVE EVENT SERVICES\nGenerated: ${new Date().toLocaleString()}\n\n${'═'.repeat(50)}\nTOTAL EVENTS: ${CES.events.length} | ACTIVE: ${CES.events.filter(e=>e.status==='Active').length} | COMPLETED: ${CES.events.filter(e=>e.status==='Completed').length}\n\nEVENTS:\n${CES.events.map(e=>`• ${e.id} | ${e.name} | ${e.type} | ${e.date} | ${e.status}`).join('\n')}\n\nSTAFF: ${CES.staff.length} members | Avg Performance: ${Math.round(CES.staff.reduce((a,s)=>a+s.performance,0)/CES.staff.length)}%\nLOGISTICS: ${CES.logistics.length} dispatches\n\nGenerated by CES Enterprise Operations System v1.0`;
    const a=document.createElement('a');a.href='data:text/plain,'+encodeURIComponent(text);a.download='CES_Report_'+new Date().toISOString().split('T')[0]+'.txt';a.click();
  };

  renderReports();
  window.__cesRender = window.__cesRender || {};
  window.__cesRender['automation'] = renderAutomation;
  window.__cesRender['reports']    = renderReports;
})();
