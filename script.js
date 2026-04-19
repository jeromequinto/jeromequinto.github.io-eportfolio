// =============================================
// DOM ELEMENTS
// =============================================
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scroll-top');
const contactForm = document.getElementById('contact-form');
const typewriterEl = document.getElementById('typewriter');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const themeToggle = document.getElementById('theme-toggle');
const profileImg = document.querySelector('.profile-img');

// =============================================
// INIT ON DOM READY
// =============================================
document.addEventListener('DOMContentLoaded', function () {

    // --- Theme: restore saved preference ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle?.classList.add('active');
    }

    // --- Theme toggle click ---
    // ✅ FIX: We no longer touch navbar.style.background here.
    // The navbar background is fully controlled by CSS variables +
    // the .scrolled class, so it updates instantly on theme change
    // without waiting for the next scroll event.
    themeToggle?.addEventListener('click', function () {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.classList.toggle('active');
        // No navbar.style.background override needed — CSS handles it instantly
    });

    // --- Footer year ---
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- Start features ---
    typeWriter();
    animateSkillBars();
    initProfileFloat();
});

// =============================================
// PROFILE IMAGE — SMOOTH FLOAT ONLY
// =============================================
function initProfileFloat() {
    if (!profileImg) return;

    profileImg.addEventListener('mouseenter', () => {
        profileImg.style.animationPlayState = 'paused';
    });

    profileImg.addEventListener('mouseleave', () => {
        profileImg.style.animationPlayState = 'running';
    });
}

// =============================================
// HAMBURGER MENU
// =============================================
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// =============================================
// RIPPLE EFFECT — theme-aware
// White splash in dark mode, gray splash in light mode
// =============================================
function createRipple(e, element) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const rippleColor = isDark
        ? 'rgba(255, 255, 255, 0.55)'
        : 'rgba(100, 100, 100, 0.22)';

    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.5;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: ${rippleColor};
        border-radius: 50%;
        transform: scale(0);
        animation: navRipple 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 0;
    `;

    if (!document.getElementById('ripple-keyframes')) {
        const style = document.createElement('style');
        style.id = 'ripple-keyframes';
        style.textContent = `
            @keyframes navRipple {
                to { transform: scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 620);
}

// =============================================
// NAV LINKS — SMOOTH SCROLL + RIPPLE
// =============================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // 💥 Theme-aware splash on click
        createRipple(e, link);

        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const targetPosition = targetSection.offsetTop - 80;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// =============================================
// SCROLL HANDLER
// ✅ FIX: Use navbar.classList (adds/removes .scrolled)
// instead of navbar.style.background (inline style).
//
// Inline styles override CSS and don't react to [data-theme]
// changes until the next scroll fires — that was the delay bug.
// Now the background is defined entirely in CSS using
// var(--navbar-bg) and var(--navbar-bg-scrolled), which switch
// instantly when data-theme changes on <html>.
// =============================================
window.addEventListener('scroll', () => {

    // Navbar scroll state
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll-to-top button
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }

    // Active nav link on scroll
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Skill bars
    animateSkillBars();
});

// =============================================
// SCROLL TOP BUTTON
// =============================================
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =============================================
// TYPEWRITER EFFECT
// =============================================
const texts = ['Web Developer', 'Creative Coder', 'Problem Solver'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentText = texts[textIndex];
    const typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex <= currentText.length) {
        typewriterEl.textContent = currentText.slice(0, charIndex);
        charIndex++;
        setTimeout(typeWriter, typeSpeed);
    } else if (isDeleting && charIndex >= 0) {
        typewriterEl.textContent = currentText.slice(0, charIndex);
        charIndex--;
        setTimeout(typeWriter, typeSpeed);
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
            textIndex = (textIndex + 1) % texts.length;
        }
        setTimeout(typeWriter, isDeleting ? 500 : 1200);
    }
}

// =============================================
// PROJECT FILTER
// =============================================
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const match = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
            if (match) {
                card.style.display = 'block';
                // Small delay lets display:block take effect before animating
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 20);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                setTimeout(() => { card.style.display = 'none'; }, 300);
            }
        });
    });
});

// =============================================
// SKILL BAR ANIMATION
// =============================================
const skillBars = document.querySelectorAll('.skill-progress');

function animateSkillBars() {
    skillBars.forEach(bar => {
        const barTop = bar.getBoundingClientRect().top;
        if (barTop < window.innerHeight - 80) {
            const targetWidth = bar.getAttribute('data-width');
            if (bar.style.width !== targetWidth + '%') {
                bar.style.width = targetWidth + '%';
            }
        }
    });
}

// =============================================
// INTERSECTION OBSERVER — PROJECT CARDS
// =============================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger card animations
            setTimeout(() => {
                entry.target.classList.add('animate');
            }, i * 100);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

projectCards.forEach(card => observer.observe(card));

// =============================================
// EMAILJS — CONTACT FORM
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    emailjs.init("3T-CFdzAAV41-s2BS");

    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const status = document.getElementById('form-status');

    form?.addEventListener('submit', function (e) {
        e.preventDefault();

        const SERVICE_ID = "service_yy1z2zg";
        const TEMPLATE_ID = "__ejs-test-mail-service__";

        // Basic validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            status.innerHTML = '<p style="color:#ef4444;">Please fill in all fields.</p>';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

        emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            from_name: name,
            from_email: email,
            message: message,
            to_email: "jeromequinto0101@gmail.com"
        }).then(function () {
            status.innerHTML = '<p style="color:#22c55e;margin-top:1rem;">✅ Message sent successfully!</p>';
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }, function (error) {
            console.error('EmailJS error:', error);
            status.innerHTML = '<p style="color:#ef4444;margin-top:1rem;">❌ Failed to send. Please try again.</p>';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        });
    });
});
