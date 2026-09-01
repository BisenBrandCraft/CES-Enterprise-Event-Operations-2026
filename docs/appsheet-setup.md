# CES Enterprise Operations System
## AppSheet Mobile App Setup Guide

**For:** Managers, Warehouse Staff, Drivers  
**Platform:** AppSheet (Google Workspace)

---

## Step 1 — Connect AppSheet to Google Sheet

1. Open your **CES Google Sheet**
2. Click **Extensions → AppSheet → Create an app**
3. AppSheet auto-detects tables from sheet tabs
4. Name the app: `CES Operations`

---

## Step 2 — Configure Tables

In AppSheet Studio, map these sheet tabs as **tables**:

| Sheet Tab | Table Name | Key Column |
|-----------|-----------|------------|
| `01_Events_Master` | Events | Event ID |
| `03_Staff_Master` | Staff | Staff ID |
| `04_Staff_Assignments` | Assignments | Assignment ID |
| `05_Inventory_Master` | Inventory | Item ID |
| `07_Logistics` | Logistics | Dispatch ID |
| `08_Clients_CRM` | Clients | Client ID |
| `14_QR_Logs` | QR Logs | Log ID |

---

## Step 3 — Create App Views

### Manager App (Role: Manager)
```
Views to create:
├── Events Dashboard (Deck view — Events table)
├── Today's Events (Gallery — filter: Event Date = TODAY())
├── Staff Availability (Table — Staff table)
├── Assign Staff (Form — Staff Assignments)
├── Logistics Tracker (Map view — Logistics table)
└── Finance Summary (Chart — Finance table)
```

### Warehouse App (Role: Warehouse)
```
Views to create:
├── Inventory List (Table — Inventory table)
├── Scan QR (Form — QR Logs, barcode scanner enabled)
├── Check In/Out (Form — Inventory with status update)
├── Mark Damaged (Form — Inventory, Condition field)
└── Reserve Item (Form — Inventory Reservations)
```

### Driver App (Role: Driver)
```
Views to create:
├── My Dispatches (Deck — Logistics filtered by Driver)
├── Route Map (Map — Logistics, Route field as address)
├── Update Status (Form — Logistics status dropdown)
└── Confirm Delivery (Form — with photo upload)
```

---

## Step 4 — Role-Based Access

In AppSheet Studio → **Security → Roles**:

```
Owner     → ALL tables, ALL views, read/write
Manager   → Events, Staff, Logistics, Finance — read/write
Warehouse → Inventory, QR Logs — read/write; Events — read only
Driver    → Logistics (own rows only) — read/write
```

**Set user role assignment:**
- Add a `Role` column to a **Users** table in your sheet
- Map: `sheet_user_email → role`

---

## Step 5 — QR Scanner Setup

1. In the **Inventory table**, set `QR Code` column type to **Show** with format `URL`
2. Generate QR via: `https://api.qrserver.com/v1/create-qr-code/?data={Item ID}&size=200x200`
3. In **QR Logs form**, add a column type **Scan** pointing to `Item ID`
4. On scan: auto-fill Item ID, timestamp, and user

---

## Step 6 — Automation in AppSheet

In AppSheet → **Automation → Bots**:

| Bot Name | Trigger | Action |
|----------|---------|--------|
| Staff Assigned | Row added to Assignments | Send email to staff |
| Inventory Out | Status → "In Use" | Notify warehouse lead |
| Delivery Confirmed | Status → "Delivered" | Notify event manager |
| Low Stock Alert | Available = 0 | Email ops manager |

---

## Step 7 — Deploy

1. Click **Deploy → Move app to deployed state**
2. Share app link with team via email
3. Team installs **AppSheet app** on Android/iOS
4. Each user logs in with their Google account

---

## Color Branding

Match CES branding in AppSheet Studio → **UX → Brand**:
- **Primary Color:** `#0092C8`
- **Secondary Color:** `#00A8E0`
- **Background:** `#0B0E14` (dark mode)
- **Logo:** Upload `Logo CES@2x.png`
