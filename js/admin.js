/**
 * Churrasqueto Admin Panel - Firebase Version
 * Password: admin123
 */
import { db, storage } from './firebase-init.js';
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    deleteDoc,
    query,
    orderBy,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const ADMIN_PASSWORD = 'admin123';

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

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

// Static images currently in index.html
const DEFAULT_IMAGES = {
    gallery: [
        { id: 'static1', url: 'assets/images/event-green-table.jpg', isStatic: true },
        { id: 'static2', url: 'assets/images/event-balloons.jpg', isStatic: true },
        { id: 'static3', url: 'assets/images/event-birthday.jpg', isStatic: true },
        { id: 'static4', url: 'assets/images/event-formal.jpg', isStatic: true },
        { id: 'static5', url: 'assets/images/party-interior-1.jpg', isStatic: true },
        { id: 'static6', url: 'assets/images/party-interior-2.jpg', isStatic: true }
    ],
    events: [
        { id: 'static_ev1', url: 'assets/images/event-green-table.jpg', isStatic: true },
        { id: 'static_ev2', url: 'assets/images/event-balloons.jpg', isStatic: true },
        { id: 'static_ev3', url: 'assets/images/event-birthday.jpg', isStatic: true },
        { id: 'static_ev4', url: 'assets/images/event-formal.jpg', isStatic: true }
    ]
};

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
    loadInitialData();
}

function showLoginScreen() {
    loginScreen.style.display = 'flex';
    adminPanel.style.display = 'none';
    passwordInput.value = '';
}

// ===================================
// TABS
// ===================================
window.switchTab = function (tabName) {
    tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
    tabContents.forEach(content => content.classList.toggle('active', content.id === tabName + 'Tab'));
};

// ===================================
// FIREBASE OPERATIONS
// ===================================

async function handleMenuUpload(file) {
    if (!file) return;

    menuProgress.style.display = 'block';
    menuSuccess.style.display = 'none';
    const progressBar = menuProgress.querySelector('.progress-bar');

    const storageRef = ref(storage, 'menu/weekly-menu.jpg');
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.style.width = progress + '%';
        },
        (error) => console.error("Upload failed", error),
        async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            menuImage.src = downloadURL;
            menuProgress.style.display = 'none';
            menuSuccess.style.display = 'block';

            // Save to Firestore
            await setDoc(doc(db, "config", "menu"), { url: downloadURL, updatedAt: new Date() });
        }
    );
}

async function handleGalleryUpload(file, type) {
    if (!file) return;

    const storageRef = ref(storage, `${type}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', null,
        (error) => console.error("Upload failed", error),
        async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Save to Firestore
            const docRef = await addDoc(collection(db, type), {
                url: downloadURL,
                storagePath: uploadTask.snapshot.ref.fullPath,
                createdAt: new Date()
            });

            addPhotoToGrid(type, downloadURL, docRef.id, uploadTask.snapshot.ref.fullPath);

            const success = type === 'gallery' ? gallerySuccess : eventsSuccess;
            success.style.display = 'block';
            setTimeout(() => success.style.display = 'none', 3000);
        }
    );
}

// Modal Elements
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
let itemToDelete = null;

function addPhotoToGrid(type, url, id, storagePath, isStatic = false) {
    const grid = type === 'gallery' ? galleryGrid : eventsGrid;

    const placeholder = grid.querySelector('.placeholder');
    if (placeholder) placeholder.remove();

    const item = document.createElement('div');
    item.className = 'gallery-item';
    if (isStatic) item.classList.add('static-item');

    item.innerHTML = `
        <img src="${url}" alt="Photo">
        <button class="delete-btn" title="Supprimer">×</button>
        ${isStatic ? '<span class="static-badge">Site</span>' : ''}
    `;

    const deleteBtn = item.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showDeleteModal(type, id, storagePath, deleteBtn, isStatic);
    });

    grid.prepend(item);
}

function showDeleteModal(type, id, storagePath, btn, isStatic) {
    itemToDelete = { type, id, storagePath, btn, isStatic };
    deleteModal.classList.add('active');
}

function hideDeleteModal() {
    deleteModal.classList.remove('active');
    itemToDelete = null;
}

confirmDeleteBtn.addEventListener('click', async () => {
    if (!itemToDelete) return;

    const { type, id, storagePath, btn, isStatic } = itemToDelete;
    hideDeleteModal();

    try {
        if (!isStatic && id && storagePath) {
            // Delete from Firestore
            await deleteDoc(doc(db, type, id));

            // Delete from Storage
            const storageRef = ref(storage, storagePath);
            await deleteObject(storageRef);
            console.log("Supprimé de Firebase");
        }

        // Remove from DOM anyway
        const galleryItem = btn.closest('.gallery-item');
        if (galleryItem) galleryItem.remove();
    } catch (error) {
        console.error("Error deleting:", error);
        alert("Erreur lors de la suppression. Vérifiez votre connexion.");
    }
});

cancelDeleteBtn.addEventListener('click', hideDeleteModal);

// Close modal when clicking outside
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) hideDeleteModal();
});

async function loadInitialData() {
    // 1. Load Menu
    try {
        const menuDoc = await getDoc(doc(db, "config", "menu"));
        if (menuDoc.exists()) menuImage.src = menuDoc.data().url;
    } catch (e) { console.log("No menu doc yet"); }

    // Clear grids
    galleryGrid.innerHTML = '';
    eventsGrid.innerHTML = '';

    // 2. Load Firestore Data
    const loadFromFirestore = async (type) => {
        const q = query(collection(db, type), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
            const data = doc.data();
            addPhotoToGrid(type, data.url, doc.id, data.storagePath);
        });
    };

    await loadFromFirestore('gallery');
    await loadFromFirestore('events');

    // 3. Load Static Data (at the end)
    DEFAULT_IMAGES.gallery.forEach(p => addPhotoToGrid('gallery', p.url, p.id, '', true));
    DEFAULT_IMAGES.events.forEach(p => addPhotoToGrid('events', p.url, p.id, '', true));
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
    btn.addEventListener('click', () => window.switchTab(btn.dataset.tab));
});

menuUpload.addEventListener('change', (e) => handleMenuUpload(e.target.files[0]));
galleryUpload.addEventListener('change', (e) => handleGalleryUpload(e.target.files[0], 'gallery'));
eventsUpload.addEventListener('change', (e) => handleGalleryUpload(e.target.files[0], 'events'));

checkAuth();
