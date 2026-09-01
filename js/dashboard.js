// ── CES ENTERPRISE OPERATIONS SYSTEM ─────────────────────────────────────────
// dashboard.js — Core data, navigation, KPIs, charts

// ── SAMPLE DATA ───────────────────────────────────────────────────────────────
const CES = {
  events: [
    { id:'CES-EVT-2026-0001', name:'Tech Summit 2026',             client:'CES-CLT-001', clientName:'Nexus Corp',           venue:'Dubai World Trade Centre',      type:'Corporate Events',              date:'2026-08-20', setupTime:'06:00', strikeTime:'23:00', manager:'Shane Williams', contactName:'Ahmed Al Rashid',   contactPhone:'+971-50-111-2222', contactEmail:'ahmed@nexuscorp.ae',    staff:['CES-STF-001','CES-STF-002','CES-STF-003'], inventory:['CES-INV-LED-001','CES-INV-ROB-001'], truck:'CES-TRK-01', revenue:28000, expenses:14500, profit:13500, status:'Completed', notes:'VIP event — CEO attending' },
    { id:'CES-EVT-2026-0002', name:'Grand Wedding — Al Farsi',      client:'CES-CLT-002', clientName:'Al Farsi Family',       venue:'Atlantis The Palm',             type:'Private / Social',              date:'2026-08-25', setupTime:'08:00', strikeTime:'02:00', manager:'Maria Lopez',    contactName:'Mohammed Al Farsi', contactPhone:'+971-55-333-4444', contactEmail:'mfarsi@gmail.com',      staff:['CES-STF-004','CES-STF-005'],               inventory:['CES-INV-LNG-001','CES-INV-LGT-001'], truck:'CES-TRK-02', revenue:45000, expenses:22000, profit:23000, status:'Completed', notes:'Flowers vendor pending confirmation' },
    { id:'CES-EVT-2026-0003', name:'Product Launch — TechX Pro',    client:'CES-CLT-003', clientName:'TechX Industries',      venue:'DIFC Gate Village',             type:'Corporate Events',              date:'2026-08-29', setupTime:'10:00', strikeTime:'20:00', manager:'David Chen',     contactName:'Sara Johnson',      contactPhone:'+971-50-555-6666', contactEmail:'sara@techx.io',         staff:['CES-STF-006','CES-STF-007'],               inventory:['CES-INV-AIB-001','CES-INV-DSP-001'], truck:'CES-TRK-01', revenue:18500, expenses:9200,  profit:9300,  status:'Completed', notes:'AI Booth demo required' },
    { id:'CES-EVT-2026-0009', name:'Gala Dinner — Emaar Foundation',client:'CES-CLT-004', clientName:'Emaar Properties',      venue:'Armani Hotel, Burj Khalifa',    type:'Private / Social',              date:'2026-09-01', setupTime:'14:00', strikeTime:'23:30', manager:'Shane Williams', contactName:'Khalid Al Emaar',   contactPhone:'+971-4-777-8888',  contactEmail:'khalid@emaar.ae',       staff:['CES-STF-001','CES-STF-008'],               inventory:['CES-INV-LNG-001','CES-INV-AUD-001'], truck:'CES-TRK-02', revenue:32000, expenses:16000, profit:16000, status:'Active', notes:'Board dinner — VIP setup, champagne wall required' },
    { id:'CES-EVT-2026-0010', name:'College Sports Day — AUS',      client:'CES-CLT-003', clientName:'TechX Industries',      venue:'American University of Sharjah',type:'Colleges',                      date:'2026-09-04', setupTime:'07:00', strikeTime:'18:00', manager:'Maria Lopez',    contactName:'Sara Johnson',      contactPhone:'+971-50-555-6666', contactEmail:'sara@techx.io',         staff:['CES-STF-004','CES-STF-006'],               inventory:['CES-INV-003','CES-INV-024'],          truck:'CES-TRK-03', revenue:14000, expenses:7000,  profit:7000,  status:'Confirmed', notes:'Outdoor setup — weather contingency plan ready' },
    { id:'CES-EVT-2026-0004', name:'Corporate Gala — Emaar',        client:'CES-CLT-004', clientName:'Emaar Properties',      venue:'Burj Khalifa Sky Lounge',       type:'Corporate Events',              date:'2026-09-06', setupTime:'14:00', strikeTime:'00:00', manager:'Shane Williams', contactName:'Khalid Al Emaar',   contactPhone:'+971-4-777-8888',  contactEmail:'events@emaar.ae',       staff:['CES-STF-001','CES-STF-008'],               inventory:['CES-INV-LNG-002','CES-INV-AUD-001'], truck:'CES-TRK-03', revenue:55000, expenses:28000, profit:27000, status:'Confirmed', notes:'Premium package — lounge + audio' },
    { id:'CES-EVT-2026-0011', name:'Mitzvah Madness — Goldstein',   client:'CES-CLT-006', clientName:'Private Client',        venue:'Four Seasons Dubai DIFC',       type:'Mitzvah',                       date:'2026-09-08', setupTime:'10:00', strikeTime:'23:00', manager:'David Chen',     contactName:'Zara Malik',        contactPhone:'+971-55-121-3141', contactEmail:'zara@private.me',       staff:['CES-STF-005','CES-STF-010'],               inventory:['CES-INV-LGT-002','CES-INV-021'],      truck:'CES-TRK-01', revenue:41000, expenses:20000, profit:21000, status:'Confirmed', notes:'Custom Mitzvah theme — photo booths + dance floor' },
    { id:'CES-EVT-2026-0005', name:'Expo Exhibition — Vision 2030', client:'CES-CLT-005', clientName:'Dubai Expo LLC',        venue:'Expo City Dubai',               type:'Corporate Events',              date:'2026-09-13', setupTime:'07:00', strikeTime:'21:00', manager:'Maria Lopez',    contactName:'Layla Khouri',      contactPhone:'+971-50-999-0000', contactEmail:'layla@expo.ae',         staff:['CES-STF-002','CES-STF-004','CES-STF-009'],inventory:['CES-INV-LED-002','CES-INV-ROB-002'], truck:'CES-TRK-02', revenue:38000, expenses:19500, profit:18500, status:'Planning', notes:'3 LED walls + 2 robots — team needs training' },
    { id:'CES-EVT-2026-0006', name:'Birthday Bash — VIP',           client:'CES-CLT-006', clientName:'Private Client',        venue:'Private Villa, Palm Jumeirah',  type:'Private / Social',              date:'2026-09-10', setupTime:'12:00', strikeTime:'04:00', manager:'David Chen',     contactName:'Zara Malik',        contactPhone:'+971-55-121-3141', contactEmail:'zara@private.me',       staff:['CES-STF-005','CES-STF-010'],               inventory:['CES-INV-LGT-002','CES-INV-LNG-001'], truck:'CES-TRK-01', revenue:22000, expenses:11000, profit:11000, status:'Confirmed', notes:'Client prefers minimal staff visibility' },
    { id:'CES-EVT-2026-0007', name:'Music Concert — Neon Night',    client:'CES-CLT-007', clientName:'XSound Entertainment',  venue:'Dubai Festival City Arena',     type:'Party Planners / DJ Companies', date:'2026-09-16', setupTime:'09:00', strikeTime:'01:00', manager:'Shane Williams', contactName:'DJ Marcus',         contactPhone:'+971-50-516-1718', contactEmail:'marcus@xsound.com',     staff:['CES-STF-001','CES-STF-003','CES-STF-006','CES-STF-008'], inventory:['CES-INV-AUD-002','CES-INV-LGT-001','CES-INV-LED-001'], truck:'CES-TRK-01', revenue:72000, expenses:38000, profit:34000, status:'Planning', notes:'Largest audio setup this quarter' },
    { id:'CES-EVT-2026-0014', name:'Graduation Gala — AUD',         client:'CES-CLT-008', clientName:'Masterclass HR',        venue:'American University in Dubai',  type:'Colleges',                      date:'2026-09-08', setupTime:'15:00', strikeTime:'23:00', manager:'Maria Lopez',    contactName:'Divya Nair',        contactPhone:'+971-4-192-0212',  contactEmail:'divya@masterclass.ae',  staff:['CES-STF-002','CES-STF-009'],               inventory:['CES-INV-014','CES-INV-016'],          truck:'CES-TRK-03', revenue:16500, expenses:8000,  profit:8500,  status:'Confirmed', notes:'Graduation ceremony + after-party setup' },
    { id:'CES-EVT-2026-0008', name:'Training Workshop — HR Summit', client:'CES-CLT-008', clientName:'Masterclass HR',        venue:'Hyatt Regency Dubai',           type:'Corporate Events',              date:'2026-09-29', setupTime:'08:00', strikeTime:'18:00', manager:'Maria Lopez',    contactName:'Divya Nair',        contactPhone:'+971-4-192-0212',  contactEmail:'divya@masterclass.ae',  staff:['CES-STF-007','CES-STF-009'],               inventory:['CES-INV-DSP-001'],                   truck:'CES-TRK-03', revenue:9500,  expenses:4200,  profit:5300,  status:'Tentative', notes:'Small setup — display screens only' },
    { id:'CES-EVT-2026-0015', name:'Bar Mitzvah — Katz Family',     client:'CES-CLT-002', clientName:'Al Farsi Family',       venue:'Palazzo Versace Dubai',         type:'Mitzvah',                       date:'2026-09-19', setupTime:'11:00', strikeTime:'00:00', manager:'David Chen',     contactName:'Mohammed Al Farsi', contactPhone:'+971-55-333-4444', contactEmail:'mfarsi@gmail.com',      staff:['CES-STF-005','CES-STF-007'],               inventory:['CES-INV-008','CES-INV-018'],          truck:'CES-TRK-02', revenue:38000, expenses:18500, profit:19500, status:'Planning', notes:'Full LED dance floor + glam photo booth package' },
    { id:'CES-EVT-2026-0012', name:'Summer Carnival — Nakheel Mall',client:'CES-CLT-005', clientName:'Dubai Expo LLC',        venue:'Nakheel Mall, Palm Jumeirah',   type:'Holiday Parties',               date:'2026-10-03', setupTime:'10:00', strikeTime:'22:00', manager:'David Chen',     contactName:'Layla Khouri',      contactPhone:'+971-50-999-0000', contactEmail:'layla@expo.ae',         staff:['CES-STF-005','CES-STF-009'],               inventory:['CES-INV-011','CES-INV-029'],          truck:'',           revenue:26000, expenses:13000, profit:13000, status:'Tentative', notes:'Pending mall management approval — carnival rides confirmed' },
    { id:'CES-EVT-2026-0016', name:'DJ Battle Night — Club Privé',   client:'CES-CLT-007', clientName:'XSound Entertainment',  venue:'Club Privé, DIFC',              type:'Party Planners / DJ Companies', date:'2026-09-22', setupTime:'18:00', strikeTime:'03:00', manager:'Shane Williams', contactName:'DJ Marcus',         contactPhone:'+971-50-516-1718', contactEmail:'marcus@xsound.com',     staff:['CES-STF-003','CES-STF-008'],               inventory:['CES-INV-010','CES-INV-018'],          truck:'CES-TRK-01', revenue:29000, expenses:14000, profit:15000, status:'Planning', notes:'Multi-DJ lineup — full AV + LED dance floor' },
    { id:'CES-EVT-2026-0013', name:'Holiday Gala — ENBD Bank',      client:'CES-CLT-001', clientName:'Nexus Corp',           venue:'Grand Hyatt Dubai',             type:'Holiday Parties',               date:'2026-10-07', setupTime:'16:00', strikeTime:'00:00', manager:'Shane Williams', contactName:'Ahmed Al Rashid',   contactPhone:'+971-50-111-2222', contactEmail:'ahmed@nexuscorp.ae',    staff:['CES-STF-002','CES-STF-007'],               inventory:['CES-INV-015','CES-INV-026'],          truck:'',           revenue:19000, expenses:9500,  profit:9500,  status:'Tentative', notes:'Initial quote sent — waiting on client budget approval' }
  ],
  staff: [
    { id:'CES-STF-001', name:'Shane Williams',  role:'Operations Manager', skill:'A/V Equipment',        availability:'Available', performance:96, events:3, phone:'+1-555-0101', email:'shane@ces.ae' },
    { id:'CES-STF-002', name:'Maria Lopez',     role:'Event Coordinator',  skill:'Event Furniture',      availability:'Available', performance:91, events:2, phone:'+1-555-0102', email:'maria@ces.ae' },
    { id:'CES-STF-003', name:'David Chen',      role:'Tech Lead',          skill:'A/V Equipment',        availability:'Busy',      performance:88, events:2, phone:'+1-555-0103', email:'david@ces.ae' },
    { id:'CES-STF-004', name:'James Okafor',    role:'Warehouse Lead',     skill:'Inflatables',          availability:'Available', performance:85, events:2, phone:'+1-555-0104', email:'james@ces.ae' },
    { id:'CES-STF-005', name:'Priya Sharma',    role:'Logistics Driver',   skill:'Food Concessions',     availability:'Available', performance:93, events:2, phone:'+1-555-0105', email:'priya@ces.ae' },
    { id:'CES-STF-006', name:'Carlos Rivera',   role:'Setup Crew Lead',    skill:'Giant / Lawn Games',   availability:'Busy',      performance:87, events:2, phone:'+1-555-0106', email:'carlos@ces.ae' },
    { id:'CES-STF-007', name:'Aisha Hassan',    role:'Client Relations',   skill:'Photo Booths',         availability:'Available', performance:94, events:2, phone:'+1-555-0107', email:'aisha@ces.ae' },
    { id:'CES-STF-008', name:'Tom Bradley',     role:'Audio Engineer',     skill:'Casino',               availability:'Available', performance:90, events:2, phone:'+1-555-0108', email:'tom@ces.ae' },
    { id:'CES-STF-009', name:'Fatima Al-Zahra', role:'Setup Crew',         skill:'Crafts & Favors',      availability:'Available', performance:82, events:2, phone:'+1-555-0109', email:'fatima@ces.ae' },
    { id:'CES-STF-010', name:'Kevin Park',      role:'Lighting Tech',      skill:'Sports & Video Games', availability:'Busy',      performance:86, events:1, phone:'+1-555-0110', email:'kevin@ces.ae' }
  ],
  inventory: [
    { id:'CES-INV-001', name:'Audio Guest Book',               category:'Photo Booths',        emoji:'assets/icons/categories/photo-booths.svg',       qty:3, available:2, status:'Available', condition:'Excellent', value:800,   location:'Warehouse A' },
    { id:'CES-INV-002', name:'Branded Deluxe Candy Wall',      category:'Holiday Parties',     emoji:'assets/icons/categories/holiday-parties.svg',    qty:2, available:2, status:'Available', condition:'Excellent', value:1200,  location:'Warehouse A' },
    { id:'CES-INV-003', name:'Branded Street Hoops',           category:'Sports & Video Games',emoji:'assets/icons/categories/sports-video-games.svg', qty:4, available:3, status:'Available',   condition:'Good',      value:900,   location:'Warehouse B' },
    { id:'CES-INV-004', name:'Casino Tables',                  category:'Casino Nights',       emoji:'assets/icons/categories/casino-nights.svg',      qty:10,available:7, status:'In Repair',  condition:'Fair',      value:1800,  location:'Warehouse A' },
    { id:'CES-INV-005', name:'Checkered Dance Floor',          category:'Dance Floors',        emoji:'assets/icons/categories/dance-floors.svg',       qty:2, available:1, status:'In Use',    condition:'Good',      value:5500,  location:'Truck 01' },
    { id:'CES-INV-006', name:'Classic Arcade Wall',            category:'Sports & Video Games',emoji:'assets/icons/categories/sports-video-games.svg', qty:3, available:3, status:'Available', condition:'Excellent', value:4200,  location:'Warehouse B' },
    { id:'CES-INV-007', name:'Communal High-Top Tables',       category:'Event Furniture',     emoji:'assets/icons/categories/event-furniture.svg',    qty:20,available:14,status:'Available',   condition:'Good',      value:350,   location:'Warehouse A' },
    { id:'CES-INV-008', name:'Deluxe 3-Sided Photo Wall',      category:'Photo Booths',        emoji:'assets/icons/categories/photo-booths.svg',       qty:2, available:2, status:'Available', condition:'Excellent', value:6800,  location:'Warehouse B' },
    { id:'CES-INV-009', name:'Deluxe Chrome O\'Bar',           category:'Event Furniture',     emoji:'assets/icons/categories/event-furniture.svg',    qty:3, available:2, status:'Available',   condition:'Excellent', value:3200,  location:'Warehouse A' },
    { id:'CES-INV-010', name:'Deluxe DJ Booth & Dance Staging',category:'Audio / Video',       emoji:'assets/icons/categories/audio-video.svg',        qty:2, available:1, status:'In Use',    condition:'Good',      value:12000, location:'Truck 02' },
    { id:'CES-INV-011', name:'Dual Snow & Ski Simulator',      category:'Sports & Video Games',emoji:'assets/icons/categories/sports-video-games.svg', qty:1, available:1, status:'Available', condition:'Excellent', value:18000, location:'Warehouse B' },
    { id:'CES-INV-012', name:'Event Furniture Packages',       category:'Event Furniture',     emoji:'assets/icons/categories/event-furniture.svg',    qty:5, available:4, status:'Available',   condition:'Good',      value:5500,  location:'Warehouse A' },
    { id:'CES-INV-013', name:'Football Fanatic',               category:'Sports & Video Games',emoji:'assets/icons/categories/sports-video-games.svg', qty:2, available:2, status:'Available', condition:'Excellent', value:2200,  location:'Warehouse B' },
    { id:'CES-INV-014', name:'Glam Photo Booth',               category:'Photo Booths',        emoji:'assets/icons/categories/photo-booths.svg',       qty:3, available:1, status:'In Repair',  condition:'Poor',      value:7500,  location:'Warehouse A' },
    { id:'CES-INV-015', name:'Glow Candy Cart',                category:'Holiday Parties',     emoji:'assets/icons/categories/holiday-parties.svg',    qty:4, available:4, status:'Available', condition:'Excellent', value:950,   location:'Warehouse A' },
    { id:'CES-INV-016', name:'Glow Oreo Cocktail Tables',      category:'Event Furniture',     emoji:'assets/icons/categories/event-furniture.svg',    qty:12,available:9, status:'Available',   condition:'Good',      value:620,   location:'Warehouse A' },
    { id:'CES-INV-017', name:'Hi-Tech Video Game Show',        category:'Game Shows',          emoji:'assets/icons/categories/game-shows.svg',         qty:2, available:2, status:'Available', condition:'Excellent', value:8800,  location:'Warehouse B' },
    { id:'CES-INV-018', name:'LED Dance Floor',                category:'Dance Floors',        emoji:'assets/icons/categories/dance-floors.svg',       qty:2, available:1, status:'In Use',    condition:'Good',      value:22000, location:'Truck 01' },
    { id:'CES-INV-019', name:'Pop Star Recording Booth',       category:'Photo Booths',        emoji:'assets/icons/categories/photo-booths.svg',       qty:2, available:2, status:'Available', condition:'Excellent', value:9500,  location:'Warehouse B' },
    { id:'CES-INV-020', name:'Street Hoops',                   category:'Sports & Video Games',emoji:'assets/icons/categories/sports-video-games.svg', qty:5, available:4, status:'Available',   condition:'Good',      value:1400,  location:'Warehouse A' },
    { id:'CES-INV-021', name:'Vogue Magazine Booth',           category:'Photo Booths',        emoji:'assets/icons/categories/photo-booths.svg',       qty:2, available:2, status:'Available', condition:'Excellent', value:5200,  location:'Warehouse A' },
    { id:'CES-INV-022', name:'Vogue Photo Booth',              category:'Photo Booths',        emoji:'assets/icons/categories/photo-booths.svg',       qty:3, available:2, status:'Available',   condition:'Good',      value:6800,  location:'Warehouse B' },
    { id:'CES-INV-023', name:'Deluxe Mini Golf',               category:'Giant / Lawn Games',  emoji:'assets/icons/categories/giant-lawn-games.svg',   qty:1, available:1, status:'Available', condition:'Excellent', value:4800,  location:'Warehouse A' },
    { id:'CES-INV-024', name:'Extreme Foosball',               category:'Sports & Video Games',emoji:'assets/icons/categories/sports-video-games.svg', qty:2, available:2, status:'Available', condition:'Excellent', value:6200,  location:'Warehouse B' },
    { id:'CES-INV-025', name:'Draw Me Bot Station',            category:'Virtual Reality',     emoji:'assets/icons/categories/virtual-reality.svg',    qty:2, available:1, status:'In Use',    condition:'Excellent', value:15000, location:'Event Site' },
    { id:'CES-INV-026', name:'LED Infinity Glow Letters',      category:'Holiday Parties',     emoji:'assets/icons/categories/holiday-parties.svg',    qty:3, available:3, status:'Available', condition:'Excellent', value:2800,  location:'Warehouse A' },
    { id:'CES-INV-027', name:'Deluxe Video DJ Set',            category:'Audio / Video',       emoji:'assets/icons/categories/audio-video.svg',        qty:1, available:1, status:'Available', condition:'Excellent', value:28000, location:'Warehouse B' },
    { id:'CES-INV-028', name:'Custom Sports & Trading Cards',  category:'Crafts & Favors',     emoji:'assets/icons/categories/crafts-favors.svg',      qty:2, available:2, status:'Available', condition:'Excellent', value:3500,  location:'Warehouse A' },
    { id:'CES-INV-029', name:'Stick Drop Showdown',            category:'Game Shows',          emoji:'assets/icons/categories/game-shows.svg',         qty:4, available:4, status:'Available', condition:'Excellent', value:2200,  location:'Warehouse B' }
  ],
  logistics: [
    { id:'CES-DSP-001', eventId:'CES-EVT-2026-0001', eventName:'Tech Summit 2026', truck:'CES TRUCK', truckType:'own', driver:'Priya Sharma', rental:0, status:'Delivered' },
    { id:'CES-DSP-002', eventId:'CES-EVT-2026-0002', eventName:'Grand Wedding — Al Farsi', truck:'CES VAN', truckType:'own', driver:'James Okafor', rental:0, status:'Preparing' },
    { id:'CES-DSP-003', eventId:'CES-EVT-2026-0007', eventName:'Music Concert — Neon Night', truck:'RYDER # 1', truckType:'own', driver:'Priya Sharma', rental:200, status:'Preparing' }
  ],
  clients: [
    { id:'CES-CLT-001', company:'Nexus Corp', contact:'Ahmed Al Rashid', email:'ahmed@nexuscorp.ae', phone:'+971-50-111-2222', events:5, revenue:112000, tier:'VIP', lastEvent:'2026-05-18' },
    { id:'CES-CLT-002', company:'Al Farsi Family', contact:'Mohammed Al Farsi', email:'mfarsi@gmail.com', phone:'+971-55-333-4444', events:2, revenue:89000, tier:'VIP', lastEvent:'2026-05-20' },
    { id:'CES-CLT-003', company:'TechX Industries', contact:'Sara Johnson', email:'sara@techx.io', phone:'+971-50-555-6666', events:3, revenue:54500, tier:'Regular', lastEvent:'2026-05-22' },
    { id:'CES-CLT-004', company:'Emaar Properties', contact:'Khalid Al Emaar', email:'khalid@emaar.ae', phone:'+971-4-777-8888', events:8, revenue:320000, tier:'VIP', lastEvent:'2026-05-25' },
    { id:'CES-CLT-005', company:'Dubai Expo LLC', contact:'Layla Khouri', email:'layla@expo.ae', phone:'+971-50-999-0000', events:4, revenue:145000, tier:'VIP', lastEvent:'2026-06-01' },
    { id:'CES-CLT-006', company:'Private Client', contact:'Zara Malik', email:'zara@private.me', phone:'+971-55-121-3141', events:1, revenue:22000, tier:'New', lastEvent:'2026-06-05' },
    { id:'CES-CLT-007', company:'XSound Entertainment', contact:'DJ Marcus', email:'marcus@xsound.com', phone:'+971-50-516-1718', events:2, revenue:120000, tier:'Regular', lastEvent:'2026-06-10' },
    { id:'CES-CLT-008', company:'Masterclass HR', contact:'Divya Nair', email:'divya@masterclass.ae', phone:'+971-4-192-0212', events:3, revenue:28500, tier:'Regular', lastEvent:'2026-06-15' }
  ],
};

// ── LOCAL STORAGE PERSISTENCE ──────────────────────────────────────────────────
(function() {
  const DATA_VERSION = '2.5'; // bump this to force-clear old cached data
  const savedVersion = localStorage.getItem('CES_DATA_VERSION');

  if (savedVersion !== DATA_VERSION) {
    // Version mismatch — wipe stale cache and start fresh
    localStorage.removeItem('CES_DATA');
    localStorage.setItem('CES_DATA_VERSION', DATA_VERSION);
    console.log('CES: data cache cleared (version upgrade to ' + DATA_VERSION + ')');
  } else {
    const savedData = localStorage.getItem('CES_DATA');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.events)    CES.events    = parsed.events;
        if (parsed.staff)     CES.staff     = parsed.staff;
        if (parsed.inventory) CES.inventory = parsed.inventory;
        if (parsed.logistics) CES.logistics = parsed.logistics;
        if (parsed.clients)   CES.clients   = parsed.clients;
      } catch (e) {
        console.error('CES: error loading saved data, resetting:', e);
        localStorage.removeItem('CES_DATA');
      }
    }
  }

  let lastSavedString = JSON.stringify({
    events: CES.events,
    staff: CES.staff,
    inventory: CES.inventory,
    logistics: CES.logistics,
    clients: CES.clients
  });

  window.saveCESData = function() {
    const currentObj = {
      events: CES.events,
      staff: CES.staff,
      inventory: CES.inventory,
      logistics: CES.logistics,
      clients: CES.clients
    };
    const currentStr = JSON.stringify(currentObj);
    if (currentStr !== lastSavedString) {
      localStorage.setItem('CES_DATA', currentStr);
      lastSavedString = currentStr;
    }
  };

  // Use dynamic reference so Firebase override is picked up after init
  setInterval(function() { if (window.saveCESData) window.saveCESData(); }, 1000);
  window.addEventListener('beforeunload', function() { if (window.saveCESData) window.saveCESData(); });
})();

// ── NAVIGATION ────────────────────────────────────────────────────────────────
const panelTitles = {
  dashboard: ['CES Master Dashboard','Enterprise Event Operations System'],
  events: ['Events Master','Central command for all events'],
  staff: ['Staff Operations','Team management and availability'],
  inventory: ['Inventory Management','Asset tracking and reservations'],
  logistics: ['Logistics Control','Truck dispatch and delivery management'],
  crm: ['Client CRM','Client relationships and value tracking'],
  automation: ['Automation Engine','Alerts, notifications and triggers'],
  reports: ['Reports & Analytics','Executive insights and KPIs']
};

function switchPanel(id, el) {
  document.querySelectorAll('.module-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  if (el) el.classList.add('active');
  const t = panelTitles[id] || [id,''];
  document.getElementById('panel-title').textContent = t[0];
  document.getElementById('panel-sub').textContent = t[1];
  window.CES_ACTIVE_PANEL = id;
  // Apply role-based UI after panel renders
  setTimeout(function () { if (window.CES_AUTH) window.CES_AUTH.applyUI(); }, 80);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Close any modal when clicking the dark overlay (outside the modal box)
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('open')) {
    e.target.classList.remove('open');
  }
});

// ── CLOCK ─────────────────────────────────────────────────────────────────────
function startClock() {
  const el = document.getElementById('live-clock');
  function tick() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});
  }
  tick(); setInterval(tick, 1000);
}

// ── KPI BAR ───────────────────────────────────────────────────────────────────
function renderKPIs() {
  const now = new Date();
  const thisMonth = now.getMonth(), thisYear = now.getFullYear();
  const todayStr  = now.toISOString().split('T')[0];
  const monthEvts = CES.events.filter(e => { const d=new Date(e.date); return d.getMonth()===thisMonth && d.getFullYear()===thisYear; });
  const activeNow = CES.events.filter(e => e.date===todayStr && e.status==='Active').length;
  const activeStaff   = CES.staff.filter(s=>s.availability==='Busy').length;
  const invUtil       = Math.round((CES.inventory.filter(i=>i.status==='In Use').length/CES.inventory.length)*100);
  const repairCount   = CES.inventory.filter(i=>i.status==='In Repair').length;
  const activeDisp    = CES.logistics.filter(l=>l.status==='Preparing'||l.status==='In Transit').length;
  const deliveredDisp = CES.logistics.filter(l=>l.status==='Delivered').length;

  const svgCalendar = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2.5"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><rect x="7" y="14" width="3" height="3" rx="0.5" fill="currentColor" stroke="none"/><rect x="12" y="14" width="3" height="3" rx="0.5" fill="currentColor" stroke="none"/></svg>`;
  const svgUsers    = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  const svgBox      = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`;
  const svgTruck    = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1.5"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`;

  const kpis = [
    { label:'Events This Month', value:String(monthEvts.length), sub:activeNow+' active today', change:'+3 vs last month', up:true, icon:svgCalendar, panel:'events', tip:'View all events' },
    { label:'Active Staff', value:activeStaff+'/'+CES.staff.length, sub:'on-site right now', change:'3 available', up:true, icon:svgUsers, panel:'staff', tip:'View staff operations' },
    { label:'Inventory Use', value:invUtil+'%', sub:CES.inventory.length+' of '+CES.inventory.length+' tracked', change:repairCount+' item'+(repairCount!==1?'s':'')+' in repair', up:false, icon:svgBox, panel:'inventory', tip:'View inventory', repair:repairCount>0 },
    { label:'Active Dispatches', value:String(activeDisp), sub:'3 trucks in fleet', change:deliveredDisp+' delivered', up:activeDisp>0, icon:svgTruck, panel:'logistics', tip:'View logistics' }
  ];

  document.getElementById('kpi-grid').innerHTML = kpis.map(k=>{
    const clickFn = `switchPanel('${k.panel}',document.querySelector('[data-panel=${k.panel}]'))`;
    return `
    <div class="kpi-card kpi-card-clickable" onclick="${clickFn}" title="${k.tip}" style="cursor:pointer">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}</div>
      <div class="kpi-sub">${k.sub}</div>
      <div class="kpi-change ${k.up?'up':'down'}">${k.up?'▲':'▼'} ${k.change}</div>
      <div class="kpi-icon">${k.icon}</div>
      <div class="kpi-nav-hint">→ ${k.tip}</div>
    </div>`;
  }).join('');
}

function fmt(n) { return n.toLocaleString(); }

// ── ALERTS ────────────────────────────────────────────────────────────────────
const alerts = [
  { type:'danger', title:'CONFLICT: Truck Overlap', text:'CES TRUCK double-booked on Jun 10 & Jun 5', time:'2 mins ago' },
  { type:'warning', title:'Staff Shortage', text:'Expo Exhibition (Jun 1) needs 2 more crew members', time:'3 hours ago' },
  { type:'danger', title:'Inventory Alert', text:'AI Photo Booth — QR scan missed at strike', time:'5 hours ago' },
  { type:'info', title:'Event Confirmed', text:'Emaar Properties signed off on Corporate Gala', time:'Yesterday' }
];

function renderAlerts() {
  const dotColor = { danger:'var(--danger)', warning:'var(--warning)', info:'var(--ces-blue)' };
  document.getElementById('alert-list').innerHTML = alerts.map(a=>`
    <div style="display:flex;gap:9px;padding:8px 12px;border-bottom:1px solid var(--border-subtle);align-items:flex-start">
      <div style="width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:4px;background:${dotColor[a.type]||'var(--text-muted)'}"></div>
      <div style="flex:1;min-width:0">
        <div style="font-size:10px;font-weight:700;color:var(--text-secondary);margin-bottom:1px">${a.title}</div>
        <div style="font-size:10px;color:var(--text-muted);line-height:1.4">${a.text}</div>
        <div style="font-size:9px;color:var(--text-muted);margin-top:3px;opacity:0.65">🕐 ${a.time}</div>
      </div>
    </div>`).join('');
  document.getElementById('alert-count').textContent = alerts.length;
}

// ── WEEK PRIORITY (Next 7 Days) ───────────────────────────────────────────────
function renderWeekPriority() {
  const today = new Date(); today.setHours(0,0,0,0);
  const week  = new Date(today); week.setDate(today.getDate() + 7);

  const weekEvts = CES.events
    .filter(e => { const d = new Date(e.date); return d >= today && d <= week; })
    .sort((a,b) => new Date(a.date) - new Date(b.date));

  // Fallback: if no events in the next 7 days, show the next upcoming events instead
  const display = weekEvts.length > 0 ? weekEvts :
    CES.events.filter(e => new Date(e.date) >= today)
              .sort((a,b) => new Date(a.date) - new Date(b.date))
              .slice(0,3);

  const countEl = document.getElementById('week-event-count');
  if (weekEvts.length) {
    countEl.textContent = weekEvts.length + ' event' + (weekEvts.length !== 1 ? 's' : '');
    countEl.className = 'badge badge-info';
  } else {
    countEl.textContent = 'No events this week';
    countEl.className = 'badge badge-neutral';
  }

  const container = document.getElementById('week-priority-events');
  if (!display.length) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);font-size:12px">No upcoming events scheduled</div>`;
    return;
  }

  container.innerHTML = display.map(e => {
    const evtDate   = new Date(e.date);
    const daysUntil = Math.ceil((evtDate - today) / (1000*60*60*24));
    const dayLabel  = daysUntil === 0 ? '🔴 Today' : daysUntil === 1 ? '🟠 Tomorrow' : `🟡 In ${daysUntil} days`;
    const dayName   = evtDate.toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'});
    const urgentBorder = daysUntil <= 2 ? 'var(--danger)' : daysUntil <= 7 ? 'var(--ces-cyan)' : 'var(--border)';
    const urgentBg  = daysUntil <= 2 ? 'rgba(244,67,54,0.06)' : daysUntil <= 7 ? 'rgba(0,146,200,0.04)' : 'transparent';

    return `
    <div class="event-card" onclick="switchPanel('events',document.querySelector('[data-panel=events]'))"
         style="margin-bottom:10px;border-left:3px solid ${urgentBorder};background:${urgentBg}">
      <div class="event-card-header">
        <span class="event-card-id">${e.id}</span>
        <span class="event-card-name">${e.name}</span>
        <span class="badge ${statusBadge(e.status)}">${e.status}</span>
      </div>
      <div class="event-meta" style="margin-top:7px">
        <span class="event-meta-item" style="font-weight:600;color:var(--text-primary)">📅 ${dayName}</span>
        <span class="event-meta-item" style="font-weight:700;color:${daysUntil<=2?'var(--danger)':daysUntil<=7?'var(--ces-cyan)':'var(--text-muted)'}">${dayLabel}</span>
        <span class="event-meta-item">⏰ Setup ${e.setupTime} → Strike ${e.strikeTime}</span>
        <span class="event-meta-item">🏛️ ${e.venue}</span>
        <span class="event-meta-item">👤 ${e.manager}</span>
        <span class="event-meta-item">👥 ${e.staff.length} staff assigned</span>
      </div>
    </div>`;
  }).join('');
}

// ── 30-DAY EVENT PIPELINE ─────────────────────────────────────────────────────
function render30DayPipeline() {
  const today = new Date(); today.setHours(0,0,0,0);
  const end   = new Date(today); end.setDate(today.getDate() + 30);

  const evts = CES.events
    .filter(e => { const d = new Date(e.date); return d >= today && d <= end; })
    .sort((a,b) => new Date(a.date) - new Date(b.date));

  const startLabel = today.toLocaleDateString('en-US',{month:'short',day:'numeric'});
  const endLabel   = end.toLocaleDateString('en-US',{month:'short',day:'numeric'});
  document.getElementById('pipeline-count').textContent = `${startLabel} – ${endLabel}  ·  ${evts.length} event${evts.length!==1?'s':''}`;

  const container = document.getElementById('pipeline-30day');
  if (!evts.length) {
    container.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted);font-size:12px">No events scheduled in the next 30 days</div>`;
    return;
  }

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Event</th>
          <th>Venue</th>
          <th>Manager</th>
          <th>Staff</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${evts.map(e => {
          const evtDate   = new Date(e.date);
          const daysUntil = Math.ceil((evtDate - today) / (1000*60*60*24));
          const dayName   = evtDate.toLocaleDateString('en-US',{weekday:'short'});
          const dateStr   = evtDate.toLocaleDateString('en-US',{month:'short',day:'numeric'});
          const isThisWeek = daysUntil <= 7;
          const rowBg     = isThisWeek ? 'background:rgba(0,146,200,0.05)' : '';

          return `<tr style="${rowBg}">
            <td>
              <div style="font-weight:700;font-size:12px;color:var(--text-primary)">${dayName}, ${dateStr}</div>
              <div style="font-size:10px;margin-top:2px;display:flex;align-items:center;gap:5px">
                <span style="color:${daysUntil===0?'var(--danger)':daysUntil<=2?'var(--danger)':daysUntil<=7?'var(--ces-cyan)':'var(--text-muted)'}">
                  ${daysUntil===0?'Today':daysUntil===1?'Tomorrow':daysUntil+'d away'}
                </span>
                ${isThisWeek ? `<span style="font-size:9px;font-weight:700;background:rgba(0,146,200,0.15);color:var(--ces-cyan);padding:1px 6px;border-radius:3px">THIS WEEK</span>` : ''}
              </div>
            </td>
            <td>
              <div style="font-weight:600;font-size:12px;color:var(--text-primary)">${e.name}</div>
              <div style="font-size:10px;color:var(--text-muted)">${e.id}</div>
            </td>
            <td style="font-size:11px;color:var(--text-secondary);max-width:160px">${e.venue}</td>
            <td style="font-size:11px;color:var(--text-secondary)">${e.manager}</td>
            <td style="font-size:11px;color:var(--text-secondary)">${e.staff.length} staff</td>
            <td><span class="badge ${statusBadge(e.status)}">${e.status}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

function statusBadge(s) {
  const m={Active:'badge-success',Confirmed:'badge-info',Planning:'badge-warning',Tentative:'badge-neutral',Completed:'badge-neutral'};
  return m[s]||'badge-neutral';
}

// ── INVENTORY UTILIZATION (lightweight inline bars) ───────────────────────────
function renderInventoryChart() {
  const cats = ['AI Booths','LED Games','Robots','Lounge','Displays','Lighting','Audio'];
  const util = [67,75,67,70,67,67,50];

  // Replace canvas with a lightweight HTML render
  const canvas = document.getElementById('inventoryChart');
  const wrapper = canvas.closest('.card-body') || canvas.parentNode;
  canvas.style.display = 'none';

  const existing = wrapper.querySelector('.inv-util-list');
  if (existing) existing.remove();

  const list = document.createElement('div');
  list.className = 'inv-util-list';
  list.style.cssText = 'padding:4px 0;display:flex;flex-direction:column;gap:10px';

  cats.forEach((cat, i) => {
    const v = util[i];
    const color = v > 80 ? 'var(--success)' : v > 60 ? 'var(--ces-blue)' : 'var(--warning)';
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:10px';
    row.innerHTML = `
      <span style="width:80px;font-size:10px;color:var(--text-muted);flex-shrink:0;text-align:right">${cat}</span>
      <div style="flex:1;height:5px;background:var(--bg-input);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${v}%;background:${color};border-radius:99px;transition:width 0.6s ease"></div>
      </div>
      <span style="width:30px;font-size:10px;font-weight:700;color:${color};flex-shrink:0">${v}%</span>`;
    list.appendChild(row);
  });

  wrapper.appendChild(list);
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', ()=>{
  startClock();
  renderKPIs();
  renderAlerts();
  renderWeekPriority();
  render30DayPipeline();
  renderInventoryChart();

  // Register dashboard render in the global map
  window.__cesRender = window.__cesRender || {};
  window.__cesRender['dashboard'] = function() {
    renderKPIs();
    renderAlerts();
    renderWeekPriority();
    render30DayPipeline();
    renderInventoryChart();
  };
  window.CES_ACTIVE_PANEL = 'dashboard';

  // Auto-refresh removed — onSnapshot (instant) + 12s polling already handle real-time updates
});

// ── DRAG TO SCROLL ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  let isDown = false;
  let startX;
  let startY;
  let scrollLeft;
  let scrollTop;
  let activeSlider = null;

  document.addEventListener('mousedown', (e) => {
    const slider = e.target.closest('.table-wrap, .content-area');
    if (!slider) return;

    // Do not initiate drag if clicking on interactive elements
    if (e.target.closest('button, a, input, select, textarea, .nav-item, .alert-item, .event-card, th, td')) {
      // Allow drag on td if it's just text, but wait, usually user clicks td to select text.
      // Since it's a dashboard, dragging on table rows is expected.
      // Let's only prevent on buttons, links, inputs.
      if (e.target.closest('button, a, input, select, textarea, .nav-item')) return;
    }

    isDown = true;
    activeSlider = slider;
    activeSlider.style.cursor = 'grabbing';
    activeSlider.style.userSelect = 'none';
    startX = e.pageX - activeSlider.offsetLeft;
    startY = e.pageY - activeSlider.offsetTop;
    scrollLeft = activeSlider.scrollLeft;
    scrollTop = activeSlider.scrollTop;
  });

  document.addEventListener('mouseleave', () => {
    if (!isDown) return;
    isDown = false;
    if(activeSlider) {
      activeSlider.style.cursor = '';
      activeSlider.style.userSelect = '';
    }
  });

  document.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    if(activeSlider) {
      activeSlider.style.cursor = '';
      activeSlider.style.userSelect = '';
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDown || !activeSlider) return;
    e.preventDefault(); // prevent default text selection behavior while dragging
    const x = e.pageX - activeSlider.offsetLeft;
    const y = e.pageY - activeSlider.offsetTop;
    const walkX = (x - startX) * 1.5; // Scroll speed
    const walkY = (y - startY) * 1.5; // Scroll speed
    activeSlider.scrollLeft = scrollLeft - walkX;
    activeSlider.scrollTop = scrollTop - walkY;
  });
});

// ── GLOBAL CUSTOM DROPDOWN (applies to ALL selects everywhere) ────────────────
(function() {
  function buildDropdown(select) {
    if (select.dataset.cesCustomized) return;
    select.dataset.cesCustomized = 'true';

    // inherit width from the select
    const origWidth = select.style.width || '';
    select.style.display = 'none';

    const wrap = document.createElement('div');
    wrap.className = 'ces-filter-wrap';
    if (origWidth) wrap.style.width = origWidth;
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);

    const val = document.createElement('div');
    val.className = 'ces-filter-val';
    const _initOpt = select.options[select.selectedIndex];
    val.textContent = _initOpt?.text || '';
    if (_initOpt?.disabled) val.classList.add('ces-placeholder');
    // match full-width if select had it
    if (origWidth === '100%' || select.classList.contains('form-control') || select.style.width === '100%') {
      wrap.style.width = '100%';
    }
    wrap.appendChild(val);

    const opts = document.createElement('div');
    opts.className = 'ces-filter-opts';
    wrap.appendChild(opts);

    function rebuildOptions() {
      opts.innerHTML = '';
      Array.from(select.options).forEach((opt, i) => {
        // skip disabled placeholder from the visible list
        if (opt.disabled) return;
        const item = document.createElement('div');
        item.className = 'ces-filter-opt';
        if (i === select.selectedIndex) item.classList.add('selected');
        item.textContent = opt.text;
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          select.selectedIndex = i;
          val.textContent = opt.text;
          val.classList.remove('ces-placeholder');
          opts.querySelectorAll('.ces-filter-opt').forEach(o => o.classList.remove('selected'));
          item.classList.add('selected');
          opts.classList.remove('open');
          val.classList.remove('open');
          select.dispatchEvent(new Event('change', { bubbles: true }));
        });
        opts.appendChild(item);
      });
      // sync displayed value — show placeholder text in muted style if no real selection
      const selOpt = select.options[select.selectedIndex];
      if (selOpt) {
        val.textContent = selOpt.text;
        if (selOpt.disabled) {
          val.classList.add('ces-placeholder');
        } else {
          val.classList.remove('ces-placeholder');
        }
      }
    }
    rebuildOptions();

    val.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = opts.classList.contains('open');
      document.querySelectorAll('.ces-filter-opts.open').forEach(o => o.classList.remove('open'));
      document.querySelectorAll('.ces-filter-val.open').forEach(o => o.classList.remove('open'));
      if (!isOpen) {
        opts.classList.add('open');
        val.classList.add('open');
      }
    });

    // keep custom dropdown in sync if native select changes programmatically
    const mo = new MutationObserver(rebuildOptions);
    mo.observe(select, { childList: true });
  }

  window.cesApplyDropdowns = function(root) {
    (root || document).querySelectorAll('select:not([data-ces-customized])').forEach(buildDropdown);
  };

  document.addEventListener('click', () => {
    document.querySelectorAll('.ces-filter-opts.open').forEach(o => o.classList.remove('open'));
    document.querySelectorAll('.ces-filter-val.open').forEach(o => o.classList.remove('open'));
  });

  // ── CUSTOM DATE & TIME PICKERS ──────────────────────────────────────────────
  function initCustomPickers(root = document) {
    // TIME PICKERS
    root.querySelectorAll('input[type="time"]').forEach(input => {
      if (input.dataset.cesPicker) return;
      input.dataset.cesPicker = 'true';
      input.type = 'text';
      input.readOnly = true;
      input.classList.add('ces-picker-input');

      const wrap = document.createElement('div');
      wrap.style.position = 'relative';
      wrap.style.display = 'inline-block';
      wrap.style.width = input.style.width || '100%';
      if(input.classList.contains('form-control')) wrap.style.flex = input.style.flex || '1';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);

      const picker = document.createElement('div');
      picker.className = 'ces-timepicker';
      wrap.appendChild(picker);

      for (let h = 0; h < 24; h++) {
        for (let m of ['00', '30']) {
          const time = `${h.toString().padStart(2, '0')}:${m}`;
          const opt = document.createElement('div');
          opt.className = 'ces-timepicker-opt';
          opt.textContent = time;
          opt.addEventListener('click', (e) => {
            e.stopPropagation();
            input.value = time;
            picker.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
            opt.classList.add('selected');
            picker.classList.remove('open');
            input.dispatchEvent(new Event('change', { bubbles: true }));
          });
          picker.appendChild(opt);
        }
      }

      input.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.ces-timepicker, .ces-datepicker').forEach(p => p.classList.remove('open'));
        picker.classList.add('open');
      });
    });

    // DATE PICKERS
    root.querySelectorAll('input[type="date"]').forEach(input => {
      if (input.dataset.cesPicker) return;
      input.dataset.cesPicker = 'true';
      input.type = 'text';
      input.readOnly = true;
      input.classList.add('ces-picker-input');

      const wrap = document.createElement('div');
      wrap.style.position = 'relative';
      wrap.style.display = 'inline-block';
      wrap.style.width = input.style.width || '100%';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);

      const picker = document.createElement('div');
      picker.className = 'ces-datepicker';
      wrap.appendChild(picker);

      let currentDate = input.value ? new Date(input.value) : new Date();
      let viewMonth = currentDate.getMonth();
      let viewYear = currentDate.getFullYear();

      const header = document.createElement('div');
      header.className = 'ces-datepicker-header';
      const title = document.createElement('div');
      title.className = 'ces-datepicker-title';
      const nav = document.createElement('div');
      nav.className = 'ces-datepicker-nav';
      
      const prevBtn = document.createElement('button');
      prevBtn.className = 'ces-datepicker-btn';
      prevBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>';
      
      const nextBtn = document.createElement('button');
      nextBtn.className = 'ces-datepicker-btn';
      nextBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
      
      nav.appendChild(prevBtn);
      nav.appendChild(nextBtn);
      header.appendChild(title);
      header.appendChild(nav);
      picker.appendChild(header);

      const bodyWrap = document.createElement('div');
      bodyWrap.className = 'ces-datepicker-body';
      picker.appendChild(bodyWrap);

      const footer = document.createElement('div');
      footer.className = 'ces-datepicker-footer';
      const clearBtn = document.createElement('button');
      clearBtn.className = 'ces-datepicker-action';
      clearBtn.textContent = 'Clear';
      const todayBtn = document.createElement('button');
      todayBtn.className = 'ces-datepicker-action primary';
      todayBtn.textContent = 'Today';
      footer.appendChild(clearBtn);
      footer.appendChild(todayBtn);
      picker.appendChild(footer);

      const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

      function renderCalendar() {
        title.textContent = `${months[viewMonth]} ${viewYear}`;
        bodyWrap.innerHTML = '';
        
        const weekdays = document.createElement('div');
        weekdays.className = 'ces-datepicker-grid ces-datepicker-weekdays';
        ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => {
          const w = document.createElement('div');
          w.className = 'ces-datepicker-weekday';
          w.textContent = d;
          weekdays.appendChild(w);
        });
        bodyWrap.appendChild(weekdays);

        const daysGrid = document.createElement('div');
        daysGrid.className = 'ces-datepicker-grid';
        
        const firstDay = new Date(viewYear, viewMonth, 1).getDay();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        
        for (let i = 0; i < firstDay; i++) {
          const d = document.createElement('div');
          d.className = 'ces-datepicker-day outside';
          daysGrid.appendChild(d);
        }
        
        const today = new Date();
        const selectedStr = input.value;

        for (let i = 1; i <= daysInMonth; i++) {
          const d = document.createElement('div');
          d.className = 'ces-datepicker-day';
          d.textContent = i;
          
          const dateStr = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
          
          if (viewYear === today.getFullYear() && viewMonth === today.getMonth() && i === today.getDate()) {
            d.classList.add('today');
          }
          if (dateStr === selectedStr) {
            d.classList.add('selected');
          }

          d.addEventListener('click', (e) => {
            e.stopPropagation();
            input.value = dateStr;
            picker.classList.remove('open');
            input.dispatchEvent(new Event('change', { bubbles: true }));
            renderCalendar();
          });
          daysGrid.appendChild(d);
        }
        bodyWrap.appendChild(daysGrid);
      }

      prevBtn.addEventListener('click', (e) => { e.stopPropagation(); viewMonth--; if(viewMonth<0){viewMonth=11;viewYear--;} renderCalendar(); });
      nextBtn.addEventListener('click', (e) => { e.stopPropagation(); viewMonth++; if(viewMonth>11){viewMonth=0;viewYear++;} renderCalendar(); });

      renderCalendar();
    });
  }

  // Auto-apply dropdowns and pickers to the initial DOM
  window.cesInitCustomPickers = initCustomPickers;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { cesApplyDropdowns(); initCustomPickers(); });
  } else {
    cesApplyDropdowns();
    initCustomPickers();
  }
})();
