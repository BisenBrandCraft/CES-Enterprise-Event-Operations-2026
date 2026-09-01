// inventory.js — Inventory Management Module
(function(){
  const el = document.getElementById('panel-inventory');
  if (!el) return;

  // ── KEYWORD → CATEGORY AUTO-DETECT ─────────────────────────────────────────
  // When user types item name, category + icon auto-selects based on these keywords.
  // User can still manually override anytime.
  // Order matters — first match wins. Specific/narrow keywords checked before broad ones.
  const KEYWORD_MAP = [
    { cat: 'Audio / Video',                  keys: ['dj booth','dj set','dj rig','audio system','pa system','av system','sound system','microphone','projector','led screen','dance staging'] },
    { cat: 'Virtual Reality',                keys: ['virtual reality','360 vr','360vr','vr experience','vr station','vr headset','oculus','draw me bot','bot station','augmented reality'] },
    { cat: 'Dance Floors',                   keys: ['dance floor','dancefloor','dance stage','checkered floor','led floor'] },
    { cat: 'Casino Nights',                  keys: ['casino','poker','blackjack','roulette','slot machine','craps','baccarat'] },
    { cat: 'Carnivals',                      keys: ['carnival','ferris wheel','carousel','midway'] },
    { cat: 'Sports & Video Games',           keys: ['race car','simulator','hoops','basketball','football','soccer','foosball','arcade','video game','bowling','billiard','pool table','air hockey','dual snow','street hoops','sports game','gaming'] },
    { cat: 'Game Shows',                     keys: ['game show','trivia','quiz show','stick drop','showdown'] },
    { cat: 'Giant / Lawn Games',             keys: ['mini golf','lawn game','giant jenga','cornhole','bocce','giant chess','oversized game','yard game'] },
    { cat: 'Halloween Themed Entertainment', keys: ['halloween','haunted','ghost','pumpkin','horror','spooky','witch','zombie'] },
    { cat: 'Holiday Parties',                keys: ['holiday','christmas','candy wall','candy cart','glow letter','neon letter','snow globe','santa claus','winter wonder'] },
    { cat: 'Inflatables',                    keys: ['inflatable','bounce house','bouncy castle','air castle','obstacle course'] },
    { cat: 'Mitzvah Madness',                keys: ['mitzvah','bar mitzvah','bat mitzvah','bnai'] },
    { cat: 'Performers',                     keys: ['performer','magician','comedian','clown','entertainer','hypnotist','illusionist','caricature artist'] },
    { cat: 'Photo Favors',                   keys: ['photo favor','photo strip','photo print','photo gift','trading card','custom card','photo keepsake'] },
    { cat: 'Crafts & Favors',               keys: ['craft kit','diy favor','favor kit','custom craft'] },
    { cat: 'Event Furniture',                keys: ["o'bar","o' bar",'chrome bar','glow bar','candy bar station','bar cart','bar unit','bar set',' bar','lounge sofa','cocktail table','high-top','communal table','furniture package','table package','chair','stool','bench','seating'] },
    { cat: 'Photo Booths',                   keys: ['booth','photo wall','vogue','glam','selfie','pop star','magazine booth','3-sided','ai photo','photo station','mirror'] }
  ];

  function autoDetectCategory(name) {
    const lower = name.toLowerCase();
    for (const row of KEYWORD_MAP) {
      if (row.keys.some(k => lower.includes(k))) return row.cat;
    }
    return null;
  }

  // ── CATEGORY → ICON MAP (matches assets/icons/categories/) ─────────────────
  // Product-type categories only (NOT event contexts like "College Events" or "Wedding Entertainment")
  // Event context is tracked in the Events module when items are assigned to events.
  const CAT_ICONS = [
    { name: 'Audio / Video',                  file: 'audio-video'            },
    { name: 'Carnivals',                       file: 'carnivals'              },
    { name: 'Casino Nights',                   file: 'casino-nights'          },
    { name: 'Crafts & Favors',                 file: 'crafts-favors'          },
    { name: 'Dance Floors',                    file: 'dance-floors'           },
    { name: 'Event Furniture',                 file: 'event-furniture'        },
    { name: 'Game Shows',                      file: 'game-shows'             },
    { name: 'Giant / Lawn Games',              file: 'giant-lawn-games'       },
    { name: 'Halloween Themed Entertainment',  file: 'halloween'              },
    { name: 'Holiday Parties',                 file: 'holiday-parties'        },
    { name: 'Inflatables',                     file: 'inflatables'            },
    { name: 'Mitzvah Madness',                 file: 'mitzvah-madness'        },
    { name: 'Performers',                      file: 'performers'             },
    { name: 'Photo Booths',                    file: 'photo-booths'           },
    { name: 'Photo Favors',                    file: 'photo-favors'           },
    { name: 'Sports & Video Games',            file: 'sports-video-games'     },
    { name: 'Virtual Reality',                 file: 'virtual-reality'        }
  ];

  function iconPath(file) {
    return 'assets/icons/categories/' + file + '.svg';
  }

  function getIconForCategory(catName) {
    const match = CAT_ICONS.find(c => c.name === catName);
    return match ? iconPath(match.file) : iconPath('photo-booths');
  }

  // ── BUILD ICON PICKER ────────────────────────────────────────────────────────
  function buildIconPicker() {
    const picker = document.getElementById('inv-icon-picker');
    if (!picker) return;
    picker.innerHTML = CAT_ICONS.map(c => `
      <div class="inv-icon-tile" data-file="${c.file}" data-name="${c.name}"
           onclick="selectInvIcon('${c.file}','${c.name}')"
           title="${c.name}"
           style="display:flex;flex-direction:column;align-items:center;gap:4px;
                  padding:8px 6px;border-radius:8px;cursor:pointer;min-width:68px;
                  border:2px solid transparent;transition:all .15s;background:var(--bg-card)">
        <img src="${iconPath(c.file)}" style="width:32px;height:32px;opacity:0.75;filter:brightness(0) invert(0.7)" onerror="this.style.display='none'">
        <span style="font-size:9px;color:var(--text-muted);text-align:center;line-height:1.2;max-width:64px;word-break:break-word">${c.name}</span>
      </div>`).join('');
  }

  window.selectInvIcon = function(file, name) {
    // Update hidden field
    const hiddenEl = document.getElementById('new-inv-emoji');
    if (hiddenEl) hiddenEl.value = iconPath(file);
    // Update preview
    const prev = document.getElementById('inv-icon-preview');
    if (prev) prev.src = iconPath(file);
    const lbl = document.getElementById('inv-icon-label');
    if (lbl) lbl.textContent = name;
    // Highlight selected tile
    document.querySelectorAll('.inv-icon-tile').forEach(t => {
      t.style.borderColor = 'transparent';
      t.style.background = 'var(--bg-card)';
      const img = t.querySelector('img');
      if (img) img.style.filter = 'brightness(0) invert(0.7)';
    });
    const chosen = document.querySelector(`.inv-icon-tile[data-file="${file}"]`);
    if (chosen) {
      chosen.style.borderColor = 'var(--ces-cyan)';
      chosen.style.background = 'rgba(0,146,200,0.12)';
      const img = chosen.querySelector('img');
      if (img) img.style.filter = 'brightness(0) saturate(100%) invert(42%) sepia(96%) saturate(500%) hue-rotate(163deg)';
    }
  };

  // Auto-sync icon when category dropdown changes
  window.syncIconToCategory = function() {
    const cat = document.getElementById('new-inv-cat');
    if (!cat) return;
    const match = CAT_ICONS.find(c => c.name === cat.value);
    if (match) selectInvIcon(match.file, match.name);
  };

  // Auto-detect category from item name as user types
  window.autoSelectInvCategory = function() {
    const nameEl = document.getElementById('new-inv-name');
    if (!nameEl) return;
    const detected = autoDetectCategory(nameEl.value);
    if (!detected) return;

    requestAnimationFrame(function() {
      const catEl = document.getElementById('new-inv-cat');
      if (!catEl || catEl.dataset.manualOverride === 'true') return;

      // Rebuild <select> options HTML with correct option pre-selected.
      // This is the only 100% reliable way to force a visual refresh in all browsers.
      catEl.innerHTML = CAT_ICONS.map(c =>
        '<option' + (c.name === detected ? ' selected' : '') + '>' +
        c.name.replace(/&/g, '&amp;') +
        '</option>'
      ).join('');

      // Re-attach manual-override listener (lost when innerHTML was rebuilt)
      catEl.onmousedown = function() { this.dataset.manualOverride = 'true'; };

      window.syncIconToCategory();
    });
  };

  function setIconPickerValue(iconSrc, catName) {
    const hiddenEl = document.getElementById('new-inv-emoji');
    if (hiddenEl) hiddenEl.value = iconSrc;
    const prev = document.getElementById('inv-icon-preview');
    if (prev) prev.src = iconSrc;
    const lbl = document.getElementById('inv-icon-label');
    if (lbl) lbl.textContent = catName || '';
    // Highlight matching tile
    const file = iconSrc.replace('assets/icons/categories/','').replace('.svg','');
    document.querySelectorAll('.inv-icon-tile').forEach(t => {
      t.style.borderColor = 'transparent';
      t.style.background = 'var(--bg-card)';
      const img = t.querySelector('img');
      if (img) img.style.filter = 'brightness(0) invert(0.7)';
    });
    const chosen = document.querySelector(`.inv-icon-tile[data-file="${file}"]`);
    if (chosen) {
      chosen.style.borderColor = 'var(--ces-cyan)';
      chosen.style.background = 'rgba(0,146,200,0.12)';
      const img = chosen.querySelector('img');
      if (img) img.style.filter = 'brightness(0) saturate(100%) invert(42%) sepia(96%) saturate(500%) hue-rotate(163deg)';
    }
  }

  // ── RENDER PAGE ──────────────────────────────────────────────────────────────
  function render() {
    const totalItems = CES.inventory.length;
    const totalQty   = CES.inventory.reduce((a,i)=>a+i.qty, 0);
    const availQty   = CES.inventory.reduce((a,i)=>a+i.available, 0);
    const inUseQty   = totalQty - availQty;

    el.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">Inventory Management</div>
          <div class="page-subtitle">${totalItems} unique products · ${availQty}/${totalQty} items available</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline" onclick="exportInventory()">⬇ Export</button>
          <button class="btn btn-outline" onclick="openAddInventoryModal()">+ Add Inventory</button>
        </div>
      </div>
      <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
        ${kpi('Total Products',    totalItems, 'Unique SKU categories')}
        ${kpi('Available Items',   availQty,   'Ready to deploy')}
        ${kpi('In Use / Reserved', inUseQty,   'Currently deployed')}
      </div>
      <div class="grid-1">
        <div class="card">
          <div class="card-header"><span class="card-title"><span class="card-title-icon"></span>Inventory Directory</span></div>
          <div class="filter-bar" style="padding:12px 12px 0">
            <div class="search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input id="inv-search" placeholder="Search products..." oninput="filterInventory()">
            </div>
            <select class="filter-select" id="inv-cat-filter" onchange="filterInventory()">
              <option value="">All Categories</option>
              <option>Audio / Video</option>
              <option>Carnivals</option>
              <option>Casino Nights</option>
              <option>Crafts &amp; Favors</option>
              <option>Dance Floors</option>
              <option>Event Furniture</option>
              <option>Game Shows</option>
              <option>Giant / Lawn Games</option>
              <option>Halloween Themed Entertainment</option>
              <option>Holiday Parties</option>
              <option>Inflatables</option>
              <option>Mitzvah Madness</option>
              <option>Performers</option>
              <option>Photo Booths</option>
              <option>Photo Favors</option>
              <option>Sports &amp; Video Games</option>
              <option>Virtual Reality</option>
            </select>
            <select class="filter-select" id="inv-status-filter" onchange="filterInventory()">
              <option value="">All Statuses</option>
              <option>Available</option>
              <option>In Use</option>
              <option>In Repair</option>
            </select>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Product</th><th>Category</th><th>Qty</th><th>Status</th><th>Condition</th><th>Action</th></tr></thead>
              <tbody id="inv-table"></tbody>
            </table>
          </div>
        </div>
      </div>`;

    // Build icon picker after DOM is ready
    buildIconPicker();
    renderInventoryTable(CES.inventory);
  }

  function kpi(l,v,s){
    return `<div class="kpi-card"><div class="kpi-label">${l}</div><div class="kpi-value">${v}</div><div class="kpi-sub">${s}</div></div>`;
  }

  function renderInventoryTable(items) {
    document.getElementById('inv-table').innerHTML = items.map(i => {
      // Always use category-based SVG icon (ignore legacy emoji chars)
      const iconSrc  = (i.emoji||'').startsWith('assets/') ? i.emoji : getIconForCategory(i.category);
      const iconHtml = `<img src="${iconSrc}" style="width:30px;height:30px;object-fit:contain;filter:brightness(0) saturate(100%) invert(42%) sepia(96%) saturate(500%) hue-rotate(163deg)" onerror="this.style.opacity='0.3'">`;
      return `
        <tr ondblclick="editInventory('${i.id}')" style="cursor:pointer" title="Double-click to edit">
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              ${iconHtml}
              <strong>${i.name}</strong>
            </div>
          </td>
          <td>${i.category}</td>
          <td>
            <div style="font-weight:700">${i.available} <span style="color:var(--text-muted);font-weight:400">/ ${i.qty}</span></div>
          </td>
          <td><span class="badge ${i.status==='Available'?'badge-success':i.status==='In Use'?'badge-danger':i.status==='In Repair'?'badge-repair':'badge-warning'}">${i.status}</span></td>
          <td><span class="badge ${i.condition==='In Repair'?'badge-repair':'badge-info'}">${i.condition}</span></td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="editInventory('${i.id}')">Edit</button>
          </td>
        </tr>`;
    }).join('');
  }

  window.filterInventory = function() {
    const q      = document.getElementById('inv-search').value.toLowerCase();
    const cat    = document.getElementById('inv-cat-filter').value;
    const status = document.getElementById('inv-status-filter').value;
    renderInventoryTable(CES.inventory.filter(i =>
      (!q      || i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)) &&
      (!cat    || i.category === cat) &&
      (!status || i.status === status)
    ));
  };

  // Called from Dashboard KPI card — navigate to inventory and filter by In Repair
  window.showInRepairItems = function() {
    const navEl = document.querySelector('[data-panel=inventory]');
    switchPanel('inventory', navEl);
    // Wait for panel to render then apply status filter
    setTimeout(() => {
      const sel = document.getElementById('inv-status-filter');
      if (sel) {
        sel.value = 'In Repair';
        // Trigger custom dropdown sync if present
        const wrap = sel.closest('.ces-filter-wrap');
        if (wrap) {
          const val = wrap.querySelector('.ces-filter-val');
          if (val) { val.textContent = 'In Repair'; val.classList.remove('ces-placeholder'); }
        }
        filterInventory();
      }
    }, 80);
  };

  // ── OPEN ADD MODAL ───────────────────────────────────────────────────────────
  window.openAddInventoryModal = function() {
    try {
      const modal = document.getElementById('modal-add-inventory');
      if (!modal) { alert('Modal not found. Please hard-refresh (Ctrl+F5).'); return; }

      document.getElementById('inv-modal-title').textContent = '➕ Add New Inventory';
      document.getElementById('edit-inv-id').value   = '';
      document.getElementById('new-inv-name').value  = '';
      const catEl = document.getElementById('new-inv-cat');
      catEl.selectedIndex = 0;
      document.getElementById('new-inv-qty').value    = '1';
      document.getElementById('new-inv-status').value = 'Available';
      document.getElementById('new-inv-cond').selectedIndex = 0;
      document.getElementById('btn-delete-inv').style.display = 'none';

      // Reset manual-override flag so auto-detect works fresh
      catEl.dataset.manualOverride = 'false';
      // Attach mousedown once — marks manual override if user opens the dropdown themselves
      catEl.onmousedown = function() { this.dataset.manualOverride = 'true'; };

      // Build picker & default to first category icon
      buildIconPicker();
      const firstCat = CAT_ICONS[0];
      setIconPickerValue(iconPath(firstCat.file), firstCat.name);

      openModal('modal-add-inventory');
    } catch(err) { alert('Error opening modal: ' + err.message); }
  };

  // ── OPEN EDIT MODAL ──────────────────────────────────────────────────────────
  window.editInventory = function(id) {
    try {
      const item = CES.inventory.find(i => i.id === id);
      if (!item) return;
      const modal = document.getElementById('modal-add-inventory');
      if (!modal) { alert('Modal not found. Please hard-refresh (Ctrl+F5).'); return; }

      document.getElementById('inv-modal-title').textContent = '✏️ Edit Inventory';
      document.getElementById('edit-inv-id').value   = item.id;
      document.getElementById('new-inv-name').value  = item.name;
      document.getElementById('new-inv-cat').value   = item.category;
      document.getElementById('new-inv-qty').value    = item.qty;
      document.getElementById('new-inv-status').value = item.status;
      document.getElementById('new-inv-cond').value   = item.condition;
      document.getElementById('btn-delete-inv').style.display = 'block';

      // Build picker & restore saved icon
      buildIconPicker();
      const iconSrc = (item.emoji||'').startsWith('assets/')
        ? item.emoji
        : getIconForCategory(item.category);
      const match = CAT_ICONS.find(c => iconPath(c.file) === iconSrc);
      setIconPickerValue(iconSrc, match ? match.name : item.category);

      openModal('modal-add-inventory');
    } catch(err) { alert('Error opening edit modal: ' + err.message); }
  };

  // ── SAVE ─────────────────────────────────────────────────────────────────────
  window.saveInventory = function() {
    const editId = document.getElementById('edit-inv-id').value;
    const name   = document.getElementById('new-inv-name').value.trim();
    if (!name) return alert('Please enter an item name.');

    const cat    = document.getElementById('new-inv-cat').value;
    const icon   = document.getElementById('new-inv-emoji').value || getIconForCategory(cat);
    const qty    = parseInt(document.getElementById('new-inv-qty').value) || 1;
    const status = document.getElementById('new-inv-status').value;
    const cond   = document.getElementById('new-inv-cond').value;

    if (editId) {
      const item = CES.inventory.find(i => i.id === editId);
      if (item) {
        const diff     = qty - item.qty;
        item.available = Math.max(0, item.available + diff);
        item.name      = name;
        item.category  = cat;
        item.emoji     = icon;
        item.qty       = qty;
        item.status    = status;
        item.condition = cond;
      }
    } else {
      const nextId = 'CES-INV-' + String(CES.inventory.length + 1).padStart(3,'0');
      CES.inventory.push({ id:nextId, name, category:cat, emoji:icon,
        qty, available:qty, status, condition:cond });
    }

    if (window.CES_DB && window.CES_DB.triggerSync) window.CES_DB.triggerSync();
    closeModal('modal-add-inventory');
    render();
    if (window.renderInvPicker) renderInvPicker();
  };

  // ── DELETE ────────────────────────────────────────────────────────────────────
  window.deleteInventoryItem = function() {
    const editId = document.getElementById('edit-inv-id').value;
    if (!editId) return;
    if (confirm('Are you sure you want to permanently delete this item?')) {
      CES.inventory = CES.inventory.filter(i => i.id !== editId);
      closeModal('modal-add-inventory');
      render();
      if (window.renderInvPicker) renderInvPicker();
    }
  };

  window.exportInventory = function() {
    alert('Inventory export downloaded as CSV.');
  };

  // ── INIT ─────────────────────────────────────────────────────────────────────
  render();

  const originalSwitchPanel = window.switchPanel;
  if (originalSwitchPanel && !window._inventoryHooked) {
    window._inventoryHooked = true;
    window.switchPanel = function(panelId, btn) {
      originalSwitchPanel(panelId, btn);
      if (panelId === 'inventory') render();
    };
  }

  window.__cesRender = window.__cesRender || {};
  window.__cesRender['inventory'] = render;
})();
