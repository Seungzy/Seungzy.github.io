document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        // Toggle sidebar
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });

        // Close sidebar when a link inside it is clicked
        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                sidebar.classList.remove('active');
            });
        });

        // Close sidebar when clicking outside of it
        document.addEventListener('click', function (event) {
            if (!event.target.closest('.sidebar') && !event.target.closest('.menu-toggle')) {
                sidebar.classList.remove('active');
            }
        });
    }



    // ============= SHOPPING CART MANAGEMENT =============
    initializeShoppingCart();
    
    // Only initialize shopping cart page if on ShoppingCart.html
    if (document.getElementById('cartTable')) {
        initializeShoppingCartPage();
    }

    // ============= TRANSACTION CONFIRMATION PAGE =============
    initializeTransactionConfirmation();
    initializeTransactionConfirmationPage();

    // Contact form: basic submit
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            contactForm.reset();
        });
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }

    // Sign up form: validation and submit feedback
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match. Please try again.');
                return;
            }

            window.location.href = 'index.html';
        });
    }

    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }

    // Cart total calculation for ShoppingCart.html
    (function() {
        const table = document.getElementById('cartTable');
        if (table) {
            function updateTotal() {
                let subtotal = 0;
                table.querySelectorAll('tbody tr').forEach(row => {
                    const price = parseFloat(row.querySelector('.price').textContent);
                    const qty = parseInt(row.querySelector('.qty').value);
                    const itemSubtotal = price * qty;
                    row.querySelector('.subtotal').textContent = itemSubtotal.toFixed(2);
                    subtotal += itemSubtotal;
                });
                const total = subtotal;
                
                document.getElementById('cartSubtotal').textContent = '₱' + subtotal.toFixed(2);
                document.getElementById('cartTotal').textContent = '₱' + total.toFixed(2);
            }
            table.addEventListener('input', function(e) {
                if (e.target.classList.contains('qty')) updateTotal();
            });
            updateTotal();
        }
    })();

    // Payment form toggle for PaymentDelivery.html
    (function() {
        const form = document.getElementById('paymentForm');
        const cardDetails = document.getElementById('cardDetails');
        if (form && cardDetails) {
            form.payment.forEach(radio => {
                radio.addEventListener('change', function() {
                    cardDetails.style.display = (this.value === 'card') ? '' : 'none';
                });
            });
            if (form.payment.value !== 'card') cardDetails.style.display = 'none';
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                window.location.href = 'TransactionConfirmation.html';
            });
        }
        
        // Handle proceed to payment button in PaymentDelivery.html
        const payOrderBtn = document.querySelector('.pay-order-btn');
        if (payOrderBtn && !form) {
            payOrderBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = payOrderBtn.getAttribute('href');
            });
        }
    })();
});


//SHOPPING CART MANAGEMENT
function initializeShoppingCart() {
    // Cart management using localStorage
    window.cart = JSON.parse(localStorage.getItem('cart')) || [];

    window.addToCart = function(id, name, price) {
        const existingItem = cart.find(item => item.id == id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        showCartNotification(`${name} added to cart!`);
    };

    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id != id);
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    window.updateCartQuantity = function(id, quantity) {
        const item = cart.find(item => item.id == id);
        if (item) {
            item.quantity = Math.max(1, quantity);
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    };

    window.clearCart = function() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
    };
}

//TRANSACTION CONFIRMATION
function initializeTransactionConfirmation() {
    const receiptItems = document.getElementById('receiptItems');
    if (!receiptItems) return;

    // Set current date and time
    const now = new Date();
    document.getElementById('orderDate').textContent = now.toLocaleDateString();
    document.getElementById('orderTime').textContent = now.toLocaleTimeString();

    // Populate receipt items from cart
    if (window.cart && window.cart.length > 0) {
        let subtotal = 0;
        receiptItems.innerHTML = window.cart.map(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            return `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₱${item.price.toFixed(2)}</td>
                    <td>₱${itemTotal.toFixed(2)}</td>
                </tr>
            `;
        }).join('');

        const deliveryFee = 50;
        const total = subtotal + deliveryFee;

        document.getElementById('receiptSubtotal').textContent = '₱' + subtotal.toFixed(2);
        document.getElementById('receiptDeliveryFee').textContent = '₱' + deliveryFee.toFixed(2);
        document.getElementById('receiptTotal').textContent = '₱' + total.toFixed(2);
    }
}

// Notification for cart
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// SHOPPING CART PAGE - Save cart data when proceeding to payment
function initializeShoppingCartPage() {
    const proceedButton = document.querySelector('.proceed-btn');
    if (proceedButton) {
        proceedButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const cartItems = [];
            const rows = document.querySelectorAll('#cartTable tbody tr');
            
            rows.forEach(row => {
                const product = row.querySelector('td:nth-child(1)').textContent;
                const price = parseFloat(row.querySelector('td:nth-child(2)').textContent);
                const quantity = parseInt(row.querySelector('input.qty').value);
                const subtotal = parseFloat(row.querySelector('td:nth-child(4)').textContent);
                
                if (quantity > 0) {
                    cartItems.push({
                        product: product,
                        price: price,
                        quantity: quantity,
                        subtotal: subtotal
                    });
                }
            });
            
            // Store cart data in sessionStorage
            sessionStorage.setItem('cartData', JSON.stringify(cartItems));
            
            // Store totals
            const subtotal = document.getElementById('cartSubtotal').textContent;
            const total = document.getElementById('cartTotal').textContent;
            
            sessionStorage.setItem('cartTotals', JSON.stringify({
                subtotal: subtotal,
                total: total
            }));
            
            // Navigate to PaymentDelivery
            window.location.href = proceedButton.getAttribute('href');
        });
    }
}

// TRANSACTION CONFIRMATION PAGE - Load and display cart data
function initializeTransactionConfirmationPage() {
    const receiptItemsBody = document.getElementById('receiptItems');
    if (!receiptItemsBody) return;
    
    // Retrieve cart data from sessionStorage
    const cartData = JSON.parse(sessionStorage.getItem('cartData') || '[]');
    const cartTotals = JSON.parse(sessionStorage.getItem('cartTotals') || '{"subtotal":"₱0.00","total":"₱0.00"}');
    
    // Populate receipt items
    receiptItemsBody.innerHTML = '';
    
    cartData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.quantity}x</td>
            <td>₱${item.price.toFixed(2)}</td>
            <td>₱${item.subtotal.toFixed(2)}</td>
        `;
        receiptItemsBody.appendChild(row);
    });
    
    // Update totals
    document.getElementById('receiptSubtotal').textContent = cartTotals.subtotal;
    
    // Calculate total
    const subtotalAmount = parseFloat(cartTotals.subtotal.replace('₱', ''));
    document.getElementById('receiptTotal').textContent = '₱' + subtotalAmount.toFixed(2);
    
    // Set current date and time
    const now = new Date();
    document.getElementById('orderDate').textContent = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('orderTime').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
