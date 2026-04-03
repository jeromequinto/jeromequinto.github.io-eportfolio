// DOM Elements
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


// Dark Mode Toggle Functionality - FIXED VERSION
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.classList.add('active');
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.classList.remove('active');
    }
}

themeToggle.addEventListener('click', () => {
    themeToggle.classList.toggle('active');
    const isDark = themeToggle.classList.contains('active');

    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
});

// Initialize theme on page load
initTheme();
// 🌙 DARK MODE - CLOUDFLARE WORKERS FIXED VERSION
// 🌙 ULTRA-SIMPLE DARK MODE - CLOUDFLARE PROOF
document.addEventListener('DOMContentLoaded', function () {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
    }

    // Toggle theme
    themeToggle.addEventListener('click', function () {
        const isDark = html.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});


window.addEventListener('scroll', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (window.scrollY > 50) {
        navbar.style.background = isDark ? 'rgba(15, 15, 35, 0.98)' : 'rgba(255, 255, 255, 0.98)';

        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = isDark ? 'rgba(15, 15, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)';

        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = isDark ? 'rgba(15, 15, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';

        navbar.style.boxShadow = 'none';
    }

    // Show/hide scroll top button
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const targetPosition = targetSection.offsetTop - 80;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Scroll Top Button
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Typewriter Effect
const texts = ['Web Developer', 'Enjoying Coding', 'Creative Coder'];
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
        setTimeout(typeWriter, isDeleting ? 500 : 1000);
    }
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.display = 'block';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Skill Bar Animation
const skillBars = document.querySelectorAll('.skill-progress');

function animateSkillBars() {
    skillBars.forEach(bar => {
        const barPosition = bar.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (barPosition < windowHeight - 100) {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        }
    });
}

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

projectCards.forEach(card => observer.observe(card));
document.querySelectorAll('section').forEach(section => observer.observe(section));

// Contact Form Validation
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    let isValid = true;

    document.querySelectorAll('.error').forEach(error => error.textContent = '');

    if (name.length < 2) {
        document.getElementById('name-error').textContent = 'Name must be at least 2 characters';
        isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email';
        isValid = false;
    }
    if (message.length < 10) {
        document.getElementById('message-error').textContent = 'Message must be at least 10 characters';
        isValid = false;
    }

    if (isValid) {
        alert('Thank you for your message! I\'ll get back to you soon.');
        contactForm.reset();
    }
});

// Navbar active link on scroll & skill bars
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
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
    animateSkillBars();
window.addEventListener('load', () => {
    typeWriter();
    animateSkillBars();
});
