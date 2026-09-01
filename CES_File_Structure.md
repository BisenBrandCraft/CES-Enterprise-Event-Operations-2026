# CES Enterprise Operations System
## File Structure Reference — v1.0

**Creative Event Services | Enterprise Event Operations System**  
*Complete file map, module purposes, and data flow*

---

## 📁 Root Directory

```
CES - Enterprice Event Operations System 2026/
│
├── index.html                        ← Main application entry point (single-page app)
├── CES_User_Guide.md                 ← Full user guide (this system's manual)
├── CES_File_Structure.md             ← This document
├── firebase.json                     ← Firebase Hosting config (deploy settings)
├── .gitignore                        ← Git ignore rules
├── .gitattributes                    ← Git line-ending settings
├── CES - Enterprice Event Operations System 2026.code-workspace  ← VS Code workspace
│
├── css/
│   └── dashboard.css                 ← All styles (dark theme, components, layout)
│
├── js/
│   ├── firebase-config.js            ← Firebase project credentials
│   ├── firebase-db.js                ← Firestore engine (CRUD, real-time sync, polling)
│   ├── auth.js                       ← Login, session, roles, team management
│   ├── datetime-picker.js            ← Custom date/time picker (window.CESDTP)
│   ├── dashboard.js                  ← Core data, navigation, KPIs, charts, custom dropdowns
│   ├── events.js                     ← Events module UI + CRUD
│   ├── staff.js                      ← Staff module UI + CRUD + photo upload
│   ├── inventory.js                  ← Inventory module UI + CRUD + icon picker
│   ├── logistics.js                  ← Logistics module UI + CRUD + truck combobox
│   ├── automation.js                 ← Automation Engine + Reports panels
│   ├── settings.js                   ← Settings modal + Export All Data
│   ├── crm.js                        ← ⚠️ ORPHANED — not loaded in index.html
│   └── finance.js                    ← ⚠️ ORPHANED — not loaded in index.html
│
├── assets/
│   ├── logo/
│   │   └── Logo CES@2x.png           ← CES logo (used in sidebar + login screen)
│   └── icons/
│       └── categories/               ← 17 SVG category icons for inventory
│           ├── audio-video.svg
│           ├── carnivals.svg
│           ├── casino-nights.svg
│           ├── crafts-favors.svg
│           ├── corporate-entertainment.svg
│           ├── college-events.svg
│           ├── dance-floors.svg
│           ├── event-furniture.svg
│           ├── game-shows.svg
│           ├── giant-lawn-games.svg
│           ├── halloween.svg
│           ├── holiday-parties.svg
│           ├── inflatables.svg
│           ├── mitzvah-madness.svg
│           ├── performers.svg
│           ├── photo-booths.svg
│           ├── photo-favors.svg
│           ├── sports-video-games.svg
│           └── virtual-reality.svg
│
├── docs/
│   ├── CES_User_Guide.md             ← ⚠️ DUPLICATE of root CES_User_Guide.md — may be outdated
│   ├── appsheet-setup.md             ← AppSheet integration guide (Phase 2 planning)
│   └── looker-studio.md              ← Looker Studio reporting guide (Phase 2 planning)
│
└── .git/                             ← Git repository (version control)
```

---

## 📄 File-by-File Reference

### `index.html`
The entire application lives in one HTML file. It contains:
- Login overlay (`#ces-login-overlay`)
- Loading overlay (`#ces-db-loading`)
- Sidebar navigation
- Topbar (clock, notifications, settings, user avatar)
- All 7 panel divs (`#panel-dashboard`, `#panel-events`, `#panel-staff`, `#panel-inventory`, `#panel-logistics`, `#panel-automation`, `#panel-reports`)
- All modals: Add/Edit Event, Add/Edit Staff, Add/Edit Inventory, Add/Edit Dispatch, Add/Edit Client, Settings
- All `<script>` tags — loaded in this order:
  1. Firebase SDK (CDN)
  2. `firebase-config.js`
  3. `firebase-db.js`
  4. `auth.js`
  5. `datetime-picker.js`
  6. `dashboard.js`
  7. `events.js`
  8. `staff.js`
  9. `inventory.js`
  10. `logistics.js`
  11. `automation.js`
  12. `settings.js`

---

### `css/dashboard.css`
Single stylesheet for the entire application. Contains:
- CSS custom properties (variables) for the dark blue-black theme
- Base reset and typography
- Layout: `.app-layout`, `.sidebar`, `.main-area`, `.content-area`, `.topbar`
- Component styles: `.card`, `.kpi-card`, `.modal`, `.modal-overlay`, `.badge`, `.btn`, `.form-control`
- Table styles: `.table-wrap`, `table`, `th`, `td`
- Custom picker styles: `.ces-dt-wrapper`, `.ces-dtp-*`, `.ces-timepicker`, `.ces-datepicker`
- Custom dropdown styles: `.ces-filter-wrap`, `.ces-filter-val`, `.ces-filter-opts`
- Module-specific overrides for Events, Staff, Inventory, Logistics panels

---

### `js/firebase-config.js`
Stores the Firebase project credentials. Sets `window.CES_FIREBASE_ENABLED = true` if a real API key is present (the system detects a valid config vs the placeholder).

**Key exports:**
- `CES_FIREBASE_CONFIG` — object with apiKey, authDomain, projectId, etc.
- `window.CES_FIREBASE_ENABLED` — boolean flag

---

### `js/firebase-db.js`
The Firestore database engine. Wraps in an IIFE and exposes `window.CES_DB`.

**Firestore Collections:**
| Collection | Stores |
|-----------|--------|
| `ces_events` | All events |
| `ces_staff` | All staff members |
| `ces_inventory` | All inventory items |
| `ces_logistics` | All dispatch records |
| `ces_users` | Team member login accounts |
| `ces_meta` | Seed markers (prevents re-seeding) |

**Key functions:**
- `loadAll()` — Fetches all 4 data collections from Firestore (server-only, skips cache)
- `saveCollection(colName, dataArray, idField)` — Smart diff: deletes removed docs, upserts existing ones, batches in chunks of 400
- `seedIfEmpty()` — Seeds demo data to Firestore on first run (checks if events collection is empty)
- `forceSeedEvents()` — One-time migration to fix event dates (guarded by `ces_meta/seed_v2`)
- `setupListeners()` — Attaches `onSnapshot` real-time listeners to all 4 collections
- `startPolling()` — 12-second polling fallback (also detects changes and re-renders)
- `scheduleSyncAll()` — Debounced (800ms) sync triggered by data changes
- `getUsers() / saveUser() / deleteUser()` — User account management in Firestore

**Overrides:**
- After init, `window.saveCESData` is overridden to also trigger Firebase sync
- `window.CES_DB.triggerSync` is set to force an immediate sync (bypasses debounce)

**Conflict prevention:**
- `_ignoreUntil` timestamp — suppresses incoming snapshots for 3 seconds after a local write, preventing echo loops
- `dataHash()` — compares data state before/after to avoid unnecessary writes

---

### `js/auth.js`
Authentication, session management, and role-based access control (RBAC).

**localStorage keys:**
- `CES_USERS` — Array of all user accounts (id, name, email, password, role)
- `CES_SESSION` — Current logged-in user's session object

**Roles:**
| Role | Permissions |
|------|------------|
| `owner` | Full access + Team Access settings section |
| `editor` | Can add, edit, and delete all records |
| `viewer` | Read-only — all action buttons hidden via `applyUI()` |

**Key exports (window globals):**
- `window.CES_AUTH` — Main auth object: `session`, `canEdit()`, `isOwner()`, `isViewer()`, `applyUI()`, `getUsers()`, `addUser()`, `removeUser()`
- `window.cesLogin()` — Login handler (checks Firestore users, falls back to localStorage, hardcoded owner fallback)
- `window.cesLogout()` — Clears session, reloads page
- `window.toggleUserMenu()` — Opens/closes the user dropdown in the topbar
- `window.renderTeamAccess()` — Renders the team list in Settings modal
- `window.addTeamMember()` — Adds a new team member from the Settings form
- `window.removeTeamMember(id)` — Removes a team member
- `window.updateTeamMemberRole(id, newRole)` — Changes a user's role

⚠️ **Security note:** Passwords are stored in plaintext in both localStorage and Firestore. Acceptable for an internal ops tool; do not expose this system publicly without adding proper auth (e.g., Firebase Authentication).

---

### `js/datetime-picker.js`
A single-instance shared date/time picker widget. Built once, repositioned on demand.

**Modes:**
- `'date'` — Calendar only (auto-confirms on day click)
- `'time'` — Time scroll list only (auto-confirms on slot click)
- `'datetime'` — Calendar + time side by side (requires ✓ Done click)

**Public API (`window.CESDTP`):**
- `CESDTP.init(wrapper, inputId, val)` — Date+Time picker
- `CESDTP.initDate(wrapper, inputId, val)` — Date-only picker
- `CESDTP.initTime(wrapper, inputId, val)` — Time-only picker
- `CESDTP.open(wrapperEl)` — Opens the picker for a given field wrapper
- `CESDTP.setAmPm('AM'|'PM')` — Toggles AM/PM in time mode
- `CESDTP.done()` — Commits the selected value to the hidden input and closes
- `CESDTP.cancel()` — Closes without saving

**How it works:** `initDate/initTime/init` replace a wrapper div's innerHTML with a clickable field + hidden `<input>`. The hidden input holds the machine-readable value (e.g. `2026-06-15` or `14:30`). The visible display shows a human-readable label.

---

### `js/dashboard.js`
The core file. Loaded first (after auth). Defines the global `CES` data object, localStorage persistence, navigation, KPI rendering, and shared utilities.

**`CES` global object:**
Contains all in-memory data:
- `CES.events` — Array of event objects
- `CES.staff` — Array of staff objects
- `CES.inventory` — Array of inventory objects
- `CES.logistics` — Array of dispatch objects
- `CES.clients` — Array of client objects (used in event form, not in a standalone CRM panel)
- `CES.config` — Settings (currency, date format, company name — loaded from localStorage)

**localStorage persistence:**
- Key: `CES_DATA` — Stores events/staff/inventory/logistics/clients as JSON
- Key: `CES_DATA_VERSION` — Version string (`'2.4'`) — mismatches wipe stale cache
- Auto-saves every 1 second via `setInterval`
- Also saves on `beforeunload` (page close/refresh)

**Navigation:**
- `switchPanel(id, el)` — Switches the visible panel, updates sidebar active state, updates page title
- `openModal(id)` / `closeModal(id)` — Adds/removes `.open` class on modal overlays
- `window.CES_ACTIVE_PANEL` — Tracks which panel is currently active

**KPI rendering:**
- `renderKPIs()` — Renders 4 KPI cards with live computed values
- `renderAlerts()` — Renders the static alerts array (dashboard alerts are not live data)
- `renderWeekPriority()` — Renders events in the next 7 days
- `render30DayPipeline()` — Renders the 30-day pipeline table
- `renderInventoryChart()` — Renders inventory utilization progress bars (currently uses hardcoded sample data)

**Custom UI:**
- `window.cesApplyDropdowns(root)` — Converts all `<select>` elements to custom styled dropdowns
- `window.cesInitCustomPickers(root)` — Converts `input[type=date]` and `input[type=time]` to custom pickers (Note: the primary picker is `datetime-picker.js`/`CESDTP`; this function handles any native pickers that may appear outside modals)

**Auto-refresh engine:**
- `window.CES_REFRESH_COUNTDOWN` — 60-second countdown, resets on panel switch
- Re-calls the current panel's render function every 60 seconds
- `window.__cesRender` — Map of `{ panelId: renderFunction }` — each module registers itself here

---

### `js/events.js`
Events module — full CRUD UI inside `#panel-events`.

**Key globals:**
- `window.openNewEventModal()` — Opens the Add modal with cleared fields
- `window.editEvent(id)` — Opens the Edit modal pre-filled with event data
- `window.addEvent()` — Saves new or edited event (reads from modal fields)
- `window.deleteEvent(id)` — Deletes event, releases staff
- `window.filterEvents()` — Filters the events table by search/status/type
- `window.checkConflicts(id)` — Shows truck conflict alert for an event
- `window.showTimeline()` — Generates run-of-show timeline for selected event
- `window.toggleStaffPick(id)` / `window.toggleInvPick(id)` — Toggles staff/inventory selection in modal pickers

**Event object schema:**
```json
{
  "id": "CES-EVT-2026-0001",
  "name": "Event Name",
  "client": "CES-CLT-001",
  "clientName": "Client Company",
  "venue": "Venue Name",
  "type": "Corporate Events",
  "date": "2026-06-18",
  "setupTime": "14:00",
  "strikeTime": "23:00",
  "eventStart": "18:00",
  "eventEnd": "22:00",
  "manager": "Shane Williams",
  "contactName": "John Smith",
  "contactPhone": "+971-50-000-0000",
  "contactEmail": "john@company.com",
  "staff": ["CES-STF-001", "CES-STF-002"],
  "staffNames": ["Shane Williams", "Maria Lopez"],
  "inventory": ["CES-INV-001", "CES-INV-005"],
  "truck": "CES-TRK-01",
  "status": "Confirmed",
  "notes": "Notes here"
}
```

⚠️ **Known issue:** New event IDs use `CES.events.length + 1`. If records have been deleted in the same session, this can produce duplicate IDs.

---

### `js/staff.js`
Staff module — full CRUD UI inside `#panel-staff`.

**Key globals:**
- `window.openAddStaffModal()` — Opens the Add Staff modal
- `window.editStaff(id)` — Opens Edit modal pre-filled
- `window.submitNewStaff()` — Saves new or edited staff
- `window.deleteStaff(id)` — Removes staff member
- `window.filterStaff()` — Filters the staff table
- `window.handleStaffPhotoUpload(input)` — Reads photo file as base64 Data URL
- `window.removeStaffPhoto()` — Clears the photo, reverts to initials
- `window.updateStaffPhotoInitials()` — Updates initials in the preview as user types name
- `window.exportStaff()` — Downloads staff data as CSV

**Staff object schema:**
```json
{
  "id": "CES-STF-001",
  "name": "Shane Williams",
  "role": "Operations Manager",
  "skill": "A/V Equipment",
  "availability": "Available",
  "performance": 96,
  "events": 3,
  "phone": "+1-555-0101",
  "email": "shane@ces.ae",
  "photo": ""
}
```

⚠️ **Known issue:** `photo` is stored as a base64 Data URL string. Firestore documents have a 1MB limit — large photos will cause the document to fail saving silently. Use small images (<200KB after encoding) or implement Firebase Storage for photos.

---

### `js/inventory.js`
Inventory module — full CRUD UI inside `#panel-inventory`.

**Key globals:**
- `window.openAddInventoryModal()` — Opens Add Inventory modal
- `window.editInventory(id)` — Opens Edit modal pre-filled
- `window.saveInventory()` — Saves new or edited inventory item
- `window.deleteInventoryItem()` — Deletes inventory item
- `window.filterInventory()` — Filters inventory table
- `window.selectInvIcon(file, name)` — Selects a category icon tile
- `window.syncIconToCategory()` — Auto-syncs icon when category dropdown changes
- `window.autoSelectInvCategory()` — Auto-detects category from item name as user types
- `window.showInRepairItems()` — Navigates to inventory and pre-filters to "In Repair"

**Inventory object schema:**
```json
{
  "id": "CES-INV-001",
  "name": "Audio Guest Book",
  "category": "Photo Booths",
  "emoji": "assets/icons/categories/photo-booths.svg",
  "qty": 3,
  "available": 2,
  "status": "Available",
  "condition": "Excellent",
  "value": 800,
  "location": "Warehouse A"
}
```

⚠️ **Known issue:** The "⬇ Export" button in the Inventory page header calls `exportInventory()` which only shows an alert. Use **Settings → Export All Data** for a real CSV export of inventory.

---

### `js/logistics.js`
Logistics module — full CRUD UI inside `#panel-logistics`.

**Key globals:**
- `window.openAddDispatchModal()` — Opens Add Dispatch modal
- `window.editDispatch(id)` — Opens Edit modal pre-filled
- `window.submitDispatch()` — Saves new or edited dispatch
- `window.deleteDispatch(id)` — Deletes dispatch record
- `window.updateDispatch(id, newStatus)` — Updates dispatch status
- `window.setTruckType('own'|'rental')` — Toggles own fleet / rental UI sections
- `window.showTruckSuggestions()` — Shows the truck combobox dropdown
- `window.filterTruckSuggestions(val)` — Filters truck suggestions by input
- `window.selectTruck(val)` — Sets the truck input to the selected value
- `window.toggleFleetStatus()` — Expands/collapses the Fleet Status panel

**Dispatch object schema:**
```json
{
  "id": "CES-DSP-001",
  "eventId": "CES-EVT-2026-0001",
  "eventName": "Tech Summit 2026",
  "truck": "CES TRUCK",
  "truckType": "own",
  "driver": "Priya Sharma",
  "rental": 0,
  "status": "Delivered"
}
```

**Fleet list (hardcoded in `BASE_FLEET`):**
- Own: `CES TRUCK`, `CES VAN`
- Ryder: `RYDER # 1` through `RYDER # 5`
- Penske: `PENSKE # 1` through `PENSKE # 3`
- UHaul: `UHAUL # 1` through `UHAUL # 3`

---

### `js/automation.js`
Handles both the **Automation Engine** (`#panel-automation`) and **Reports & Analytics** (`#panel-reports`) panels.

**Automation globals:**
- `window.runAutomation(id)` — Manually triggers an automation rule
- `window.toggleAuto(id)` — Pauses or resumes an automation
- `window.runAllNow()` — Triggers all automations at once

**Live alerts logic (`buildLiveAlerts()`):**
Reads directly from `CES.events`, `CES.inventory`, and `automations` array to generate real-time alerts:
1. Truck double-bookings (same truck, same date)
2. Inventory items in repair
3. Active/Confirmed events within 48 hours
4. Paused automations

**Reports globals:**
- `window.exportReport()` — Downloads a plain-text executive report

---

### `js/settings.js`
Settings modal + export all data.

**localStorage key:** `ces_settings` — Stores: companyName, managerName, email, currency, dateFormat

**Key globals:**
- `window.openSettings()` — Opens the settings modal and populates fields from `CES.config`
- `window.saveSettings()` — Saves settings to localStorage and `CES.config`
- `window.exportAllData()` — Downloads Events, Staff, Inventory, and Logistics as separate CSV files
- `window.applyCompactMode(on)` — Toggles `body.compact-mode` class (CSS compact overrides)

**Exposes:** `CES.config` — loaded at startup, accessible by all modules for currency symbol, date format, etc.

---

### `js/crm.js` ⚠️ ORPHANED FILE
This file exists in the `js/` folder but is **not loaded** in `index.html` and has no corresponding panel div. The CRM module was removed from the system (client relationship tracking is handled externally). The file can be safely deleted or kept for reference.

### `js/finance.js` ⚠️ ORPHANED FILE
This file exists but is **not loaded** in `index.html`. The Finance module was removed (payment tracking is in a separate dedicated system). Can be safely deleted or kept for reference.

---

### `firebase.json`
Firebase Hosting configuration. Defines which files to deploy and URL rewrite rules (all routes → `index.html` for SPA behavior).

---

### `docs/` Directory
Documentation and Phase 2 planning files. Not part of the application runtime.

| File | Purpose |
|------|---------|
| `CES_User_Guide.md` | ⚠️ Duplicate of root `CES_User_Guide.md` — may be outdated; the root version is authoritative |
| `appsheet-setup.md` | Phase 2: AppSheet mobile app integration guide |
| `looker-studio.md` | Phase 2: Looker Studio dashboard reporting guide |

---

## 🔄 Data Flow Overview

```
Browser Opens index.html
        │
        ▼
firebase-config.js loads
        │ CES_FIREBASE_ENABLED = true/false
        ▼
firebase-db.js loads (IIFE)
        │ Sets up window.CES_DB (or null if disabled)
        ▼
auth.js loads
        │ Checks localStorage for existing session
        ▼
datetime-picker.js → dashboard.js → events.js → staff.js
→ inventory.js → logistics.js → automation.js → settings.js
        │ All modules register their render fn in window.__cesRender
        │ dashboard.js defines global CES data object
        │ CES data loaded from localStorage (if saved)
        ▼
DOMContentLoaded fires (auth.js handler)
        │
        ├─ Session found → CES_DB.init() → loadAll() from Firestore
        │                              → setupListeners() (real-time)
        │                              → startPolling() (12s fallback)
        │                              → render dashboard
        │
        └─ No session → show login overlay
                        │
                        └─ User logs in → CES_DB.init() → same as above
```

```
User makes a change (add/edit/delete)
        │
        ▼
Module function updates CES.events/staff/inventory/logistics in memory
        │
        ▼
Module re-renders its panel (render() call)
        │
        ▼
window.saveCESData() called (writes to localStorage)
        │
        ▼
CES_DB.triggerSync() called (for add operations)
OR
1-second interval picks up change → scheduleSyncAll() (debounced 800ms)
        │
        ▼
Firebase saveCollection() — batch diff, commits to Firestore
        │
        ▼
onSnapshot fires on other connected clients → they re-render
```

---

## ⚠️ Known Issues & Future Improvements

| Issue | Severity | Details |
|-------|----------|---------|
| **ID collision on delete+add** | Medium | All 4 modules use `array.length + 1` for new IDs. Deleting a record then adding a new one can produce duplicate IDs. Fix: use `max existing ID + 1` or `Date.now()` for ID generation. |
| **Staff photos in Firestore** | High | Photos are stored as base64 strings in Firestore documents. The 1MB document limit will cause silent save failures for photos over ~700KB. Fix: move photos to Firebase Storage and store only the download URL. |
| **Dashboard alerts are static** | Low | The alerts array on the Dashboard is hardcoded. The Automation Engine has live alerts. Consider wiring `buildLiveAlerts()` into `renderAlerts()`. |
| **Inventory utilization chart is static** | Low | `renderInventoryChart()` uses hardcoded sample data instead of computing from `CES.inventory`. |
| **Inventory Export button is broken** | Medium | `exportInventory()` shows an alert instead of downloading CSV. Use Settings → Export All instead for now. |
| **Firebase sync after event edit** | Low | `CES_DB.triggerSync()` is only called in event add mode, not edit mode. The 1-second auto-save interval will catch it within 1–2 seconds, but an explicit sync call after edit would be cleaner. |
| **`switchPanel('events')` without nav element** | Low | After creating an event, `switchPanel('events')` is called without the nav element argument, so the sidebar highlight may not update. |
| **`crm.js` and `finance.js` orphaned** | Cleanup | Two JS files exist but are not referenced anywhere. Safe to delete. |
| **`docs/CES_User_Guide.md` is a duplicate** | Cleanup | Two copies of the user guide exist. The root version is authoritative. |
| **Passwords in plaintext** | Acceptable (internal) | Team member passwords stored in localStorage and Firestore without hashing. Acceptable for a private internal tool but not suitable for public deployment. |
| **Auto-refresh indicator element missing** | Low | `dashboard.js` references `#ces-refresh-indicator` which doesn't exist in `index.html`. The refresh still works silently; the visual countdown just never displays. |

---

## 🔌 External Dependencies

| Library | Version | CDN | Purpose |
|---------|---------|-----|---------|
| Firebase App (compat) | 10.7.0 | gstatic.com | Firebase SDK core |
| Firebase Firestore (compat) | 10.7.0 | gstatic.com | Database engine |
| Chart.js | 4.4.0 | jsdelivr.net | Staff workload bar chart |

All other UI (date pickers, dropdowns, tables, modals) is built in pure vanilla JavaScript with no external UI framework.

---

*Creative Event Services — Enterprise Operations System v4.0*  
*File Structure Reference — Last updated: June 2026*  
*Support contact is configured during final deployment.*
