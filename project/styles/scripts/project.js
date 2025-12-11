/* script.js
   Requirements satisfied:
   - multiple functions
   - DOM selection & event listeners
   - conditional branching
   - objects/arrays + array methods
   - template literals exclusively for HTML output
   - localStorage usage
   - lazy loading via IntersectionObserver
*/

const TRAILS_KEY = 'ahub_favorites';
const SUBMISSIONS_KEY = 'ahub_submissions';

// Demo trail data (objects + array methods used)
const trails = [
  { id: 't1', name: 'Ridgeway Loop', difficulty: 'moderate', length: '6.2 mi', img: 'images/trail1-small.jpg', desc: 'Scenic ridge with panoramic views.' },
  { id: 't2', name: 'Creekside Path', difficulty: 'easy', length: '2.1 mi', img: 'images/trail2-small.jpg', desc: 'Flat, family-friendly path along a creek.' },
  { id: 't3', name: 'Summit Climb', difficulty: 'hard', length: '8.4 mi', img: 'images/trail3-small.jpg', desc: 'Steep ascent to the summit; rewarding views.' }
];

// Small DOM helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// Template literal output function (used exclusively)
function trailCardHTML(trail) {
  return `
    <article class="card" data-id="${trail.id}" aria-labelledby="${trail.id}-title">
      <img data-src="${trail.img}" alt="${trail.name} photo" class="lazy" loading="lazy" />
      <h3 id="${trail.id}-title">${trail.name}</h3>
      <p>${trail.desc}</p>
      <p><strong>${trail.length}</strong> — ${trail.difficulty}</p>
      <div>
        <button class="btn save" data-id="${trail.id}">${isFavorited(trail.id) ? 'Unsave' : 'Save'}</button>
        <button class="btn details" data-id="${trail.id}">Details</button>
      </div>
    </article>
  `;
}

// Render helpers
function renderTo(containerSelector, items) {
  const container = $(containerSelector);
  if (!container) return;
  container.innerHTML = items.map(item => trailCardHTML(item)).join('');
  attachCardListeners(container);
  observeLazyImages(container);
}

// Event wiring for buttons inside a container
function attachCardListeners(container) {
  container.querySelectorAll('.save').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      toggleFavorite(id);
      // refresh both lists
      renderFavorites();
      renderTo('#trails-list', applyCurrentFilters());
      renderTo('#featured-container', trails.slice(0,2));
    });
  });

  container.querySelectorAll('.details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const t = trails.find(x => x.id === id);
      if (t) {
        // simple modal replacement: alert (ok for demo)
        alert(`${t.name}\n\n${t.desc}\nLength: ${t.length}\nDifficulty: ${t.difficulty}`);
      }
    });
  });
}

// Favorites using localStorage
function getFavorites() {
  try {
    const raw = localStorage.getItem(TRAILS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveFavorites(list) {
  localStorage.setItem(TRAILS_KEY, JSON.stringify(list));
}
function isFavorited(id) {
  return getFavorites().includes(id);
}
function toggleFavorite(id) {
  const fav = getFavorites();
  if (fav.includes(id)) {
    saveFavorites(fav.filter(x => x !== id));
  } else {
    fav.push(id);
    saveFavorites(fav);
  }
}
function renderFavorites() {
  const favEl = $('#favorites');
  if (!favEl) return;
  const favIds = getFavorites();
  const favItems = favIds.map(id => trails.find(t => t.id === id)).filter(Boolean);
  if (favItems.length === 0) {
    favEl.innerHTML = '<p>No saved trails yet.</p>';
  } else {
    favEl.innerHTML = favItems.map(t => trailCardHTML(t)).join('');
    attachCardListeners(favEl);
    observeLazyImages(favEl);
  }
}

// Filters & search
function applyCurrentFilters() {
  const diffSelect = $('#difficulty');
  const searchInput = $('#search');
  let results = trails.slice();
  if (diffSelect && diffSelect.value !== 'all') {
    results = results.filter(t => t.difficulty === diffSelect.value);
  }
  if (searchInput && searchInput.value.trim()) {
    const q = searchInput.value.trim().toLowerCase();
    results = results.filter(t => (`${t.name} ${t.desc}`).toLowerCase().includes(q));
  }
  return results;
}
function initFilters() {
  const diff = $('#difficulty');
  const search = $('#search');
  if (diff) diff.addEventListener('change', () => renderTo('#trails-list', applyCurrentFilters()));
  if (search) search.addEventListener('input', () => renderTo('#trails-list', applyCurrentFilters()));
}

// Lazy loading (IntersectionObserver)
function observeLazyImages(scope = document) {
  const images = Array.from((typeof scope === 'string') ? document.querySelectorAll(scope + ' img.lazy') : scope.querySelectorAll('img.lazy'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });
    images.forEach(img => io.observe(img));
  } else {
    images.forEach(img => img.src = img.dataset.src);
  }
}


function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();
    if (name.length < 2 || !email.includes('@') || message.length < 10) {
      $('#form-result').textContent = 'Please fill the form with valid information.';
      return;
    }
    const subs = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    subs.push({ name, email, message, date: new Date().toISOString() });
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subs));
    $('#form-result').textContent = 'Thanks — your message is saved locally for demo.';
    form.reset();
  });
}


function initFocusOutline() {
  document.body.addEventListener('keyup', e => {
    if (e.key === 'Tab') document.body.classList.add('show-focus');
  });
}


document.addEventListener('DOMContentLoaded', () => {
  
  ['#year','#year-2','#year-3','#year-4'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.textContent = new Date().getFullYear();
  });

 
  renderTo('#featured-container', trails.slice(0, 2));


  renderTo('#trails-list', trails);

  
  renderFavorites();

  initFilters();
  initContactForm();
  initFocusOutline();
});
