/* ============================================
   CUSTOM CURSOR
   ============================================ */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (cursorDot && cursorRing) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = 'a, button, .project-card, .gallery-item, .contact-card, .filter-tab, .strength-card';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });

  document.addEventListener('mousedown', () => cursorRing.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursorRing.classList.remove('clicking'));
}

/* ============================================
   NAV SCROLL + MOBILE TOGGLE
   ============================================ */
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    navLinks.classList.contains('open')
      ? (spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)',
         spans[1].style.opacity = '0',
         spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)')
      : (spans[0].style.transform = '',
         spans[1].style.opacity = '',
         spans[2].style.transform = '');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================
   PROJECT DATA
   ============================================ */
const projects = [
  {
    id: 'bhakti-chai',
    title: 'Bhakti Chai',
    subtitle: 'Growing Gen Z Brand Awareness',
    category: 'class',
    categoryLabel: 'Class Project',
    time: 'Completed April 30, 2026',
    description: 'This strategic campaign aimed to expand Bhakti Chai\'s presence into East Coast urban and college markets by positioning it as a functional wellness beverage for Gen Z. The execution focused on a multi-city college ambassador tour and heavy social media engagement to drive product trial and brand loyalty among health-conscious consumers.',
    skills: ['Media Planning', 'Campaign Structuring', 'Experiential Marketing', 'Strategic Timeline Management', 'Social Media Strategy', 'TikTok / Instagram'],
    bullets: null,
    link: null,
    screenshots: [
      'images/projects/bhakti-chai/screenshot-1.png',
      'images/projects/bhakti-chai/screenshot-2.png',
      'images/projects/bhakti-chai/screenshot-3.png',
      'images/projects/bhakti-chai/screenshot-4.png'
    ]
  },
  {
    id: 'ups-store',
    title: 'The UPS Store',
    subtitle: 'Helping Small Businesses Do the Hard Things',
    category: 'class',
    categoryLabel: 'Class Project',
    time: 'Completed December 3, 2024',
    description: 'This project focused on building a creative platform to bridge the gap between The UPS Store and Gen Z small business owners by highlighting the store as a centralized hub for entrepreneurial support. I introduced the "Box Buddies" concept to create a more interactive brand experience, alongside ideas like the "Build-A-PR Box" and influencer collaborations.',
    skills: ['Creative Strategy', 'Consumer Insight Research', 'Presentation Delivery', 'Figma', 'Social Media Content Strategy'],
    bullets: null,
    link: null,
    screenshots: [
      'images/projects/ups-store/screenshot-1.png',
      'images/projects/ups-store/screenshot-2.png',
      'images/projects/ups-store/screenshot-3.png',
      'images/projects/ups-store/screenshot-4.png',
      'images/projects/ups-store/screenshot-5.png',
      'images/projects/ups-store/screenshot-6.png'
    ]
  },
  {
    id: 'matcha-brand',
    title: 'Matcha Brand Website',
    subtitle: 'Personal Brand Concept',
    category: 'class',
    categoryLabel: 'Figma / UI Design',
    time: 'Completed Summer 2025',
    description: 'I designed a comprehensive website layout for a fictional matcha brand that sells high-quality matcha powder and traditional preparation tools. The project was driven by my personal passion for matcha and focused on creating a clean, aesthetic user interface that reflects the wellness and ritual aspects of the product.',
    skills: ['UI/UX Design (Figma)', 'Visual Branding', 'E-commerce Layout Design', 'Prototyping'],
    bullets: null,
    link: null,
    screenshots: [
      'images/projects/matcha-brand/screenshot-1.png',
      'images/projects/matcha-brand/screenshot-2.png',
      'images/projects/matcha-brand/screenshot-3.png'
    ]
  },
  {
    id: 'women-in-fashion',
    title: 'Women in Fashion Autobiography',
    subtitle: 'Academic Figma Assignment',
    category: 'class',
    categoryLabel: 'Figma / UI Design',
    time: 'Completed Winter 2024',
    description: 'This interactive Figma project serves as a digital autobiography of four iconic women — Coco Chanel, Rei Kawakubo (Comme des Garçons), Vivienne Westwood, and Miuccia Prada — who revolutionized the fashion industry. The site explores their historical impact and leadership through a curated visual narrative and structured digital layout.',
    skills: ['UI/UX Design (Figma)', 'Content Curation', 'Educational Layout Design', 'Storytelling'],
    bullets: null,
    link: null,
    screenshots: [
      'images/projects/women-in-fashion/screenshot-1.png',
      'images/projects/women-in-fashion/screenshot-2.png'
    ]
  },
  {
    id: 'house-of-hur',
    title: 'House of Hur',
    subtitle: 'Marketing Intern · Seoul, South Korea',
    category: 'internship',
    categoryLabel: 'Internship',
    time: 'August 2025 – October 2025',
    description: 'As a Marketing Intern at House of Hur in Seoul, I led end-to-end influencer campaigns and built operational systems that increased visibility and reduced redundancy across the marketing team.',
    skills: ['Influencer Marketing', 'Modash', 'Google Sheets', 'TikTok Production', 'Creator Relations', 'Campaign Operations', 'Email Campaigns'],
    bullets: [
      'Led end-to-end influencer campaign workflow (sourcing, contracting, briefs, content review, tracking) for multiple product pushes, coordinating creators across time zones.',
      'Built a Modash + Sheets tracker to manage creator status, contracts, shipping, and posting deadlines; reduced duplicate outreach and made campaign status visible to stakeholders.',
      'Drafted standardized creator briefs and review checklists that aligned content to product claims and brand voice, minimizing back-and-forth with legal and creative.',
      'Negotiated paid and gifting terms with micro-influencers (up to 100K followers), building long-term relationships through email campaigns.',
      'Planned, filmed, and published TikTok assets for product launches; partnered with content team to test hooks/CTAs and documented learnings for future campaigns.'
    ],
    link: null,
    screenshots: []
  },
  {
    id: 'bilin-technology',
    title: 'Bilin Technology',
    subtitle: 'Sales & Marketing Associate Intern · Remote',
    category: 'internship',
    categoryLabel: 'Internship',
    time: 'December 2023 – June 2024',
    description: 'As a Sales and Marketing Associate Intern at Bilin Technology, I executed data-driven B2B campaigns and managed paid media strategies that generated measurable growth in qualified leads and reduced cost-per-lead.',
    skills: ['HubSpot', 'Paid Media', 'B2B Marketing', 'A/B Testing', 'Excel Analytics', 'Lead Nurturing', 'Budget Management'],
    bullets: [
      'Executed data-driven paid media strategies targeting B2B audiences, helping generate and nurture 200+ qualified leads through targeted digital outreach.',
      'Managed end-to-end B2B marketing campaigns in HubSpot, including lead scoring and automated email nurture workflows.',
      'Implemented A/B testing on ad creative and landing pages, optimizing CPL by 18% over three months.',
      'Tracked media budgets of $15K+, reconciled invoices with agency partners, and maintained media schedules.',
      'Generated weekly marketing analytics reports in Excel, providing actionable insights on CTR and CPA to senior leadership, directly influencing strategy adjustments.'
    ],
    link: null,
    screenshots: []
  },
  {
    id: 'kasa',
    title: 'KASA Social Media',
    subtitle: 'Korean American Student Association · UNC Chapel Hill',
    category: 'social',
    categoryLabel: 'Social Media',
    time: 'August 2023 – May 2025',
    description: 'As VP, Outreach Chair, and Photographer for KASA, I managed a $2K ad budget, led a cross-functional team of 8, and grew the club\'s digital presence through a consistent content calendar across Instagram, TikTok, and YouTube. I blended custom digital illustrations with trendy short-form video content to strengthen brand identity and campus visibility.',
    skills: ['Canva', 'Procreate', 'TikTok Editing', 'Instagram', 'Photography', 'Graphic Design', 'Community Engagement', 'Paid Social'],
    bullets: [
      'Managed a $2K ad budget and executed paid social strategy, monitoring daily performance metrics and adjusting targeting to maintain a CPA 20% below benchmark.',
      'Led cross-functional team of 8 to execute signature events, coordinating timelines, vendor invoicing, and media schedules.',
      'Managed content calendar across Instagram, TikTok, and YouTube, increasing video views by 80% and overall engagement by 60%.',
      'Produced custom digital illustrations and graphics using Procreate and Canva to maintain a cohesive brand aesthetic.',
      'Shot and edited event photography for promotional use across all club channels.'
    ],
    link: null,
    screenshots: [
      'images/projects/kasa/screenshot-1.png',
      'images/projects/kasa/screenshot-2.png',
      'images/projects/kasa/screenshot-3.png',
      'images/projects/kasa/screenshot-4.png'
    ]
  },
  {
    id: 'podcast',
    title: 'Can You Hear Us Now',
    subtitle: 'Podcast Social Media · Academic Project',
    category: 'social',
    categoryLabel: 'Social Media',
    time: 'Completed 2024',
    description: 'For this academic project, I developed a comprehensive social media strategy to promote guest-led podcast episodes for "Can You Hear Us Now." I specialized in identifying high-impact segments from full-length recordings to create engaging clips and promotional posts tailored for social sharing.',
    skills: ['Video Snippet Editing', 'Social Media Promotion', 'Content Curation', 'Podcast Hosting', 'Graphic Design'],
    bullets: null,
    link: null,
    screenshots: [
      'images/projects/podcast/screenshot-1.png',
      'images/projects/podcast/screenshot-2.png',
      'images/projects/podcast/screenshot-3.png',
      'images/projects/podcast/screenshot-4.png',
      'images/projects/podcast/screenshot-5.png'
    ]
  }
];

/* ============================================
   PROJECT FILTERING (portfolio.html)
   ============================================ */
function initFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterTabs.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('filtered-out', !match);
      });
    });
  });
}

/* ============================================
   PROJECT MODAL (portfolio.html)
   ============================================ */
function initModal() {
  const overlay = document.querySelector('.modal-overlay');
  const modalContent = document.querySelector('.modal');
  if (!overlay) return;

  function openModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const modalCategory = overlay.querySelector('.modal-category');
    const modalTitle = overlay.querySelector('.modal-title');
    const modalSubtitle = overlay.querySelector('.modal-subtitle');
    const modalTime = overlay.querySelector('.modal-time');
    const modalDescription = overlay.querySelector('.modal-description');
    const modalSkills = overlay.querySelector('.modal-skills');
    const modalBullets = overlay.querySelector('.modal-bullets');
    const modalBulletsSection = overlay.querySelector('.modal-bullets-section');
    const modalScreenshots = overlay.querySelector('.modal-screenshots');
    const modalLinkSection = overlay.querySelector('.modal-link-section');

    modalCategory.textContent = project.categoryLabel;
    modalTitle.textContent = project.title;
    modalSubtitle.textContent = project.subtitle;
    modalTime.textContent = project.time;
    modalDescription.textContent = project.description;

    modalSkills.innerHTML = project.skills.map(s => `<span class="tag">${s}</span>`).join('');

    if (project.bullets && modalBulletsSection && modalBullets) {
      modalBulletsSection.style.display = 'block';
      modalBullets.innerHTML = project.bullets.map(b => `<li>${b}</li>`).join('');
    } else if (modalBulletsSection) {
      modalBulletsSection.style.display = 'none';
    }

    const screenshotLabel = overlay.querySelector('.modal-screenshots-label');
    if (modalScreenshots) {
      if (project.screenshots.length === 0) {
        modalScreenshots.innerHTML = '';
        if (screenshotLabel) screenshotLabel.style.display = 'none';
      } else {
        if (screenshotLabel) screenshotLabel.style.display = 'block';
        modalScreenshots.innerHTML = project.screenshots.map(src =>
          `<div class="modal-screenshot">
            <img src="${src}" alt="" onerror="this.parentElement.innerHTML='<span>Add screenshot to<br>${src}</span>'">
          </div>`
        ).join('');
      }
    }

    if (modalLinkSection) {
      modalLinkSection.style.display = project.link ? 'block' : 'none';
      if (project.link) {
        const linkBtn = modalLinkSection.querySelector('.modal-link-btn');
        if (linkBtn) linkBtn.href = project.link;
      }
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
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

/* ============================================
   LIGHTBOX (photography.html)
   ============================================ */
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const galleryItems = [...document.querySelectorAll('.gallery-item[data-src]')];
  let currentIdx = 0;

  function open(idx) {
    currentIdx = idx;
    lightboxImg.src = galleryItems[idx].dataset.src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIdx = (currentIdx + dir + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIdx].dataset.src;
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => open(idx));
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  lightbox.querySelector('.prev').addEventListener('click', () => navigate(-1));
  lightbox.querySelector('.next').addEventListener('click', () => navigate(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initModal();
  initLightbox();
});
