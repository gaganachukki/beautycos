// Basic JS functionality

document.addEventListener('DOMContentLoaded', () => {
    console.log('Stackly Beauty and Cosmetics Store Loaded');
    
    // Example: Highlight active nav link based on current URL path
    const currentLocation = location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    
    if (currentLocation) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentLocation) {
                document.querySelector('nav ul li a.active')?.classList.remove('active');
                link.classList.add('active');
            }
        });
    }

    // Scroll Animations
    const animatedElements = document.querySelectorAll('.hero-content, .hero-image, .section-header, .category-card, .product-card, .banner-content, .testimonial-card, .why-choose-card, .offer-card, .newsletter-content');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: unobserve after animating to only animate once
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav');
    
    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
});
