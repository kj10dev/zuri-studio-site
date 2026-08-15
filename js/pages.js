/* ═══════════════════════════════════════════════════
   ZURI STUDIO — New Pages Shared JS
   Handles: Lenis, GSAP, cursor, navbar, project
   filters, multi-step form, and animations
   ═══════════════════════════════════════════════════ */

// ─── Lenis Smooth Scroll ───
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync GSAP ScrollTrigger with Lenis
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

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
    gsap.to(words, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.07,
        ease: 'power3.out',
        delay: 0.2,
    });
}

revealWords('projects-heading');
revealWords('sp-heading');

// Hero sub + generic hero animations
gsap.from('.page-hero__sub, .sp-hero__sub', {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.9,
    ease: 'power3.out',
});

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
                    gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
                } else {
                    gsap.to(card, {
                        opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => {
                            card.classList.add('hidden');
                        }
                    });
                }
            });
        });
    });
}

// ─── MULTI-STEP FORM ───
const spForm = document.getElementById('sp-form');
const spSuccess = document.getElementById('sp-success');

if (spForm) {
    const fieldsets = spForm.querySelectorAll('.sp-fieldset');
    const steps = document.querySelectorAll('.sp-step');
    const stepLines = document.querySelectorAll('.sp-step-line');

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

        if (!valid) {
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
    spForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateStep(3)) return;

        const formData = new FormData(spForm);
        const firstName = formData.get('firstName')?.toString().trim() || 'Client';
        const lastName = formData.get('lastName')?.toString().trim() || '';
        const email = formData.get('email')?.toString().trim() || '';
        const phone = formData.get('phone')?.toString().trim() || 'Not provided';
        const company = formData.get('company')?.toString().trim() || 'Not provided';
        const service = formData.get('service')?.toString().trim() || 'Not specified';
        const description = formData.get('description')?.toString().trim() || '';
        const url = formData.get('url')?.toString().trim() || 'Not provided';
        const budget = formData.get('budget')?.toString().trim() || 'Not specified';
        const timeline = formData.get('timeline')?.toString().trim() || 'Not specified';
        const deadline = formData.get('deadline')?.toString().trim() || 'Not specified';
        const referral = formData.get('referral')?.toString().trim() || 'Not specified';
        const extra = formData.get('extra')?.toString().trim() || 'None';

        const recipient = 'zuristudio@proton.me';
        const subject = encodeURIComponent(`Project enquiry from ${firstName} ${lastName}`.trim());
        const body = encodeURIComponent(
            `First Name: ${firstName}\n` +
            `Last Name: ${lastName}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone}\n` +
            `Company: ${company}\n` +
            `Service: ${service}\n` +
            `Project URL: ${url}\n` +
            `Budget: ${budget}\n` +
            `Timeline: ${timeline}\n` +
            `Deadline: ${deadline}\n` +
            `Referral: ${referral}\n\n` +
            `Project Description:\n${description}\n\n` +
            `Additional Notes:\n${extra}`
        );

        const submitBtn = document.getElementById('sp-submit');
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

        setTimeout(() => {
            steps.forEach(step => {
                const num = Number(step.getAttribute('data-step'));
                step.classList.add('done');
                step.classList.remove('active');
                if (num === 3) step.classList.add('active');
            });

            spForm.querySelector('[data-fieldset="3"]').classList.remove('active');
            spSuccess.hidden = false;
            spSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Animate success
            gsap.from('.sp-success__icon', { scale: 0, rotation: -90, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' });
            gsap.from('.sp-success__title', { y: 20, opacity: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' });
            gsap.from('.sp-success__msg', { y: 20, opacity: 0, duration: 0.5, delay: 0.35, ease: 'power2.out' });
            gsap.from('.sp-success__logo', { scale: 0.7, rotation: -25, opacity: 0, duration: 0.7, delay: 0.5, ease: 'back.out(1.8)' });

            submitBtn.textContent = 'Send My Brief';
            submitBtn.disabled = false;
            spForm.reset();
        }, 1400);
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

// ─── Shared Logic for all pages (Optional) ───
// This file can now house shared logic that isn't modal-specific,
// while modal logic lives in projects.html for file:// compatibility.
