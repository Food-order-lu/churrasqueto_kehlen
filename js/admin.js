/**
 * Churrasqueto Admin Panel
 * Password: admin123
 */

const ADMIN_PASSWORD = 'admin123';

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Tab Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Upload Elements
const menuUpload = document.getElementById('menuUpload');
const menuImage = document.getElementById('menuImage');
const menuProgress = document.getElementById('menuProgress');
const menuSuccess = document.getElementById('menuSuccess');

const galleryUpload = document.getElementById('galleryUpload');
const galleryGrid = document.getElementById('galleryGrid');
const gallerySuccess = document.getElementById('gallerySuccess');

const eventsUpload = document.getElementById('eventsUpload');
const eventsGrid = document.getElementById('eventsGrid');
const eventsSuccess = document.getElementById('eventsSuccess');

// ===================================
// AUTHENTICATION
// ===================================
function checkAuth() {
    const auth = sessionStorage.getItem('churrasqueto_admin');
    if (auth === 'true') {
        showAdminPanel();
    }
}

function login(password) {
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('churrasqueto_admin', 'true');
        showAdminPanel();
        loginError.textContent = '';
        return true;
    } else {
        loginError.textContent = 'Mot de passe incorrect';
        return false;
    }
}

function logout() {
    sessionStorage.removeItem('churrasqueto_admin');
    showLoginScreen();
}

function showAdminPanel() {
    loginScreen.style.display = 'none';
    adminPanel.style.display = 'block';
}

function showLoginScreen() {
    loginScreen.style.display = 'flex';
    adminPanel.style.display = 'none';
    passwordInput.value = '';
}

// ===================================
// TABS
// ===================================
function switchTab(tabName) {
    // Update buttons
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update content
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabName + 'Tab');
    });
}

// ===================================
// FILE UPLOAD (Local Preview)
// ===================================
function handleMenuUpload(file) {
    if (!file) return;

    // Show progress
    menuProgress.style.display = 'block';
    menuSuccess.style.display = 'none';

    const progressBar = menuProgress.querySelector('.progress-bar');

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(interval);

            // Show local preview
            const reader = new FileReader();
            reader.onload = (e) => {
                menuImage.src = e.target.result;
                menuProgress.style.display = 'none';
                menuSuccess.style.display = 'block';

                // TODO: Upload to Firebase/Cloudinary when configured
                console.log('Menu image ready for upload:', file.name);
            };
            reader.readAsDataURL(file);
        }
    }, 100);
}

function handleGalleryUpload(file, type) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const grid = type === 'gallery' ? galleryGrid : eventsGrid;
        const success = type === 'gallery' ? gallerySuccess : eventsSuccess;

        // Remove placeholder if exists
        const placeholder = grid.querySelector('.placeholder');
        if (placeholder) placeholder.remove();

        // Create new gallery item
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${e.target.result}" alt="Photo">
            <button class="delete-btn" onclick="deleteGalleryItem(this)">×</button>
        `;
        grid.prepend(item);

        // Show success
        success.style.display = 'block';
        setTimeout(() => success.style.display = 'none', 3000);

        // TODO: Upload to Firebase/Cloudinary when configured
        console.log(`${type} image ready for upload:`, file.name);
    };
    reader.readAsDataURL(file);
}

function deleteGalleryItem(btn) {
    if (confirm('Supprimer cette image ?')) {
        btn.closest('.gallery-item').remove();
        // TODO: Delete from Firebase when configured
    }
}

// ===================================
// EVENT LISTENERS
// ===================================
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    login(passwordInput.value);
});

logoutBtn.addEventListener('click', logout);

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

menuUpload.addEventListener('change', (e) => {
    handleMenuUpload(e.target.files[0]);
});

galleryUpload.addEventListener('change', (e) => {
    handleGalleryUpload(e.target.files[0], 'gallery');
});

eventsUpload.addEventListener('change', (e) => {
    handleGalleryUpload(e.target.files[0], 'events');
});

// Check auth on load
checkAuth();

console.log('🔥 Churrasqueto Admin loaded. Password: admin123');
