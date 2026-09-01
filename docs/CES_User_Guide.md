# CES Enterprise Operations System
## Complete User Guide — Version 4.0
> ⚠️ This is a secondary copy. The authoritative version is at the root: `CES_User_Guide.md`

**Creative Event Services | Enterprise Event Operations System**  
*Dashboard Guide — All Modules, All Features*

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Master Dashboard](#master-dashboard)
3. [Events Module](#events-module)
4. [Staff Operations Module](#staff-operations-module)
5. [Inventory Module](#inventory-module)
6. [Logistics Module](#logistics-module)
7. [Client CRM Module](#client-crm-module)
8. [Finance Module](#finance-module)
9. [Automation Engine](#automation-engine)
10. [Reports & Analytics](#reports--analytics)
11. [Google Sheets Setup](#google-sheets-setup)
12. [Mobile App (AppSheet)](#mobile-app-appsheet)
13. [Role-Based Access](#role-based-access)
14. [Tips & Best Practices](#tips--best-practices)

---

## 🚀 Getting Started

### Opening the Dashboard

1. Go to the folder: `CES - Enterprice Event Operations System 2026`
2. Double-click `index.html`
3. It will open in your web browser (Chrome recommended)
4. No internet needed — it runs fully offline

### First Look

When the dashboard opens, you will see:

| Area | Description |
|------|-------------|
| **Left Sidebar** | Navigation menu — click any module to switch |
| **Top Bar** | Live clock, notification bell, settings icon |
| **Main Area** | Changes based on which module is selected |

### Navigation

- Click any item in the **left sidebar** to open that module
- The **active module** is highlighted in blue with a left border
- A **red badge** on a nav item means there are alerts in that section
- The **top bar title** updates to show which module you're in

---

## 📊 Master Dashboard

> **Purpose:** The command center. See everything at a glance — KPIs, today's events, alerts, and charts.

### KPI Bar (6 Cards at the Top)

| KPI Card | What It Shows |
|----------|--------------|
| **Events This Month** | Total events scheduled for the current month |
| **Total Revenue** | Sum of all invoiced amounts (YTD) |
| **Total Profit** | Net profit after all expenses |
| **Active Staff** | How many staff are currently deployed vs total |
| **Inventory Use** | % of inventory currently in use |
| **Pending Payments** | Total outstanding balance + number of unpaid invoices |

- **Green arrow ▲** = positive trend
- **Red arrow ▼** = needs attention

### Revenue Chart

- Shows monthly revenue for all 12 months of 2026
- **Switch between Monthly / Quarterly** using the dropdown in the chart header
- Blue line with gradient fill — hover over any point to see exact dollar amount
- Months with no events show $0 (future months)

### Alert Center

Live alerts appear here for:
- 🔴 **Red alerts** = Critical (conflicts, overdue payments)
- 🟡 **Yellow alerts** = Warnings (staff shortage, pending items)
- 🔵 **Blue alerts** = Info (confirmations, reminders)

Each alert shows: **title**, **description**, and **time ago**

### Today's Events Panel

- Shows all events happening **today**
- If no events today, shows the next upcoming events for demo
- Each event card shows: **ID, Name, Venue, Time, Manager, Revenue**
- **Health Score bar** — green (80%+), yellow (60–79%), red (below 60%)
- **Click any event card** → jumps to the Events module

### Inventory Utilization Chart

- Horizontal bar chart per category (AI Booths, LED Games, Robots, etc.)
- **Green bars** = well utilized (>60%)
- **Yellow bars** = moderate use
- Helps you see which equipment is most in demand

---

## 📅 Events Module

> **Purpose:** Central command for every event. Create, track, manage, and analyze all events.

### Opening the Module

Click **"Events"** in the left sidebar. A red badge shows the number of active events.

### Events Table

The main table shows all 8 events with these columns:

| Column | Description |
|--------|-------------|
| **Event ID** | Unique code (CES-EVT-2026-0001) — shown in blue |
| **Event Name** | Full event name |
| **Client** | Client company name |
| **Date** | Event date |
| **Venue** | Event location |
| **Manager** | Assigned event manager |
| **Revenue** | Total event revenue in USD |
| **Status** | Active / Confirmed / Planning / Tentative |
| **Priority** | High / Medium / Low |
| **Health** | Health score bar (0–100%) |
| **Actions** | View details or Check conflicts |

### Status Color Codes

| Status | Color | Meaning |
|--------|-------|---------|
| Active | 🟢 Green | Event is live / happening now |
| Confirmed | 🔵 Blue | Booked and confirmed by client |
| Planning | 🟡 Yellow | In planning stage |
| Tentative | ⚪ Gray | Pending confirmation |
| Completed | ⚪ Gray | Event finished |

### Searching and Filtering

1. **Search box** — Type event name, client name, or Event ID
2. **Status filter** — Show only Active / Confirmed / Planning / etc.
3. **Type filter** — Filter by Conference, Wedding, Corporate, Exhibition, etc.
4. **Priority filter** — High / Medium / Low
5. Results update instantly — badge shows count of matching events

### View Event Details

Click the **"View"** button on any event row to see full details:
- Complete event info (date, time, venue, manager)
- Revenue and profit figures
- Health score and priority
- Any special notes

### Conflict Detection

Click the **"⚡"** (lightning bolt) button on any event to run a conflict check:
- ✅ **No conflict** → shows green confirmation
- ⚠️ **Conflict found** → shows which truck or staff is double-booked and on which date

### Creating a New Event

1. Click **"➕ New Event"** button (top right)
2. A modal form opens — fill in:
   - **Event Name** (required)
   - **Client** name
   - **Venue**
   - **Event Type** (dropdown)
   - **Event Date** (date picker)
   - **Event Manager** (dropdown: Shane / Maria / David)
   - **Revenue** amount in USD
   - **Priority** (High/Medium/Low)
   - **Notes** (optional)
3. Click **"Create Event"** — the event is added instantly
4. Auto-generates ID like `CES-EVT-2026-0009`

### Timeline Generator

1. In the right panel, select any event from the dropdown
2. Click **"Generate Timeline"**
3. Auto-creates a time-based plan:
   - T-24h → Inventory Pull
   - T-4h → Truck Loading
   - Setup Time → Setup Begins
   - Setup +2h → Setup Complete
   - Strike Time → Strike Begins
   - T+2h → Inventory Return

### Event Stats Panel

Shows summary stats on the right:
- Total events count
- Currently active events
- Total revenue this month
- Average health score
- Conflict alerts count

### Exporting Events

Click **"⬇ Export"** → downloads `CES_Events_[date].csv` file  
Contains all event data — open in Excel or Google Sheets

---

## 👥 Staff Operations Module

> **Purpose:** Manage your entire team — availability, performance, assignments, and workload.

### Staff Directory Table

| Column | Description |
|--------|-------------|
| **Staff ID** | Unique code (CES-STF-001) |
| **Name** | Full name with avatar initials |
| **Role** | Job title (Operations Manager, Tech Lead, etc.) |
| **Skill** | Primary skill area |
| **Availability** | 🟢 Available / 🟡 Busy |
| **Rate/hr** | Hourly rate in USD |
| **Events** | Number of events assigned |
| **Performance** | Score bar (0–100%) |

### KPI Cards (Top)

| KPI | Description |
|-----|-------------|
| Total Staff | All team members in the system |
| Available | Ready to be assigned to new events |
| On Duty | Currently deployed at events |
| Avg Performance | Team average performance score |

### Searching Staff

- **Search box** — type name or role
- **Availability filter** — show only Available or Busy staff

### View Staff Profile

Click **"View"** on any staff row to see:
- Staff ID, name, role, skill type
- Current availability status
- Hourly rate and performance score
- Which events they're assigned to
- Phone number

### Top Performers Panel

Right side shows the **top 5 staff** ranked by performance score.  
Each card shows: avatar, name, role, score number.

### Workload Chart

Horizontal bar chart showing performance scores for all 10 staff members.  
Useful to identify who needs coaching vs who is excelling.

### Adding New Staff

1. Click **"➕ Add Staff"**
2. Enter: Name → Role
3. Staff is added with default values (Performance: 80, Rate: $35/hr)
4. Auto-generates ID (CES-STF-011, etc.)

### Exporting Staff Data

Click **"⬇ Export"** → downloads `CES_Staff.csv`

---

## 📦 Inventory Module

> **Purpose:** Track every piece of equipment — availability, location, condition, and QR check-in/out.

### Inventory Table

| Column | Description |
|--------|-------------|
| **Item ID** | Unique code (CES-INV-LED-001) |
| **Name** | Equipment name |
| **Category** | Type of equipment |
| **Qty** | Total quantity owned |
| **Available** | Green = all available, Yellow = partial, Red = none |
| **Status** | Available / In Use / Partial |
| **Condition** | Excellent / Good / Damaged |
| **Value** | Unit value in USD |
| **Location** | Current location (Warehouse A/B or Truck/Event Site) |
| **QR** | Button to view QR code info |

### Categories

| Category | Icon | Examples |
|----------|------|---------|
| AI Booths | 🤖 | AI Photo Booth Pro |
| LED Games | 💡 | LED Wall Panels |
| Robots | 🦾 | Interactive Robot Alpha |
| Lounge Furniture | 🛋️ | Premium Lounge Sets |
| Displays | 🖥️ | 4K Display 75" |
| Lighting | 🔆 | Stage Lighting Rigs |
| Audio Equipment | 🔊 | PA Systems, Concert Sound |

### Category Panel (Right Side)

Shows each category with:
- Progress bar showing availability %
- Count (available / total)
- Color coding: Green = well stocked, Red = running low

### Searching Inventory

- **Search box** — type item name or ID
- **Category filter** — filter by equipment type
- **Status filter** — Available / In Use / Partial

### QR Code Feature

Click **"QR"** button on any item to see:
- Item ID, name, category, status, location
- In production: displays actual QR image for scanning

### QR Scanner Panel (Right Side)

1. Type an Item ID in the input box (e.g. `CES-INV-LED-001`)
2. Click **"Check In/Out"**
3. System shows item details — name, status, location
4. In production: warehouse staff scan physical QR → auto-logs in `14_QR_Logs`

### KPI Cards (Top)

| KPI | Description |
|-----|-------------|
| Total Items | All inventory items tracked |
| Available | Items ready to be reserved |
| In Use | Currently at event sites |
| Total Value | Full asset portfolio value |

### Adding New Inventory

Click **"➕ Add Item"** and enter:
1. Item name
2. Category (from the 7 categories)
3. Quantity
4. Unit value ($)

Auto-generates ID based on category code.

### Exporting Inventory

Click **"⬇ Export"** → downloads `CES_Inventory.csv`

---

## 🚛 Logistics Module

> **Purpose:** Manage truck dispatch, routes, drivers, and delivery tracking.

### Dispatch Log Table

| Column | Description |
|--------|-------------|
| **Dispatch ID** | Unique code (CES-DSP-001) |
| **Event** | Which event this dispatch serves |
| **Truck** | Which truck (CES-TRK-01/02/03) |
| **Driver** | Assigned driver name |
| **Departure** | Date and time of departure |
| **Route** | From → To description |
| **Fuel $** | Estimated fuel cost |
| **Status** | Current status (dropdown) |

### Status Flow

Status moves through 6 stages:

```
Preparing → Loading → Dispatched → Delivered → Returning → Completed
```

Click the **status dropdown** on any dispatch row to update it instantly.

### KPI Cards (Top)

| KPI | Description |
|-----|-------------|
| Trucks | Total fleet size (3 trucks) |
| Active Dispatches | Current dispatch operations |
| Delivered | Completed delivery runs |
| Total Fuel Cost | Sum of all fuel costs this period |

### Fleet Status Panel (Right Side)

Shows all 3 trucks with:
- **Truck ID** (CES-TRK-01, 02, 03)
- Which event they're currently serving
- Current status badge

If a truck has no dispatch → shows **"Available"** in green.

### Status Flow Visual (Right Side)

A numbered step-by-step flow showing all 6 statuses in order — helps drivers and managers understand the process.

### Creating a New Dispatch

1. Click **"➕ New Dispatch"**
2. Enter an Event ID (e.g. `CES-EVT-2026-0002`)
3. System auto-fills: event name, truck, route, departure time
4. New dispatch appears in the table as "Preparing"

---

## 🤝 Client CRM Module

> **Purpose:** Manage client relationships, track lifetime value, rank clients, and generate proposals.

### Client Directory Table

| Column | Description |
|--------|-------------|
| **Client ID** | Unique code (CES-CLT-001) |
| **Company** | Company/organization name |
| **Contact** | Primary contact person |
| **Email** | Contact email address |
| **Events** | Total events done with CES |
| **Revenue** | Total revenue generated |
| **Tier** | VIP / Regular / New |
| **Last Event** | Date of most recent event |
| **Actions** | View profile or Generate Proposal |

### Client Tiers

| Tier | Badge | Criteria |
|------|-------|---------|
| 🟢 VIP | Green | High revenue, multiple events, loyal |
| 🔵 Regular | Blue | Returning clients, moderate revenue |
| ⚪ New | Gray | First-time or single event clients |

### KPI Cards (Top)

| KPI | Description |
|-----|-------------|
| Total Clients | All clients in database |
| VIP Clients | Premium tier count |
| Lifetime Value | Total all-time revenue from all clients |
| Avg Events/Client | Shows repeat booking rate |

### Searching Clients

- **Search box** — type company name or contact name
- **Tier filter** — show only VIP / Regular / New

### Top Clients by LTV Panel (Right Side)

Shows all clients ranked by **Lifetime Value** (highest to lowest):
- Rank number, company name, events count
- LTV amount in blue and tier badge

### View Client Profile

Click **"View"** on any client row:
- Full contact details (email, phone)
- Tier classification
- Total events and lifetime revenue
- Most recent event date

### Generate Proposal

Click **"Proposal"** on any client row:
- Auto-generates a professional proposal letter
- Includes client name, CES services list, signature
- Downloads as a `.txt` file ready to customize and send

### Tier Distribution Chart (Right Side)

Donut chart showing breakdown of VIP / Regular / New clients.

### Adding New Client

Click **"➕ Add Client"** → enter company name and contact name.

### Exporting Client Data

Click **"⬇ Export"** → downloads `CES_Clients.csv`

---

## 💰 Finance Module

> **Purpose:** Track all revenue, invoices, payments, and profitability.

### Invoice Register Table

| Column | Description |
|--------|-------------|
| **Invoice ID** | Unique code (CES-INV-F-001) |
| **Event** | Linked event ID |
| **Client** | Client company name |
| **Amount** | Total invoice amount |
| **Paid** | Amount received so far |
| **Balance** | Remaining amount due |
| **Status** | Paid / Partial / Unpaid |
| **Due Date** | Payment deadline (red if overdue) |
| **Actions** | Record payment or Download invoice |

### Invoice Status

| Status | Badge | Meaning |
|--------|-------|---------|
| 🟢 Paid | Green | Fully collected |
| 🟡 Partial | Yellow | Partially paid, balance remaining |
| 🔴 Unpaid | Red | No payment received yet |
| 🔴 OVERDUE | Red tag | Past due date |

### KPI Cards (Top)

| KPI | Description |
|-----|-------------|
| Total Invoiced | Sum of all invoice amounts |
| Collected | Total payments received |
| Outstanding | Total remaining balance |
| Net Profit | Profit after all expenses |

### Recording a Payment

1. Find the invoice in the table
2. Click **"Pay"** button
3. A prompt asks: how much was received?
4. Enter the amount → click OK
5. System automatically:
   - Updates paid amount
   - Reduces balance
   - Changes status to Partial or Paid

### Downloading an Invoice

Click **"PDF"** on any invoice row:
- Downloads a formatted invoice text file
- Contains: Invoice ID, client name, event, amount, paid, balance, status, due date
- Ready to email or print

### Creating a New Invoice

1. Click **"➕ Invoice"**
2. Enter: client name → invoice amount
3. Auto-sets due date to 14 days from today
4. Appears in the table as Unpaid

### Profit by Event Panel (Right Side)

Shows each event with:
- Event name
- Progress bar showing profit margin %
- Profit amount in green
- Margin percentage

### Payment Summary Chart (Right Side)

Donut chart: **Collected** (green) vs **Outstanding** (red)  
Visual snapshot of payment collection health.

### Filter by Status

Use the status dropdown to show only:
- All invoices
- Paid only
- Partial only
- Unpaid only

### Exporting Finance Data

Click **"⬇ Export"** → downloads `CES_Finance.csv`

---

## ⚡ Automation Engine

> **Purpose:** View and control all automated rules, alerts, and notification logs.

### Automation Rules Table

| Column | Description |
|--------|-------------|
| **ID** | Automation identifier (AUTO-001 to AUTO-008) |
| **Name** | What this automation does |
| **Trigger** | What causes it to run |
| **Action** | What it does when triggered |
| **Runs** | How many times it has executed |
| **Last Run** | When it last ran |
| **Status** | 🟢 Active / ⚪ Paused |

### The 8 Automations

| # | Name | When It Runs |
|---|------|-------------|
| 1 | Daily Operations Report | Every day at 7:00 AM |
| 2 | Payment Reminder — 7 Days | When invoice due in 7 days |
| 3 | Payment Reminder — Overdue | When payment is past due |
| 4 | Inventory Alert | When item is unavailable or damaged |
| 5 | Staff Assignment Notification | When staff assigned to event |
| 6 | Conflict Detection | On every sheet edit |
| 7 | Weekly Executive Report | Every Monday 8:00 AM |
| 8 | Event Health Score Update | Every 6 hours |

### Running an Automation Manually

Click **"▶ Run"** next to any automation to trigger it immediately.  
The **Runs** count increases and **Last Run** updates to "Just now".

### Pausing an Automation

Click **"⏸"** to pause any automation.  
Status changes from **Active** (green) to **Paused** (gray).  
Click **"▶"** again to reactivate.

### Run All Now

Click **"▶ Run All Now"** button to trigger all 8 automations at once.  
Useful for testing or end-of-day manual run.

### Live Alerts Panel (Right Side)

Shows the 3 most critical current alerts:
- 🔴 Overdue payments
- 🟡 Truck conflicts
- 🔵 Event reminders

### Notification Log (Right Side)

A scrollable log showing recent automation activity:
- **Time** → **color dot** → **message**
- Most recent actions at the top
- Shows what ran, what was sent, what was detected

---

## 📈 Reports & Analytics

> **Purpose:** Executive-level insights, KPI summaries, revenue analysis, and data exports.

### KPI Summary (Top)

| Card | Description |
|------|-------------|
| Total Revenue | All-time invoiced revenue |
| Net Profit | After all expenses |
| Total Events | Count of all events managed |
| Client LTV | Combined lifetime value of all clients |

### Revenue by Event Type Chart

Bar chart showing how much revenue each event type generates:
- Corporate, Wedding, Conference, Exhibition, Concert, Product Launch
- Quickly see which event type is most profitable

### Top 5 Events by Profit

Ranked list showing the 5 most profitable events:
- Event name, type, date
- Profit amount in green

### Executive Summary Table

Three-column breakdown:

**Revenue Column:**
- Gross Revenue
- Total Expenses
- Net Profit
- Profit Margin %

**Operations Column:**
- Events Managed
- Staff Deployed
- Trucks Used
- Inventory Items

**Client Metrics Column:**
- Total Clients
- VIP Clients
- New Clients
- Retention Rate

### Exporting Executive Report

Click **"⬇ Export Report"** → downloads a formatted text file with:
- Company header and generation date
- Revenue summary
- Full events list with revenue and status
- Staff performance summary
- Ready to share with stakeholders

---

## 🗂️ Google Sheets Setup

> **One-time setup to create the live database backend.**

### Step 1 — Create Google Sheet

1. Go to **sheets.google.com**
2. Create a **New Blank Spreadsheet**
3. Name it: `CES Enterprise Operations System 2026`

### Step 2 — Open Apps Script

1. Click **Extensions → Apps Script**
2. Delete the default `function myFunction()` code
3. Click the **+** next to "Files" to add new files

### Step 3 — Add the Scripts

Create these files and paste the code from the `apps-script/` folder:

| File to Create | Paste from |
|---------------|-----------|
| `setup.gs` | `apps-script/setup.gs` |
| `automation.gs` | `apps-script/automation.gs` |
| `triggers.gs` | `apps-script/triggers.gs` |

### Step 4 — Run Setup

1. Select function `setupAllSheets` from the dropdown
2. Click **▶ Run**
3. Grant permissions when asked
4. Wait ~30 seconds
5. ✅ Alert appears: "CES Setup Complete! 21 sheets created"

### Step 5 — Activate Triggers

1. Select function `setupTriggers`
2. Click **▶ Run**
3. ✅ Alert: "Triggers Set! Daily report, weekly report, health scores, conflict detection"

### Step 6 — Configure Settings

Open sheet `16_Admin_Settings` and update:
- `OWNER_EMAIL` → your email address
- `OPERATIONS_EMAIL` → Shane's email address
- `TIMEZONE` → your timezone

### What Gets Created (21 Sheets)

```
00_Dashboard         → Visual summary (manual)
01_Events_Master     → All events database
02_Events_Calendar   → Calendar view
03_Staff_Master      → Staff database
04_Staff_Assignments → Who works which event
05_Inventory_Master  → All equipment
06_Inventory_Reservations → Reserved items per event
07_Logistics         → Truck dispatches
08_Clients_CRM       → Client database
09_Vendors           → Vendor contacts
10_Finance           → P&L per event
11_Invoices          → All invoices
12_Payments          → Payment records
13_Event_Checklists  → Task checklists per event
14_QR_Logs           → Scan history
15_Notifications     → All sent notifications
16_Admin_Settings    → System configuration
17_Reports           → Saved reports
18_Analytics         → KPI metrics
19_Automation_Config → Automation rules config
20_System_Logs       → Full audit trail
```

---

## 📱 Mobile App (AppSheet)

> **For field teams — managers, warehouse, and drivers.**

### Setting Up

1. Open your CES Google Sheet
2. Click **Extensions → AppSheet → Create an app**
3. Follow the setup in `docs/appsheet-setup.md`

### Who Uses It

| Role | Access | Key Features |
|------|--------|-------------|
| **Manager** | Events, Staff, Logistics | Assign staff, track deliveries |
| **Warehouse** | Inventory, QR Logs | Scan items, mark damaged |
| **Driver** | Own dispatches only | Update status, confirm delivery |

---

## 🔐 Role-Based Access

| Role | Who | Access Level |
|------|-----|-------------|
| **Owner** | Company owner | Full access — all modules, all data |
| **Shane** | Operations Manager | All operations — Events, Staff, Logistics |
| **Managers** | Event Managers | Their assigned events only |
| **Warehouse** | Warehouse staff | Inventory and QR Logs only |
| **Drivers** | Drivers | Their own dispatch records only |

---

## 💡 Tips & Best Practices

### Daily Workflow

```
Morning:
1. Open Dashboard → check Alert Center
2. Review Today's Events panel
3. Check pending payments in Finance
4. Confirm staff availability in Staff module

During Events:
5. Logistics → update dispatch status
6. Inventory → check in/out via QR scanner

Evening:
7. Automation runs daily report at 7 PM
8. Update any event health scores
9. Log any damage to inventory
```

### Weekly Workflow

```
Monday:
- Weekly executive report auto-sent
- Review top clients in CRM
- Check all upcoming event health scores

Friday:
- Export event data for weekly backup
- Review outstanding invoices
- Update inventory quantities
```

### Event Health Score Guide

| Score | Status | Action Required |
|-------|--------|----------------|
| 80–100% | 🟢 Healthy | No action needed |
| 60–79% | 🟡 At Risk | Review missing items |
| 0–59% | 🔴 Critical | Immediate attention |

**What lowers the score:**
- No staff assigned (-25 points)
- Only 1 staff assigned (-10 points)
- No truck assigned (-10 points)
- Unpaid invoice (-20 points)
- Partial payment (-10 points)
- High risk level (-15 points)
- Medium risk level (-5 points)

### ID Naming Reference

| Type | Format | Example |
|------|--------|---------|
| Event | CES-EVT-YYYY-XXXX | CES-EVT-2026-0001 |
| Staff | CES-STF-XXX | CES-STF-001 |
| Inventory | CES-INV-CAT-XXX | CES-INV-LED-001 |
| Client | CES-CLT-XXX | CES-CLT-001 |
| Dispatch | CES-DSP-XXX | CES-DSP-001 |
| Invoice | CES-INV-F-XXX | CES-INV-F-001 |
| Truck | CES-TRK-XX | CES-TRK-01 |

### Color Reference

| Color | Meaning |
|-------|---------|
| 🟢 Green | Good / Available / Paid / Active |
| 🔵 Blue | Info / Confirmed / CES Brand |
| 🟡 Yellow | Warning / Planning / Partial |
| 🔴 Red | Danger / Overdue / Unavailable |
| ⚪ Gray | Neutral / Completed / Paused |

---

## ❓ Common Questions

**Q: My dashboard shows old data — how do I refresh?**  
A: Press `F5` or `Ctrl+R` to reload the browser. Sample data reloads fresh.

**Q: Can I add more events than 8?**  
A: Yes — click "➕ New Event" in the Events module. New events are added to the live session.

**Q: How do I connect the dashboard to real Google Sheets data?**  
A: Run `setup.gs` in Apps Script first. The dashboard currently shows demo data — in Phase 2 development it can connect via Google Sheets API.

**Q: The export downloaded a CSV — how do I open it?**  
A: Double-click the downloaded `.csv` file — it opens in Excel or Google Sheets automatically.

**Q: Who receives the daily report email?**  
A: The emails set in `16_Admin_Settings` → `OWNER_EMAIL` and `OPERATIONS_EMAIL`.

**Q: How do I check if two events have a conflict?**  
A: In the Events module, click the **"⚡"** button on any event row. Or run `runConflictCheck()` in Apps Script.

---

*Creative Event Services — Enterprise Operations System v1.0*  
*Built for: Shane Williams & Team | 2026*
