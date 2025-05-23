// Firebase Configuration (firebase-config.js)
// Debes reemplazar con tus propias credenciales de Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Variables globales
let currentUser = null;

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const quoteBtn = document.getElementById('quote-btn');
const quoteModal = document.getElementById('quote-modal');
const quoteForm = document.getElementById('quote-form');
const contactForm = document.getElementById('contact-form');
const portfolioGrid = document.querySelector('.portfolio-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const scrollDown = document.querySelector('.scroll-down');

// Portfolio Data
const portfolioItems = [
    {
        id: 1,
        title: "Tienda Online Moda",
        category: "ecommerce",
        image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        title: "Landing Page Startup",
        category: "web",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        title: "App Móvil Restaurante",
        category: "mobile",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        title: "Sitio Web Corporativo",
        category: "web",
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        title: "Plataforma Educativa",
        category: "web",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        title: "App de Fitness",
        category: "mobile",
        image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Cargar portfolio
    renderPortfolioItems('all');

    // Verificar estado de autenticación
    auth.onAuthStateChanged(user => {
        currentUser = user;
        updateAuthUI();
    });
});

themeToggle.addEventListener('click', toggleTheme);
hamburger.addEventListener('click', toggleMobileMenu);
loginBtn.addEventListener('click', () => openModal(loginModal));
quoteBtn.addEventListener('click', () => openModal(quoteModal));
showRegister.addEventListener('click', switchAuthForms);
showLogin.addEventListener('click', switchAuthForms);
scrollDown.addEventListener('click', scrollToContent);

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', filterPortfolio);
});

// Formularios
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
contactForm.addEventListener('submit', handleContactSubmit);
quoteForm.addEventListener('submit', handleQuoteSubmit);

// Validación en tiempo real
setupFormValidation(contactForm);
setupFormValidation(loginForm);
setupFormValidation(registerForm);
setupFormValidation(quoteForm);

// Scroll suave para enlaces
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Cerrar menú móvil si está abierto
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Funciones
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
}

function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

function switchAuthForms(e) {
    e.preventDefault();
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
}

function scrollToContent() {
    window.scrollTo({
        top: document.getElementById('services').offsetTop - 80,
        behavior: 'smooth'
    });
}

function renderPortfolioItems(filter) {
    portfolioGrid.innerHTML = '';
    
    const itemsToShow = filter === 'all' 
        ? portfolioItems 
        : portfolioItems.filter(item => item.category === filter);
    
    itemsToShow.forEach(item => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.dataset.category = item.category;
        
        portfolioItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="portfolio-overlay">
                <h3>${item.title}</h3>
                <p>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</p>
            </div>
        `;
        
        portfolioGrid.appendChild(portfolioItem);
    });
}

function filterPortfolio() {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    renderPortfolioItems(filter);
}

function updateAuthUI() {
    if (currentUser) {
        loginBtn.textContent = 'Mi cuenta';
        // Aquí podrías agregar más lógica para cuando el usuario está autenticado
    } else {
        loginBtn.textContent = 'Iniciar sesión';
    }
}

function setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });
}

function validateInput(input) {
    const errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) return;
    
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    
    if (!input.required) return true;
    
    if (input.value.trim() === '') {
        errorElement.textContent = 'Este campo es requerido';
        errorElement.style.display = 'block';
        return false;
    }
    
    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        errorElement.textContent = 'Ingresa un email válido';
        errorElement.style.display = 'block';
        return false;
    }
    
    if (input.id === 'register-password' && input.value.length < 6) {
        errorElement.textContent = 'La contraseña debe tener al menos 6 caracteres';
        errorElement.style.display = 'block';
        return false;
    }
    
    if (input.id === 'register-confirm' && input.value !== document.getElementById('register-password').value) {
        errorElement.textContent = 'Las contraseñas no coinciden';
        errorElement.style.display = 'block';
        return false;
    }
    
    return true;
}

// Handlers de formularios
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        closeModal();
    } catch (error) {
        const errorElement = document.querySelector('#login-form .error-message');
        if (errorElement) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        }
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    // Validación adicional
    if (password !== confirm) {
        const errorElement = document.getElementById('register-confirm').nextElementSibling;
        errorElement.textContent = 'Las contraseñas no coinciden';
        errorElement.style.display = 'block';
        return;
    }
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Guardar información adicional del usuario en Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        closeModal();
    } catch (error) {
        const errorElement = document.querySelector('#register-form .error-message');
        if (errorElement) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        }
    }
}

async function handleContactSubmit(e) {
    e.preventDefault();
    
    // Validar todos los campos
    let isValid = true;
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateInput(input)) isValid = false;
    });
    
    if (!isValid) return;
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    try {
        await db.collection('contacts').add({
            name: name,
            email: email,
            phone: phone || 'No proporcionado',
            message: message,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Mostrar mensaje de éxito
        contactForm.reset();
        const successElement = document.getElementById('form-success');
        successElement.style.display = 'block';
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        alert('Ocurrió un error al enviar tu mensaje. Por favor intenta nuevamente.');
    }
}

async function handleQuoteSubmit(e) {
    e.preventDefault();
    
    // Validar todos los campos
    let isValid = true;
    const inputs = quoteForm.querySelectorAll('select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateInput(input)) isValid = false;
    });
    
    if (!isValid) return;
    
    const projectType = document.getElementById('project-type').value;
    const projectDetails = document.getElementById('project-details').value;
    const budget = document.getElementById('budget').value;
    const timeline = document.getElementById('timeline').value;
    
    try {
        await db.collection('quotes').add({
            projectType: projectType,
            projectDetails: projectDetails,
            budget: budget || 'No especificado',
            timeline: timeline || 'No especificado',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            userId: currentUser ? currentUser.uid : null,
            status: 'pending'
        });
        
        // Mostrar mensaje de éxito
        quoteForm.reset();
        const successElement = document.getElementById('quote-success');
        successElement.style.display = 'block';
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            successElement.style.display = 'none';
            closeModal();
        }, 5000);
    } catch (error) {
        console.error('Error al enviar la cotización:', error);
        alert('Ocurrió un error al enviar tu solicitud. Por favor intenta nuevamente.');
    }
}