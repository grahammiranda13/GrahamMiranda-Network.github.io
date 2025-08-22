// DevCommunity Hub - Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initSmoothScrolling();
    initScrollAnimations();
    initCodeWindowAnimations();
    initProgressiveDisclosure();
    initLinkTracking();

    console.log('🚀 DevCommunity Hub loaded successfully');
});

// Mobile Navigation
function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (!navToggle || !navMenu) return;

    let isMenuOpen = false;

    navToggle.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        toggleMobileMenu(isMenuOpen);
    });

    // Close menu when clicking nav links
    const navLinks = navMenu.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isMenuOpen) {
                isMenuOpen = false;
                toggleMobileMenu(false);
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && isMenuOpen) {
            isMenuOpen = false;
            toggleMobileMenu(false);
        }
    });

    function toggleMobileMenu(open) {
        if (open) {
            // Create mobile menu overlay
            navMenu.style.cssText = `
                position: fixed;
                top: 0;
                right: 0;
                width: 280px;
                height: 100vh;
                background: white;
                z-index: 60;
                padding: 4rem 2rem 2rem;
                box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                transform: translateX(0);
                transition: transform 0.3s ease;
            `;

            // Create backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'mobile-nav-backdrop';
            backdrop.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 55;
                backdrop-filter: blur(4px);
            `;

            backdrop.addEventListener('click', () => {
                isMenuOpen = false;
                toggleMobileMenu(false);
            });

            document.body.appendChild(backdrop);
            document.body.style.overflow = 'hidden';

            // Animate hamburger to X
            animateHamburgerToX(navToggle, true);

        } else {
            // Reset menu styles
            navMenu.style.cssText = '';

            // Remove backdrop
            const backdrop = document.querySelector('.mobile-nav-backdrop');
            if (backdrop) {
                backdrop.remove();
            }

            document.body.style.overflow = '';

            // Reset hamburger
            animateHamburgerToX(navToggle, false);
        }
    }

    function animateHamburgerToX(toggle, toX) {
        const spans = toggle.querySelectorAll('span');
        if (toX) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    }
}

// Smooth Scrolling with offset for sticky nav
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerHeight = document.querySelector('.nav').offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// Scroll Animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Stagger animations for card grids
                const cards = entry.target.querySelectorAll('.tutorial-card, .resource-category, .guide-card, .community-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Set initial styles and observe elements
    const elementsToAnimate = document.querySelectorAll('.section, .tutorial-card, .resource-category, .guide-card, .community-card');
    elementsToAnimate.forEach(el => {
        // Don't hide hero elements
        if (!el.closest('.hero')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        observer.observe(el);
    });
}

// Code Window Animations
function initCodeWindowAnimations() {
    const codeWindow = document.querySelector('.code-window');
    if (!codeWindow) return;

    // Typing animation for code
    const codeSnippet = codeWindow.querySelector('.code-snippet');
    if (codeSnippet) {
        const originalContent = codeSnippet.innerHTML;

        // Only run animation on first load
        let hasAnimated = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    animateCode(codeSnippet, originalContent);
                }
            });
        });

        observer.observe(codeWindow);
    }
}

function animateCode(element, finalContent) {
    element.innerHTML = '';

    // Simple typing animation
    let i = 0;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = finalContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    function typeWriter() {
        if (i < textContent.length) {
            element.innerHTML += textContent.charAt(i);
            i++;
            setTimeout(typeWriter, 20);
        } else {
            // Replace with styled content
            setTimeout(() => {
                element.innerHTML = finalContent;
            }, 500);
        }
    }

    setTimeout(typeWriter, 1000);
}

// Progressive Disclosure for Resource Items
function initProgressiveDisclosure() {
    const resourceItems = document.querySelectorAll('.resource-item');

    resourceItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add a subtle feedback animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Guide card interactions
    const guideCards = document.querySelectorAll('.guide-card:not(.featured)');
    guideCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const tags = this.querySelectorAll('.tag');
            tags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'scale(1.05)';
                }, index * 50);
            });
        });

        card.addEventListener('mouseleave', function() {
            const tags = this.querySelectorAll('.tag');
            tags.forEach(tag => {
                tag.style.transform = '';
            });
        });
    });
}

// Link Tracking and Analytics
function initLinkTracking() {
    // Track external link clicks
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('External link clicked:', this.href);

            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('CTA clicked:', this.textContent.trim());
        });
    });

    // Track tutorial card interactions
    const tutorialCards = document.querySelectorAll('.tutorial-card');
    tutorialCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.tutorial-card__title').textContent;
            console.log('Tutorial card clicked:', title);
        });
    });
}

// Keyboard Navigation Enhancement
document.addEventListener('keydown', function(e) {
    // Add keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'k':
                e.preventDefault();
                // Focus search if exists, or scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
        }
    }

    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const backdrop = document.querySelector('.mobile-nav-backdrop');
        if (backdrop) {
            backdrop.click();
        }
    }
});

// Performance optimization: Lazy load heavy content
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyElements = document.querySelectorAll('[data-lazy]');

        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    // Load lazy content here
                    element.removeAttribute('data-lazy');
                    lazyObserver.unobserve(element);
                }
            });
        });

        lazyElements.forEach(el => lazyObserver.observe(el));
    }
}

// Initialize lazy loading
initLazyLoading();

// Add enhanced focus styles for accessibility
const focusableElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--color-primary)';
        this.style.outlineOffset = '2px';
        this.style.borderRadius = '4px';
    });

    element.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });
});

// Add custom CSS for enhanced mobile experience
const mobileStyles = `
@media (max-width: 767px) {
    .nav__link {
        display: block;
        padding: 1rem;
        margin: 0.5rem 0;
        background: var(--color-bg-secondary);
        border-radius: var(--radius-lg);
        text-align: center;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .nav__link:hover {
        background: var(--color-primary);
        color: white;
        transform: translateX(4px);
    }

    .tutorial-card,
    .guide-card,
    .community-card {
        transform: none !important;
    }

    .tutorial-card:active,
    .guide-card:active,
    .community-card:active {
        transform: scale(0.98) !important;
    }
}

.mobile-nav-backdrop {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
`;

const style = document.createElement('style');
style.textContent = mobileStyles;
document.head.appendChild(style);

// Console greeting for developers
console.log(`
🚀 Welcome to DevCommunity Hub!
👨‍💻 Built with vanilla JavaScript, CSS Grid, and love
🎨 Design system based on CSS custom properties
📱 Fully responsive and accessible
⚡ Performance optimized with lazy loading

Feel free to explore the code and contribute!
`);