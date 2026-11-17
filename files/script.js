// Mobile menu
const burger = document.getElementById('burger');
const links = document.getElementById('links');
burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

// Hero video play/pause
const hero = document.getElementById('heroVideo');
const pp = document.getElementById('pp');
pp.addEventListener('click', () => {
  if (hero.paused) { hero.play(); pp.textContent = 'Pause'; }
  else { hero.pause(); pp.textContent = 'Play'; }
});

// Story modal
const modal = document.getElementById('modal');
const story = document.getElementById('storyVideo');
function openModal() { modal.classList.add('open'); hero.pause(); story.play().catch(() => {}); }
function closeModal() { modal.classList.remove('open'); story.pause(); if (pp.textContent === 'Pause') hero.play(); }
document.getElementById('openStory').addEventListener('click', openModal);
document.getElementById('closeModal').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Hide broken images so the green fallback shows
document.querySelectorAll('.img img').forEach(img => {
  img.addEventListener('error', () => { img.style.display = 'none'; });
});

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Metric count-up
const counters = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count, suffix = el.dataset.suffix || '';
    let n = 0; const step = Math.max(1, Math.ceil(end / 40));
    const t = setInterval(() => {
      n = Math.min(end, n + step);
      el.textContent = n + (n === end ? suffix : '');
      if (n === end) clearInterval(t);
    }, 30);
    counters.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => counters.observe(el));

// Form validation
const form = document.getElementById('form');
const err = document.getElementById('err');
const ok = document.getElementById('ok');
form.addEventListener('submit', e => {
  e.preventDefault();
  err.textContent = ''; ok.hidden = true;
  let bad = [];
  form.querySelectorAll('[required]').forEach(f => {
    const empty = !f.value.trim();
    f.classList.toggle('invalid', empty);
    if (empty) bad.push(f.closest('label').firstChild.textContent.trim());
  });
  const c = form.contact.value.trim();
  const valid = /^\S+@\S+\.\S+$/.test(c) || /^\+?[\d\s-]{9,}$/.test(c);
  if (c && !valid) { form.contact.classList.add('invalid'); err.textContent = 'Enter a valid email or WhatsApp number.'; return; }
  if (bad.length) { err.textContent = 'Please fill in: ' + bad.join(', ') + '.'; return; }
  const WHATSAPP = '256701156412'; // Uganda code 256 + number without the leading 0
  const d = new FormData(form);
  const text = [
    'Hello, I would like to request the investor deck.',
    'Name: ' + d.get('name'),
    'Contact: ' + d.get('contact'),
    'Organization / Country: ' + d.get('org'),
    'Interest: ' + d.get('interest'),
    'Message: ' + (d.get('msg') || '-')
  ].join('\n');
  window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  ok.hidden = false;
  form.reset();
});
