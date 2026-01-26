document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (!menuToggle || !sidebar) return;

    // Toggle sidebar
    menuToggle.addEventListener('click', function (e) {
        e.stopPropagation(); // prevent document click handler from immediately closing it
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
    // this is the logout button, it will redirect to home page
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
                const tax = subtotal * 0.12; // 12% tax
                const total = subtotal + tax;
                
                document.getElementById('cartSubtotal').textContent = '₱' + subtotal.toFixed(2);
                document.getElementById('cartTax').textContent = '₱' + tax.toFixed(2);
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
            // Hide card details
            if (form.payment.value !== 'card') cardDetails.style.display = 'none';
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Order placed successfully!');
            });
        }
    })();
});
