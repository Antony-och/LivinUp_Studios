// ============================
// BRAND ASSET / DESIGN TOKENS
// ============================
const LANDMARK = 'img/livingup_logo.png';
const LOGO = 'img/livingup_logo.png';
const TILE = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="144">
  <rect width="120" height="144" fill="#f7f2ee"/>
  <path d="M0 0L120 144M120 0L0 144" stroke="#e8d9cb" stroke-width="4"/>
  <path d="M30 0v144M90 0v144M0 36h120M0 108h120" stroke="#e4d4c3" stroke-width="2"/>
</svg>
`);

document.documentElement.style.setProperty('--tile', 'url(' + TILE + ')');
document.querySelectorAll('[data-logo]').forEach((el) => { el.src = LOGO; });
document.querySelectorAll('[data-mark]').forEach((el) => { el.setAttribute('href', LANDMARK); });
document.querySelectorAll('[data-markimg]').forEach((el) => { el.src = LANDMARK; });

// ============================
// NAVIGATION / MOBILE MENU
// ============================
document.querySelectorAll('.burger').forEach((button) => {
  button.addEventListener('click', () => {
    const navWrap = button.closest('.fnav');
    if (!navWrap) return;
    const open = navWrap.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
});

document.querySelectorAll('.fnav nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const wrap = link.closest('.fnav');
    if (!wrap) return;
    wrap.classList.remove('open');
    const button = wrap.querySelector('.burger');
    if (button) button.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', (event) => {
  const navWrap = event.target.closest('.fnav');
  if (!navWrap) {
    document.querySelectorAll('.fnav').forEach((wrap) => {
      wrap.classList.remove('open');
      const button = wrap.querySelector('.burger');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  }
});

const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.fnav nav a').forEach((link) => {
  const href = (link.getAttribute('href') || '').split('/').pop() || 'index.html';
  const match = href === currentPage || (href === 'index.html' && currentPage === 'index.html');
  if (match) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 860) {
    document.querySelectorAll('.fnav').forEach((wrap) => {
      wrap.classList.remove('open');
      const button = wrap.querySelector('.burger');
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  }
});

// ============================
// CAROUSEL HELPERS
// ============================
function setupCarousel(root, { trackClass, prevSelector, nextSelector, visibleCount, autoplayMs = 4000 }) {
  if (!root) return;

  const track = root.querySelector(trackClass);
  if (!track) return;

  const cards = [...track.children];
  const prev = document.querySelector(prevSelector);
  const next = document.querySelector(nextSelector);
  let index = 0;
  let timer = null;

  const getVisibleCount = () => typeof visibleCount === 'function' ? visibleCount() : visibleCount;

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const play = () => {
    stop();
    if (cards.length > getVisibleCount()) {
      timer = setInterval(() => {
        index = index >= cards.length - getVisibleCount() ? 0 : index + 1;
        update();
      }, autoplayMs);
    }
  };

  const update = () => {
    if (!cards.length) return;
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visible);
    index = Math.min(index, maxIndex);
    const firstCard = cards[0];
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '20');
    const offset = (firstCard.getBoundingClientRect().width + gap) * index;
    track.dataset.index = String(index);
    track.style.transform = `translateX(-${offset}px)`;

    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index >= maxIndex;
  };

  prev?.addEventListener('click', () => {
    index = Math.max(0, index - 1);
    update();
    play();
  });

  next?.addEventListener('click', () => {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visible);
    index = Math.min(maxIndex, index + 1);
    update();
    play();
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', play);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', play);
  window.addEventListener('resize', update);

  update();
  play();
}

const servicesCarousel = document.querySelector('[data-services-carousel]');
setupCarousel(servicesCarousel, {
  trackClass: '.svc-track',
  prevSelector: '.svc-prev',
  nextSelector: '.svc-next',
  visibleCount: () => window.innerWidth <= 640 ? 1 : window.innerWidth <= 980 ? 2 : 3,
  autoplayMs: 3600
});

const HOME_PROJECTS = [
  {
    title: 'First Cup Coffee & Tea',
    category: 'Hospitality',
    blurb: 'Warm, premium storytelling for a coffee and tea brand rooted in craft, ritual, and community.',
    href: 'work.html#project-0',
    image: 'img/firstcup/Coffee%20is%20more%20than%20a%20drink,%20its%20a%20language%20of%20flavour.%20Each%20roast%20speaks%20with%20its%20unique%20aroma,%20(1).jpg'
  },
  {
    title: 'N’jiru BTS shoot',
    category: 'Culture',
    blurb: 'Behind-the-scenes documentation capturing the mood, movement, and craft behind the N’jiru campaign.',
    href: 'work.html#project-1',
    image: 'img/Njiru/BTS%20moments%20from%20my%20perspective%20during%20the%20recce.I%20got%20to%20document%20the%20process%20and%20moments%20that%20%20(1).jpg'
  },
  {
    title: 'Café Content Package',
    category: 'Hospitality',
    blurb: 'A warm, tactile visual system designed for a neighborhood café launch and repeat audience growth.',
    href: 'work.html#project-2',
    image: 'img/firstcup/Coffee%20is%20more%20than%20a%20drink,%20its%20a%20language%20of%20flavour.%20Each%20roast%20speaks%20with%20its%20unique%20aroma,%20(3).jpg'
  },
  {
    title: 'Community Merch Drop',
    category: 'Merch & retail',
    blurb: 'A thoughtful retail launch pairing identity, product capture, and rollout content across channels.',
    href: 'work.html#project-3',
    image: 'img/firstcup/Coffee%20is%20more%20than%20a%20drink,%20its%20a%20language%20of%20flavour.%20Each%20roast%20speaks%20with%20its%20unique%20aroma,%20(4).jpg'
  }
];

function renderHomeProjects() {
  const track = document.querySelector('[data-work-carousel] .work-track');
  if (!track) return;

  track.innerHTML = HOME_PROJECTS.map((project) => `
    <a class="work-card" href="${project.href}">
      <div class="work-visual">
        <img src="${project.image}" alt="${project.title}" loading="lazy">
      </div>
      <div class="work-copy">
        <span>${project.category}</span>
        <h3>${project.title}</h3>
        <p>${project.blurb}</p>
      </div>
    </a>
  `).join('');
}

renderHomeProjects();

const workCarousel = document.querySelector('[data-work-carousel]');
setupCarousel(workCarousel, {
  trackClass: '.work-track',
  prevSelector: '.work-prev',
  nextSelector: '.work-next',
  visibleCount: () => window.innerWidth <= 640 ? 1 : window.innerWidth <= 980 ? 2 : 3,
  autoplayMs: 4200
});

// ============================
// CASE STUDY MODAL
// ============================
const CASE_STUDIES = [
  {
    title: 'First Cup Coffee & Tea',
    category: 'Hospitality',
    year: '2025',
    metric: '+100%',
    metricLabel: 'Guest engagement uplift',
    lead: 'We created a visual identity and content system for a new coffee and tea brand, with photography, film and print assets that helped the business feel established from day one.',
    summary: 'The work focused on creating a premium, location-led visual language that could be applied across web, social and print, with photography and film that highlighted the brand’s story and local roots.',
    outcomes: ['Luxury visual language across web and print', 'Location-led photography direction', 'Guest-facing campaign launch assets'],
    slides: [
      { label: 'Coffee ritual', svg: '<img src="img/firstcup/Coffee%20is%20more%20than%20a%20drink,%20its%20a%20language%20of%20flavour.%20Each%20roast%20speaks%20with%20its%20unique%20aroma,%20(1).jpg" alt="Coffee ritual" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:20px;" />' },
      { label: 'Brew details', svg: '<img src="img/firstcup/Coffee%20is%20more%20than%20a%20drink,%20its%20a%20language%20of%20flavour.%20Each%20roast%20speaks%20with%20its%20unique%20aroma,%20(2).jpg" alt="Brew details" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:20px;" />' },
      { label: 'Brand story', svg: '<img src="img/firstcup/Coffee%20is%20more%20than%20a%20drink,%20its%20a%20language%20of%20flavour.%20Each%20roast%20speaks%20with%20its%20unique%20aroma,%20(3).jpg" alt="Brand story" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:20px;" />' }
    ]
  },
  {
    title: 'N’jiru BTS shoot',
    category: 'Culture',
    year: '2024',
    metric: '5k+',
    metricLabel: 'Reach in 72 hours',
    lead: 'We documented the behind-the-scenes moments, movement and intent of the N’jiru shoot to create a visual story that felt intimate, real and campaign-ready.',
    summary: 'The shoot focused on mood, process and place, translating the lived experience of the production into a narrative set of stills that felt editorial and authentic.',
    outcomes: ['BTS visual storytelling', 'Production mood captures', 'Campaign-ready stills'],
    slides: [
      { label: 'Recce mood', svg: '<img src="img/Njiru/BTS%20moments%20from%20my%20perspective%20during%20the%20recce.I%20got%20to%20document%20the%20process%20and%20moments%20that%20%20(1).jpg" alt="Recce mood" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:20px;" />' },
      { label: 'Set detail', svg: '<img src="img/Njiru/BTS%20moments%20from%20my%20perspective%20during%20the%20recce.I%20got%20to%20document%20the%20process%20and%20moments%20that%20%20(2).jpg" alt="Set detail" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:20px;" />' },
      { label: 'Process frames', svg: '<img src="img/Njiru/BTS%20moments%20from%20my%20perspective%20during%20the%20recce.I%20got%20to%20document%20the%20process%20and%20moments%20that%20%20(3).jpg" alt="Process frames" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:20px;" />' },
      { label: 'Movement', svg: '<img src="img/Njiru/BTS%20moments%20from%20my%20perspective%20during%20the%20recce.I%20got%20to%20document%20the%20process%20and%20moments%20that%20%20(4).jpg" alt="Movement" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:20px;" />' },
      { label: 'Final story', svg: '<img src="img/Njiru/BTS%20moments%20from%20my%20perspective%20during%20the%20recce.I%20got%20to%20document%20the%20process%20and%20moments%20that%20%20(5).jpg" alt="Final story" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:20px;" />' },
      { label: 'Set notes', svg: '<img src="img/Njiru/BTS%20moments%20from%20my%20perspective%20during%20the%20recce.I%20got%20to%20document%20the%20process%20and%20moments%20that%20.jpg" alt="Set notes" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:20px;" />' }
    ]
  },
  {
    title: 'Café content package',
    category: 'Retail',
    year: '2023',
    metric: '3x',
    metricLabel: 'Content output increase',
    lead: 'For a neighbourhood café, we built a repeatable content system with product, crew and interior imagery that kept the brand fresh without feeling staged.',
    summary: 'The work focused on designing a practical publishing rhythm with warm, tactile imagery, so the brand could maintain momentum while staying recognisably local and authentic.',
    outcomes: ['Social content calendar', 'Interior visual refresh', 'Staff portrait package'],
    slides: [
      { label: 'Café interiors', svg: '<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="600" fill="#f1eae0"/><rect x="0" y="420" width="800" height="180" fill="#5e4430"/><rect x="130" y="160" width="220" height="180" fill="#c9a37a"/><rect x="430" y="170" width="220" height="170" fill="#f5efe8"/><path d="M120 420H680" stroke="#17120e" stroke-width="16"/><circle cx="580" cy="200" r="54" fill="#efb91f"/></svg>' },
      { label: 'Product detail', svg: '<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="600" fill="#f5efe3"/><ellipse cx="360" cy="420" rx="250" ry="58" fill="#e8e2d8"/><path d="M260 200H480L450 440H290Z" fill="#b28a64"/><path d="M260 200H480L470 240H270Z" fill="#f6f1eb"/><path d="M330 160Q360 120 390 160" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/></svg>' },
      { label: 'Social series', svg: '<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="600" fill="#efe7d7"/><rect x="110" y="100" width="240" height="300" fill="#7a4b3c"/><rect x="410" y="150" width="260" height="240" fill="#f0d398"/><circle cx="230" cy="220" r="70" fill="#c9a37a"/><path d="M490 380L600 220L650 380Z" fill="#17120e" opacity=".9"/></svg>' }
    ]
  },
  {
    title: 'Community merch drop',
    category: 'Experiences',
    year: '2023',
    metric: '87%',
    metricLabel: 'Merch sell-through',
    lead: 'We designed and photographed a small merch range with local makers, creating an identity that could carry the story into tote bags, tees and print promos.',
    summary: 'The merchandising system was built to feel premium while remaining accessible and rooted in local craft, with product photography and packaging that told a clear story at a glance.',
    outcomes: ['Product photography system', 'Packaging direction', 'Retail-ready launch assets'],
    slides: [
      { label: 'Merch line', svg: '<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="600" fill="#d2c3ad"/><rect x="110" y="120" width="200" height="320" rx="18" fill="#17120e"/><rect x="340" y="70" width="260" height="380" rx="18" fill="#efb91f"/><path d="M180 170L260 90L330 170V410H180Z" fill="#edeee8" opacity=".9"/><path d="M420 120H560L600 410H380Z" fill="#fff" opacity=".8"/></svg>' },
      { label: 'Packaging detail', svg: '<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="600" fill="#f4f1ea"/><rect x="180" y="150" width="440" height="260" fill="#fff"/><rect x="240" y="210" width="140" height="150" fill="#8b7a63"/><rect x="420" y="210" width="120" height="150" fill="#17120e"/><path d="M260 420H550" stroke="#17120e" stroke-width="12"/><circle cx="300" cy="245" r="45" fill="#efb91f"/></svg>' },
      { label: 'Retail rollout', svg: '<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="600" fill="#8b7a63"/><rect x="80" y="120" width="640" height="300" fill="#f3d9a5" opacity=".8"/><rect x="150" y="170" width="220" height="200" fill="#17120e"/><rect x="430" y="170" width="220" height="200" fill="#fff"/><path d="M230 440H570" stroke="#17120e" stroke-width="16"/><circle cx="490" cy="230" r="52" fill="#efb91f"/></svg>' }
    ]
  }
];

const caseStudyModal = document.getElementById('case-study-modal');
const caseStudyContent = document.getElementById('case-study-content');
const caseStudyStage = document.getElementById('case-slide-stage');
const caseStudyDots = document.getElementById('case-slide-dots');
const caseStudyShell = document.querySelector('#case-study-modal .case-modal-shell');
if (caseStudyModal) {
  caseStudyModal.style.width = 'min(92vw, 760px)';
  caseStudyModal.style.maxWidth = '92vw';
}
if (caseStudyShell) {
  caseStudyShell.style.width = 'min(92vw, 760px)';
}
let caseStudyCurrent = 0;
let caseStudySlideIndex = 0;

function renderCaseStudy(study, slideIndex) {
  if (!study || !caseStudyContent || !caseStudyStage || !caseStudyDots) return;

  caseStudySlideIndex = slideIndex;
  const slide = study.slides[slideIndex];

  caseStudyContent.innerHTML = `
    <span class="eyebrow">${study.category}</span>
    <h3 id="case-study-title">${study.title}</h3>
    <div class="meta-row">
      <span>${study.year}</span>
      <span>${study.category}</span>
    </div>
    <p>${study.lead}</p>
    <p>${study.summary}</p>
    <ul>
      ${study.outcomes.map((outcome) => `<li>${outcome}</li>`).join('')}
    </ul>
    <div class="results">
      <strong>${study.metric}</strong>
      <small>${study.metricLabel}</small>
    </div>
  `;

  caseStudyStage.innerHTML = slide.svg;

  caseStudyDots.innerHTML = study.slides.map((item, idx) => `
    <button type="button" class="${idx === slideIndex ? 'active' : ''}" data-slide-index="${idx}" aria-label="View ${item.label}" aria-current="${idx === slideIndex ? 'true' : 'false'}"></button>
  `).join('');

  caseStudyDots.querySelectorAll('button').forEach((dot) => {
    dot.addEventListener('click', () => {
      const nextIndex = Number(dot.dataset.slideIndex);
      renderCaseStudy(study, nextIndex);
    });
  });
}

function openCaseStudy(index) {
  if (!caseStudyModal || !CASE_STUDIES[index]) return;
  caseStudyCurrent = index;
  renderCaseStudy(CASE_STUDIES[index], 0);
  caseStudyModal.showModal();
}

function navigateCaseSlide(direction) {
  const study = CASE_STUDIES[caseStudyCurrent];
  if (!study) return;
  const nextIndex = (caseStudySlideIndex + direction + study.slides.length) % study.slides.length;
  renderCaseStudy(study, nextIndex);
}

const projectCaseButtons = () => [...document.querySelectorAll('.project-item, a.project-item')];
projectCaseButtons().forEach((button) => {
  button.addEventListener('click', (event) => {
    const projectIndex = Number(button.dataset.caseStudy ?? button.getAttribute('data-case-study'));
    if (!Number.isNaN(projectIndex)) {
      event.preventDefault();
      openCaseStudy(projectIndex);
    }
  });
});

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('.project-item, a.project-item');
  if (!trigger) return;
  const projectIndex = Number(trigger.dataset.caseStudy ?? trigger.getAttribute('data-case-study'));
  if (!Number.isNaN(projectIndex)) {
    event.preventDefault();
    openCaseStudy(projectIndex);
  }
});

if (window.location.hash.startsWith('#project-')) {
  const hashIndex = Number(window.location.hash.replace('#project-', ''));
  if (!Number.isNaN(hashIndex)) {
    window.addEventListener('load', () => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => openCaseStudy(hashIndex), 120);
    }, { once: true });
  }
}

document.getElementById('case-study-close')?.addEventListener('click', () => caseStudyModal?.close());
document.getElementById('case-study-prev')?.addEventListener('click', () => navigateCaseSlide(-1));
document.getElementById('case-study-next')?.addEventListener('click', () => navigateCaseSlide(1));
caseStudyModal?.addEventListener('click', (event) => {
  if (event.target === caseStudyModal) caseStudyModal.close();
});
caseStudyModal?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') navigateCaseSlide(-1);
  if (event.key === 'ArrowRight') navigateCaseSlide(1);
});

// ============================
// GALLERY DATA / LIGHTBOX
// ============================
const firstCupShots = [
  'img/firstcup/Coffee%20is%20more%20than%20a%20drink,%20its%20a%20language%20of%20flavour.%20Each%20roast%20speaks%20with%20its%20unique%20aroma,%20(1).jpg',
  'img/firstcup/Coffee%20is%20more%20than%20a%20drink,%20its%20a%20language%20of%20flavour.%20Each%20roast%20speaks%20with%20its%20unique%20aroma,%20(2).jpg',
  'img/firstcup/Coffee%20is%20more%20than%20a%20drink,%20its%20a%20language%20of%20flavour.%20Each%20roast%20speaks%20with%20its%20unique%20aroma,%20(3).jpg',
  'img/firstcup/Coffee%20is%20more%20than%20a%20drink,%20its%20a%20language%20of%20flavour.%20Each%20roast%20speaks%20with%20its%20unique%20aroma,%20(4).jpg',
  'img/firstcup/Coffee%20is%20more%20than%20a%20drink,%20its%20a%20language%20of%20flavour.%20Each%20roast%20speaks%20with%20its%20unique%20aroma,.jpg'
];
const njiruShots = [
  'img/Njiru/BTS%20moments%20from%20my%20perspective%20during%20the%20recce.I%20got%20to%20document%20the%20process%20and%20moments%20that%20%20(1).jpg',
  'img/Njiru/BTS%20moments%20from%20my%20perspective%20during%20the%20recce.I%20got%20to%20document%20the%20process%20and%20moments%20that%20%20(2).jpg',
  'img/Njiru/BTS%20moments%20from%20my%20perspective%20during%20the%20recce.I%20got%20to%20document%20the%20process%20and%20moments%20that%20%20(3).jpg',
  'img/Njiru/BTS%20moments%20from%20my%20perspective%20during%20the%20recce.I%20got%20to%20document%20the%20process%20and%20moments%20that%20%20(4).jpg',
  'img/Njiru/BTS%20moments%20from%20my%20perspective%20during%20the%20recce.I%20got%20to%20document%20the%20process%20and%20moments%20that%20%20(5).jpg',
  'img/Njiru/BTS%20moments%20from%20my%20perspective%20during%20the%20recce.I%20got%20to%20document%20the%20process%20and%20moments%20that%20.jpg'
];

const G = [
  { title: 'First Cup Coffee & Tea', category: 'Photography', colors: ['#ee3524', '#efb91f'], shots: firstCupShots },
  { title: 'N’jiru BTS shoot', category: 'Film', colors: ['#2b2a74', '#efb91f'], shots: njiruShots }
];

const shape = (type) => type === 'Film'
  ? '<path d="M38 28 74 50 38 72z" fill="#fff"/>'
  : '<circle cx="50" cy="50" r="24" fill="#17120e" opacity=".8"/><circle cx="50" cy="50" r="11" fill="#fff"/>';
const art = (item) => `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${item.title}"><rect width="100" height="100" fill="${item.colors[0]}"/><path d="M0 100 100 0v40L40 100z" fill="${item.colors[1]}" opacity=".85"/>${shape(item.category)}</svg>`;

const gallery = document.getElementById('gal');
if (gallery) {
  let currentFilter = 'All';
  let list = [];
  let activeIndex = 0;
  let activeShotIndex = 0;
  const filterBar = document.getElementById('filt');
  const countText = document.getElementById('gc');
  const lightbox = document.getElementById('lb');
  const lightboxContent = document.getElementById('lbc');
  const lightboxIndex = document.getElementById('lbi');

  const categories = ['All', ...new Set(G.map((item) => item.category))];

  const draw = () => {
    filterBar.innerHTML = categories.map((type) =>
      `<button type="button" aria-pressed="${type === currentFilter}">${type}</button>`
    ).join('');

    list = G.map((g, i) => ({ g, i })).filter((entry) => currentFilter === 'All' || entry.g.category === currentFilter);
    gallery.innerHTML = list.map((entry, k) => `
      <button type="button" data-k="${k}" style="animation-delay:${k * 40}ms">
        <img src="${entry.g.shots[0]}" alt="${entry.g.title}" loading="lazy" />
        <span><b>${entry.g.title}</b>${entry.g.category}</span>
      </button>
    `).join('');

    if (countText) countText.textContent = `${list.length} sets`;
  };

  const show = (index, shotIndex = 0) => {
    if (!list.length) return;
    activeIndex = (index + list.length) % list.length;
    const item = list[activeIndex].g;
    const shots = item.shots || [item.image];
    activeShotIndex = ((shotIndex % shots.length) + shots.length) % shots.length;

    if (lightboxContent) {
      lightboxContent.innerHTML = `
        <div class="gallery-lightbox">
          <div class="gallery-stage">
            ${shots.map((src, idx) => `
              <div class="gallery-slide ${idx === activeShotIndex ? 'is-active' : ''}">
                <img src="${src}" alt="${item.title} shot ${idx + 1}" loading="eager" />
              </div>
            `).join('')}
          </div>
          <div class="gallery-meta-row">
            <button class="btn w2" type="button" data-lightbox-prev="true">Previous</button>
            <span>${activeShotIndex + 1} / ${shots.length}</span>
            <button class="btn w2" type="button" data-lightbox-next="true">Next</button>
          </div>
          <div class="gallery-caption">
            <h3>${item.title}</h3>
            <p>${item.category} set from a recent Livin Up campaign, shown here as a multi-image story sequence.</p>
          </div>
        </div>
      `;

      lightboxContent.querySelector('[data-lightbox-prev]').addEventListener('click', () => show(activeIndex, activeShotIndex - 1));
      lightboxContent.querySelector('[data-lightbox-next]').addEventListener('click', () => show(activeIndex, activeShotIndex + 1));
    }

    if (lightboxIndex) lightboxIndex.textContent = `${activeIndex + 1} of ${list.length}`;
  };

  filterBar.addEventListener('click', (event) => {
    const btn = event.target.closest('button');
    if (!btn) return;
    currentFilter = btn.textContent.trim();
    draw();
    const selected = [...filterBar.children].find((b) => b.textContent.trim() === currentFilter);
    selected?.focus();
  });

  gallery.addEventListener('click', (event) => {
    const btn = event.target.closest('button');
    if (!btn) return;
    show(Number(btn.dataset.k));
    if (lightbox) lightbox.showModal();
  });

  document.getElementById('lbp')?.addEventListener('click', () => show(activeIndex, activeShotIndex - 1));
  document.getElementById('lbnx')?.addEventListener('click', () => show(activeIndex, activeShotIndex + 1));
  document.getElementById('lbx')?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(activeIndex, activeShotIndex - 1);
    if (event.key === 'ArrowRight') show(activeIndex, activeShotIndex + 1);
  });
  draw();
}

// ============================
// HERO SLIDESHOW
// ============================
const hero = document.querySelector('.hero');
if (hero) {
  const slides = [...hero.querySelectorAll('.slide')];
  const previousButton = hero.querySelector('[data-p]');
  const nextButton = hero.querySelector('[data-n]');
  const pauseButton = hero.querySelector('.pz');
  let currentSlide = 0;
  let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = null;

  const goToSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, idx) => {
      slide.classList.toggle('on', idx === currentSlide);
      slide.setAttribute('aria-hidden', String(idx !== currentSlide));
    });
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const play = () => {
    stop();
    if (!paused && !hero.hidden) {
      timer = setInterval(() => goToSlide(currentSlide + 1), 5500);
    }
  };

  const updatePauseButton = () => {
    if (!pauseButton) return;
    pauseButton.innerHTML = paused ? '&#9654;' : '&#10074;&#10074;';
    pauseButton.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
  };

  goToSlide(0);
  updatePauseButton();
  play();

  previousButton?.addEventListener('click', () => { goToSlide(currentSlide - 1); play(); });
  nextButton?.addEventListener('click', () => { goToSlide(currentSlide + 1); play(); });
  pauseButton?.addEventListener('click', () => {
    paused = !paused;
    updatePauseButton();
    play();
  });
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', play);
  hero.addEventListener('focusin', stop);
  hero.addEventListener('focusout', play);
}

// ============================
// CONTACT FORM VALIDATION
// ============================
const contactForm = document.getElementById('cf');
if (contactForm) {
  const setError = (input, show) => {
    input.setAttribute('aria-invalid', String(show));
    const error = input.parentNode.querySelector('.er');
    if (error) error.hidden = !show;
  };

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = [contactForm.n, contactForm.e, contactForm.m];
    let firstInvalid = null;

    fields.forEach((field) => {
      const isEmail = field === contactForm.e;
      const value = field.value.trim();
      const valid = Boolean(value) && (!isEmail || /^\S+@\S+\.\S+$/.test(value));
      setError(field, !valid);
      if (!valid && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const services = [...contactForm.querySelectorAll('[name="s"]:checked')].map((input) => input.value).join(', ') || 'Not sure yet';
    const mailBody = [
      'Name: ' + contactForm.n.value,
      'Email: ' + contactForm.e.value,
      'Organisation: ' + (contactForm.o.value || '-'),
      'Phone: ' + (contactForm.p.value || '-'),
      'Needs: ' + services,
      'Budget: ' + contactForm.b.value,
      'Timing: ' + contactForm.w.value,
      '',
      'Project:',
      contactForm.m.value
    ].join('\n');

    const mailLink = document.getElementById('mt');
    if (mailLink) {
      mailLink.href = 'mailto:hello@livinup.com?subject=' + encodeURIComponent('New project: ' + contactForm.n.value) + '&body=' + encodeURIComponent(mailBody);
    }

    const contactContainer = document.getElementById('ct');
    const success = document.getElementById('ok');
    if (contactContainer) contactContainer.hidden = true;
    if (success) success.hidden = false;
  });

  document.getElementById('ed')?.addEventListener('click', () => {
    const contactContainer = document.getElementById('ct');
    const success = document.getElementById('ok');
    if (contactContainer) contactContainer.hidden = false;
    if (success) success.hidden = true;
  });

  document.querySelector('.cp')?.addEventListener('click', async function () {
    try {
      await navigator.clipboard.writeText('hello@livinup.com');
      this.textContent = 'Copied';
    } catch (error) {
      this.textContent = 'hello@livinup.com';
    }
  });
}

const team = document.getElementById('team');
if (team) {
  const TEAM = [
    ['Name Surname', 'Lead photographer', '#efb91f'],
    ['Name Surname', 'Filmmaker', '#6abf69'],
    ['Name Surname', 'Designer', '#2b2a74'],
    ['Name Surname', 'Producer', '#ee3524']
  ];
  team.innerHTML = TEAM.map((member) => `
    <figure>
      <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Placeholder portrait">
        <rect width="100" height="120" fill="${member[2]}"/>
        <path d="M0 120 50 60 100 120z" fill="#17120e" opacity=".12"/>
        <circle cx="50" cy="48" r="20" fill="#5a3b2e"/>
        <path d="M14 120q4-42 36-46 32 4 36 46z" fill="#7a1020"/>
      </svg>
      <figcaption><b>${member[0]}</b>${member[1]}</figcaption>
    </figure>
  `).join('');
}

const projectCards = document.getElementById('wr');
if (projectCards && !projectCards.querySelector('.project-item')) {
  const projects = [
    {
      title: 'First Cup Coffee & Tea',
      blurb: 'First Cup Coffee & Tea needed a brand identity that reflected their commitment to quality and community. We created a visual system that balanced warmth, authenticity, and modernity.',
      detail: 'Read the case study',
      image: 'img/firstcup/Coffee%20is%20more%20than%20a%20drink,%20its%20a%20language%20of%20flavour.%20Each%20roast%20speaks%20with%20its%20unique%20aroma,%20(1).jpg'
    },
    {
      title: 'N’jiru BTS shoot',
      blurb: 'A behind-the-scenes documentation of the N’jiru shoot, capturing movement, mood and the process behind the final campaign.',
      detail: 'Read the case study',
      image: 'img/Njiru/BTS%20moments%20from%20my%20perspective%20during%20the%20recce.I%20got%20to%20document%20the%20process%20and%20moments%20that%20%20(1).jpg'
    },
    { title: 'Café content package', blurb: 'A café wanted steady content for social media without stock images or staged models.', detail: 'Read the case study' },
    { title: 'Community merch drop', blurb: 'A community group wanted merchandise that carried its identity and paid local makers.', detail: 'Read the case study' }
  ];
  projectCards.innerHTML = projects.map((project) => `
    <a class="project-item" href="work.html">
      <div class="mini-placeholder">
        <img src="${project.image || 'img/firstcup/Coffee%20is%20more%20than%20a%20drink,%20its%20a%20language%20of%20flavour.%20Each%20roast%20speaks%20with%20its%20unique%20aroma,%20(1).jpg'}" alt="${project.title}" loading="eager" style="width:100%;height:100%;object-fit:cover;display:block;">
      </div>
      <div>
        <h3>${project.title}</h3>
        <p>${project.blurb}</p>
        <b>${project.detail}</b>
      </div>
    </a>
  `).join('');
}
