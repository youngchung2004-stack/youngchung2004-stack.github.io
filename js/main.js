/* ============================================
   CUSTOM CURSOR
   ============================================ */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (cursorDot && cursorRing) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  const targets = 'a, button, .project-card, .gallery-item, .filter-tab, .skill-block, .footer-cta, .contact-card';
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });

  document.addEventListener('mousedown', () => cursorRing.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cursorRing.classList.remove('clicking'));
}

/* ============================================
   NAV SCROLL + MOBILE TOGGLE
   ============================================ */
const nav       = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 10
      ? 'rgba(253,246,227,0.13)'
      : 'transparent';
  }, { passive: true });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity   = open ? '0' : '';
    spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });
}

// Mobile: tap PORTFOLIO to expand dropdown
document.querySelectorAll('.nav-item').forEach(item => {
  const link     = item.querySelector('.nav-link');
  const dropdown = item.querySelector('.nav-dropdown');
  if (!dropdown || window.innerWidth > 768) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    item.classList.toggle('dropdown-open');
  });
});

/* ============================================
   SCROLL REVEAL
   ============================================ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ============================================
   FULL-IMAGE OVERLAY (modal image lightbox)
   ============================================ */
function openFullImage(src) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(10,10,10,.97);z-index:500;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
  const img = document.createElement('img');
  img.src = src;
  img.alt = '';
  img.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;pointer-events:none;';
  overlay.appendChild(img);
  const close = () => { overlay.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

/* ============================================
   PROJECT DATA
   ============================================ */
const projects = [
  {
    id: 'bhakti-chai',
    title: 'Bhakti Chai',
    subtitle: 'Growing Gen Z Brand Awareness',
    category: 'projects',
    categoryLabel: 'Class Project',
    date: 'APR 2026',
    description: 'A strategic campaign to expand Bhakti Chai\'s presence into East Coast urban and college markets by positioning it as a functional wellness beverage for Gen Z. Execution focused on a multi-city college ambassador tour and heavy social media engagement.',
    skills: ['Media Planning', 'Campaign Structuring', 'Experiential Marketing', 'Strategic Timeline Management', 'Social Media Strategy', 'TikTok / Instagram'],
    bullets: null,
    screenshots: ['images/projects/bhakti-chai/screenshot-1.png','images/projects/bhakti-chai/screenshot-2.png','images/projects/bhakti-chai/screenshot-3.png','images/projects/bhakti-chai/screenshot-4.png']
  },
  {
    id: 'ups-store',
    title: 'The UPS Store',
    subtitle: 'Helping Small Businesses Do the Hard Things',
    category: 'projects',
    categoryLabel: 'Class Project',
    date: 'DEC 2024',
    description: 'A creative platform bridging The UPS Store and Gen Z small business owners. Introduced the "Box Buddies" concept for a more interactive brand experience, alongside "Build-A-PR Box" and influencer collaborations.',
    skills: ['Creative Strategy', 'Consumer Insight Research', 'Presentation Delivery', 'Figma', 'Social Media Content Strategy'],
    bullets: null,
    screenshots: ['images/projects/ups-store/screenshot-1.png','images/projects/ups-store/screenshot-2.png','images/projects/ups-store/screenshot-3.png','images/projects/ups-store/screenshot-4.png','images/projects/ups-store/screenshot-5.png','images/projects/ups-store/screenshot-6.png']
  },
  {
    id: 'matcha-brand',
    title: 'Matcha Brand Website',
    subtitle: 'Personal Brand Concept',
    category: 'projects',
    categoryLabel: 'Figma / UI Design',
    date: 'SUM 2025',
    description: 'A comprehensive website layout for a fictional matcha brand focused on creating a clean, aesthetic UI that reflects the wellness and ritual aspects of the product.',
    skills: ['UI/UX Design (Figma)', 'Visual Branding', 'E-commerce Layout Design', 'Prototyping'],
    bullets: null,
    screenshots: ['images/projects/matcha-brand/screenshot-1.png','images/projects/matcha-brand/screenshot-2.png','images/projects/matcha-brand/screenshot-3.png']
  },
  {
    id: 'women-in-fashion',
    title: 'Women in Fashion',
    subtitle: 'Academic Figma Assignment',
    category: 'projects',
    categoryLabel: 'Figma / UI Design',
    date: 'WIN 2024',
    description: 'An interactive digital autobiography of Coco Chanel, Rei Kawakubo, Vivienne Westwood, and Miuccia Prada — exploring their historical impact through curated visual narrative.',
    skills: ['UI/UX Design (Figma)', 'Content Curation', 'Educational Layout Design', 'Storytelling'],
    bullets: null,
    screenshots: ['images/projects/women-in-fashion/screenshot-1.png','images/projects/women-in-fashion/screenshot-2.png']
  },
  {
    id: 'house-of-hur',
    title: 'House of Hur',
    subtitle: 'Marketing Intern · Seoul, South Korea',
    category: 'internship',
    categoryLabel: 'Internship',
    date: 'OCT 2025',
    description: 'Led end-to-end influencer campaigns and built operational systems that increased visibility and reduced redundancy across the marketing team at a Seoul-based beauty brand.',
    skills: ['Influencer Marketing', 'Modash', 'Google Sheets', 'TikTok Production', 'Creator Relations', 'Campaign Operations'],
    bullets: [
      'Led end-to-end influencer campaign workflow (sourcing, contracting, briefs, content review, tracking) for multiple product pushes, coordinating creators across time zones.',
      'Built a Modash + Sheets tracker to manage creator status, contracts, shipping, and posting deadlines; reduced duplicate outreach and made campaign status visible to stakeholders.',
      'Drafted standardized creator briefs and review checklists aligned to product claims and brand voice.',
      'Negotiated paid and gifting terms with micro-influencers (up to 100K followers), building long-term relationships through email campaigns.',
      'Planned, filmed, and published TikTok assets for product launches; tested hooks/CTAs and documented learnings for future campaigns.'
    ],
    screenshots: ['images/projects/house-of-hur/detail.webp']
  },
  {
    id: 'bilin-technology',
    title: 'Bilin Technology',
    subtitle: 'Sales & Marketing Associate Intern · Remote',
    category: 'internship',
    categoryLabel: 'Internship',
    date: 'JUN 2024',
    description: 'Executed data-driven B2B campaigns and managed paid media strategies that generated measurable growth in qualified leads and reduced cost-per-lead.',
    skills: ['HubSpot', 'Paid Media', 'B2B Marketing', 'A/B Testing', 'Excel Analytics', 'Lead Nurturing'],
    bullets: [
      'Executed data-driven paid media strategies targeting B2B audiences, generating and nurturing 200+ qualified leads.',
      'Managed end-to-end B2B marketing campaigns in HubSpot, including lead scoring and automated email nurture workflows.',
      'Implemented A/B testing on ad creative and landing pages, optimizing CPL by 18% over three months.',
      'Tracked media budgets of $15K+, reconciled invoices with agency partners, and maintained media schedules.',
      'Generated weekly marketing analytics reports in Excel, providing actionable insights on CTR and CPA to senior leadership.'
    ],
    screenshots: []
  },
  {
    id: 'kasa',
    title: 'KASA Social Media',
    subtitle: 'Korean American Student Association · UNC Chapel Hill',
    category: 'social-media',
    categoryLabel: 'Social Media',
    date: 'MAY 2025',
    description: 'As VP, Outreach Chair, and Photographer for KASA, managed a $2K ad budget, led a team of 8, and grew digital presence through a consistent content calendar — increasing video views by 80% and engagement by 60%.',
    skills: ['Canva', 'Procreate', 'TikTok Editing', 'Instagram', 'Photography', 'Graphic Design', 'Paid Social'],
    bullets: [
      'Managed a $2K ad budget with paid social strategy, maintaining CPA 20% below benchmark.',
      'Led cross-functional team of 8 to execute signature events, coordinating timelines, vendor invoicing, and media schedules.',
      'Managed content calendar across Instagram, TikTok, and YouTube — 80% video views increase, 60% engagement increase.',
      'Produced custom digital illustrations and graphics using Procreate and Canva.',
      'Shot and edited event photography for promotional use across all channels.'
    ],
    screenshots: ['images/projects/kasa/screenshot-1.png','images/projects/kasa/screenshot-2.png','images/projects/kasa/screenshot-3.png','images/projects/kasa/screenshot-4.png']
  },
  {
    id: 'podcast',
    title: 'Can You Hear Us Now',
    subtitle: 'Podcast Social Media · Academic Project',
    category: 'social-media',
    categoryLabel: 'Social Media',
    date: '2024',
    description: 'Developed a comprehensive social media strategy to promote guest-led podcast episodes, specializing in identifying high-impact segments to create engaging clips and promotional posts.',
    skills: ['Video Snippet Editing', 'Social Media Promotion', 'Content Curation', 'Podcast Hosting', 'Graphic Design'],
    bullets: null,
    screenshots: ['images/projects/podcast/screenshot-1.png','images/projects/podcast/screenshot-2.png','images/projects/podcast/screenshot-3.png','images/projects/podcast/screenshot-4.png','images/projects/podcast/screenshot-5.png']
  }
];

/* ============================================
   PORTFOLIO FILTER
   ============================================ */
function initFilters() {
  const tabs  = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');
  if (!tabs.length) return;

  function applyFilter(filter) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.filter === filter));
    cards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('filtered-out', !show);
    });
  }

  // Read hash on load
  const hash = window.location.hash.replace('#', '');
  if (hash) applyFilter(hash);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      applyFilter(tab.dataset.filter);
      history.replaceState(null, '', tab.dataset.filter === 'all' ? window.location.pathname : '#' + tab.dataset.filter);
    });
  });
}

/* ============================================
   PROJECT MODAL
   ============================================ */
function initModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (!overlay) return;

  function openModal(id) {
    const p = projects.find(x => x.id === id);
    if (!p) return;

    overlay.querySelector('.modal-category').textContent  = p.categoryLabel;
    overlay.querySelector('.modal-title').textContent     = p.title;
    overlay.querySelector('.modal-subtitle').textContent  = p.subtitle;
    overlay.querySelector('.modal-time').textContent      = p.date;
    overlay.querySelector('.modal-description').textContent = p.description;
    overlay.querySelector('.modal-skills').innerHTML = p.skills.map(s => `<span class="tag">${s}</span>`).join('');

    const bulletsSection = overlay.querySelector('.modal-bullets-section');
    const bulletsList    = overlay.querySelector('.modal-bullets');
    if (bulletsSection) {
      bulletsSection.style.display = p.bullets ? 'block' : 'none';
      if (p.bullets && bulletsList) bulletsList.innerHTML = p.bullets.map(b => `<li>${b}</li>`).join('');
    }

    const screenshotsEl    = overlay.querySelector('.modal-screenshots');
    const screenshotsLabel = overlay.querySelector('.modal-screenshots-label');
    if (screenshotsEl) {
      if (!p.screenshots.length) {
        screenshotsEl.innerHTML = '';
        if (screenshotsLabel) screenshotsLabel.style.display = 'none';
      } else {
        if (screenshotsLabel) screenshotsLabel.style.display = 'block';
        screenshotsEl.innerHTML = p.screenshots.map(src =>
          `<div class="modal-screenshot"><img src="${src}" alt="" loading="lazy" style="cursor:zoom-in;" onerror="this.parentElement.style.display='none'"></div>`
        ).join('');
        screenshotsEl.querySelectorAll('img').forEach(img => {
          img.addEventListener('click', () => openFullImage(img.src));
        });
      }
    }

    const linkSection = overlay.querySelector('.modal-link-section');
    if (linkSection) {
      linkSection.style.display = p.link ? 'block' : 'none';
      if (p.link) linkSection.querySelector('.modal-link-btn').href = p.link;
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.projectId));
  });

  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ============================================
   LIGHTBOX
   ============================================ */
function initLightbox() {
  const lb    = document.querySelector('.lightbox');
  if (!lb) return;
  const img   = lb.querySelector('img');
  const items = [...document.querySelectorAll('.gallery-item[data-src]')];
  let idx = 0;

  const open  = (i) => { idx = i; img.src = items[i].dataset.src; lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = ()  => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  const nav   = (d) => { idx = (idx + d + items.length) % items.length; img.src = items[idx].dataset.src; };

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
  lb.querySelector('.lightbox-close').addEventListener('click', close);
  lb.querySelector('.prev').addEventListener('click', () => nav(-1));
  lb.querySelector('.next').addEventListener('click', () => nav(1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') nav(-1);
    if (e.key === 'ArrowRight') nav(1);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initModal();
  initLightbox();
});
