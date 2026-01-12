document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (!menuToggle || !sidebar) return;

    // Toggle sidebar when hamburger is clicked
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
});
