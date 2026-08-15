/* ═══════════════════════════════════════════════════
   ZURI STUDIO — Futuristic Motion & Interactions
   ═══════════════════════════════════════════════════ */

// ─── Lenis Smooth Scroll ───
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
} else {
  document.documentElement.style.scrollBehavior = 'smooth';
}

// ─── Custom Cursor ───
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

if (cursorDot) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });
}

// Smooth ring follow
function updateCursorRing() {
  if (!cursorRing) return;
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(updateCursorRing);
}
updateCursorRing();

// Hover scaling
const interactiveElements = document.querySelectorAll('a, button, .service-card, .work-card, input, textarea');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ─── Color Hover Widget ───
const colorWidget = document.getElementById('color-hover-widget');
const colorWidgetSwatch = document.getElementById('color-hover-swatch');
const colorWidgetValue = document.getElementById('color-hover-value');

function rgbToHex(value) {
  if (!value || value === 'transparent') return '#FAF5EB';
  const rgb = value.match(/\d+/g);
  if (!rgb) return '#FAF5EB';
  return `#${rgb.slice(0, 3).map((channel) => Number(channel).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

function getHoveredColor(target) {
  let current = target;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const background = style.backgroundColor;
    if (background && background !== 'rgba(0, 0, 0, 0)' && background !== 'transparent') {
      return rgbToHex(background);
    }
    const textColor = style.color;
    if (textColor && textColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'transparent') {
      return rgbToHex(textColor);
    }
    current = current.parentElement;
  }
  return '#FAF5EB';
}

if (colorWidget && colorWidgetSwatch && colorWidgetValue) {
  document.addEventListener('mousemove', (event) => {
    const target = document.elementFromPoint(event.clientX, event.clientY);
    if (!target) return;
    const hex = getHoveredColor(target);
    colorWidgetSwatch.style.background = hex;
    colorWidgetValue.textContent = hex;
  });
}

// ─── Hero Word-by-Word Reveal ───
if (typeof gsap !== 'undefined') {
  const heroHeading = document.getElementById('hero-heading');
  if (heroHeading) {
    const text = heroHeading.textContent;
    heroHeading.innerHTML = text.split(' ').map(word =>
      `<span class="word">${word}</span>`
    ).join(' ');

    const words = heroHeading.querySelectorAll('.word');

    gsap.to(words, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.3,
    });
  }

  // Hero subtitle and buttons
  gsap.from('.hero-content p', {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 1,
    ease: 'power3.out',
  });

  gsap.from('.hero-buttons', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 1.3,
    ease: 'power3.out',
  });

  // ─── Section Reveal Animations ───
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.fromTo(el, {
      opacity: 0,
      y: 50,
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      }
    });
  });

  // Section headings
  gsap.utils.toArray('.section h2').forEach((h2) => {
    gsap.from(h2, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: h2,
        start: 'top 85%',
        once: true,
      }
    });
  });

  // Section labels
  gsap.utils.toArray('.section-label').forEach((label) => {
    gsap.from(label, {
      opacity: 0,
      x: -20,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: label,
        start: 'top 88%',
        once: true,
      }
    });
  });

  // Stats counter animation
  gsap.utils.toArray('.stat h4').forEach((stat) => {
    gsap.from(stat, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: stat,
        start: 'top 88%',
        once: true,
      }
    });
  });

  // ─── Work Card Image Parallax ───
  gsap.utils.toArray('.work-card img').forEach((img) => {
    gsap.fromTo(img, {
      yPercent: -8,
    }, {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.work-card'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });
  });

  // ─── Navbar Scroll Transition ───
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: (self) => {
        if (self.direction === 1 && window.scrollY > 80) {
          navbar.classList.add('scrolled');
        }
        if (window.scrollY <= 80) {
          navbar.classList.remove('scrolled');
        }
      }
    });
  }
}

// ─── Hamburger Menu Toggle ───
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.textContent = '☰';
    });
  });
}

// ─── THREE.JS AMBIENT HERO BACKGROUND ───
const heroCanvas = document.querySelector('#bg');
if (typeof THREE !== 'undefined' && heroCanvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: heroCanvas,
    alpha: true,
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Floating particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 80;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 12;
    positions[i + 1] = (Math.random() - 0.5) * 12;
    positions[i + 2] = (Math.random() - 0.5) * 8;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xE85D26,
    size: 0.03,
    transparent: true,
    opacity: 0.8,
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Wireframe shape — slow ambient rotation
  const geo1 = new THREE.IcosahedronGeometry(2.2, 1);
  const mat1 = new THREE.MeshStandardMaterial({
    color: 0xE85D26,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  });

  const shape1 = new THREE.Mesh(geo1, mat1);
  scene.add(shape1);

  // Second shape
  const geo2 = new THREE.OctahedronGeometry(1.2, 0);
  const mat2 = new THREE.MeshStandardMaterial({
    color: 0x2B7A3D,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  });
  const shape2 = new THREE.Mesh(geo2, mat2);
  shape2.rotation.set(0.8, 0.4, 0);
  scene.add(shape2);

  // Lighting
  const light1 = new THREE.PointLight(0xffffff, 0.8);
  light1.position.set(5, 5, 5);
  scene.add(light1);

  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  camera.position.z = 5;

  // Mouse interaction
  let cursorMX = 0, cursorMY = 0;
  document.addEventListener('mousemove', (e) => {
    cursorMX = (e.clientX / window.innerWidth - 0.5) * 0.3;
    cursorMY = (e.clientY / window.innerHeight - 0.5) * 0.3;
  });

  function animate() {
    requestAnimationFrame(animate);

    // Very slow ambient rotation
    shape1.rotation.x += 0.001;
    shape1.rotation.y += 0.0015;
    shape2.rotation.x -= 0.0008;
    shape2.rotation.y += 0.001;

    // Particle drift
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;

    // Subtle mouse follow
    shape1.rotation.x += (cursorMY * 0.2 - shape1.rotation.x) * 0.005;
    shape1.rotation.y += (cursorMX * 0.2 - shape1.rotation.y) * 0.005;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

// ─── Contact Form Handler ───
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-primary');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Sent ✓';
      btn.style.background = '#2B7A3D';

      let feedback = form.querySelector('.form-feedback');
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        feedback.textContent = "Thanks! We'll get back to you within 24 hours.";
        form.appendChild(feedback);
      }
      feedback.classList.add('show');

      form.reset();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        feedback.classList.remove('show');
      }, 3000);
    }, 1200);
  });
}