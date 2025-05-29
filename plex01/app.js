// Global variables
let cursor, cursorFollower;
let particles = [];
let mouse = { x: 0, y: 0 };
let loadingParticles = [];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCursor();
    initLoadingScreen();
    initNavigation();
    initScrollAnimations();
    initMagneticButtons();
    initContactForm();
    initMobileMenu();
});

// Custom Cursor
function initCursor() {
    if (window.innerWidth <= 768) return; // Disable on mobile
    
    cursor = document.getElementById('cursor');
    cursorFollower = document.getElementById('cursorFollower');
    
    if (!cursor || !cursorFollower) return;
    
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        cursorFollower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
    });
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .magnetic');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(1.5)';
            cursorFollower.style.transform += ' scale(1.2)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
            cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.2)', '');
        });
    });
}

// Loading Screen with Particles
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingCanvas = document.getElementById('loadingParticles');
    
    if (!loadingScreen || !loadingCanvas) {
        // If loading elements don't exist, initialize main content immediately
        initHeroAnimations();
        initParticleSystem();
        return;
    }
    
    const ctx = loadingCanvas.getContext('2d');
    
    // Set canvas size
    loadingCanvas.width = window.innerWidth;
    loadingCanvas.height = window.innerHeight;
    
    // Create loading particles
    for (let i = 0; i < 100; i++) {
        loadingParticles.push({
            x: Math.random() * loadingCanvas.width,
            y: Math.random() * loadingCanvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
    
    let animationRunning = true;
    
    function animateLoadingParticles() {
        if (!animationRunning) return;
        
        ctx.clearRect(0, 0, loadingCanvas.width, loadingCanvas.height);
        
        loadingParticles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0) particle.x = loadingCanvas.width;
            if (particle.x > loadingCanvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = loadingCanvas.height;
            if (particle.y > loadingCanvas.height) particle.y = 0;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animateLoadingParticles);
    }
    
    animateLoadingParticles();
    
    // Hide loading screen after 2.5 seconds
    setTimeout(() => {
        animationRunning = false;
        loadingScreen.classList.add('hidden');
        
        // Initialize main content after loading screen is hidden
        setTimeout(() => {
            initHeroAnimations();
            initParticleSystem();
        }, 500);
    }, 2500);
}

// Hero Section Animations
function initHeroAnimations() {
    // Typewriter effect for name
    const nameElement = document.getElementById('typewriterName');
    const titleElement = document.getElementById('typewriterTitle');
    
    if (!nameElement || !titleElement) return;
    
    const name = 'Krishnamoorthi G';
    const title = 'AI/ML Engineer | Software Developer | BE AIML Student';
    
    let nameIndex = 0;
    let titleIndex = 0;
    
    // Clear existing content
    nameElement.textContent = '';
    titleElement.textContent = '';
    
    function typewriterName() {
        if (nameIndex < name.length) {
            nameElement.textContent = name.slice(0, nameIndex + 1);
            nameIndex++;
            setTimeout(typewriterName, 100);
        } else {
            setTimeout(typewriterTitle, 500);
        }
    }
    
    function typewriterTitle() {
        if (titleIndex < title.length) {
            titleElement.textContent = title.slice(0, titleIndex + 1);
            titleIndex++;
            setTimeout(typewriterTitle, 50);
        }
    }
    
    setTimeout(typewriterName, 500);
}

// Particle System for Hero Background
function initParticleSystem() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Clear existing particles
    particles = [];
    
    // Create particles
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 1,
            speedY: (Math.random() - 0.5) * 1,
            opacity: Math.random() * 0.5 + 0.1
        });
    }
    
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Mouse interaction
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particle.x -= dx * 0.02;
                particle.y -= dy * 0.02;
            }
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            ctx.fill();
        });
        
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScrollY = window.scrollY;
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Hide/show navbar on scroll
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate skill bars
                if (entry.target.classList.contains('skills')) {
                    setTimeout(() => animateSkillBars(), 300);
                }
                
                // Animate timeline items
                if (entry.target.hasAttribute('data-animate')) {
                    entry.target.style.animationDelay = '0.2s';
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                }
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    
    // Observe timeline items
    const timelineItems = document.querySelectorAll('[data-animate]');
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Skill Bar Animations
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    skillBars.forEach((bar, index) => {
        const percentage = bar.getAttribute('data-percentage');
        const fill = bar.querySelector('.skill-fill');
        
        if (fill) {
            setTimeout(() => {
                fill.style.width = percentage + '%';
            }, index * 200);
        }
    });
}

// Magnetic Button Effects
function initMagneticButtons() {
    if (window.innerWidth <= 768) return; // Disable on mobile
    
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Show loading state
        if (btnText) btnText.style.display = 'none';
        if (btnLoader) btnLoader.style.display = 'inline';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            alert('Thank you for your message! I\'ll get back to you soon.');
            form.reset();
            
            // Reset button state
            if (btnText) btnText.style.display = 'inline';
            if (btnLoader) btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }, 2000);
    });
    
    // Floating label effect
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Project Card Tilt Effect
document.addEventListener('DOMContentLoaded', () => {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
});

// Parallax Effect for Floating Shapes
function initParallax() {
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        shapes.forEach((shape, index) => {
            const rate = scrolled * -0.5 * (index + 1);
            shape.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Initialize parallax after loading
document.addEventListener('DOMContentLoaded', initParallax);

// Smooth scroll for hero scroll indicator
document.addEventListener('DOMContentLoaded', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Add pulse animation to important elements
function addPulseAnimation() {
    const pulseElements = document.querySelectorAll('.btn-primary, .social-link');
    
    pulseElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        element.addEventListener('animationend', () => {
            element.style.animation = '';
        });
    });
}

document.addEventListener('DOMContentLoaded', addPulseAnimation);

// Performance optimizations
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle scroll and mouse events for better performance
const throttledMouseMove = throttle((e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}, 16);

document.addEventListener('mousemove', throttledMouseMove);

// Intersection Observer for counting animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                let currentValue = 0;
                
                const increment = () => {
                    if (finalValue.includes('.')) {
                        const decimalPlaces = finalValue.split('.')[1].length;
                        currentValue += parseFloat(finalValue) / 100;
                        target.textContent = currentValue.toFixed(decimalPlaces);
                        
                        if (currentValue < parseFloat(finalValue)) {
                            requestAnimationFrame(increment);
                        } else {
                            target.textContent = finalValue;
                        }
                    } else if (finalValue.includes('+')) {
                        const numValue = parseInt(finalValue);
                        currentValue += numValue / 50;
                        target.textContent = Math.floor(currentValue) + '+';
                        
                        if (currentValue < numValue) {
                            requestAnimationFrame(increment);
                        } else {
                            target.textContent = finalValue;
                        }
                    } else {
                        currentValue += parseInt(finalValue) / 50;
                        target.textContent = Math.floor(currentValue);
                        
                        if (currentValue < parseInt(finalValue)) {
                            requestAnimationFrame(increment);
                        } else {
                            target.textContent = finalValue;
                        }
                    }
                };
                
                increment();
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

document.addEventListener('DOMContentLoaded', initCounterAnimations);