// cart.js - Handles global shopping cart state

let cartItems = JSON.parse(localStorage.getItem('stackly_cart')) || [];

function saveCart() {
    localStorage.setItem('stackly_cart', JSON.stringify(cartItems));
    updateCartBadge();
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    badges.forEach(badge => {
        badge.textContent = totalItems;
    });
}

function addToCart(product) {
    const existingItem = cartItems.find(item => item.title === product.title);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }
    saveCart();
    showToast(`Added to cart!`);
}

function showToast(message) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        document.body.appendChild(toast);
        
        // Basic toast styles
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.right = '30px';
        toast.style.backgroundColor = 'var(--primary-color)';
        toast.style.color = 'white';
        toast.style.padding = '12px 25px';
        toast.style.borderRadius = '30px';
        toast.style.boxShadow = '0 5px 15px rgba(203,106,120,0.4)';
        toast.style.zIndex = '9999';
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.fontWeight = '500';
    }
    
    toast.textContent = message;
    
    // Trigger reflow
    void toast.offsetWidth;
    
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 3000);
}

// Bind add-to-cart buttons
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    
    const addBtns = document.querySelectorAll('.add-to-cart-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Find parent product card
            const card = e.target.closest('.product-card');
            if (card) {
                const titleEl = card.querySelector('h3, .product-title');
                const title = titleEl ? titleEl.textContent.trim() : 'Unknown Product';
                
                let priceText = '0.00';
                const priceEl = card.querySelector('.product-price');
                if (priceEl) {
                    // Extract main price ignoring crossed-out old prices
                    const clone = priceEl.cloneNode(true);
                    const oldPrices = clone.querySelectorAll('.old-price, .original-price');
                    oldPrices.forEach(el => el.remove());
                    priceText = clone.textContent.trim();
                }
                
                const imgEl = card.querySelector('img');
                const imgSrc = imgEl ? imgEl.getAttribute('src') : '';
                
                // Parse price to number
                const priceMatch = priceText.match(/[\d,.]+/);
                const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '')) : 0;
                
                // Get currency symbol
                const currencyMatch = priceText.match(/^[^\d]+/);
                const currency = currencyMatch ? currencyMatch[0].trim() : '₹';
                
                addToCart({
                    title,
                    price,
                    image: imgSrc,
                    formattedPrice: priceText,
                    currency: currency
                });
            }
        });
    });
});

// Render Cart Page if we are on cart.html
function renderCartPage() {
    const cartLayout = document.getElementById('cart-layout');
    const emptyMessage = document.getElementById('empty-cart-message');
    const itemsList = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    
    if (!cartLayout || !emptyMessage || !itemsList) return; // Not on cart page
    
    if (cartItems.length === 0) {
        cartLayout.style.display = 'none';
        emptyMessage.style.display = 'block';
        return;
    }
    
    // Show layout
    cartLayout.style.display = 'grid';
    emptyMessage.style.display = 'none';
    
    // Render items
    itemsList.innerHTML = '';
    let subtotal = 0;
    
    cartItems.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.currency || '₹'}${(item.price).toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus-btn" data-index="${index}"><i class="fas fa-minus"></i></button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn plus-btn" data-index="${index}"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <button class="remove-btn" data-index="${index}" title="Remove item"><i class="fas fa-trash"></i></button>
        `;
        itemsList.appendChild(itemEl);
    });
    
    // Update summary
    const currency = cartItems[0]?.currency || '₹';
    subtotalEl.textContent = `${currency}${subtotal.toFixed(2)}`;
    totalEl.textContent = `${currency}${subtotal.toFixed(2)}`;
    
    // Bind buttons
    document.querySelectorAll('.minus-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.getAttribute('data-index');
            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity--;
            } else {
                cartItems.splice(index, 1);
            }
            saveCart();
            renderCartPage();
        });
    });
    
    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.getAttribute('data-index');
            cartItems[index].quantity++;
            saveCart();
            renderCartPage();
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.getAttribute('data-index');
            cartItems.splice(index, 1);
            saveCart();
            renderCartPage();
        });
    });
}

// Call renderCartPage on DOM load
document.addEventListener('DOMContentLoaded', renderCartPage);
