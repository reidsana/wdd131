(function () {


const trails = [
  {
    id: 't1',
    name: 'Ridgeway Loop',
    difficulty: 'moderate',
    length: '6.2 mi',
    img: 'images/trail1-small.jpg',
    desc: 'A scenic ridge walk with panoramic views.'
  },
  {
    id: 't2',
    name: 'Creekside Path',
    difficulty: 'easy',
    length: '2.1 mi',
    img: 'images/trail2-small.jpg',
    desc: 'Flat and family-friendly path along a creek.'
  },
  {
    id: 't3',
    name: 'Summit Climb',
    difficulty: 'hard',
    length: '8.4 mi',
    img: 'images/trail3-small.jpg',
    desc: 'Steep ascent to the summit; rewarding views.'
  }
];


// ---------- Helpers ----------
function $(selector) { return document.querySelector(selector); }
function $all(selector) { return Array.from(document.querySelectorAll(selector)); }


// ---------- Generate Trail Cards ----------
function renderCards(containerSelector, items) {
  const container = $(containerSelector);
  if (!container) return;
  container.innerHTML = items.map(item => trailCardHTML(item)).join('');
  activateButtons(container);
  observeLazyImages(container);
}

function trailCardHTML(trail) {
  return `
    <article class="card" data-id="${trail.id}" aria-labelledby="${trail.id}-title">
      <img data-src="${trail.img}" alt="${trail.name} photo"
           class="lazy" loading="lazy">
      <h3 id="${trail.id}-title">${trail.name}</h3>
      <p>${trail.desc}</p>
      <p><strong>${trail.length}</strong> — ${trail.difficulty}</p>

      <div class="btn-row">
        <button class="btn save" data-id="${trail.id}">Save</button>
        <button class="btn details" data-id="${trail.id}">Details</button>
      </div>
    </article>
  `;
}


// ---------- Events (Save + Details) ----------
function activateButtons(container) {
  container.querySelectorAll('.save').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleFavorite(btn.dataset.id);
      renderFavorites();
    });
  });

  container.querySelectorAll('.details').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const t = trails.find(x => x.id === id);
      if (t) {
        alert(`${t.name}\n\n${t.desc}\nLength: ${t.length}\nDifficulty: ${t.difficulty}`);
      }
    });
  });
}


// ---------- Favorites / LocalStorage ----------
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem('favorites', JSON.stringify(list));
}

function toggleFavorite(id) {
  const favs = getFavorites();
  if (favs.includes(id)) {
    saveFavorites(favs.filter(x => x !== id));
  } else {
    favs.push(id);
    saveFavorites(favs);
  }
}

function renderFavorites() {
  const favEl = $('#favorites');
  if (!favEl) return;

  const favIds = getFavorites();
  const favItems = favIds.map(id => trails.find(t => t.id === id)).filter(Boolean);

  if (favItems.length === 0) {
    favEl.innerHTML = '<p>No saved trails yet.</p>';
    return;
  }

  favEl.innerHTML = favItems.map(trail => trailCardHTML(trail)).join('');
  activateButtons(favEl);
  observeLazyImages(favEl);
}


// ---------- Filters + Search ----------
function initFilters() {
  const d = $('#difficulty');
  const s = $('#search');

  if (d) d.addEventListener('change', applyFilters);
  if (s) s.addEventListener('input', applyFilters);
}

function applyFilters() {
  const diff = $('#difficulty') ? $('#difficulty').value : 'all';
  const q = $('#search') ? $('#search').value.trim().toLowerCase() : '';

  let results = trails.slice();

  if (diff !== 'all') {
    results = results.filter(t => t.difficulty === diff);
  }

  if (q) {
    results = results.filter(t =>
      (t.name + " " + t.desc).toLowerCase().includes(q)
    );
  }

  renderCards('#trails-list', results);
}


// ---------- Lazy Loading ----------
function observeLazyImages(scope = document) {
  const imgs = scope.querySelectorAll('img.lazy');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '60px' });

    imgs.forEach(i => io.observe(i));

  } else {
    imgs.forEach(i => i.src = i.dataset.src);
  }
}



function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();

    if (name.length < 2 || !email.includes('@') || message.length < 10) {
      $('#form-result').textContent = 'Please complete the form correctly.';
      return;
    }

    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    submissions.push({ name, email, message, date: new Date().toISOString() });
    localStorage.setItem('submissions', JSON.stringify(submissions));

    $('#form-result').textContent = 'Thanks! Your message was saved.';
    form.reset();
  });
}



document.addEventListener('DOMContentLoaded', () => {

  
  const y = new Date().getFullYear();
  ['#year', '#year-2', '#year-3'].forEach(id => {
    const el = document.querySelector(id);
    if (el) el.textContent = y;
  });

  renderCards('#featured-container', trails.slice(0, 2));
  renderCards('#trails-list', trails);
  renderFavorites();


  initFilters();
  initContactForm();

  
  document.body.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') document.body.classList.add('show-focus');
  });

});

})();
