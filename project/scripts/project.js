(function () {
  'use strict';

  const TRAILS_KEY = 'ahub_favorites';
  const SUBMISSIONS_KEY = 'ahub_submissions';

  const trails = [
    { id: 't1', name: 'Ridgeway Loop', difficulty: 'moderate', length: '6.2 mi', img: 'images/trail1.jpg', desc: 'Scenic ridge with panoramic views.' },
    { id: 't2', name: 'Creekside Path', difficulty: 'easy', length: '2.1 mi', img: 'images/trail2.jpg', desc: 'Flat, family-friendly path along a creek.' },
    { id: 't3', name: 'Summit Climb', difficulty: 'hard', length: '8.4 mi', img: 'images/trail3.jpg', desc: 'Steep ascent to the summit; rewarding views.' }
  ];

  const $ = sel => document.querySelector(sel);

  -
  function getFavorites() {
    try { return JSON.parse(localStorage.getItem(TRAILS_KEY)) || []; } 
    catch { return []; }
  }
  function saveFavorites(list) {
    localStorage.setItem(TRAILS_KEY, JSON.stringify(list));
  }
  function isFavorited(id) {
    return getFavorites().includes(id);
  }
  function toggleFavorite(id) {
    let favs = getFavorites();
    favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
    saveFavorites(favs);
  }

  // --- Generate Trail Card HTML ---
  function trailCardHTML(trail) {
    return `
      <article class="card" data-id="${trail.id}" aria-labelledby="${trail.id}-title">
        <img src="${trail.img}" alt="${trail.name}" loading="lazy">
        <h3 id="${trail.id}-title">${trail.name}</h3>
        <p>${trail.desc}</p>
        <p><strong>${trail.length} mi</strong> — ${trail.difficulty}</p>
        <div class="btn-row">
          <button class="btn save" data-id="${trail.id}">${isFavorited(trail.id) ? 'Unsave' : 'Save'}</button>
          <button class="btn details" data-id="${trail.id}">Details</button>
        </div>
      </article>
    `;
  }

  // --- Render Cards ---
  function renderCards(containerSelector, items) {
    const container = $(containerSelector);
    if (!container) return;
    container.innerHTML = items.map(trailCardHTML).join('');
    activateButtons(container);
  }

  // --- Render Favorites ---
  function renderFavorites() {
    const favEl = $('#favorites');
    if (!favEl) return;
    const favIds = getFavorites();
    const favItems = favIds.map(id => trails.find(t => t.id === id)).filter(Boolean);
    favEl.innerHTML = favItems.length ? favItems.map(trailCardHTML).join('') : '<p>No saved trails yet.</p>';
    activateButtons(favEl);
  }

  // --- Activate Buttons ---
  function activateButtons(container) {
    container.querySelectorAll('.save').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleFavorite(btn.dataset.id);
        renderCards('#trails-list', trails);
        renderFavorites();
      });
    });
    container.querySelectorAll('.details').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = trails.find(x => x.id === btn.dataset.id);
        if (t) alert(`${t.name}\n\n${t.desc}\nLength: ${t.length} mi\nDifficulty: ${t.difficulty}`);
      });
    });
  }

  // --- Filters & Sorting ---
  function initFilters() {
    const diff = $('#difficulty'), search = $('#search'), sort = $('#sort');
    if (diff) diff.addEventListener('change', applyFilters);
    if (search) search.addEventListener('input', applyFilters);
    if (sort) sort.addEventListener('change', applyFilters);
  }

  function applyFilters() {
    const diff = $('#difficulty') ? $('#difficulty').value : 'all';
    const q = $('#search') ? $('#search').value.trim().toLowerCase() : '';
    let results = trails.slice();

    if (diff !== 'all') results = results.filter(t => t.difficulty === diff);
    if (q) results = results.filter(t => (t.name + ' ' + t.desc).toLowerCase().includes(q));

    const sort = $('#sort') ? $('#sort').value : 'default';
    if (sort === 'length-asc') results.sort((a,b)=>parseFloat(a.length)-parseFloat(b.length));
    else if (sort === 'length-desc') results.sort((a,b)=>parseFloat(b.length)-parseFloat(a.length));
    else if (sort === 'difficulty-az') results.sort((a,b)=>a.difficulty.localeCompare(b.difficulty));
    else if (sort === 'name-az') results.sort((a,b)=>a.name.localeCompare(b.name));
    else if (sort === 'name-za') results.sort((a,b)=>b.name.localeCompare(a.name));

    renderCards('#trails-list', results);
  }

  // --- Contact Form ---
  function initContactForm() {
    const form = $('#contactForm');
    if(!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#name').value.trim(),
            email = $('#email').value.trim(),
            message = $('#message').value.trim();
      if(name.length < 2 || !email.includes('@') || message.length < 10) {
        $('#form-result').textContent = 'Please complete the form correctly.';
        return;
      }
      const submissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
      submissions.push({name,email,message,date:new Date().toISOString()});
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
      $('#form-result').textContent = 'Thanks! Your message was saved.';
      form.reset();
    });
  }

  // --- Navigation Toggle ---
  function setupNavToggle() {
    const btn = $('#nav-toggle'), nav = $('#primary-nav');
    if(!btn || !nav) return;
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', e => {
      if(!nav.classList.contains('open')) return;
      if(!nav.contains(e.target) && e.target !== btn){
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', false);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const year = new Date().getFullYear();
    ['#year','#year-2','#year-3'].forEach(id=>{
      const el = $(id);
      if(el) el.textContent = year;
    });
    renderCards('#trails-list', trails);
    renderFavorites();
    initFilters();
    initContactForm();
    setupNavToggle();
  });

})();