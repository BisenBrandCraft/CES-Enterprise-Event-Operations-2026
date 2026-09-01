// datetime-picker.js — CES Custom Date & Time Picker
// Supports 3 modes: 'datetime' | 'date' | 'time'

(function () {
  'use strict';

  const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const MONTHS_S = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const WDAYS    = ['Mo','Tu','We','Th','Fr','Sa','Su'];
  const WDAYS_L  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  let pickerEl      = null;
  let activeWrapper = null;
  let currentMode   = 'datetime'; // 'datetime' | 'date' | 'time'

  let ps = { year: 2026, month: 4, selDate: null, hour: 9, min: 0 };

  /* ══════════════════════════════════════════════════════
     BUILD PICKER DOM (once, reused)
  ══════════════════════════════════════════════════════ */
  function buildPicker() {
    const el = document.createElement('div');
    el.id = 'ces-dtp';
    el.innerHTML = `
      <div class="ces-dtp-body">
        <div class="ces-dtp-cal" id="ces-dtp-cal-section">
          <div class="ces-dtp-cal-nav">
            <button class="ces-dtp-nav-btn" id="ces-dtp-prev">&#8249;</button>
            <span id="ces-dtp-month-lbl" class="ces-dtp-month-lbl"></span>
            <button class="ces-dtp-nav-btn" id="ces-dtp-next">&#8250;</button>
          </div>
          <div class="ces-dtp-weekdays">${WDAYS.map(d=>`<span>${d}</span>`).join('')}</div>
          <div class="ces-dtp-grid" id="ces-dtp-grid"></div>
        </div>
        <div class="ces-dtp-divider" id="ces-dtp-divider"></div>
        <div class="ces-dtp-time" id="ces-dtp-time-section">
          <div class="ces-dtp-time-title">Time</div>
          <div class="ces-dtp-ampm-row">
            <button class="ces-dtp-ampm-btn" id="ces-dtp-am" onclick="window.CESDTP.setAmPm('AM')">AM</button>
            <button class="ces-dtp-ampm-btn" id="ces-dtp-pm" onclick="window.CESDTP.setAmPm('PM')">PM</button>
          </div>
          <div class="ces-dtp-time-scroll" id="ces-dtp-time-scroll"></div>
        </div>
      </div>
      <div class="ces-dtp-footer">
        <span class="ces-dtp-selected-label" id="ces-dtp-preview">—</span>
        <div style="display:flex;gap:8px">
          <button class="btn btn-outline btn-sm" onclick="window.CESDTP.cancel()">Cancel</button>
          <button class="btn btn-primary btn-sm" onclick="window.CESDTP.done()">✓ Done</button>
        </div>
      </div>`;

    document.body.appendChild(el);

    document.getElementById('ces-dtp-prev').addEventListener('click', () => {
      ps.month--; if (ps.month < 0) { ps.month = 11; ps.year--; }
      renderGrid();
    });
    document.getElementById('ces-dtp-next').addEventListener('click', () => {
      ps.month++; if (ps.month > 11) { ps.month = 0; ps.year++; }
      renderGrid();
    });

    document.addEventListener('mousedown', function (e) {
      if (!pickerEl || pickerEl.style.display === 'none') return;
      if (pickerEl.contains(e.target)) return;
      if (activeWrapper && activeWrapper.contains(e.target)) return;
      hidePicker();
    }, true);

    window.addEventListener('scroll', repositionPicker, true);
    return el;
  }

  /* ══════════════════════════════════════════════════════
     APPLY MODE — show/hide sections based on mode
  ══════════════════════════════════════════════════════ */
  function applyMode(mode) {
    const cal  = document.getElementById('ces-dtp-cal-section');
    const div  = document.getElementById('ces-dtp-divider');
    const time = document.getElementById('ces-dtp-time-section');
    if (mode === 'date') {
      cal.style.display  = '';
      div.style.display  = 'none';
      time.style.display = 'none';
      pickerEl.style.width = '310px';
    } else if (mode === 'time') {
      cal.style.display  = 'none';
      div.style.display  = 'none';
      time.style.display = '';
      pickerEl.style.width = '160px';
    } else {
      cal.style.display  = '';
      div.style.display  = '';
      time.style.display = '';
      pickerEl.style.width = '510px';
    }
  }

  /* ══════════════════════════════════════════════════════
     SMART REPOSITION (scroll-aware, flip above/below)
  ══════════════════════════════════════════════════════ */
  function repositionPicker() {
    if (!pickerEl || pickerEl.style.display === 'none' || !activeWrapper) return;
    const rect    = activeWrapper.getBoundingClientRect();
    const pickerH = pickerEl.offsetHeight || 380;
    const pickerW = pickerEl.offsetWidth  || 510;
    const gap     = 6;
    const viewH   = window.innerHeight;
    const viewW   = window.innerWidth;

    if (rect.bottom < 0 || rect.top > viewH) { hidePicker(); return; }

    const left       = Math.max(8, Math.min(rect.left, viewW - pickerW - 8));
    const spaceBelow = viewH - rect.bottom;
    const spaceAbove = rect.top;
    const top = (spaceBelow >= pickerH + gap || spaceBelow >= spaceAbove)
      ? rect.bottom + gap
      : rect.top - pickerH - gap;

    pickerEl.style.top  = Math.max(8, top) + 'px';
    pickerEl.style.left = left + 'px';
  }

  /* ══════════════════════════════════════════════════════
     RENDER CALENDAR GRID
  ══════════════════════════════════════════════════════ */
  function renderGrid() {
    document.getElementById('ces-dtp-month-lbl').textContent = MONTHS[ps.month] + ' ' + ps.year;
    const firstDay    = new Date(ps.year, ps.month, 1).getDay();
    const daysInMonth = new Date(ps.year, ps.month + 1, 0).getDate();
    const today       = new Date();
    const offset      = firstDay === 0 ? 6 : firstDay - 1;

    let html = '';
    for (let i = 0; i < offset; i++) html += '<span class="ces-dtp-day-blank"></span>';
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = today.getFullYear() === ps.year && today.getMonth() === ps.month && today.getDate() === d;
      const isSel   = ps.selDate && ps.selDate.y === ps.year && ps.selDate.mo === ps.month && ps.selDate.d === d;
      html += `<span class="ces-dtp-day${isToday?' today':''}${isSel?' selected':''}" data-d="${d}">${d}</span>`;
    }
    const grid = document.getElementById('ces-dtp-grid');
    grid.innerHTML = html;
    grid.querySelectorAll('.ces-dtp-day').forEach(el => {
      el.addEventListener('click', function () {
        ps.selDate = { y: ps.year, mo: ps.month, d: +this.dataset.d };
        renderGrid();
        updatePreview();
        // Date-only mode: auto-confirm on date click
        if (currentMode === 'date') window.CESDTP.done();
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     RENDER TIME SLOTS
  ══════════════════════════════════════════════════════ */
  function renderTimes() {
    const isAM = ps.hour < 12;
    document.getElementById('ces-dtp-am').className = 'ces-dtp-ampm-btn' + (isAM  ? ' active' : '');
    document.getElementById('ces-dtp-pm').className = 'ces-dtp-ampm-btn' + (!isAM ? ' active' : '');

    const startH = isAM ? 0 : 12;
    const endH   = isAM ? 12 : 24;
    let html = '';
    for (let h = startH; h < endH; h++) {
      for (let m = 0; m < 60; m += 30) {
        const isSel = ps.hour === h && ps.min === m;
        const h12   = h === 0 ? 12 : h > 12 ? h - 12 : h;
        html += `<div class="ces-dtp-slot${isSel?' active':''}" data-h="${h}" data-m="${m}">${String(h12).padStart(2,'0')}:${String(m).padStart(2,'0')}</div>`;
      }
    }
    const scroll = document.getElementById('ces-dtp-time-scroll');
    scroll.innerHTML = html;
    scroll.querySelectorAll('.ces-dtp-slot').forEach(el => {
      el.addEventListener('click', function () {
        ps.hour = +this.dataset.h;
        ps.min  = +this.dataset.m;
        renderTimes();
        updatePreview();
        // Time-only mode: auto-confirm on slot click
        if (currentMode === 'time') window.CESDTP.done();
      });
    });
    const active = scroll.querySelector('.active');
    if (active) setTimeout(() => {
      scroll.scrollTop = active.offsetTop - scroll.clientHeight / 2 + active.clientHeight / 2;
    }, 20);
  }

  /* ══════════════════════════════════════════════════════
     PREVIEW FOOTER LABEL
  ══════════════════════════════════════════════════════ */
  function updatePreview() {
    const lbl = document.getElementById('ces-dtp-preview');
    if (!lbl) return;
    const text = buildDisplay(ps, currentMode);
    lbl.textContent = text || (currentMode === 'time' ? 'Pick a time' : 'Pick a date');
    lbl.style.color = text ? 'var(--ces-cyan)' : 'var(--text-muted)';
  }

  /* ══════════════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════════════ */
  function buildDisplay(state, mode) {
    if (mode === 'time') {
      const h = state.hour, m = state.min;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12  = h === 0 ? 12 : h > 12 ? h - 12 : h;
      return `${String(h12).padStart(2,'0')}:${String(m).padStart(2,'0')} ${ampm}`;
    }
    if (!state.selDate) return '';
    const { y, mo, d } = state.selDate;
    const dateObj = new Date(y, mo, d);
    const dateStr = `${WDAYS_L[dateObj.getDay()]} ${d} ${MONTHS_S[mo]} ${y}`;
    if (mode === 'date') return dateStr;
    const h = state.hour, m = state.min;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12  = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${dateStr}  ·  ${String(h12).padStart(2,'0')}:${String(m).padStart(2,'0')} ${ampm}`;
  }

  function buildValue(state, mode) {
    if (mode === 'time') {
      return `${String(state.hour).padStart(2,'0')}:${String(state.min).padStart(2,'0')}`;
    }
    if (!state.selDate) return '';
    const { y, mo, d } = state.selDate;
    const dateStr = `${y}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if (mode === 'date') return dateStr;
    return `${dateStr}T${String(state.hour).padStart(2,'0')}:${String(state.min).padStart(2,'0')}`;
  }

  function parseValue(val, mode) {
    if (!val) return null;
    if (mode === 'time') {
      const [h, m] = val.split(':').map(Number);
      return { selDate: null, hour: h || 9, min: m || 0 };
    }
    const normalized = val.replace(' ', 'T');
    const [dp, tp]   = normalized.split('T');
    if (!dp) return null;
    const [y, mo, d] = dp.split('-').map(Number);
    const [h, m]     = (tp || '09:00').split(':').map(Number);
    return { selDate: { y, mo: mo - 1, d }, hour: h || 9, min: m || 0 };
  }

  function getPlaceholder(mode) {
    if (mode === 'time') return 'Select time';
    if (mode === 'date') return 'Select date';
    return 'Select date &amp; time';
  }

  function getIcon(mode) {
    if (mode === 'time')
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15" style="flex-shrink:0;opacity:0.55"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15" style="flex-shrink:0;opacity:0.55"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
  }

  function hidePicker() {
    if (pickerEl) pickerEl.style.display = 'none';
    activeWrapper = null;
  }

  /* ══════════════════════════════════════════════════════
     CORE INIT — used by all three public wrappers
  ══════════════════════════════════════════════════════ */
  function initWrapper(wrapperEl, inputId, existingVal, mode) {
    if (!wrapperEl) return;
    const parsed  = parseValue(existingVal, mode);
    const display = parsed ? buildDisplay(
      { selDate: parsed.selDate, hour: parsed.hour, min: parsed.min }, mode
    ) : '';

    wrapperEl.className = 'ces-dt-wrapper';
    wrapperEl.dataset.mode = mode;
    wrapperEl.innerHTML = `
      <div class="ces-dt-field" onclick="window.CESDTP.open(this.closest('.ces-dt-wrapper'))">
        ${getIcon(mode)}
        <span class="ces-dt-display">${display || getPlaceholder(mode)}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12" style="flex-shrink:0;opacity:0.45"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <input type="hidden" id="${inputId}" value="${existingVal || ''}">`;
  }

  /* ══════════════════════════════════════════════════════
     PUBLIC API  —  window.CESDTP
  ══════════════════════════════════════════════════════ */
  window.CESDTP = {

    /** Date + Time picker */
    init: function (wrapperEl, inputId, existingVal) {
      initWrapper(wrapperEl, inputId, existingVal, 'datetime');
    },

    /** Date-only picker */
    initDate: function (wrapperEl, inputId, existingVal) {
      initWrapper(wrapperEl, inputId, existingVal, 'date');
    },

    /** Time-only picker */
    initTime: function (wrapperEl, inputId, existingVal) {
      initWrapper(wrapperEl, inputId, existingVal, 'time');
    },

    /** Open picker for the given wrapper */
    open: function (wrapperEl) {
      if (!pickerEl) pickerEl = buildPicker();
      activeWrapper = wrapperEl;
      currentMode   = wrapperEl.dataset.mode || 'datetime';

      const hidden = wrapperEl.querySelector('input[type=hidden]');
      const parsed = parseValue(hidden ? hidden.value : '', currentMode);
      if (parsed) {
        const base = currentMode === 'time'
          ? { year: new Date().getFullYear(), month: new Date().getMonth() }
          : { year: parsed.selDate.y, month: parsed.selDate.mo };
        ps = { ...base, selDate: parsed.selDate, hour: parsed.hour, min: parsed.min };
      } else {
        const now = new Date();
        ps = { year: now.getFullYear(), month: now.getMonth(), selDate: null, hour: 9, min: 0 };
      }

      applyMode(currentMode);

      pickerEl.style.top  = '-9999px';
      pickerEl.style.left = '-9999px';
      pickerEl.style.display = 'block';
      repositionPicker();

      if (currentMode !== 'time') renderGrid();
      if (currentMode !== 'date') renderTimes();
      updatePreview();
    },

    setAmPm: function (ampm) {
      if (ampm === 'AM' && ps.hour >= 12) ps.hour -= 12;
      if (ampm === 'PM' && ps.hour < 12)  ps.hour += 12;
      renderTimes();
      updatePreview();
    },

    cancel: function () { hidePicker(); },

    done: function () {
      if (!activeWrapper) { hidePicker(); return; }
      const value   = buildValue(ps, currentMode);
      const display = buildDisplay(ps, currentMode);
      const dispEl  = activeWrapper.querySelector('.ces-dt-display');
      if (dispEl) dispEl.textContent = display || getPlaceholder(currentMode);
      const hidden = activeWrapper.querySelector('input[type=hidden]');
      if (hidden) hidden.value = value;
      hidePicker();
    }
  };

})();
