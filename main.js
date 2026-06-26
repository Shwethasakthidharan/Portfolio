import * as THREE from 'three';
import { portfolioData } from './data.js';

// Shared reference to 3D shapes — updated on theme change
let bgShapes = [];
// Update wireframe colors to match current theme
function syncBgTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  bgShapes.forEach(shape => {
    // Dark: bright cyan-teal pops on dark bg; Light: primary teal on light bg
    shape.material.color.setHex(isDark ? 0x5ed4d0 : 0x34afa9);
  });
}

// ==========================================================================
// DOM POPULATION
// ==========================================================================

function populateResumeData() {
  try {
    // 1. Summary
    const summaryContent = document.getElementById('summary-content');
    if (summaryContent) {
      summaryContent.innerText = portfolioData.personalInfo.summary;
    }

    // 2. Education
    const eduContainer = document.getElementById('education-container');
    if (eduContainer) {
      eduContainer.innerHTML = '';
      portfolioData.education.forEach(edu => {
        const eduHTML = `
          <div class="edu-item">
            <div class="edu-institution">${edu.institution}</div>
            <div class="edu-meta">
              <span>${edu.degree}</span>
              <span>${edu.period}</span>
            </div>
            <div class="edu-grade">${edu.grade}</div>
          </div>
        `;
        eduContainer.innerHTML += eduHTML;
      });
    }

    // 3. Experience
    const expContainer = document.getElementById('experience-container');
    if (expContainer) {
      expContainer.innerHTML = '';
      portfolioData.experience.forEach(exp => {
        let projectsHTML = '';
        exp.projects.forEach(proj => {
          projectsHTML += `
            <div class="experience-project">
              <h4 class="exp-project-name">${proj.name}</h4>
              <p class="exp-project-desc">${proj.description}</p>
            </div>
          `;
        });
        
        const expHTML = `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-header">
              <h3 class="timeline-role">${exp.role}</h3>
              <span class="timeline-company">${exp.company}</span>
              <div class="timeline-meta">
                <span>${exp.location}</span>
                <span>${exp.period}</span>
              </div>
            </div>
            <div class="timeline-content">
              ${projectsHTML}
            </div>
          </div>
        `;
        expContainer.innerHTML += expHTML;
      });
    }

    // 4. Projects
    const projContainer = document.getElementById('projects-container');
    if (projContainer) {
      projContainer.innerHTML = '';
      portfolioData.projects.forEach((proj, idx) => {
        const projHTML = `
          <div class="project-card" data-project-idx="${idx}">
            <div class="project-top">
              <svg class="project-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <span class="project-tech">${proj.tech}</span>
            </div>
            <h3 class="project-title">${proj.title}</h3>
            <p class="project-desc">${proj.description}</p>
          </div>
        `;
        projContainer.innerHTML += projHTML;
      });
    }

    // 5. Skills
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
      skillsContainer.innerHTML = '';
      const skillCategories = {
        languages: 'Languages & Databases',
        frameworks: 'Frameworks & Cloud',
        dataEngineering: 'Data & Platform Engineering',
        concepts: 'Concepts & Tools'
      };
      
      Object.keys(skillCategories).forEach(key => {
        if (portfolioData.skills[key]) {
          let pillsHTML = '';
          portfolioData.skills[key].forEach(skill => {
            pillsHTML += `<span class="skill-pill" data-skill="${skill}">${skill}</span>`;
          });
          
          const catHTML = `
            <div class="skill-category-block" data-category="${key}">
              <h4 class="skill-cat-title">${skillCategories[key]}</h4>
              <div class="skills-pill-box">
                ${pillsHTML}
              </div>
            </div>
          `;
          skillsContainer.innerHTML += catHTML;
        }
      });
    }

    // 6. Certifications
    const certContainer = document.getElementById('certifications-container');
    if (certContainer) {
      certContainer.innerHTML = '';
      
      // Helper function to get badge/icon SVG based on issuer name
      function getCertBadge(issuer) {
        const cleanIssuer = issuer.toLowerCase();
        if (cleanIssuer.includes('google')) {
          return `
            <div class="cert-badge google-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-cloud">
                <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.57-3.96-3.72-7-8-7C4.1 4 1 7.1 1 11c0 2.2 1.5 4.1 3.5 4.8-.02.4.02.8.1 1.2a3.5 3.5 0 0 0 6.9 0 3.5 3.5 0 0 0 6 2z"/>
              </svg>
            </div>
          `;
        } else if (cleanIssuer.includes('aws') || cleanIssuer.includes('amazon')) {
          return `
            <div class="cert-badge aws-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-server">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                <line x1="6" y1="6" x2="6.01" y2="6"/>
                <line x1="6" y1="18" x2="6.01" y2="18"/>
              </svg>
            </div>
          `;
        } else {
          return `
            <div class="cert-badge generic-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-award">
                <circle cx="12" cy="8" r="7"/>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
              </svg>
            </div>
          `;
        }
      }

      portfolioData.certifications.forEach(cert => {
        const url = cert.certificateUrl || '#';
        const isClickable = cert.certificateUrl ? '' : 'style="pointer-events: none; opacity: 0.5;"';
        const targetAttr = cert.certificateUrl ? 'target="_blank" rel="noopener noreferrer"' : '';
        const titleLinkOpen = cert.certificateUrl ? `<a href="${url}" ${targetAttr} class="cert-title-link">` : '';
        const titleLinkClose = cert.certificateUrl ? `</a>` : '';
        const certHTML = `
          <div class="cert-card">
            <div class="cert-card-top">
              ${getCertBadge(cert.issuer)}
              <span class="cert-year">${cert.year}</span>
            </div>
            
            ${titleLinkOpen}
              <h3 class="cert-title">${cert.title}</h3>
            ${titleLinkClose}
            
            <span class="cert-issuer">Issued by ${cert.issuer}</span>
            
            <div class="cert-card-bottom">
              <a href="${url}" ${targetAttr} class="btn-cert-view" ${isClickable}>
                View Certificate
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon-external-link">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
          </div>
        `;
        certContainer.innerHTML += certHTML;
      });
    }
  } catch (error) {
    console.error("Error populating resume content: ", error);
  }
}

// ==========================================================================
// SCROLL NAVIGATION BINDINGS & HIGHLIGHTS
// ==========================================================================

let activeSectionId = 'home';

function setupScrollAnimations() {
  const sections = document.querySelectorAll('.section, .contact-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const menuToggle = document.getElementById('menu-toggle');
  const header = document.querySelector('.header');

  if (menuToggle && header) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      header.classList.toggle('nav-open');
    });

    document.addEventListener('click', (e) => {
      if (header.classList.contains('nav-open') && !header.contains(e.target)) {
        header.classList.remove('nav-open');
      }
    });
  }

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -45% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id') || 'certifications';
        
        if (id !== activeSectionId) {
          activeSectionId = id;
          onSectionActivate(id);
        }
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  function handleLinkClick(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElem = document.querySelector(targetId);
    if (targetElem) {
      targetElem.scrollIntoView({ behavior: 'smooth' });
    }
    if (header) {
      header.classList.remove('nav-open');
    }
  }

  navLinks.forEach(link => link.addEventListener('click', handleLinkClick));
}

function onSectionActivate(sectionId) {
  // Update Navbar states
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ==========================================================================
// SCROLL REVEAL
// ==========================================================================

function setupScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.glass-card, .project-card, .cert-card, .edu-item, .experience-project, .skill-category-block, .timeline-item'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sr-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => {
    el.classList.add('sr-hidden');
    observer.observe(el);
  });
}

// ==========================================================================
// DARK MODE TOGGLE
// ==========================================================================

function setupThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  // Restore saved preference before first paint
  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('portfolio-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('portfolio-theme', 'dark');
    }
    syncBgTheme();
  });
}

// ==========================================================================
// INITIALIZATION TRIGGER
// ==========================================================================

window.addEventListener('DOMContentLoaded', () => {
  populateResumeData();
  setupScrollAnimations();
  setupScrollReveal();
  init3DBackground();
  setupThemeToggle();
  // Sync 3D colors after shapes are built and theme is applied
  syncBgTheme();
});

// ==========================================================================
// 3D BACKGROUND — FLOATING WIREFRAME GEOMETRY
// ==========================================================================

function init3DBackground() {
  const canvas = document.getElementById('bg-3d');
  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 38;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const isMobile = window.innerWidth < 768;

  // Each shape: geometry type, radius, [x,y,z], [rotX,rotY,rotZ] speed, edge opacity
  const shapeConfigs = [
    { type: 'icosahedron', r: 7.5, pos: [-17,  7, -10], rot: [0.0028, 0.0045, 0.0018], op: 0.92 },
    { type: 'octahedron',  r: 5.5, pos: [ 16, -5,  -7], rot: [0.0038, 0.0028, 0.0055], op: 0.88 },
    { type: 'icosahedron', r: 3.8, pos: [  9, 12, -12], rot: [0.0055, 0.0038, 0.0028], op: 0.82 },
    { type: 'tetrahedron', r: 4.5, pos: [ -8, 15, -14], rot: [0.0035, 0.0058, 0.0025], op: 0.76 },
    { type: 'octahedron',  r: 2.8, pos: [-12, -9,   2], rot: [0.0048, 0.0065, 0.0038], op: 0.80 },
    { type: 'icosahedron', r: 1.8, pos: [  6,-13,   5], rot: [0.0075, 0.0048, 0.0085], op: 0.84 },
    { type: 'octahedron',  r: 2.2, pos: [ 18,  9,  -2], rot: [0.0065, 0.0028, 0.0048], op: 0.76 },
    { type: 'tetrahedron', r: 1.4, pos: [-20, -4,   6], rot: [0.0090, 0.0055, 0.0070], op: 0.72 },
  ];

  // Fewer shapes on mobile for performance
  const active = isMobile ? shapeConfigs.slice(0, 4) : shapeConfigs;

  const shapes = active.map(cfg => {
    let geo;
    if (cfg.type === 'icosahedron') geo = new THREE.IcosahedronGeometry(cfg.r, 0);
    else if (cfg.type === 'octahedron') geo = new THREE.OctahedronGeometry(cfg.r, 0);
    else geo = new THREE.TetrahedronGeometry(cfg.r, 0);

    const edges = new THREE.EdgesGeometry(geo);
    const mat = new THREE.LineBasicMaterial({
      color: 0x34afa9,
      transparent: true,
      opacity: cfg.op,
    });
    const mesh = new THREE.LineSegments(edges, mat);
    mesh.position.set(...cfg.pos);
    mesh.userData = { rot: cfg.rot, baseY: cfg.pos[1] };
    scene.add(mesh);
    return mesh;
  });

  // Expose to module scope so syncBgTheme() can update colors on toggle
  bgShapes = shapes;

  // Mouse parallax
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  let t = 0;

  function animate() {
    requestAnimationFrame(animate);
    t += 0.006;

    shapes.forEach((shape, i) => {
      // Self-rotation
      shape.rotation.x += shape.userData.rot[0];
      shape.rotation.y += shape.userData.rot[1];
      shape.rotation.z += shape.userData.rot[2];

      // Gentle up-down float — each shape on its own phase
      shape.position.y = shape.userData.baseY + Math.sin(t + i * 1.3) * 0.55;
    });

    // Smooth mouse parallax on camera
    targetX += (mouseX - targetX) * 0.035;
    targetY += (mouseY - targetY) * 0.035;
    camera.position.x = targetX * 5;
    camera.position.y = targetY * 3.5;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
