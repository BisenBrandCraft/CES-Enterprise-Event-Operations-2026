// ════════════════════════════════════════════════════════════════════════════
// CES ENTERPRISE OPERATIONS SYSTEM — Google Apps Script
// setup.gs — Run setupAllSheets() ONCE to build all sheet tabs
// Last updated: May 2026 — v3.0 (Finance & CRM removed)
// ════════════════════════════════════════════════════════════════════════════

function setupAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = [
    { name: '00_Dashboard',           headers: [] },
    { name: '01_Events_Master',       headers: ['Event ID','Event Name','Client Name','Venue Name','Event Type','Event Date','Setup Time','Strike Time','Event Manager','Staff Assigned','Inventory Reserved','Truck Assigned','Status','Priority','Risk Level','Health Score','Notes','Created Date','Updated Date'] },
    { name: '02_Events_Calendar',     headers: ['Date','Event ID','Event Name','Manager','Status','Venue'] },
    { name: '03_Staff_Master',        headers: ['Staff ID','Full Name','Role','Skill Type','Email','Phone','Availability','Hourly Rate','Performance Score','Total Events','Notes','Created Date','Updated Date','Status'] },
    { name: '04_Staff_Assignments',   headers: ['Assignment ID','Event ID','Staff ID','Staff Name','Role','Date','Hours','Pay','Status','Notes'] },
    { name: '05_Inventory_Master',    headers: ['Item ID','Item Name','Category','Quantity','Available','Status','Condition','Unit Value','Location','Notes','Created Date','Updated Date'] },
    { name: '06_Inventory_Reservations', headers: ['Reservation ID','Event ID','Item ID','Item Name','Qty Reserved','Reserved From','Reserved To','Returned','Condition After','Notes'] },
    { name: '07_Logistics',           headers: ['Dispatch ID','Event ID','Event Name','Truck ID','Truck Type','Driver Name','Departure Time','Arrival Time','Fuel Cost','Rental Cost','Route','Status','Notes'] },
    { name: '08_Notifications',       headers: ['Notif ID','Type','Recipient','Message','Channel','Status','Sent At','Event ID','Notes'] },
    { name: '09_Automation_Config',   headers: ['Auto ID','Name','Trigger','Action','Status','Last Run','Run Count','Notes'] },
    { name: '10_System_Logs',         headers: ['Log ID','Timestamp','User','Action','Module','Record ID','Old Value','New Value','Notes'] },
    { name: '11_Admin_Settings',      headers: ['Key','Value','Description','Updated By','Updated Date'] }
  ];

  sheets.forEach(function(cfg) {
    let sheet = ss.getSheetByName(cfg.name);
    if (!sheet) sheet = ss.insertSheet(cfg.name);
    if (cfg.headers.length > 0) {
      sheet.getRange(1, 1, 1, cfg.headers.length).setValues([cfg.headers]);
      const headerRange = sheet.getRange(1, 1, 1, cfg.headers.length);
      headerRange.setBackground('#0092C8');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      headerRange.setFontSize(11);
      sheet.setFrozenRows(1);
      sheet.setColumnWidths(1, cfg.headers.length, 150);
    }
    sheet.setTabColor('#0092C8');
  });

  setupAdminSettings_();
  setupAutomationConfig_();

  SpreadsheetApp.getUi().alert(
    '✅ CES Setup Complete!\n\n' +
    '12 sheets created with headers and formatting.\n\n' +
    'Next steps:\n' +
    '1. Go to sheet 11_Admin_Settings\n' +
    '2. Update OWNER_EMAIL and OPERATIONS_EMAIL\n' +
    '3. Run setupTriggers() to activate automations'
  );
}

function setupAdminSettings_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const s = ss.getSheetByName('11_Admin_Settings');
  if (!s) return;
  const settings = [
    ['COMPANY_NAME',          'Creative Event Services',  'Company display name',                     'System', ''],
    ['OWNER_EMAIL',           '',                         'Set during final deployment',               'System', ''],
    ['OPERATIONS_EMAIL',      '',                         'Set during final deployment',               'System', ''],
    ['CURRENCY',              '$',                        'Currency symbol',                           'System', ''],
    ['TIMEZONE',              'Asia/Dubai',               'System timezone',                           'System', ''],
    ['DAILY_REPORT_TIME',     '7',                        'Hour (24hr) to send daily report',         'System', ''],
    ['HEALTH_THRESHOLD',      '65',                       'Health score below this triggers alert',   'System', ''],
    ['EVENT_REMINDER_HOURS',  '48',                       'Hours before event to send reminder',      'System', ''],
    ['VERSION',               '3.0',                     'System version',                            'System', '']
  ];
  if (s.getLastRow() <= 1) {
    s.getRange(2, 1, settings.length, 5).setValues(settings);
  }
}

function setupAutomationConfig_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const s = ss.getSheetByName('09_Automation_Config');
  if (!s) return;
  const configs = [
    ['AUTO-001', 'Daily Operations Report',       'Every day 07:00 AM',              'Email summary to Owner',                    'Active', '', '0', ''],
    ['AUTO-002', 'Inventory Alert',               'Item unavailable or In Repair',   'Alert to Warehouse Lead email',             'Active', '', '0', ''],
    ['AUTO-003', 'Staff Assignment Notification', 'Staff assigned to event',         'Email notification to staff member',        'Active', '', '0', ''],
    ['AUTO-004', 'Conflict Detection',            'On any Events sheet edit',        'Flag truck/staff conflict in logs',         'Active', '', '0', ''],
    ['AUTO-005', 'Weekly Executive Report',       'Every Monday 08:00 AM',           'Email report to Owner',                     'Active', '', '0', ''],
    ['AUTO-006', 'Event Health Score Update',     'Every 6 hours',                   'Recalculate all event health scores',       'Active', '', '0', ''],
    ['AUTO-007', 'Event Reminder — 48 Hours',     '48 hours before event date',      'Email crew confirmation to Event Manager',  'Active', '', '0', ''],
    ['AUTO-008', 'Post-Event Debrief',            '24 hours after event strike time','Send debrief form to Event Manager',        'Active', '', '0', '']
  ];
  if (s.getLastRow() <= 1) {
    s.getRange(2, 1, configs.length, 8).setValues(configs);
  }
}

// ── ID GENERATORS ─────────────────────────────────────────────────────────────
function generateEventId() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('01_Events_Master');
  return 'CES-EVT-2026-' + String(Math.max(s.getLastRow(), 1)).padStart(4, '0');
}

function generateStaffId() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('03_Staff_Master');
  return 'CES-STF-' + String(Math.max(s.getLastRow(), 1)).padStart(3, '0');
}

function generateInventoryId() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('05_Inventory_Master');
  return 'CES-INV-' + String(Math.max(s.getLastRow(), 1)).padStart(3, '0');
}

function generateDispatchId() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('07_Logistics');
  return 'CES-DSP-' + String(Math.max(s.getLastRow(), 1)).padStart(3, '0');
}

// ── AUDIT LOG ─────────────────────────────────────────────────────────────────
function auditLog(action, module, recordId, oldVal, newVal) {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('10_System_Logs');
  if (!s) return;
  const user = Session.getActiveUser().getEmail() || 'system';
  s.appendRow(['LOG-' + new Date().getTime(), new Date(), user, action, module, recordId || '', oldVal || '', newVal || '', '']);
}
