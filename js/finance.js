// finance.js — Finance Module
(function(){
  const el = document.getElementById('panel-finance');

  function render() {
    const totalRev    = CES.finance.reduce((s,f)=>s+f.amount,0);
    const totalPaid   = CES.finance.reduce((s,f)=>s+f.paid,0);
    const totalBal    = CES.finance.reduce((s,f)=>s+f.balance,0);
    const totalProfit = CES.events.reduce((s,e)=>s+e.profit,0);

    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">Finance</div>
          <div class="page-subtitle">Revenue tracking, invoices and payment management</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline btn-sm" onclick="exportFinance()">⬇ Export</button>
          <button class="btn btn-primary" onclick="openAddInvoiceModal()">➕ Invoice</button>
        </div>
      </div>
      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
        ${kpi('Total Invoiced','$'+totalRev.toLocaleString(),'This period')}
        ${kpi('Collected','$'+totalPaid.toLocaleString(),'Payments received')}
        ${kpi('Outstanding','$'+totalBal.toLocaleString(),'Pending collection')}
        ${kpi('Net Profit','$'+totalProfit.toLocaleString(),'After all expenses')}
      </div>
      <div class="grid-21">
        <div class="card">
          <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Invoice Register</span></div>
          <div class="filter-bar" style="padding:12px 12px 0">
            <select class="filter-select" id="fin-status" onchange="filterFinance()"><option value="">All Status</option><option>Paid</option><option>Partial</option><option>Unpaid</option></select>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Invoice ID</th><th>Event</th><th>Client</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Status</th><th>Due Date</th><th>Actions</th></tr></thead>
              <tbody id="fin-table"></tbody>
            </table>
          </div>
        </div>
        <div>
          <div class="card" style="margin-bottom:16px">
            <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Profit by Event</span></div>
            <div class="card-body">
              ${CES.events.slice(0,6).map(e=>{
                const margin=Math.round(e.profit/e.revenue*100);
                return `<div class="stat-row">
                  <div style="flex:1;margin-right:10px">
                    <div style="font-size:11px;font-weight:600;margin-bottom:3px">${e.name.length>22?e.name.substring(0,22)+'…':e.name}</div>
                    <div class="progress-bar"><div class="progress-fill ${margin>50?'success':''}" style="width:${margin}%"></div></div>
                  </div>
                  <div style="text-align:right;flex-shrink:0">
                    <div style="font-size:12px;font-weight:700;color:var(--success)">$${e.profit.toLocaleString()}</div>
                    <div style="font-size:10px;color:var(--text-muted)">${margin}%</div>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Payment Summary</span></div>
            <div class="card-body"><canvas id="finChart" height="150"></canvas></div>
          </div>
        </div>
      </div>`;
    renderFinTable(CES.finance);
    renderFinChart(totalPaid, totalBal);
  }

  function kpi(l,v,s){ return `<div class="kpi-card"><div class="kpi-label">${l}</div><div class="kpi-value">${v}</div><div class="kpi-sub">${s}</div></div>`; }
  function finBadge(s){ return s==='Paid'?'badge-success':s==='Partial'?'badge-warning':'badge-danger'; }
  function isOverdue(due){ return new Date(due)<new Date(); }

  function renderFinTable(items) {
    document.getElementById('fin-table').innerHTML = items.map(f=>`
      <tr>
        <td><span class="id-cell">${f.id}</span></td>
        <td style="font-size:11px">${f.eventId}</td>
        <td><strong>${f.client}</strong></td>
        <td>$${f.amount.toLocaleString()}</td>
        <td style="color:var(--success)">$${f.paid.toLocaleString()}</td>
        <td style="color:${f.balance>0?'var(--danger)':'var(--success)'}">$${f.balance.toLocaleString()}</td>
        <td><span class="badge ${finBadge(f.status)}">${f.status}</span></td>
        <td>
          <span style="font-size:11px;color:${f.status!=='Paid'&&isOverdue(f.due)?'var(--danger)':'var(--text-secondary)'}">${f.due}</span>
          ${f.status!=='Paid'&&isOverdue(f.due)?'<span class="badge badge-danger" style="margin-left:4px">OVERDUE</span>':''}
        </td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-outline btn-sm" onclick="openRecordPaymentModal('${f.id}')">💰 Pay</button>
            <button class="btn btn-outline btn-sm" onclick="editInvoice('${f.id}')">✏️ Edit</button>
            <button class="btn btn-primary btn-sm" onclick="downloadInvoice('${f.id}')">PDF</button>
            <button class="btn btn-outline btn-sm" style="color:#f44336;border-color:rgba(244,67,54,0.3)" onclick="deleteInvoice('${f.id}')">🗑️</button>
          </div>
        </td>
      </tr>`).join('');
  }

  window.filterFinance = function() {
    const s=document.getElementById('fin-status').value;
    renderFinTable(CES.finance.filter(f=>!s||f.status===s));
  };

  // ── INVOICE MODAL ──────────────────────────────────────────────────────────
  window.openAddInvoiceModal = function() {
    document.getElementById('edit-fin-id').value = '';
    document.getElementById('invoice-modal-title').textContent = '➕ New Invoice';
    document.getElementById('btn-submit-fin-inv').textContent  = '✅ Create Invoice';
    document.getElementById('btn-delete-fin-inv').style.display = 'none';
    document.getElementById('fin-cli-name').value = '';
    document.getElementById('fin-event-id').value = '';
    document.getElementById('fin-amount').value   = '';
    document.getElementById('fin-paid').value     = '0';
    document.getElementById('fin-status-sel').value = 'Unpaid';
    const due = new Date(); due.setDate(due.getDate()+14);
    window.CESDTP.initDate(document.getElementById('ces-dtp-fin-due-wrap'), 'fin-due', due.toISOString().split('T')[0]);
    openModal('modal-add-invoice');
  };

  window.editInvoice = function(id) {
    const f = CES.finance.find(x=>x.id===id);
    if (!f) return;
    document.getElementById('edit-fin-id').value = id;
    document.getElementById('invoice-modal-title').textContent = '✏️ Edit Invoice — ' + f.id;
    document.getElementById('btn-submit-fin-inv').textContent  = '✅ Save Changes';
    document.getElementById('btn-delete-fin-inv').style.display = 'block';
    document.getElementById('fin-cli-name').value    = f.client;
    document.getElementById('fin-event-id').value    = f.eventId !== '—' ? f.eventId : '';
    document.getElementById('fin-amount').value      = f.amount;
    document.getElementById('fin-paid').value        = f.paid;
    window.CESDTP.initDate(document.getElementById('ces-dtp-fin-due-wrap'), 'fin-due', f.due);
    document.getElementById('fin-status-sel').value  = f.status;
    openModal('modal-add-invoice');
  };

  window.deleteInvoice = function(id) {
    const f = CES.finance.find(x=>x.id===id);
    if (!f) return;
    if (!confirm(`⚠️ Delete invoice ${f.id} for ${f.client}?\n\nThis cannot be undone.`)) return;
    CES.finance = CES.finance.filter(x=>x.id!==id);
    closeModal('modal-add-invoice');
    render();
  };

  window.submitInvoice = function() {
    const client = document.getElementById('fin-cli-name').value.trim();
    if (!client) { alert('⚠️ Client name is required!'); return; }

    const eventId = document.getElementById('fin-event-id').value.trim() || '—';
    const amount  = Number(document.getElementById('fin-amount').value) || 0;
    const paid    = Math.min(Number(document.getElementById('fin-paid').value) || 0, amount);
    const due     = document.getElementById('fin-due').value;
    const status  = document.getElementById('fin-status-sel').value;
    const balance = amount - paid;
    const editId  = document.getElementById('edit-fin-id').value;

    if (editId) {
      // EDIT
      const f = CES.finance.find(x=>x.id===editId);
      if (f) { f.client=client; f.eventId=eventId; f.amount=amount; f.paid=paid; f.balance=balance; f.due=due; f.status=status; }
    } else {
      // ADD
      const id = 'CES-INV-F-' + String(CES.finance.length + 1).padStart(3, '0');
      const issued = new Date().toISOString().split('T')[0];
      CES.finance.push({ id, eventId, client, amount, paid, balance, status, due, issued });
    }

    closeModal('modal-add-invoice');
    render();
  };

  // ── RECORD PAYMENT MODAL ───────────────────────────────────────────────────
  window.openRecordPaymentModal = function(id) {
    const f = CES.finance.find(x=>x.id===id);
    if (!f) return;
    if (f.status==='Paid') { alert('✅ This invoice is already fully paid.'); return; }
    document.getElementById('payment-invoice-id').value = id;
    document.getElementById('payment-amount').value = '';
    document.getElementById('payment-invoice-info').innerHTML =
      `<strong>${f.id}</strong> — ${f.client}<br>
       Invoice Total: <strong>$${f.amount.toLocaleString()}</strong> &nbsp;|&nbsp;
       Already Paid: <strong style="color:var(--success)">$${f.paid.toLocaleString()}</strong> &nbsp;|&nbsp;
       Outstanding: <strong style="color:var(--danger)">$${f.balance.toLocaleString()}</strong>`;
    openModal('modal-record-payment');
  };

  window.submitPayment = function() {
    const id = document.getElementById('payment-invoice-id').value;
    const f  = CES.finance.find(x=>x.id===id);
    if (!f) return;
    const amount = Number(document.getElementById('payment-amount').value);
    if (!amount || isNaN(amount) || amount <= 0) { alert('⚠️ Please enter a valid amount.'); return; }
    f.paid    = Math.min(f.paid + amount, f.amount);
    f.balance = f.amount - f.paid;
    f.status  = f.balance === 0 ? 'Paid' : 'Partial';
    closeModal('modal-record-payment');
    render();
  };

  window.downloadInvoice = function(id) {
    const f=CES.finance.find(x=>x.id===id);
    const text=`INVOICE\n\nCreative Event Services\nInvoice: ${f.id} | Issued: ${f.issued} | Due: ${f.due}\nBill To: ${f.client} | Event: ${f.eventId}\n\nAmount:  $${f.amount.toLocaleString()}\nPaid:    $${f.paid.toLocaleString()}\nBalance: $${f.balance.toLocaleString()}\nStatus:  ${f.status}\n\nThank you!\naccounts@creativeeventservices.com`;
    const a=document.createElement('a');a.href='data:text/plain,'+encodeURIComponent(text);a.download='Invoice_'+f.id+'.txt';a.click();
  };

  window.exportFinance = function() {
    const rows=[['ID','Event','Client','Amount','Paid','Balance','Status','Due']];
    CES.finance.forEach(f=>rows.push([f.id,f.eventId,f.client,'$'+f.amount,'$'+f.paid,'$'+f.balance,f.status,f.due]));
    const csv=rows.map(r=>r.join(',')).join('\n');
    const a=document.createElement('a');a.href='data:text/csv,'+encodeURIComponent(csv);a.download='CES_Finance.csv';a.click();
  };

  function renderFinChart(paid,bal) {
    const ctx=document.getElementById('finChart').getContext('2d');
    new Chart(ctx,{type:'doughnut',data:{labels:['Collected','Outstanding'],datasets:[{data:[paid,bal],backgroundColor:['rgba(0,200,81,0.8)','rgba(255,68,68,0.6)'],borderWidth:0}]},options:{plugins:{legend:{labels:{color:'#8892A4',font:{size:11}}}},cutout:'60%'}});
  }

  render();
})();
