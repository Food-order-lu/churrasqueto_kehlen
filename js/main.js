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

    // ===================================
    // LANGUAGE SYSTEM
    // ===================================
    const translations = {
        fr: {
            "nav.home": "Accueil",
            "nav.menu": "Rodízio & Carte",
            "nav.events": "Événements",
            "nav.gallery": "Galerie",
            "nav.contact": "Contact",
            "btn.reserve": "Réserver une table",
            "btn.reserve_header": "Réserver",
            "hero.title": "Churrasqueto Picanha",
            "hero.subtitle": "Rodízio brésilien à volonté au Luxembourg",
            "hero.description": "Picanha, rodízio complet, plats brésiliens et organisation d'événements à Kehlen",
            "hero.btn_reserve": "Réserver une table",
            "hero.btn_menu": "Voir le menu",
            "menu_semaine.title": "Menu de la Semaine",
            "menu_semaine.subtitle": "Découvrez nos plats du jour, mis à jour chaque semaine",
            "menu_semaine.this_week": "Cette semaine",
            "menu.title": "Rodízio & Carte",
            "menu.rodizio_volonte": "Rodízio à Volonté",
            "menu.rod_complet": "Rodízio Complet",
            "menu.rod_complet_desc": "Toutes les viandes à volonté avec buffet de salades et accompagnements",
            "menu.rod_picanha": "Rodízio Picanha",
            "menu.rod_picanha_desc": "Notre spécialité : la meilleure picanha servie à volonté",
            "menu.rod_brochette": "Rodízio Brochette",
            "menu.rod_brochette_desc": "Sélection de brochettes variées avec accompagnements",
            "menu.rod_enfant": "Rodízio Enfant",
            "menu.rod_enfant_desc": "Menu enfant jusqu'à 12 ans avec dessert inclus",
            "menu.seafood_title": "Plats à base de crevettes et morue",
            "menu.shrimp_grilled": "Crevettes grillées",
            "menu.shrimp_grilled_desc": "Crevettes géantes grillées avec riz et sauce épicée",
            "menu.shrimp_garlic": "Crevettes à l'ail",
            "menu.shrimp_garlic_desc": "Crevettes sautées à l'ail avec légumes du jour",
            "menu.cod_braise": "Morue à la braise",
            "menu.cod_braise_desc": "Filet de morue grillé avec pommes de terre et légumes",
            "menu.cod_bras": "Bacalhau à Brás",
            "menu.cod_bras_desc": "Recette traditionnelle portugaise de morue effilochée",
            "menu.lunch_title": "Formules de midi",
            "menu.lunch_express": "Menu Express",
            "menu.lunch_express_desc": "Plat du jour + boisson",
            "menu.lunch_complet": "Menu Complet",
            "menu.lunch_complet_desc": "Entrée + plat du jour + dessert",
            "menu.lunch_grill": "Menu Grill",
            "menu.lunch_grill_desc": "Viande grillée + accompagnements + boisson",
            "menu.lunch_premium": "Menu Premium",
            "menu.lunch_premium_desc": "Entrée + viande au choix + dessert + boisson",
            "events.title": "Faça seu evento conosco",
            "events.type_events": "Événements",
            "events.type_parties": "Fêtes",
            "events.type_birthdays": "Anniversaires",
            "events.type_weddings": "Mariages",
            "events.type_corporate": "Événements d'entreprise",
            "events.type_baptisms": "Baptêmes",
            "events.type_communions": "Communions",
            "events.type_others": "Entre autres",
            "events.quote_main": "\"Nous organisons tout, libérez vous.\"",
            "events.quote_subtitle": "Du concept à la décoration, de la cuisine au service - nous prenons soin de chaque détail de votre événement",
            "events.btn_whatsapp": "Agendar seu événement pelo WhatsApp",
            "gallery.item1": "Décoration de table",
            "gallery.item2": "Décoration ballons",
            "gallery.item3": "Anniversaire enfant",
            "gallery.item4": "Soirée élégante",
            "gallery.item5": "Ambiance festive",
            "gallery.item6": "Espace événements",
            "contact.title": "Infos & Contact",
            "contact.hours_title": "Nos horaires",
            "days.monday": "Lundi",
            "days.tuesday": "Mardi",
            "days.wednesday": "Mercredi",
            "days.thursday": "Jeudi",
            "days.friday": "Vendredi",
            "days.saturday": "Samedi",
            "days.sunday": "Dimanche",
            "hours.closed": "Fermé",
            "footer.about_title": "Churrasqueto Picanha",
            "footer.about_text": "Restaurant brésilien authentique au Luxembourg. Venez découvrir notre rodízio à volonté, notre sélection de viandes grillées et notre ambiance chaleureuse. Nous organisons également vos événements privés.",
            "footer.links_title": "Navigation",
            "footer.contact_title": "Contact",
            "footer.copy": "© 2026 Churrasqueto Picanha - Tous droits réservés"
        },
        pt: {
            "nav.home": "Início",
            "nav.menu": "Rodízio & Carta",
            "nav.events": "Eventos",
            "nav.gallery": "Galeria",
            "nav.contact": "Contacto",
            "btn.reserve": "Reservar uma mesa",
            "btn.reserve_header": "Reservar",
            "hero.title": "Churrasqueto Picanha",
            "hero.subtitle": "Rodízio brasileiro à discrição no Luxemburgo",
            "hero.description": "Picanha, rodízio completo, pratos brasileiros e organização de eventos em Kehlen",
            "hero.btn_reserve": "Reservar uma mesa",
            "hero.btn_menu": "Ver o menu",
            "menu_semaine.title": "Menu da Semana",
            "menu_semaine.subtitle": "Descubra os nossos pratos do dia, atualizados semanalmente",
            "menu_semaine.this_week": "Esta semana",
            "menu.title": "Rodízio & Carta",
            "menu.rodizio_volonte": "Rodízio à Discrição",
            "menu.rod_complet": "Rodízio Completo",
            "menu.rod_complet_desc": "Todas as carnes à discrição com buffet de saladas e acompanhamentos",
            "menu.rod_picanha": "Rodízio de Picanha",
            "menu.rod_picanha_desc": "A nossa especialidade: a melhor picanha servida à discrição",
            "menu.rod_brochette": "Rodízio de Espetadas",
            "menu.rod_brochette_desc": "Seleção de espetadas variadas com acompanhamentos",
            "menu.rod_enfant": "Rodízio Infantil",
            "menu.rod_enfant_desc": "Menu infantil até aos 12 anos com sobremesa incluída",
            "menu.seafood_title": "Pratos de camarão e bacalhau",
            "menu.shrimp_grilled": "Camarão grelhado",
            "menu.shrimp_grilled_desc": "Camarões gigantes grelhados com arroz e molho picante",
            "menu.shrimp_garlic": "Camarão ao alho",
            "menu.shrimp_garlic_desc": "Camarões salteados ao alho com legumes do dia",
            "menu.cod_braise": "Bacalhau na brasa",
            "menu.cod_braise_desc": "Filete de bacalhau grelhado com batatas e legumes",
            "menu.cod_bras": "Bacalhau à Brás",
            "menu.cod_bras_desc": "Receita tradicional portuguesa de bacalhau desfiado",
            "menu.lunch_title": "Fórmulas de almoço",
            "menu.lunch_express": "Menu Expresso",
            "menu.lunch_express_desc": "Prato do dia + bebida",
            "menu.lunch_complet": "Menu Completo",
            "menu.lunch_complet_desc": "Entrada + prato do dia + sobremesa",
            "menu.lunch_grill": "Menu Grelhados",
            "menu.lunch_grill_desc": "Carne grelhada + acompanhamentos + bebida",
            "menu.lunch_premium": "Menu Premium",
            "menu.lunch_premium_desc": "Entrada + carne à escolha + sobremesa + bebida",
            "events.title": "Faça o seu evento connosco",
            "events.type_events": "Eventos",
            "events.type_parties": "Festas",
            "events.type_birthdays": "Aniversários",
            "events.type_weddings": "Casamentos",
            "events.type_corporate": "Eventos corporativos",
            "events.type_baptisms": "Batizados",
            "events.type_communions": "Comunhões",
            "events.type_others": "Entre outros",
            "events.quote_main": "\"Nós organizamos tudo, liberte-se.\"",
            "events.quote_subtitle": "Do conceito à decoração, da cozinha ao serviço - cuidamos de cada detalhe do seu evento",
            "events.btn_whatsapp": "Agendar o seu evento pelo WhatsApp",
            "gallery.item1": "Decoração de mesa",
            "gallery.item2": "Decoração de balões",
            "gallery.item3": "Aniversário infantil",
            "gallery.item4": "Noite elegante",
            "gallery.item5": "Ambiente festivo",
            "gallery.item6": "Espaço de eventos",
            "contact.title": "Infos & Contacto",
            "contact.hours_title": "Os nossos horários",
            "days.monday": "Segunda-feira",
            "days.tuesday": "Terça-feira",
            "days.wednesday": "Quarta-feira",
            "days.thursday": "Quinta-feira",
            "days.friday": "Sexta-feira",
            "days.saturday": "Sábado",
            "days.sunday": "Domingo",
            "hours.closed": "Fechado",
            "footer.about_title": "Churrasqueto Picanha",
            "footer.about_text": "Restaurante brasileiro autêntico no Luxemburgo. Venha descobrir o nosso rodízio à discrição, a nossa seleção de carnes grelhadas e o nosso ambiente acolhedor. Também organizamos os seus eventos privados.",
            "footer.links_title": "Navegação",
            "footer.contact_title": "Contacto",
            "footer.copy": "© 2026 Churrasqueto Picanha - Todos os direitos reservados"
        }
    };

    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });
        // Update html lang attribute
        document.documentElement.lang = lang;
        // Save preference
        localStorage.setItem('preferredLanguage', lang);
    }

    // Language switch buttons
    const langButtons = document.querySelectorAll('.lang-switch button');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateLanguage(lang);
        });
    });

    // Check for saved language
    const savedLang = localStorage.getItem('preferredLanguage') || 'fr';
    if (savedLang !== 'fr') {
        const activeBtn = document.querySelector(`.lang-switch button[data-lang="${savedLang}"]`);
        if (activeBtn) {
            langButtons.forEach(b => b.classList.remove('active'));
            activeBtn.classList.add('active');
            updateLanguage(savedLang);
        }
    }

    loadFirebaseContent();
});
