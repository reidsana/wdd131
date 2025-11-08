


document.addEventListener('DOMContentLoaded', () => {
  
  const yearEl = document.getElementById('year');
  const lastModEl = document.getElementById('last-modified');

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (lastModEl) lastModEl.textContent = document.lastModified || 'Unknown';

  
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('primary-nav');

  function closeNav(){
    nav.classList.remove('open');
    nav.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation');
    
  }

  function openNav(){
    nav.classList.add('open');
    nav.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation');
  }

  
  if (nav) nav.setAttribute('aria-hidden', 'true');

  if (hamburger){
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.contains('open');
      if (isOpen) closeNav();
      else openNav();
    });

    
    nav?.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a' && window.matchMedia('(max-width:780px)').matches){
        closeNav();
      }
    });

    
    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width:781px)').matches){
        nav.classList.remove('open');
        nav.setAttribute('aria-hidden', 'false');
        hamburger.setAttribute('aria-expanded', 'false');
      } else {
        nav.setAttribute('aria-hidden', 'true');
      }
    });
  }
});

