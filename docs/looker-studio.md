# CES Enterprise Operations System
## Looker Studio Dashboard Setup Guide

**Connect Looker Studio to your CES Google Sheet for live executive analytics.**

---

## Step 1 — Create New Report

1. Go to **lookerstudio.google.com**
2. Click **Create → Report**
3. Select data source: **Google Sheets**
4. Pick your CES spreadsheet → sheet: `10_Finance`
5. Click **Add to Report**

---

## Step 2 — Add All Data Sources

Add each sheet tab as a separate data source:

| Sheet | Looker Studio Purpose |
|-------|--------------------|
| `01_Events_Master` | Event KPIs, status charts |
| `03_Staff_Master` | Staff performance |
| `10_Finance` | Revenue & profit trends |
| `11_Invoices` | Invoice status breakdown |
| `08_Clients_CRM` | Client LTV analysis |
| `18_Analytics` | Custom KPI metrics |

---

## Step 3 — Build Dashboard Pages

### Page 1 — Executive Dashboard
```
Widgets:
├── Scorecards: Total Revenue, Net Profit, Events Count, Margin %
├── Time Series: Monthly Revenue (Finance sheet, Month dimension)
├── Bar Chart: Revenue by Event Type (Events sheet)
├── Donut Chart: Invoice Status (Invoices sheet)
└── Table: Top 10 Events by Revenue
```

### Page 2 — Operations Overview
```
Widgets:
├── Scorecards: Active Events, Staff Deployed, Available Inventory
├── Table: All Events with status color coding
├── Bar Chart: Staff Performance Scores
├── Pie Chart: Event Types Distribution
└── Bullet Chart: Inventory Utilization by Category
```

### Page 3 — Finance Deep Dive
```
Widgets:
├── Time Series: Revenue vs Expenses vs Profit (monthly)
├── Table: All Invoices with conditional formatting
├── Stacked Bar: Revenue breakdown (Staff/Inventory/Logistics/Vendor)
├── Scorecard: Outstanding Balance
└── Filter: Date range, Event Type, Status
```

### Page 4 — Client Analytics
```
Widgets:
├── Table: Clients ranked by Lifetime Value
├── Bar Chart: Revenue by Client
├── Pie Chart: Client Tier Distribution (VIP/Regular/New)
├── Scorecard: Total Client LTV, Average Events per Client
└── Filter: Tier, Date Range
```

---

## Step 4 — Apply CES Branding

**Theme → Customize:**
- **Primary color:** `#0092C8`
- **Accent:** `#00A8E0`
- **Background:** `#0B0E14` or `#111520`
- **Text:** `#E8EAF0`
- **Font:** Google Sans or Inter

**Add header:**
- Insert → Image → Upload `Logo CES@2x.png`
- Add text: `Creative Event Services — Enterprise Analytics`

---

## Step 5 — Calculated Fields

In Looker Studio → **Add a field**:

```
Profit Margin % = Revenue / Net Profit * 100

Event Health Category = 
  CASE
    WHEN Health Score >= 80 THEN "Healthy"
    WHEN Health Score >= 60 THEN "At Risk"
    ELSE "Critical"
  END

Days Until Event = DATE_DIFF(Event Date, TODAY(), DAY)
```

---

## Step 6 — Filters & Controls

Add **filter controls** to every page:
- **Date Range Control** — Event Date
- **Dropdown** — Status (Active/Confirmed/Planning/Completed)
- **Dropdown** — Event Type
- **Dropdown** — Event Manager

---

## Step 7 — Schedule Email Reports

1. Click **Share → Schedule email delivery**
2. Set: **Every Monday 8:00 AM**
3. Recipients: Owner email, Operations Manager
4. Format: PDF
5. Pages: All (Executive Summary)

---

## Step 8 — Share Dashboard

1. Click **Share → Manage access**
2. Add team members by Google email
3. Set role: **Viewer** (managers) or **Editor** (owner)
4. Enable **Link sharing** for read-only executive view

---

## Key Metrics to Track

| KPI | Source | Target |
|-----|--------|--------|
| Monthly Revenue | Finance | +15% MoM |
| Profit Margin | Finance | > 45% |
| Event Health Score | Events | > 75% avg |
| Invoice Collection Rate | Invoices | > 90% |
| Staff Utilization | Staff Assignments | 70–85% |
| Inventory Utilization | Inventory | > 60% |
