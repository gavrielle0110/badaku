document.documentElement.style.scrollBehavior = "smooth";
let isScrolling = false;
let lastScrollTime = 0;
const scrollCooldown = 5000; // Delay antar-scroll (dalam ms)

document.addEventListener('wheel', (event) => {
    const now = Date.now();
    if (isScrolling || (now - lastScrollTime < scrollCooldown)) return;

    event.preventDefault();
    isScrolling = true;
    lastScrollTime = now;

    const sections = document.querySelectorAll('section');
    const currentIndex = Math.round(window.scrollY / window.innerHeight);
    const direction = event.deltaY > 0 ? 1 : -1;
    const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));

    sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => { isScrolling = false; }, scrollCooldown);
}, { passive: false });

// Animasi div box
window.addEventListener("DOMContentLoaded", () => {
    const leftBox = document.querySelector(".animate-left");
    const rightBox = document.querySelector(".animate-right");
    const triggerSection = document.getElementById("trigger-section");

    if (!leftBox || !rightBox || !triggerSection) return;

    const observerAnimation = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    leftBox.classList.remove("fade-in-left");
                    rightBox.classList.remove("fade-in-right");
                    void leftBox.offsetWidth;
                    void rightBox.offsetWidth;
                    leftBox.classList.add("fade-in-left");
                    rightBox.classList.add("fade-in-right");
                }
            });
        },
        { threshold: 0.3 }
    );

    observerAnimation.observe(triggerSection);
});

// Animasi navbar
window.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector("nav");
    const firstSection = document.querySelector("section:first-of-type");

    if (!navbar || !firstSection) return;

    const observerNavbar = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    navbar.classList.remove("fade-out-nav");
                    navbar.classList.add("fade-in-nav");
                } else {
                    navbar.classList.remove("fade-in-nav");
                    navbar.classList.add("fade-out-nav");
                }
            });
        },
        { threshold: 0.3 }
    );

    observerNavbar.observe(firstSection);
});

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const menubar = document.querySelector('.menubar');

    // Toggle menu
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        menubar.classList.toggle('active');
        hamburger.classList.toggle('hamburger-active');
    });

    // Close menu klik di luar
    document.addEventListener('click', function(e) {
        if (!menubar.contains(e.target) && !hamburger.contains(e.target)) {
            menubar.classList.remove('active');
            hamburger.classList.remove('hamburger-active');
        }
    });

    // Close menu saat resize window ke desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menubar.classList.remove('active');
            hamburger.classList.remove('hamburger-active');
        }
    });
});
