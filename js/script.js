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

    // Counter Animation for Achievements
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.getAttribute('data-target'));
                    const suffix = target.getAttribute('data-suffix') || '';
                    const duration = 2000; // ms
                    const stepTime = Math.abs(Math.floor(duration / finalValue));
                    
                    let current = 0;
                    const timer = setInterval(() => {
                        current += 1;
                        target.innerText = current + suffix;
                        if (current >= finalValue) {
                            clearInterval(timer);
                            target.innerText = finalValue + suffix;
                        }
                    }, stepTime < 10 ? 10 : stepTime);
                    
                    counterObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Shop Filtering Logic
    const shopFilters = document.querySelector('.shop-filters');
    if (shopFilters) {
        const products = document.querySelectorAll('.product-card');
        const checkboxes = shopFilters.querySelectorAll('input[type="checkbox"]');
        
        // Assigned categories mapping to match HTML counts
        const categoriesMap = [
            'skincare', 'face-makeup', 'skincare', 'skincare', 'face-makeup',
            'skincare', 'skincare', 'skincare', 'eye-makeup', 'eye-makeup',
            'skincare', 'lip-products', 'skincare', 'skincare', 'skincare',
            'face-makeup', 'hair-care', 'hair-care', 'face-makeup', 'eye-makeup',
            'lip-products'
        ];

        // Assign data attributes dynamically
        products.forEach((product, index) => {
            if(index < categoriesMap.length) {
                product.dataset.category = categoriesMap[index];
            }
            
            // Extract price
            const priceText = product.querySelector('.price')?.textContent || '';
            const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
            product.dataset.price = price;
            
            // Extract rating
            const fullStars = product.querySelectorAll('.fa-star:not(.fa-star-half-alt)').length;
            const halfStars = product.querySelectorAll('.fa-star-half-alt').length;
            product.dataset.rating = fullStars + (halfStars * 0.5);
        });

        const filterProducts = () => {
            const selectedCategories = Array.from(shopFilters.querySelectorAll('div[data-filter-group="category"] input:checked')).map(cb => cb.value);
            const selectedPrices = Array.from(shopFilters.querySelectorAll('div[data-filter-group="price"] input:checked')).map(cb => cb.value);
            const selectedRatings = Array.from(shopFilters.querySelectorAll('div[data-filter-group="rating"] input:checked')).map(cb => parseInt(cb.value));

            products.forEach(product => {
                let show = true;

                // Check Category
                if (selectedCategories.length > 0) {
                    if (!selectedCategories.includes(product.dataset.category)) {
                        show = false;
                    }
                }

                // Check Price
                if (show && selectedPrices.length > 0) {
                    const price = parseInt(product.dataset.price);
                    let priceMatch = false;
                    for (const range of selectedPrices) {
                        if (range === 'under-800' && price < 800) priceMatch = true;
                        if (range === '800-1200' && price >= 800 && price <= 1200) priceMatch = true;
                        if (range === '1200-1500' && price > 1200 && price <= 1500) priceMatch = true;
                        if (range === 'above-1500' && price > 1500) priceMatch = true;
                    }
                    if (!priceMatch) show = false;
                }

                // Check Rating
                if (show && selectedRatings.length > 0) {
                    const rating = parseFloat(product.dataset.rating);
                    let ratingMatch = false;
                    for (const r of selectedRatings) {
                        if (rating >= r) ratingMatch = true;
                    }
                    if (!ratingMatch) show = false;
                }

                if (show) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        };

        checkboxes.forEach(cb => {
            cb.addEventListener('change', filterProducts);
        });
    }
});
