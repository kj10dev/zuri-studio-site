/* ═══════════════════════════════════════════════════
   ZURI STUDIO — New Pages Shared JS
   Handles: Lenis, GSAP, cursor, navbar, project
   filters, multi-step form, and animations
   ═══════════════════════════════════════════════════ */

// ─── Lenis Smooth Scroll ───
// Guarded: if the CDN script fails to load, the rest of this file (including
// the multi-step form's submit handler) must still run.
let lenis;
const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

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
}

// Sync GSAP ScrollTrigger with Lenis
if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }
}

// ─── Custom Cursor ───
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function updateCursorRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(updateCursorRing);
    }
    updateCursorRing();

    const interactiveElements = document.querySelectorAll('a, button, .project-card, input, textarea, select, .sp-radio, .filter-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

// ─── Navbar Hamburger ───
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

// ─── GSAP Reveal Animations ───
if (hasGSAP) {
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
} else {
    // No GSAP available — reveal content immediately instead of leaving it invisible.
    document.querySelectorAll('.reveal').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

// ─── Hero Word-by-Word Reveal ───
function revealWords(headingId) {
    const heading = document.getElementById(headingId);
    if (!heading) return;

    // Split only bare text nodes, preserve <em> or other elements
    const wrapWords = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.split(' ').map(word =>
                word ? `<span class="word">${word}</span>` : ''
            ).join(' ');
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            const inner = Array.from(node.childNodes).map(wrapWords).join('');
            return `<${node.tagName.toLowerCase()}>${inner}</${node.tagName.toLowerCase()}>`;
        }
        return '';
    };

    heading.innerHTML = Array.from(heading.childNodes).map(wrapWords).join('');

    const words = heading.querySelectorAll('.word');
    if (hasGSAP) {
        gsap.to(words, {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.07,
            ease: 'power3.out',
            delay: 0.2,
        });
    } else {
        words.forEach(word => {
            word.style.transform = 'none';
            word.style.opacity = '1';
        });
    }
}

revealWords('projects-heading');
revealWords('sp-heading');

// Hero sub + generic hero animations
if (hasGSAP) {
    gsap.from('.page-hero__sub, .sp-hero__sub', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.9,
        ease: 'power3.out',
    });
}

// ─── PROJECT FILTER ───
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                const matches = filter === 'all' || categories.includes(filter);

                if (matches) {
                    card.classList.remove('hidden');
                    if (hasGSAP) {
                        gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
                    }
                } else if (hasGSAP) {
                    gsap.to(card, {
                        opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => {
                            card.classList.add('hidden');
                        }
                    });
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ─── MULTI-STEP FORM ───
const spForm = document.getElementById('project-brief-form');
const spSuccess = document.getElementById('sp-success');

if (spForm) {
    const fieldsets = spForm.querySelectorAll('.sp-fieldset');
    const steps = document.querySelectorAll('.sp-step');
    const stepLines = document.querySelectorAll('.sp-step-line');
    const customAmountWrap = document.getElementById('custom-amount-wrap');
    const budgetRadios = spForm.querySelectorAll('input[name="budget"]');
    const customAmountInput = document.getElementById('amount');

    budgetRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (!customAmountWrap) return;
            const isCustom = radio.value === 'custom' && radio.checked;
            customAmountWrap.hidden = !isCustom;
            if (!isCustom && customAmountInput) {
                customAmountInput.value = '';
                customAmountInput.classList.remove('error');
            }
        });
    });

    // Go to a given step (1-indexed)
    function goToStep(n) {
        fieldsets.forEach(fs => {
            fs.classList.remove('active');
            if (parseInt(fs.getAttribute('data-fieldset')) === n) {
                fs.classList.add('active');
            }
        });

        steps.forEach(step => {
            const num = parseInt(step.getAttribute('data-step'));
            step.classList.remove('active', 'done');
            if (num === n) step.classList.add('active');
            if (num < n) step.classList.add('done');
        });

        stepLines.forEach((line, idx) => {
            line.classList.toggle('done', idx < n - 1);
        });

        // Scroll to top of form
        spForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Validate current fieldset before advancing
    function validateStep(fsNum) {
        const current = spForm.querySelector(`[data-fieldset="${fsNum}"]`);
        const required = current.querySelectorAll('[required]');
        let valid = true;

        required.forEach(field => {
            if (field.type === 'radio') {
                // Check if any radio in group is checked
                const groupName = field.name;
                const anyChecked = current.querySelector(`input[name="${groupName}"]:checked`);
                if (!anyChecked) {
                    valid = false;
                    // Highlight the group
                    field.closest('.sp-radio-group')?.classList.add('error');
                } else {
                    field.closest('.sp-radio-group')?.classList.remove('error');
                }
            } else {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                    field.addEventListener('input', () => field.classList.remove('error'), { once: true });
                }
            }
        });

        const customBudgetSelected = current.querySelector('input[name="budget"][value="custom"]:checked');
        const customAmountField = current.querySelector('#amount');
        if (customBudgetSelected && customAmountField && !customAmountField.value.trim()) {
            valid = false;
            customAmountField.classList.add('error');
            customAmountField.addEventListener('input', () => customAmountField.classList.remove('error'), { once: true });
        }

        if (!valid && hasGSAP) {
            // Shake the form
            gsap.fromTo(spForm, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)', clearProps: 'x' });
        }

        return valid;
    }

    // Next buttons
    spForm.querySelectorAll('.sp-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentStep = parseInt(btn.closest('[data-fieldset]').getAttribute('data-fieldset'));
            const nextStep = parseInt(btn.getAttribute('data-next'));
            if (validateStep(currentStep)) {
                goToStep(nextStep);
            }
        });
    });

    // Back buttons
    spForm.querySelectorAll('.sp-back').forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.getAttribute('data-back'));
            goToStep(prevStep);
        });
    });

    // Submit
    spForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateStep(3)) return;

        const submitBtn = document.getElementById('sp-submit');
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        const action = spForm.getAttribute('action') || '/';
        const formData = new URLSearchParams(new FormData(spForm));

        try {
            await fetch(action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString(),
            });
        } catch (error) {
            console.warn('Project brief submission was intercepted locally.', error);
        }

        spForm.reset();
        spForm.hidden = true;

        if (spSuccess) {
            spSuccess.hidden = false;
            spSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            if (hasGSAP) {
                gsap.from('.sp-success__icon', { scale: 0, rotation: -90, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' });
                gsap.from('.sp-success__title', { y: 20, opacity: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' });
                gsap.from('.sp-success__msg', { y: 20, opacity: 0, duration: 0.5, delay: 0.35, ease: 'power2.out' });
                // Logo GSAP entry (0.5s delay + 0.7s duration = 1.2s total) hands off cleanly
                // to the CSS `successLogoCycle` animation which also starts at 1.2s delay.
                gsap.from('.sp-success__logo', { scale: 0.7, rotation: -25, opacity: 0, duration: 0.7, delay: 0.5, ease: 'back.out(1.8)' });
            }
        }
    });
}

// ─── Error field styles ───
const style = document.createElement('style');
style.textContent = `
  .sp-field input.error,
  .sp-field textarea.error,
  .sp-field select.error {
    border-color: var(--accent);
    animation: shake 0.3s ease;
  }
  .sp-radio-group.error .sp-radio {
    border-color: var(--accent);
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
`;
document.head.appendChild(style);

// ─── Contact Form Handler ───
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const successBox = document.getElementById('contact-success');

        contactForm.addEventListener('submit', async (e) => {
            if (!contactForm.checkValidity()) {
                e.preventDefault();
                contactForm.reportValidity();
                return;
            }

            e.preventDefault();

            const btn = contactForm.querySelector('.btn-primary');
            const originalText = btn.textContent;
            btn.textContent = 'Sending…';
            btn.disabled = true;

            const action = contactForm.getAttribute('action') || '/';
            const formData = new URLSearchParams(new FormData(contactForm));

            try {
                await fetch(action, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData.toString(),
                });
            } catch (error) {
                console.warn('Netlify form submit was intercepted locally.', error);
            }

            contactForm.reset();
            contactForm.hidden = true;

            if (successBox) {
                successBox.hidden = false;
                successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (hasGSAP) {
                    gsap.from('.contact-success__icon', { scale: 0, rotation: -90, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' });
                    gsap.from('.contact-success__title', { y: 20, opacity: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' });
                    gsap.from('.contact-success__msg', { y: 20, opacity: 0, duration: 0.5, delay: 0.35, ease: 'power2.out' });
                    gsap.from('.contact-success__logo', { scale: 0.7, rotation: -25, opacity: 0, duration: 0.7, delay: 0.5, ease: 'back.out(1.8)' });
                }
            }

            btn.textContent = originalText;
            btn.disabled = false;
        });
    }
});

// ─── Shared Logic for all pages (Optional) ───
// This file can now house shared logic that isn't modal-specific,
// while modal logic lives in projects.html for file:// compatibility.

