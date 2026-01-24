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

    // Contact form: basic submit feedback
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Show success message
            formMessage.textContent = 'Successfully submitted. We will reply shortly.';
            formMessage.classList.remove('hidden');
            formMessage.classList.add('success');

            contactForm.reset();

            // to hide the feedback message after 5 seconds
            setTimeout(function () {
                formMessage.classList.add('hidden');
                formMessage.classList.remove('success');
                formMessage.textContent = '';
            }, 5000);
        });
    }

    // Login form: basic submit feedback
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Redirect to index page
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

            // Validate that passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match. Please try again.');
                return;
            }

            // If passwords match, this will redirect to index page
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
});
