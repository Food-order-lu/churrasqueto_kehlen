/**
 * CHURRASQUETO - Main Website (Firebase Version)
 */
import { db } from './firebase-init.js';
import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

    updateHeader();
    window.addEventListener('scroll', updateHeader);

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMobile = document.getElementById('navMobile');
    const closeNav = document.getElementById('closeNav');

    if (menuToggle && navMobile) {
        menuToggle.addEventListener('click', () => {
            navMobile.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeNav.addEventListener('click', () => {
            navMobile.classList.remove('active');
            document.body.style.overflow = '';
        });

        navMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMobile.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const targetPosition = targetElement.offsetTop - (header.offsetHeight || 80);
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Language switch
    const langButtons = document.querySelectorAll('.lang-switch button');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Observe sections for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    const hero = document.querySelector('.hero');
    if (hero) { hero.style.opacity = '1'; hero.style.transform = 'none'; }

    // ===================================
    // LOAD FIREBASE CONTENT
    // ===================================
    async function loadFirebaseContent() {
        // Helper to get image URL from both formats
        const getImgUrl = (data) => data.url || data.imageUrl || '';

        // Helper to get date regardless of format (String or Timestamp)
        const getDate = (data) => {
            if (!data.createdAt) return 0;
            if (data.createdAt.seconds) return data.createdAt.seconds * 1000;
            return new Date(data.createdAt).getTime();
        };

        // 1. Weekly Menu
        try {
            const menuDoc = await getDoc(doc(db, "config", "menu"));
            if (menuDoc.exists()) {
                document.getElementById('weeklyMenuImg').src = getImgUrl(menuDoc.data());
            }
        } catch (e) { console.log("Menu not set in Firebase"); }

        // 2. Events Photos (Faça seu evento conosco)
        const eventsContainer = document.querySelector('.events-photos-grid');
        if (eventsContainer) {
            try {
                const q = query(collection(db, 'events'), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);

                // Clear existing dynamic photos if we want a fresh list or just append
                // Let's clear to avoid duplicates on refresh
                const existingPhotos = eventsContainer.querySelectorAll('.events-photo-item:not(.static)');
                existingPhotos.forEach(p => p.remove());

                snapshot.forEach(docSnap => {
                    const data = docSnap.data();
                    const item = document.createElement('div');
                    item.className = 'events-photo-item';
                    item.innerHTML = `<img src="${getImgUrl(data)}" alt="Event Photo">`;
                    eventsContainer.appendChild(item); // Append because sorted desc
                });
            } catch (e) { console.error("Error loading events:", e); }
        }

        // 3. Gallery Photos
        const galleryContainer = document.querySelector('#galerie .gallery-grid');
        if (galleryContainer) {
            try {
                const q = query(collection(db, 'gallery'), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);

                snapshot.forEach(docSnap => {
                    const data = docSnap.data();
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.innerHTML = `
                        <img src="${getImgUrl(data)}" alt="Gallery Photo">
                        <div class="overlay"><span>${data.title || 'Photo Restaurant'}</span></div>
                    `;
                    galleryContainer.appendChild(item);
                });
            } catch (e) { console.error("Error loading gallery:", e); }
        }
    }

    loadFirebaseContent();
});
