// ════════════════════════════════════════════════════════════════════════════
// CES ENTERPRISE OPERATIONS SYSTEM — firebase-db.js  v2
// Firestore Database Engine — Real-time sync, CRUD, User management
// ════════════════════════════════════════════════════════════════════════════
(function () {
  if (!window.CES_FIREBASE_ENABLED) {
    console.log('[CES] Firebase disabled — running in offline/demo mode');
    window.CES_DB = null;
    return;
  }

  // ── INIT FIREBASE ─────────────────────────────────────────────────────────
  try { firebase.initializeApp(CES_FIREBASE_CONFIG); }
  catch (e) { if (!/already exists/.test(e.message)) console.error('[CES Firebase]', e); }

  const db = firebase.firestore();

  // Force server reads (skip cache)
  db.settings({ ignoreUndefinedProperties: true });

  const COL = {
    events:    'ces_events',
    staff:     'ces_staff',
    inventory: 'ces_inventory',
    logistics: 'ces_logistics',
    users:     'ces_users'
  };

  // ── HELPERS ───────────────────────────────────────────────────────────────
  function reRenderCurrentPanel() {
    const fn = window.__cesRender && window.__cesRender[window.CES_ACTIVE_PANEL];
    if (fn) {
      fn();
      setTimeout(function () { if (window.CES_AUTH) window.CES_AUTH.applyUI(); }, 80);
    }
  }

  function showLoadingOverlay(msg) {
    const el = document.getElementById('ces-db-loading');
    if (el) { el.querySelector('span').textContent = msg || 'Loading…'; el.style.display = 'flex'; }
  }
  function hideLoadingOverlay() {
    const el = document.getElementById('ces-db-loading');
    if (el) el.style.display = 'none';
  }

  // ── DATA HASH — to detect actual changes ─────────────────────────────────
  function dataHash() {
    return JSON.stringify({
      ev: CES.events.map(function(e){ return e.id; }).sort(),
      st: CES.staff.map(function(s){ return s.id + s.availability + s.performance; }).sort(),
      inv: CES.inventory.map(function(i){ return i.id + i.status + i.available; }).sort(),
      lg: CES.logistics.map(function(l){ return l.id + l.status; }).sort()
    });
  }

  // ── LOAD ALL DATA FROM FIRESTORE (server only) ────────────────────────────
  async function loadAll() {
    try {
      const [evSnap, stSnap, inSnap, lgSnap] = await Promise.all([
        db.collection(COL.events).get({ source: 'server' }),
        db.collection(COL.staff).get({ source: 'server' }),
        db.collection(COL.inventory).get({ source: 'server' }),
        db.collection(COL.logistics).get({ source: 'server' })
      ]);
      if (!evSnap.empty)  CES.events    = evSnap.docs.map(function(d){ return d.data(); });
      if (!stSnap.empty)  CES.staff     = stSnap.docs.map(function(d){ return d.data(); });
      if (!inSnap.empty)  CES.inventory = inSnap.docs.map(function(d){ return d.data(); });
      if (!lgSnap.empty)  CES.logistics = lgSnap.docs.map(function(d){ return d.data(); });
      return true;
    } catch (e) {
      console.error('[CES Firebase] loadAll error:', e);
      return false;
    }
  }

  // ── SAVE COLLECTION — smart diff (only delete removed, upsert existing) ───
  async function saveCollection(colName, dataArray, idField) {
    if (!dataArray) return;
    try {
      const colRef    = db.collection(COL[colName]);
      const existing  = await colRef.get({ source: 'server' });
      const existIds  = new Set(existing.docs.map(function(d){ return d.id; }));
      const currIds   = new Set(dataArray.map(function(item){ return String(item[idField]); }));

      // Firestore batch limit is 500 — split if needed
      const ops = [];
      // Delete removed docs
      existIds.forEach(function(id) {
        if (!currIds.has(id)) ops.push({ type: 'delete', id: id });
      });
      // Upsert current docs
      dataArray.forEach(function(item) {
        ops.push({ type: 'set', id: String(item[idField]), data: item });
      });

      // Execute in chunks of 400
      for (let i = 0; i < ops.length; i += 400) {
        const chunk = ops.slice(i, i + 400);
        const batch = db.batch();
        chunk.forEach(function(op) {
          const ref = colRef.doc(op.id);
          if (op.type === 'delete') batch.delete(ref);
          else batch.set(ref, op.data);
        });
        await batch.commit();
      }
    } catch (e) {
      console.error('[CES Firebase] saveCollection error (' + colName + '):', e);
    }
  }

  // ── FORCE RE-SEED EVENTS (run once to fix dates) ─────────────────────────
  async function forceSeedEvents() {
    try {
      const marker = await db.collection('ces_meta').doc('seed_v2').get({ source: 'server' });
      if (marker.exists) return; // already done
      console.log('[CES Firebase] Updating events with corrected dates…');
      await saveCollection('events', CES.events, 'id');
      await db.collection('ces_meta').doc('seed_v2').set({ done: true, ts: new Date().toISOString() });
      console.log('[CES Firebase] Events updated.');
    } catch(e) { console.error('[CES Firebase] forceSeedEvents error:', e); }
  }

  // ── ONE-TIME EVENT DATE MIGRATION ─────────────────────────────────────────
  // Preserves every Firestore event (including user-added events) and moves
  // dates into status-appropriate windows relative to the migration day.
  async function migrateEventDates() {
    const markerRef = db.collection('ces_meta').doc('event_dates_status_spread_2026_09_01_v1');
    try {
      const marker = await markerRef.get({ source: 'server' });
      if (marker.exists) return false;

      const offsets = {
        Completed: [-12, -7, -3],
        Active:    [0, 0],
        Confirmed: [3, 5, 7, 9],
        Planning:  [12, 15, 18, 21, 24],
        Tentative: [28, 32, 36]
      };
      const anchor = new Date();
      anchor.setHours(12, 0, 0, 0);

      Object.keys(offsets).forEach(function(status) {
        const group = CES.events
          .filter(function(event) { return event.status === status; })
          .sort(function(a, b) {
            return String(a.date || '').localeCompare(String(b.date || '')) || String(a.id).localeCompare(String(b.id));
          });
        const plan = offsets[status];

        group.forEach(function(event, index) {
          const lastOffset = plan[plan.length - 1];
          const extraSteps = Math.max(0, index - plan.length + 1);
          const dayOffset = index < plan.length ? plan[index] : lastOffset + (extraSteps * 3);
          const target = new Date(anchor);
          target.setDate(anchor.getDate() + dayOffset);
          event.date = [
            target.getFullYear(),
            String(target.getMonth() + 1).padStart(2, '0'),
            String(target.getDate()).padStart(2, '0')
          ].join('-');
        });
      });

      await saveCollection('events', CES.events, 'id');
      await markerRef.set({ done: true, anchorDate: anchor.toISOString(), ts: new Date().toISOString() });
      console.log('[CES Firebase] Event dates redistributed by status.');
      return true;
    } catch(e) {
      console.error('[CES Firebase] event date migration error:', e);
      return false;
    }
  }

  // ── SEED DEMO DATA ON FIRST RUN ───────────────────────────────────────────
  async function seedIfEmpty() {
    try {
      const snap = await db.collection(COL.events).limit(1).get({ source: 'server' });
      if (!snap.empty) return false;
      await Promise.all([
        saveCollection('events',    CES.events,    'id'),
        saveCollection('staff',     CES.staff,     'id'),
        saveCollection('inventory', CES.inventory, 'id'),
        saveCollection('logistics', CES.logistics, 'id')
      ]);
      console.log('[CES Firebase] Demo data seeded to Firestore.');
      return true;
    } catch(e) {
      console.error('[CES Firebase] seed error:', e);
      return false;
    }
  }

  // ── DEBOUNCED SYNC — only fires when data actually changed ─────────────────
  let syncTimer   = null;
  let _lastSynced = '';

  function scheduleSyncAll() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(async function () {
      const current = dataHash();
      if (current === _lastSynced) return; // nothing changed — skip
      _lastSynced = current;
      try {
        await Promise.all([
          saveCollection('events',    CES.events,    'id'),
          saveCollection('staff',     CES.staff,     'id'),
          saveCollection('inventory', CES.inventory, 'id'),
          saveCollection('logistics', CES.logistics, 'id')
        ]);
        console.log('[CES Firebase] Sync complete.');
      } catch(e) { console.error('[CES Firebase] sync error:', e); }
    }, 800);
  }

  // ── REAL-TIME LISTENERS ───────────────────────────────────────────────────
  let _listening     = false;
  let _ignoreUntil   = 0; // timestamp — ignore snapshots while we're writing

  function setupListeners() {
    if (_listening) return;
    _listening = true;

    function handleSnap(key, snap) {
      // Skip if we're in the middle of our own write (within 3s of last sync)
      if (Date.now() < _ignoreUntil) return;
      // Skip cache-only snapshots
      if (snap.metadata.fromCache) return;
      // Skip empty snapshots
      if (snap.empty) return;

      const newData = snap.docs.map(function(d){ return d.data(); });
      CES[key] = newData;
      reRenderCurrentPanel();
      console.log('[CES Firebase] Real-time update received:', key, newData.length, 'docs');
    }

    db.collection(COL.events).onSnapshot(
      function(snap){ handleSnap('events', snap); },
      function(err){ console.error('[CES Firebase] events listener error:', err); }
    );
    db.collection(COL.staff).onSnapshot(
      function(snap){ handleSnap('staff', snap); },
      function(err){ console.error('[CES Firebase] staff listener error:', err); }
    );
    db.collection(COL.inventory).onSnapshot(
      function(snap){ handleSnap('inventory', snap); },
      function(err){ console.error('[CES Firebase] inventory listener error:', err); }
    );
    db.collection(COL.logistics).onSnapshot(
      function(snap){ handleSnap('logistics', snap); },
      function(err){ console.error('[CES Firebase] logistics listener error:', err); }
    );
  }

  // ── POLLING FALLBACK — pulls fresh data every 15 seconds ──────────────────
  function startPolling() {
    setInterval(async function () {
      if (Date.now() < _ignoreUntil) return; // skip if we're writing
      try {
        const before = dataHash();
        await loadAll();
        const after  = dataHash();
        if (before !== after) {
          console.log('[CES Firebase] Poll detected changes — re-rendering');
          reRenderCurrentPanel();
        }
      } catch(e) {}
    }, 12000); // every 12 seconds
  }

  // ── USER MANAGEMENT ───────────────────────────────────────────────────────
  async function getUsers() {
    try {
      const snap = await db.collection(COL.users).get({ source: 'server' });
      return snap.docs.map(function(d){ return d.data(); });
    } catch (e) { console.error('[CES Firebase] getUsers error:', e); return []; }
  }
  async function saveUser(user) {
    try { await db.collection(COL.users).doc(user.id).set(user); }
    catch (e) { console.error('[CES Firebase] saveUser error:', e); }
  }
  async function deleteUser(id) {
    try { await db.collection(COL.users).doc(id).delete(); }
    catch (e) { console.error('[CES Firebase] deleteUser error:', e); }
  }

  // ── MAIN INIT ─────────────────────────────────────────────────────────────
  async function init() {
    showLoadingOverlay('Connecting to database…');
    try {
      await forceSeedEvents();
      await seedIfEmpty();
      showLoadingOverlay('Loading your data…');
      await loadAll();
      await migrateEventDates();
      _lastSynced = dataHash(); // baseline — don't sync immediately after load

      setupListeners();
      startPolling();

      // Override saveCESData — only syncs when data actually changed
      const _original = window.saveCESData;
      window.saveCESData = function () {
        if (_original) _original();
        // Only schedule Firebase sync if hash changed
        const current = dataHash();
        if (current !== _lastSynced) {
          _ignoreUntil = Date.now() + 3000; // suppress incoming snapshots for 3s
          scheduleSyncAll();
        }
      };

      // Expose direct trigger for immediate saves (add/edit/delete)
      window.CES_DB.triggerSync = function() {
        _lastSynced = ''; // force sync on next call
        _ignoreUntil = Date.now() + 3000;
        scheduleSyncAll();
      };

      hideLoadingOverlay();
      console.log('[CES Firebase] Init complete. Listeners + polling active.');
      return true;
    } catch (e) {
      console.error('[CES Firebase] init error:', e);
      hideLoadingOverlay();
      return false;
    }
  }

  // ── EXPOSE GLOBAL ─────────────────────────────────────────────────────────
  window.CES_DB = {
    init:        init,
    loadAll:     loadAll,
    syncAll:     function(){ _lastSynced = ''; scheduleSyncAll(); },
    getUsers:    getUsers,
    saveUser:    saveUser,
    deleteUser:  deleteUser,
    seedIfEmpty: seedIfEmpty,
    triggerSync: function(){} // overwritten after init
  };

  console.log('[CES Firebase] firebase-db.js v2 loaded — project:', CES_FIREBASE_CONFIG.projectId);
})();
