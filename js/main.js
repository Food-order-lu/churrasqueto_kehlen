// ===================================
// CHURRASQUETO - JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    // Header scroll behavior
    const header = document.getElementById('header');

    function updateHeader() {
        if (window.scrollY > 100) {
            header.classList.remove('transparent');
            header.classList.add('scrolled');
        } else {
            header.classList.add('transparent');
            header.classList.remove('scrolled');
        }
    }

    // Initial check
    updateHeader();

    // Listen for scroll
    window.addEventListener('scroll', updateHeader);

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMobile = document.getElementById('navMobile');
    const closeNav = document.getElementById('closeNav');

    if (menuToggle && navMobile) {
        menuToggle.addEventListener('click', function () {
            navMobile.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeNav.addEventListener('click', function () {
            navMobile.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close menu when clicking a link
        navMobile.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMobile.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Language switch (basic toggle effect)
    const langButtons = document.querySelectorAll('.lang-switch button');
    langButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            langButtons.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
        });
    });

    // Add animation on scroll for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe section elements
    document.querySelectorAll('section').forEach(function (section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Make hero always visible
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'none';
    }
});
