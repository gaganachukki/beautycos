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

// Bind add-to-cart buttons
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    
    const addBtns = document.querySelectorAll('.add-to-cart-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '404.html';
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
