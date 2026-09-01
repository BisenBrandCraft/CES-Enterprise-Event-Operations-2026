# CES Enterprise Operations System
## Complete User Guide — Version 4.0

**Creative Event Services | Enterprise Event Operations System**  
*Full Feature Reference — All Modules, All Workflows*

---

## 📋 Table of Contents

1. [Getting Started](#1-getting-started)
2. [Navigation & Layout](#2-navigation--layout)
3. [Master Dashboard](#3-master-dashboard)
4. [Events Module](#4-events-module)
5. [Staff Operations Module](#5-staff-operations-module)
6. [Inventory Module](#6-inventory-module)
7. [Logistics Module](#7-logistics-module)
8. [Automation Engine](#8-automation-engine)
9. [Reports & Analytics](#9-reports--analytics)
10. [ID Reference Guide](#10-id-reference-guide)
11. [Tips, Workflows & Best Practices](#11-tips-workflows--best-practices)
12. [System Settings](#12-system-settings)

---

## 1. Getting Started

### Login

1. Open the folder: **CES - Enterprice Event Operations System 2026**
2. Double-click **`index.html`**
3. The public development build opens directly without a login. Authentication is configured during final deployment.
4. On first load, if Firebase is connected, data loads from Firestore. Otherwise the system runs on local data.
5. **Chrome is recommended** for the best experience.

### What You See First

After login you land on the **Master Dashboard** — the home screen showing a live overview of your operation: KPI cards, next 7-day priority events, 30-day pipeline, alerts, and inventory utilization.

The interface has three main zones:

| Zone | Location | Purpose |
|------|----------|---------|
| **Left Sidebar** | Left edge | Module navigation menu |
| **Top Bar** | Top strip | Clock, notification bell, settings, user menu |
| **Main Content Area** | Center + right | Changes based on selected module |

---

## 2. Navigation & Layout

### Sidebar Navigation

The left sidebar contains all module links. Click any module name to switch to it instantly — no page reload needed.

| Module | What It Does |
|--------|-------------|
| Dashboard | Command center overview |
| Events | All event management |
| Staff Operations | Team and availability |
| Inventory | Equipment tracking |
| Logistics | Truck dispatch and delivery management |
| Automation | Automation rules and alerts |
| Reports & Analytics | Analytics and export |

### Collapsing the Sidebar

Click the **grid icon (⊞)** at the top-left of the sidebar to collapse it and gain more screen space. Click it again to expand. Useful on smaller screens or when you need a wider data table view.

### Active Module Indicator

- The **currently open module** is highlighted with a blue left border in the sidebar
- A **badge** next to Events shows the active event count
- The **page title** in the main content area always shows which module you're in

### User Menu & Sign Out

Click your **avatar/name** in the top-right to see your account details and sign out.

### Modals (Pop-up Forms)

Every module that manages records uses **modals** — pop-up forms for adding, editing, and deleting records.

- Click **+ Add / New** buttons to open the Add modal
- Click **✏️ Edit** on any row to open the Edit modal (same form, pre-filled)
- Double-click any table row to open its Edit modal
- Click **🗑️** on any row to delete a record (confirmation required)
- Click **✕** or click outside the modal to close without saving

### CES Custom Date & Time Picker

All date and time inputs use the **CES Custom Picker** (powered by `datetime-picker.js`):

**Date-only mode** (Events → Event Date):
1. Click the field — a calendar opens
2. Navigate months using **‹** and **›** arrows
3. Click any day to select — picker closes automatically and value is saved

**Time-only mode** (Events → Setup Time, Strike Time, Event Start/End):
1. Click the field — a scrollable time list opens with AM/PM toggle
2. Click **AM** or **PM** at the top to switch
3. Click any time slot — picker closes automatically

**Date + Time mode** (for combined date-time fields):
1. Click the field — a combined calendar + time panel opens (side by side)
2. Select date on the left, then time on the right
3. Click **✓ Done** to confirm, or **Cancel** to discard

The selected value shows in the field as a readable label (e.g. "Mon 15 Jun 2026 · 09:00 AM").

---

## 3. Master Dashboard

> **Purpose:** See your entire operation at a single glance — KPIs, priority events, 30-day pipeline, and alerts.

### KPI Cards (Top Row)

Four cards across the top show your most critical numbers:

| Card | What It Shows |
|------|--------------|
| **Events This Month** | Total events scheduled for the current month; how many are active today |
| **Active Staff** | Staff currently deployed (Busy) vs total team size |
| **Inventory Use** | Percentage of inventory currently In Use; count of items In Repair |
| **Active Dispatches** | Dispatches currently Preparing or In Transit; delivered count |

Each card:
- Has a flat SVG icon on the right side
- Shows a trend indicator: **▲ Green** = positive, **▼ Red** = needs attention
- Is **clickable** — takes you directly to that module

### ⚡ Upcoming — Next 7 Days

Below the KPI cards, the left column shows all events happening in the next 7 days, sorted by date:

- Each event card shows: Event ID, name, venue, date, setup/strike time, manager, staff count, status badge
- A **colored left border** shows urgency: Red = 0–2 days, Cyan = 3–7 days, Default = beyond 7 days
- An **urgency label** shows "Today", "Tomorrow", or "In X days"
- If no events exist in the next 7 days, the next upcoming events are shown as fallback

### 📅 30-Day Event Pipeline

A full table showing all events in the next 30 days:

| Column | Description |
|--------|-------------|
| **Date** | Day name, date, and how far away (e.g. "3d away", "THIS WEEK" badge) |
| **Event** | Event name and ID |
| **Venue** | Location |
| **Manager** | Assigned event manager |
| **Staff** | Number of assigned staff |
| **Status** | Current lifecycle stage badge |

Events within the next 7 days show a **THIS WEEK** badge in cyan. The table is sorted by date (soonest first).

### Alerts Panel

Compact panel on the right side of the dashboard showing recent operational alerts:

| Color | Type | Examples |
|-------|------|---------|
| 🔴 Red | Critical | Double-booked trucks, inventory conflicts |
| 🟡 Yellow | Warning | Pending confirmations, unresolved issues |
| 🔵 Blue | Info | Event confirmations, status changes |

> Note: For **live, real-time alerts** pulled directly from your data (truck conflicts, items in repair, upcoming events), use the **Automation Engine** module — its Live Alerts panel reads your actual live data.

### Inventory Utilization

Horizontal progress bars at the bottom of the dashboard showing utilization per equipment category — useful for capacity planning.

---

## 4. Events Module

> **Purpose:** Create, manage, track and analyze every event from planning to completion.

### Opening the Module

Click **Events** in the left sidebar.

### Events Table

| Column | Description |
|--------|-------------|
| **Day / Date** | Day of week + date (e.g. SAT · 2026-06-05) |
| **Event Name** | Full name of the event |
| **Client** | Client company name |
| **Contact Name** | Day-of-event contact name |
| **Contact Phone** | Day-of-event contact phone |
| **Contact Email** | Day-of-event contact email |
| **Venue** | Location |
| **Manager** | Assigned event manager |
| **Status** | Current lifecycle stage badge |
| **Actions** | Edit (✏️), Conflict Check (⚡), and Delete (🗑️) buttons |

### Event Status Lifecycle

Events move through these stages as they progress:

```
Planning → Tentative → Confirmed → Active → Completed
                                          → Cancelled
```

| Status | Badge Color | Meaning |
|--------|-------------|---------|
| Planning | 🟡 Yellow | In early planning stage |
| Tentative | ⚪ Gray | Awaiting client confirmation |
| Confirmed | 🔵 Blue | Client has confirmed |
| Active | 🟢 Green | Event is currently in progress |
| Completed | ⚪ Gray | Event finished successfully |
| Cancelled | 🔴 Red | Event was cancelled |

### Searching and Filtering

Three filters are available above the table:
1. **Search box** — Type event name, client, or Event ID
2. **Status filter** — Show only events of a specific status
3. **Type filter** — Filter by event category (Holiday, Corporate, College, Private / Social, Mitzvah, Party Planners / DJ Companies)

Results update instantly. A badge shows how many events match the current filters.

### Creating a New Event

1. Click **"+ New Event"** (top right of the page)
2. The **Add Event modal** opens — fill in all fields:

| Field | Description |
|-------|-------------|
| **Event Name** | Full name of the event (required) |
| **Client** | Client company name |
| **Venue** | Event location or venue name |
| **Event Type** | Holiday / Corporate / College / Private / Social / Mitzvah / Party Planners & DJ Companies |
| **Event Date** | Date of the event — click to open the CES date picker |
| **Event Time (Start → End)** | When the event itself runs (CES time picker) |
| **Setup Time → Strike Time** | Setup = when load-in begins, Strike = when breakdown ends (CES time pickers) |
| **Contact Day of Event — Name / Phone / Email** | Who to call on the day |
| **Event Manager** | Enter the event manager's name |
| **Assign Truck** | Optionally link one of the fleet trucks (CES-TRK-01/02/03) |
| **Event Status** | Defaults to Planning; change to any lifecycle stage |
| **Notes** | Any additional notes or special requirements |

3. **Assign Staff** — Click any staff card at the bottom to select them. Selected cards turn blue. Multi-select is supported.
4. **Reserve Inventory** — Click any inventory item card to assign it. Selected items turn blue.
5. Click **"✅ Create Event"**
6. The event is added instantly with an auto-generated ID (e.g. `CES-EVT-2026-0017`)
7. All assigned staff are automatically marked as **Busy**

### Editing an Event

1. Find the event in the table
2. Click **"✏️ Edit"** in the Actions column (or double-click any row)
3. The same modal opens — all fields are pre-filled
4. The **Event Status** dropdown lets you update the lifecycle stage
5. Staff and inventory pickers show previously assigned items already highlighted blue
6. Make changes — update any field, add or remove staff/inventory
7. Click **"✅ Save Changes"**
8. Staff availability is automatically updated (old staff released, new staff marked Busy)

### Deleting an Event

1. Click **"✏️ Edit"** to open the event modal → click the **"🗑️ Delete Event"** button in the footer
2. Or click the **"🗑️"** button directly in the Actions column
3. Confirm the deletion
4. All previously assigned staff are automatically set back to **Available**

### Conflict Detection

Click the **"⚡"** button on any event row to run an instant conflict check:
- **✅ No conflict** — all resources are free on this date
- **⚠️ Conflict found** — shows exactly which truck is double-booked on that date

### Timeline Generator

In the right panel of the Events module:
1. Select any event from the dropdown
2. Click **"Generate Timeline"**
3. The system creates a time-based run-of-show:
   - **T-24h** → Inventory Pull from Warehouse
   - **T-4h** → Truck Loading
   - **Setup Time** → Setup Begins at Venue
   - **Setup +2h** → Setup Complete — Venue Ready
   - **Strike Time** → Strike Begins
   - **T+2h** → Inventory Return to Warehouse

### Event Stats Panel

Right side panel shows live summary data:
- Total events in the system
- Currently active events
- Confirmed events count
- Number of active conflict alerts

### Exporting Events

Click **"⬇ Export"** → downloads `CES_Events.csv` with all event data.

---

## 5. Staff Operations Module

> **Purpose:** Manage your entire team — availability, roles, performance scores, and event assignments.

### Staff Table

| Column | Description |
|--------|-------------|
| **Staff ID** | Unique code — e.g. `CES-STF-001` |
| **Name** | Full name with avatar initials or photo |
| **Role** | Job title (Operations Manager, Tech Lead, etc.) |
| **Skill** | Primary skill area |
| **Availability** | 🟢 Available / 🟡 Busy |
| **Email** | Staff email address |
| **Events** | Number of events assigned |
| **Performance** | Score bar (0–100%) |
| **Actions** | Edit (✏️) and Delete (🗑️) buttons |

### KPI Cards (Top)

| KPI | Description |
|-----|-------------|
| **Total Staff** | All team members in the system |
| **Available** | Ready to be assigned to new events |
| **On Duty** | Currently deployed (Busy status) |
| **Avg Performance** | Team average performance score |

### Searching Staff

- **Search box** — Type name or role to filter instantly
- **Availability filter** — Show only Available or Busy staff

### Adding New Staff

1. Click **"+ Add Staff"**
2. Fill in: Full Name (required), Phone, Email, Role, Skill, Availability
3. Optionally upload a photo (see Staff Photo Upload below)
4. Click **"✅ Add Staff"**
5. New staff start at **0% Performance** and **0 Events** until assigned
6. Auto-generates ID (e.g. `CES-STF-011`)

### Editing / Deleting Staff

- **Edit:** Click **"✏️ Edit"** → modal opens pre-filled → update fields → **"✅ Save Changes"**
- **Delete:** In the table row click **"🗑️"**, or open Edit modal → click **"🗑️ Remove Staff"** → confirm

### Staff Photo Upload

1. Open Add or Edit Staff modal
2. Click the circular avatar area at the top of the modal
3. Select any image file (JPG, PNG, WEBP — max 5 MB)
4. A preview appears inside the circle
5. Click **"✕ Remove photo"** to revert to initials
6. Photos appear in the Staff table, Top Performers panel, and the Event staff picker

### Top Performers Panel (Right Side)

Shows the top 5 staff ranked by performance score — avatar, name, role, and score.

### Workload Chart (Right Side)

Horizontal bar chart (Chart.js) showing performance scores for all staff — useful to identify high performers and those needing coaching.

### Staff Availability and Events

- Assigning staff to an event → status automatically changes to **Busy**
- Removing staff from an event or deleting the event → automatically returns to **Available**

### Exporting Staff Data

Click **"⬇ Export"** → downloads `CES_Staff.csv` with all staff records.

---

## 6. Inventory Module

> **Purpose:** Track every piece of equipment — what you have, its condition, and availability.

### Inventory Table

| Column | Description |
|--------|-------------|
| **Product** | Category icon + equipment name |
| **Category** | Type of equipment |
| **Qty** | Available units / total units |
| **Status** | Available / In Use / In Repair |
| **Condition** | Excellent / Good / Fair / Poor / In Repair |
| **Actions** | Edit button |

### Equipment Categories

CES uses 17 product-type categories — each with its own icon:

| Category | Typical Items |
|----------|--------------|
| Audio / Video | PA Systems, LED Screens, DJ Booths |
| Carnivals | Rides, Ring Toss, Games |
| Casino Nights | Poker Tables, Roulette Wheels |
| Crafts & Favors | DIY Stations, Custom Cards |
| Dance Floors | LED Dance Floors, Checkered Stages |
| Event Furniture | Lounge Sets, VIP Bars, Tables |
| Game Shows | Buzzers, Stick Drop |
| Giant / Lawn Games | Giant Jenga, Mini Golf |
| Halloween Themed Entertainment | Haunted Props, Fog Machines |
| Holiday Parties | Seasonal Decor, Candy Walls |
| Inflatables | Bounce Houses, Slides |
| Mitzvah Madness | Themed Stations, Photo Ops |
| Performers | Acrobats, Magicians |
| Photo Booths | AI Booths, Open-Air, Mirror Booths |
| Photo Favors | Photo Strips, Trading Cards |
| Sports & Video Games | Gaming Consoles, Simulators |
| Virtual Reality | VR Headsets, 360° Stations |

### KPI Cards (Top)

| KPI | Description |
|-----|-------------|
| **Total Products** | Count of unique SKU categories |
| **Available Items** | Units currently ready to deploy |
| **In Use / Reserved** | Units currently at event sites |

### Searching and Filtering

- **Search box** — Type item name or ID
- **Category filter** — Show only a specific equipment type
- **Status filter** — Available / In Use / In Repair

### Status vs Condition

> **Status** tells you *where* an item is (Available = in warehouse, In Use = at an event, In Repair = being serviced).  
> **Condition** tells you the *physical state* (Excellent, Good, Fair, Poor, In Repair).  
> Set both independently when editing an item.

### Adding New Inventory Item

1. Click **"+ Add Inventory"**
2. Fill in: Item Name (required), Category, Total Quantity, Status, Condition
3. **Category auto-detects from the item name** — typing "VR Headset" auto-selects Virtual Reality; you can override manually
4. **Category Icon** — automatically matches the selected category; click any icon tile to override manually
5. Click **"✅ Save Item"**
6. Available count defaults to the total quantity entered
7. Item ID is auto-generated (e.g. `CES-INV-030`)

### Editing Inventory

- Double-click any row or click **"Edit"** in the Actions column
- Update name, category, quantity, status, condition, or icon
- Changing quantity automatically adjusts the available count proportionally
- Click **"✅ Save Item"**

### Deleting Inventory

- Open Edit modal → click **"🗑️ Delete Item"** → confirm

### In Repair Status

Items set to **In Repair** show an orange badge. The Dashboard KPI card automatically shows a live count of In Repair items. The Automation Engine's Live Alerts panel flags In Repair items by name.

### Exporting Inventory

Use **Settings → Export All Data** to download all inventory as `CES_Inventory_[date].csv`.

---

## 7. Logistics Module

> **Purpose:** Manage all truck dispatches, drivers, and delivery tracking.

### Dispatch Log Table

| Column | Description |
|--------|-------------|
| **Event** | Which event this dispatch serves + Event ID |
| **Truck** | Own fleet badge (blue) or 🔑 RENTAL badge with company/plate |
| **Driver** | Assigned driver name |
| **Actions** | Edit (✏️) and Delete (🗑️) buttons |

### Dispatch Status Flow

```
Preparing → Loading → Dispatched → Delivered → Returning → Completed
```

To update a dispatch status: click **"✏️ Edit"** on its row → the modal opens where status is shown in the current record.

### KPI Cards (Top)

| KPI | Description |
|-----|-------------|
| **Trucks** | Total fleet size (Own + Rental) |
| **Active Dispatches** | Total dispatches currently logged |
| **Delivered** | Completed delivery runs |

### Creating a New Dispatch

1. Click **"➕ New Dispatch"**
2. Fill in the **Add Dispatch modal**:

| Field | Description |
|-------|-------------|
| **Event** | Dropdown — select which event this dispatch is for |
| **Truck Type** | Click **OWN FLEET** or **RENTAL TRUCK** toggle |
| **Assign Truck** *(Own Fleet)* | Type or select from fleet. Click to see suggestions; type to filter; type a new ID to add a custom truck |
| **Rental Company / Plate No.** *(Rental only)* | Type the company name and vehicle plate |
| **Rental Cost ($)** *(Rental only)* | The rental fee |
| **Driver** | Driver's name |

3. Click **"✅ Create Dispatch"**

### Own Fleet vs Rental Truck

Click **OWN FLEET** or **RENTAL TRUCK** buttons at the top of the dispatch form:

- **OWN FLEET** (default) — Shows the truck combobox. These trucks appear in the Fleet Status panel.
- **RENTAL TRUCK** — Shows a text field for company/plate name + rental cost field. Rental dispatches show a 🔑 RENTAL badge in the table.

### Assign Truck — Smart Combobox

The Assign Truck field works two ways:
- **Click** the field to see all fleet trucks as suggestions
- **Type** to filter the list — suggestions narrow as you type
- **Type a new truck ID** — if it doesn't match any existing truck, an **"Add as new truck"** option appears

### Editing / Deleting a Dispatch

- **Edit:** Click **"✏️ Edit"** → modal opens pre-filled → update fields → **"✅ Save Changes"**
- **Delete:** In the table row click **"🗑️"**, or open Edit modal → click **"🗑️ Delete"** → confirm

### Fleet Status Panel (Right Side)

Shows all own-fleet trucks and their current dispatch status:
- Which event each truck is currently serving
- Status badge (Available, Preparing, Dispatched, etc.)
- **"Available"** in green if no active dispatch assigned

Rental trucks appear in a separate **Rental Trucks** section below if any are in the dispatch log.

---

## 8. Automation Engine

> **Purpose:** View and control all system automations, see live data-driven alerts, and review the notification log.

### Automation Rules Table

| Column | Description |
|--------|-------------|
| **ID** | Automation identifier (AUTO-001 through AUTO-008) |
| **Name** | What this automation does |
| **Trigger** | What causes it to run |
| **Action** | What it does when triggered |
| **Runs** | Total execution count |
| **Last Run** | When it most recently ran |
| **Status** | 🟢 Active / ⚪ Paused |
| **Control** | ▶ Run button and ⏸/▶ toggle |

### The 7 Active Automations

| # | Automation Name | Trigger | Action |
|---|----------------|---------|--------|
| AUTO-001 | Daily Operations Report | Every day at 7:00 AM | Email summary to Owner & Shane |
| AUTO-002 | Inventory Alert | Item unavailable or not returned | Alert to Warehouse Lead |
| AUTO-003 | Staff Assignment Notification | Staff assigned to event | Email/SMS to staff member |
| AUTO-004 | Conflict Detection | On any sheet edit | Flag conflict in dashboard alerts |
| AUTO-005 | Weekly Executive Report | Every Monday at 8:00 AM | PDF report to Owner email |
| AUTO-007 | Event Reminder — 48 Hours | 48 hours before event date | Email crew confirmation to Event Manager |
| AUTO-008 | Post-Event Debrief | 24 hours after event strike time | Send debrief form to Event Manager |

### Running an Automation Manually

Click **"▶ Run"** on any row to trigger it immediately:
- **Runs** count increases by 1
- **Last Run** updates to "Just now"
- A new entry appears in the Notification Log

> **Note:** If an automation is **Paused**, clicking Run is blocked — a warning appears in the Notification Log. Resume it first.

### Pausing and Resuming

- Click **"⏸ Pause"** to pause — status changes to Paused (gray)
- Click **"▶ Resume"** to reactivate

### Run All Now

Click **"▶ Run All Now"** (top right) to trigger all automations at once — useful for testing or an end-of-day sweep.

### Live Alerts Panel (Right Side)

Shows **real-time alerts pulled from your live data**:
- 🔴 **Truck Overlap** — Same truck double-booked on the same date
- 🟠 **Items In Repair** — Inventory items currently out of service (named individually)
- 🔵 **Events in 48hrs** — Active/Confirmed events happening within the next 48 hours
- ⚪ **Automations Paused** — Rules currently paused and not running

If none of the above apply, the panel shows ✅ **All Clear**. Alerts update automatically as your data changes.

### Notification Log (Right Side)

Scrollable, time-stamped log of all recent automation activity — most recent entries at the top.

---

## 9. Reports & Analytics

> **Purpose:** Executive-level summaries, operations overview, event type breakdown, and data export.

### KPI Cards (Top)

| Card | Description |
|------|-------------|
| **Total Events** | All events in the system |
| **Active Now** | Events currently in progress today |
| **Completed** | Successfully delivered events |

### Events by Type Chart

Horizontal progress bars showing how many events exist per event type. Each bar represents one type, showing count and relative proportion.

### Top Events by Revenue

Ranked list of the top 5 highest-revenue events:
- Rank number, event name, type, date
- Revenue shown in green
- Sorted highest to lowest automatically

### Executive Summary Section

Three-column breakdown for stakeholder reporting:

**Events Column:** Total events, Active count, Completed count

**Operations Column:** Staff members total, Trucks (fleet size), Total dispatches, Inventory items tracked

**Automations Column:** Active automation rules count, Total automation runs, Staff average performance %, Conflict alerts count

### Exporting the Report

Click **"⬇ Export Report"** to download a text file (`CES_Report_[date].txt`) containing:
- Company header and generation timestamp
- Event count summary (total, active, completed)
- Full event list with ID, name, type, date, status
- Staff count and average performance
- Logistics dispatch count

---

## 10. ID Reference Guide

Every record in the CES system has a unique ID for cross-referencing across modules.

| Record Type | ID Format | Example |
|-------------|-----------|---------|
| Event | CES-EVT-YYYY-XXXX | CES-EVT-2026-0001 |
| Staff Member | CES-STF-XXX | CES-STF-001 |
| Inventory Item | CES-INV-XXX | CES-INV-001 |
| Dispatch | CES-DSP-XXX | CES-DSP-001 |
| Truck | CES-TRK-XX | CES-TRK-01 |
| Client | CES-CLT-XXX | CES-CLT-001 |

**XXX** = 3-digit number (001 … 099, 100)  
**YYYY** = 4-digit year  
**XXXX** = 4-digit sequence number

> **Important:** IDs are generated as `array.length + 1`. Always avoid deleting records and adding new ones in the same session, as this can create duplicate IDs. If you need to delete records frequently, manually verify IDs after adding new ones.

---

## 11. Tips, Workflows & Best Practices

### Color Reference

| Color | Meaning |
|-------|---------|
| 🟢 Green | Good / Available / Active |
| 🔵 Blue | Info / Confirmed / CES Brand Color |
| 🟡 Yellow | Caution / Planning / Partial |
| 🔴 Red | Danger / Unavailable / Critical |
| ⚪ Gray | Neutral / Completed / Paused |
| 🟠 Orange | In Repair |

### Modal Keyboard Shortcuts

- **Click outside the modal** → closes without saving
- **✕ button** → closes without saving
- **Submit button** → saves and closes
- **Delete button** (Edit mode only) → prompts confirmation then deletes

### Daily Workflow

```
MORNING:
1. Open Dashboard → check KPI cards and Alert Center
2. Check "Upcoming — Next 7 Days" — confirm all events are staffed
3. Review 30-Day Pipeline — flag any events needing attention
4. Go to Staff → confirm availability for today's events
5. Go to Automation Engine → check Live Alerts for real-time issues

DURING EVENT DAY:
6. Logistics → update dispatch status as trucks depart and arrive
7. Inventory → edit items and update Status to "In Use" when deployed

EVENING:
8. Update event Status in Events module (Active → Completed)
9. Update inventory Status back to "Available" after return
10. Log any equipment damage (Condition → Poor / In Repair)
11. Check Automation Engine notification log for daily report
```

### Weekly Workflow

```
MONDAY:
- Weekly executive report auto-sent at 8 AM
- Review upcoming events this week
- Update any event statuses (Planning → Confirmed, etc.)

MID-WEEK:
- Check staff availability for upcoming events
- Review inventory — update In Use / returned items

FRIDAY:
- Use Settings → Export All Data for full backup
- Confirm next week's events are in Confirmed status
- Check Dashboard Pipeline — ensure all upcoming events are staffed
```

### New Event Checklist

When creating a new event, make sure to:
- [ ] Fill in Event Name, Client, Venue, Date, Event Type
- [ ] Set Event Status appropriately (Planning, Confirmed, etc.)
- [ ] Assign at least 2 Staff members
- [ ] Reserve relevant Inventory items
- [ ] Create a Dispatch record in Logistics for the truck
- [ ] Update event Status as it progresses (Planning → Confirmed → Active)

### Common Questions

**Q: I added data but it disappeared after I refreshed the page — why?**  
A: If Firebase is not configured, data is saved to localStorage. As long as you're using the same browser on the same device, data persists. If Firebase IS connected (the default config is included), data syncs to Firestore and persists permanently across devices.

**Q: Can I add more than the default events?**  
A: Yes — click "+ New Event" to add as many as needed.

**Q: How do I update an event status from Planning to Confirmed?**  
A: Click ✏️ Edit on the event row → a Status dropdown is visible in the Edit modal → select the new status and save.

**Q: How do I assign a truck to an event?**  
A: In the New/Edit Event modal, use the "Assign Truck" dropdown at the bottom. For full logistics tracking, also go to Logistics → "+ New Dispatch" → select the event → assign a truck.

**Q: A staff member shows as Busy but they're free — how do I fix it?**  
A: Go to Staff → click ✏️ Edit on that staff member → change Availability to "Available" → Save.

**Q: Can I add a truck that's not in the default fleet list?**  
A: Yes — in the Dispatch modal, type any new truck ID in the Assign Truck field. When the typed ID doesn't match any existing truck, an "Add as new truck" option appears.

**Q: How do I see which inventory is assigned to a specific event?**  
A: Go to Events → click ✏️ Edit on the event → scroll to the Inventory Picker. Items highlighted blue are currently assigned to that event.

---

## 12. System Settings

> **Purpose:** Personalise the CES dashboard — company details, display preferences, and data export.

### Opening Settings

Click the **⚙️ gear icon** in the top-right corner of the topbar. A Settings modal opens with four sections.

---

### Section 1 — Company Information

| Field | Default | Description |
|-------|---------|-------------|
| **Company Name** | Creative Event Services | Displayed in reports and exports |
| **Operations Manager** | Shane Williams | Shown in export headers |
| **Contact Email** | Set during final deployment | Used in export footers |

---

### Section 2 — Display Preferences

**Currency Symbol** — Select: $ (USD) / AED (UAE Dirham) / £ (GBP) / € (Euro) / ₹ (INR)

**Date Format** — Choose: MM/DD/YYYY / DD/MM/YYYY / YYYY-MM-DD

---

### Section 3 — Export All Data

Click **"⬇ Export All"** to download the entire CES database as CSV files:

| File Downloaded | Contents |
|----------------|----------|
| `CES_Events_YYYY-MM-DD.csv` | All event records |
| `CES_Staff_YYYY-MM-DD.csv` | All staff records |
| `CES_Inventory_YYYY-MM-DD.csv` | All inventory items |
| `CES_Logistics_YYYY-MM-DD.csv` | All dispatch records |

All 4 files download at once, each named with today's date. Open in Excel or Google Sheets for backup, reporting, or sharing.

> **Tip:** Run Export All Data at the end of each week as a manual backup.

---

### Section 4 — Team Access (Owner Only)

Owner accounts see the **Team Access** section where you can:
- View all current team members and their roles
- Change a team member's role (Editor / Viewer)
- Add a new team member with name, email, password, and role
- Remove team members (cannot remove yourself)

**Roles:**
- **Owner** — Full access: add, edit, delete, manage team, change settings
- **Editor** — Can add, edit, and delete records
- **Viewer** — Read-only access; all Add/Edit/Delete buttons are hidden

---

### Saving Settings

Click **"✅ Save Settings"** — the gear icon briefly flashes blue to confirm. Settings persist permanently in your browser's localStorage across sessions.

---

## What's New — Guide Updated June 2026 (v4.0)

Changes reflected in this version of the guide:

- **Health score system removed from docs** — Health score was never implemented in the code; all references removed from this guide
- **QR code feature removed from docs** — QR Scanner was not implemented; all references removed
- **Priority column removed from docs** — Events table does not have a Priority column; removed from guide
- **Rate/hr column removed from docs** — Staff table does not include a rate column; removed from guide
- **Logistics fields corrected** — Dispatch modal only captures: Event, Truck Type, Truck/Rental details, Driver. Departure/Arrival/Fuel/Route fields were removed earlier; guide now matches the actual form
- **Reports corrected** — "Top Events" section shows Revenue ranking (not Health Score); guide updated accordingly
- **Automation table corrected** — System has 7 automations (AUTO-001 to AUTO-008, excluding AUTO-006 "Health Score Update" which was removed); guide updated
- **KPI count corrected** — Dashboard has 4 KPI cards (Events, Staff, Inventory, Active Dispatches), not 3
- **Settings compact mode removed** — Compact Mode toggle was removed from the Settings UI; section removed from guide
- **Settings persistence corrected** — Settings persist permanently in localStorage (not just "for the current session")
- **Live Alerts panel clarified** — Real-time alerts (truck conflicts, items in repair, upcoming events) live in Automation Engine, not the Dashboard alert panel
- **ID collision warning added** — Known issue documented in Section 10
- **Team Access / Roles documented** — Section 12 now covers the full Team Access workflow
- **Firebase integration documented** — Login flow and data persistence with Firebase Firestore explained in Getting Started
- **60s Auto-Refresh removed** — Redundant since Firebase `onSnapshot` (instant) + 12s polling already handle all real-time updates

---

*Creative Event Services — Enterprise Operations System v4.0*  
*Guide last updated: June 2026*  
*Support contact is configured during final deployment.*
