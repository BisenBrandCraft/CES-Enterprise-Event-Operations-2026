// ════════════════════════════════════════════════════════════════════════════
// CES ENTERPRISE OPERATIONS SYSTEM — triggers.gs
// Trigger Setup & Conflict Detection (AUTO-004)
// Last updated: May 2026 — v3.0 (Finance removed)
// ════════════════════════════════════════════════════════════════════════════
// Automation coverage:
//   AUTO-001 Daily Operations Report      → runDailyAutomations()  (7am daily)
//   AUTO-002 Inventory Alert              → runDailyAutomations()  (7am daily)
//   AUTO-003 Staff Assignment Notification → notifyStaffAssignment() (manual call)
//   AUTO-004 Conflict Detection           → onSheetEdit()          (on every edit)
//   AUTO-005 Weekly Executive Report      → runWeeklyAutomations() (Mon 8am)
//   AUTO-006 Event Health Score Update    → updateEventHealthScores() (every 6 hrs)
//   AUTO-007 Event Reminder — 48 Hours   → runDailyAutomations()  (7am daily)
//   AUTO-008 Post-Event Debrief          → runDailyAutomations()  (7am daily)
// ════════════════════════════════════════════════════════════════════════════

function setupTriggers() {
  // Remove all existing triggers first
  ScriptApp.getProjectTriggers().forEach(function(t){ ScriptApp.deleteTrigger(t); });

  // AUTO-001, 002, 007, 008: Daily automations at 7am
  ScriptApp.newTrigger('runDailyAutomations')
    .timeBased().everyDays(1).atHour(7).create();

  // AUTO-005: Weekly executive report every Monday 8am
  ScriptApp.newTrigger('runWeeklyAutomations')
    .timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create();

  // AUTO-006: Health score update every 6 hours
  ScriptApp.newTrigger('updateEventHealthScores')
    .timeBased().everyHours(6).create();

  // AUTO-004: On edit trigger for conflict detection
  ScriptApp.newTrigger('onSheetEdit')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit().create();

  SpreadsheetApp.getUi().alert(
    '✅ Triggers Set!\n\n' +
    '• Daily automations (001, 002, 007, 008): 7:00 AM\n' +
    '• Weekly report (005): Monday 8:00 AM\n' +
    '• Health scores (006): every 6 hours\n' +
    '• Conflict detection (004): on every edit\n\n' +
    'All 8 automation rules are now active.'
  );
}

function onSheetEdit(e) {
  if (!e) return;
  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName();

  // AUTO-004: Run conflict detection when Events sheet is edited
  if (sheetName === '01_Events_Master') {
    detectAllConflicts_();
  }

  // Log the edit to System Logs
  auditLog('CELL_EDIT', sheetName, 'R'+e.range.getRow()+'C'+e.range.getColumn(), String(e.oldValue||''), String(e.value||''));
}

function detectAllConflicts_() {
  const events = getSheetData_('01_Events_Master');
  const conflicts = [];

  // Check truck conflicts
  const truckMap = {};
  events.forEach(function(e){
    const key = e['Truck Assigned'] + '|' + String(e['Event Date']).substring(0,10);
    if (!truckMap[key]) truckMap[key] = [];
    truckMap[key].push(e['Event ID'] + ' — ' + e['Event Name']);
  });
  Object.entries(truckMap).forEach(function([key, evts]){
    if (evts.length > 1) {
      conflicts.push('🚛 TRUCK CONFLICT: ' + key.split('|')[0] + ' on ' + key.split('|')[1] + ': ' + evts.join(', '));
    }
  });

  // Check staff conflicts
  const staffMap = {};
  events.forEach(function(e){
    const staffList = String(e['Staff Assigned']||'').split(',').map(s=>s.trim()).filter(Boolean);
    staffList.forEach(function(staffId){
      const key = staffId + '|' + String(e['Event Date']).substring(0,10);
      if (!staffMap[key]) staffMap[key] = [];
      staffMap[key].push(e['Event Name']);
    });
  });
  Object.entries(staffMap).forEach(function([key, evts]){
    if (evts.length > 1) {
      conflicts.push('👤 STAFF CONFLICT: ' + key.split('|')[0] + ' on ' + key.split('|')[1] + ': ' + evts.join(', '));
    }
  });

  // Write conflicts to System Logs
  if (conflicts.length > 0) {
    conflicts.forEach(function(c){
      auditLog('CONFLICT_DETECTED', 'Events', '', '', c);
    });
  }

  return conflicts;
}

// Run this manually to check conflicts at any time
function runConflictCheck() {
  const conflicts = detectAllConflicts_();
  if (conflicts.length === 0) {
    SpreadsheetApp.getUi().alert('✅ No conflicts detected!');
  } else {
    SpreadsheetApp.getUi().alert('⚠️ Conflicts Found:\n\n' + conflicts.join('\n'));
  }
}
