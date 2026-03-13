/* SOS SERVICES — JS Partagé */
'use strict';

// ── DATA ──

// ── SECURITY: HTML escape pour prévenir XSS ──
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
const properties = [
  {
    id:1, type:"Appartement", transaction:"vente", city:"Paris 16e", price:890000,
    surface:95, rooms:4, bathrooms:2, floor:"3e/6", dpe:"B",
    lat:48.863, lng:2.275,
    title:"Appartement haussmannien lumineux",
    desc:"Superbe appartement en plein cœur du 16e arrondissement, avec vue dégagée, parquet ancien, moulures et double exposition. Cuisine équipée, cave et gardien.",
    img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    tags:["Haussmannien","Parquet","Cave","Gardien"], features:{parking:false,terrace:true,garden:false,pool:false,elevator:true},
    date: new Date('2025-03-01'), agency:"Agence Prestige Paris", visitFee:30
  },
  {
    id:2, type:"Maison", transaction:"vente", city:"Lyon 5e", price:650000,
    surface:140, rooms:5, bathrooms:2, floor:"RDC", dpe:"C",
    lat:45.762, lng:4.822,
    title:"Belle maison avec jardin privatif",
    desc:"Maison familiale au calme avec grand jardin de 300m², terrasse couverte, sous-sol complet et garage double. Proche des commodités et écoles.",
    img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    tags:["Jardin","Garage","Sous-sol","Calme"], features:{parking:true,terrace:true,garden:true,pool:false,elevator:false},
    date: new Date('2025-02-15'), agency:"Lyon Immo Conseil", visitFee:25
  },
  {
    id:3, type:"Studio", transaction:"location", city:"Marseille", price:750,
    surface:28, rooms:1, bathrooms:1, floor:"2e/5", dpe:"D",
    lat:43.297, lng:5.381,
    title:"Studio meublé proche mer",
    desc:"Studio entièrement meublé à 5 minutes à pied de la plage. Kitchenette équipée, salle d'eau, box en sous-sol. Idéal pour étudiant ou premier logement.",
    img:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    tags:["Meublé","Proche mer","Box"], features:{parking:false,terrace:false,garden:false,pool:false,elevator:false},
    date: new Date('2025-03-10'), agency:"Sud Immo Marseille", visitFee:15
  },
  {
    id:4, type:"Villa", transaction:"vente", city:"Nice", price:1450000,
    surface:220, rooms:7, bathrooms:3, floor:"RDC+1", dpe:"A",
    lat:43.710, lng:7.262,
    title:"Villa d'architecte avec piscine",
    desc:"Magnifique villa contemporaine avec vue mer panoramique, piscine à débordement, cuisine ouverte design, dressing, terrasses multiples et jardin paysagé.",
    img:"https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
    tags:["Vue mer","Piscine","Contemporaine","Terrasses"], features:{parking:true,terrace:true,garden:true,pool:true,elevator:false},
    date: new Date('2025-01-20'), agency:"Côte d'Azur Luxury", visitFee:50
  },
  {
    id:5, type:"Appartement", transaction:"location", city:"Bordeaux", price:1200,
    surface:65, rooms:3, bathrooms:1, floor:"1e/4", dpe:"C",
    lat:44.837, lng:-0.579,
    title:"T3 rénové centre historique",
    desc:"Bel appartement T3 entièrement rénové avec matériaux de qualité, parquet massif, cuisine ouverte et balcon. Très bien situé à 2 min des trams.",
    img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    tags:["Rénové","Balcon","Parquet","Tram"], features:{parking:false,terrace:true,garden:false,pool:false,elevator:false},
    date: new Date('2025-03-05'), agency:"Bordeaux Habitat", visitFee:20
  },
  {
    id:6, type:"Maison", transaction:"location", city:"Nantes", price:1800,
    surface:110, rooms:5, bathrooms:2, floor:"RDC", dpe:"B",
    lat:47.218, lng:-1.553,
    title:"Maison familiale avec garage",
    desc:"Grande maison familiale avec jardin clos, garage double, 4 chambres, bureau et buanderie. Quartier résidentiel calme, proche écoles et commerces.",
    img:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    tags:["Jardin","Garage","4 chambres","Calme"], features:{parking:true,terrace:true,garden:true,pool:false,elevator:false},
    date: new Date('2025-02-28'), agency:"Nantes Ouest Immo", visitFee:20
  },
  {
    id:7, type:"Appartement", transaction:"vente", city:"Toulouse", price:340000,
    surface:72, rooms:3, bathrooms:1, floor:"5e/8", dpe:"B",
    lat:43.604, lng:1.444,
    title:"T3 moderne avec parking sous-sol",
    desc:"Appartement moderne en résidence récente, double vitrage, balcon filant avec vue dégagée, parking en sous-sol et cave. Charges faibles.",
    img:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    tags:["Récent","Balcon","Parking","Cave"], features:{parking:true,terrace:true,garden:false,pool:false,elevator:true},
    date: new Date('2025-03-08'), agency:"Toulouse Sud Immobilier", visitFee:20
  },
  {
    id:8, type:"Local commercial", transaction:"vente", city:"Paris 11e", price:480000,
    surface:85, rooms:2, bathrooms:1, floor:"RDC", dpe:"D",
    lat:48.860, lng:2.372,
    title:"Local commercial vitrine – Paris 11",
    desc:"Local commercial idéalement situé sur artère passante, grande vitrine, local technique, WC, entrepôt et cave. Murs libres. Idéal pour toute activité.",
    img:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    tags:["Murs libres","Vitrine","Local tech","Cave"], features:{parking:false,terrace:false,garden:false,pool:false,elevator:false},
    date: new Date('2025-01-10'), agency:"Agence Prestige Paris", visitFee:35
  },
  {
    id:9, type:"Villa", transaction:"location", city:"Cannes", price:4500,
    surface:180, rooms:6, bathrooms:3, floor:"RDC+1", dpe:"A",
    lat:43.552, lng:7.017,
    title:"Villa luxueuse à louer à Cannes",
    desc:"Splendide villa avec piscine chauffée, vue mer, jardin paysagé, home-cinéma, cuisine pro et 4 suites parentales. Location mensuelle ou saisonnière.",
    img:"https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&q=80",
    tags:["Luxe","Piscine","Vue mer","Saisonnier"], features:{parking:true,terrace:true,garden:true,pool:true,elevator:false},
    date: new Date('2025-03-12'), agency:"Côte d'Azur Luxury", visitFee:60
  },
  {
    id:10, type:"Appartement", transaction:"vente", city:"Strasbourg", price:295000,
    surface:80, rooms:4, bathrooms:1, floor:"2e/3", dpe:"C",
    lat:48.573, lng:7.752,
    title:"Appartement de charme centre-ville",
    desc:"Appartement de caractère avec poutres apparentes, grande hauteur sous plafond, cuisine équipée et cour intérieure privative. Rare sur le marché.",
    img:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    tags:["Charme","Poutres","Cour","Rare"], features:{parking:false,terrace:false,garden:false,pool:false,elevator:false},
    date: new Date('2025-02-01'), agency:"Alsace Immo", visitFee:20
  },
  {
    id:11, type:"Maison", transaction:"vente", city:"Montpellier", price:520000,
    surface:165, rooms:6, bathrooms:2, floor:"RDC+1", dpe:"B",
    lat:43.610, lng:3.876,
    title:"Maison de village rénovée avec piscine",
    desc:"Belle demeure en pierres rénovée avec soin, piscine enterrée, grande terrasse, cellier, 5 chambres. Ambiance provençale, village recherché.",
    img:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    tags:["Pierre","Piscine","Terrasse","Cellier"], features:{parking:true,terrace:true,garden:true,pool:true,elevator:false},
    date: new Date('2025-02-20'), agency:"Occitanie Prestige", visitFee:30
  },
  {
    id:12, type:"Studio", transaction:"location", city:"Paris 5e", price:950,
    surface:22, rooms:1, bathrooms:1, floor:"4e/6", dpe:"E",
    lat:48.848, lng:2.347,
    title:"Studio lumineux Quartier Latin",
    desc:"Studio en hauteur avec vue dégagée, cuisine équipée, salle d'eau refaite. Idéalement situé entre Panthéon et Jardin des Plantes.",
    img:"https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80",
    tags:["Lumineux","Vue","Quartier Latin","Rénové"], features:{parking:false,terrace:false,garden:false,pool:false,elevator:true},
    date: new Date('2025-03-15'), agency:"Agence Prestige Paris", visitFee:25
  }
];

let filtered = [...properties];
let favorites = new Set();
let currentTab = 'all';
let currentPage = 1;
const PER_PAGE = 6;
let map, markers = [];

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2800);
}

// ── AUTH SYSTEM ──
let currentUser = null;
let users = JSON.parse(localStorage.getItem('immo_users') || '[]');
let editingPropertyId = null;

// Simulated Google accounts pool
const googleNames = [
  {first:'Sophie',last:'Martin',email:'sophie.martin@gmail.com'},
  {first:'Lucas',last:'Bernard',email:'lucas.bernard@gmail.com'},
  {first:'Emma',last:'Dubois',email:'emma.dubois@gmail.com'},
  {first:'Hugo',last:'Leroy',email:'hugo.leroy@gmail.com'},
];

function openAuth(tab='login') {
  switchAuthTab(tab, document.querySelector('.auth-tab'));
  document.getElementById('authOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeAuth() {
  document.getElementById('authOverlay').classList.remove('open');
  document.body.style.overflow='';
}
document.getElementById('authOverlay').addEventListener('click', e => {
  if(e.target === document.getElementById('authOverlay')) closeAuth();
});

function switchAuthTab(tab, el) {
  document.querySelectorAll('.auth-tab').forEach((t,i) => t.classList.toggle('active', i===(tab==='login'?0:1)));
  document.getElementById('panelLogin').classList.toggle('active', tab==='login');
  document.getElementById('panelRegister').classList.toggle('active', tab==='register');
}

function clearErrors(...ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if(el) { el.classList.remove('show'); const inp = el.previousElementSibling; if(inp) inp.classList.remove('error'); }
  });
}
function showError(errId, inputId) {
  const err = document.getElementById(errId);
  const inp = document.getElementById(inputId);
  if(err) err.classList.add('show');
  if(inp) inp.classList.add('error');
}

function doLogin() {
  clearErrors('loginEmailErr','loginPassErr');
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('loginEmailErr','loginEmail'); return; }
  const user = users.find(u => u.email===email && u.password===pass);
  if(!user) { showError('loginPassErr','loginPassword'); return; }
  loginSuccess(user);
}

function doRegister() {
  clearErrors('regEmailErr','regPassErr','regConfirmErr');
  const first = document.getElementById('regFirstName').value.trim();
  const last = document.getElementById('regLastName').value.trim();
  const confirm = document.getElementById('regConfirm').value;
  let ok = true;
  if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || users.find(u=>u.email===email)) { showError('regEmailErr','regEmail'); ok=false; }
  if(pass.length < 8) { showError('regPassErr','regPassword'); ok=false; }
  if(pass !== confirm) { showError('regConfirmErr','regConfirm'); ok=false; }
  if(!ok) return;
  users.push(user);
  localStorage.setItem('immo_users', JSON.stringify(users));
  loginSuccess(user);
}

function doGoogleLogin() {
  const g = googleNames[Math.floor(Math.random()*googleNames.length)];
  if(!user) {
    user = { id: Date.now(), first: g.first, last: g.last, email: g.email, password: null, properties: [], google: true };
    users.push(user);
    localStorage.setItem('immo_users', JSON.stringify(users));
  }
  loginSuccess(user, true);
}

function loginSuccess(user, isGoogle=false) {
  currentUser = user;
  closeAuth();
  updateNavForUser();
  showToast(`👋 Bienvenue, ${user.first} !`);
}

function logout() {
  currentUser = null;
  closeDropdown();
  updateNavForUser();
  showToast('À bientôt !');
  renderCards();
}

function updateNavForUser() {
  const navRight = document.getElementById('navRight');
  const unreadCount = notifications.filter(n=>!n.read).length;
  if(currentUser) {
    const initials = (currentUser.first[0]||(currentUser.email[0])).toUpperCase() + (currentUser.last ? currentUser.last[0].toUpperCase() : '');
    navRight.innerHTML = `
      <button onclick="openEstim()" class="nav-btn" style="background:transparent;border:1.5px solid rgba(201,168,76,0.2);color:rgba(255,255,255,0.7);font-size:0.82rem;">💰 Estimer</button>
      <button onclick="requireAuth(openAddProp)" class="nav-btn" style="background:transparent;border:1.5px solid rgba(201,168,76,0.4);color:var(--gold);">+ Déposer</button>
      <button onclick="openArtisanDash()" class="artisan-join-btn" style="font-size:.76rem;padding:7px 11px;">👷 Artisan</button>
      <div class="notif-bell">
        <button class="notif-bell-btn" onclick="toggleNotif(event)">🔔${unreadCount>0?`<span class="notif-badge">${unreadCount}</span>`:''}</button>
        <div class="notif-dropdown" id="notifDropdown">
          <div class="notif-header">
            Notifications
            <span class="notif-mark-read" onclick="markAllRead()">Tout marquer lu</span>
          </div>
          <div id="notifList"></div>
        </div>
      </div>
      <div class="user-menu">
        <button class="user-avatar" onclick="toggleDropdown()" title="${currentUser.first} ${currentUser.last}">${initials}</button>
        <div class="user-dropdown" id="userDropdown">
          <div class="dropdown-header">
            <div class="dropdown-name">${currentUser.first} ${currentUser.last}</div>
            <div class="dropdown-email">${currentUser.email}</div>
          </div>
          <button class="dropdown-item" onclick="closeDropdown();openDash()">📊 Dashboard</button>
          <button class="dropdown-item" onclick="closeDropdown();openMsg()">💬 Messagerie</button>
          <button class="dropdown-item" onclick="closeDropdown();openAlerts()">🔔 Mes alertes</button>
          <button class="dropdown-item" onclick="openMyListings()">📋 Mes annonces</button>
          <button class="dropdown-item" onclick="openFavoritesView()">❤️ Mes favoris</button>
          <button class="dropdown-item" onclick="closeDropdown();openEstim()">💰 Estimer un bien</button>
          <button class="dropdown-item" onclick="requireAuth(openAddProp)">➕ Déposer une annonce</button>
          <div class="dropdown-sep"></div>
          <button class="dropdown-item" onclick="closeDropdown();openArtisanDash()" style="color:#e67e22;">👷 Espace Artisan</button>
          <button class="dropdown-item" onclick="closeDropdown();openAdminPanel()" style="color:#8e44ad;">🔑 Panel Admin</button>
          <div class="dropdown-sep"></div>
          <button class="dropdown-item danger" onclick="logout()">🚪 Se déconnecter</button>
        </div>
      </div>`;
    renderNotifList();
  } else {
    navRight.innerHTML = `
      <button onclick="openEstim()" class="nav-btn" style="background:transparent;border:1.5px solid rgba(201,168,76,0.2);color:rgba(255,255,255,0.7);font-size:0.82rem;">💰 Estimer</button>
      <button class="nav-btn" id="navLoginBtnGuest" onclick="openAuth()">Se connecter</button>`;
  }
}

function toggleDropdown() {
  document.getElementById('userDropdown')?.classList.toggle('open');
}
function closeDropdown() {
  document.getElementById('userDropdown')?.classList.remove('open');
}
document.addEventListener('click', e => {
  if(!e.target.closest('.user-menu')) closeDropdown();
});

function requireAuth(fn) {
  if(!currentUser) { openAuth(); showToast('⚠️ Connectez-vous pour continuer'); return; }
  fn();
}

// ══════════════════════════════════════════════
// ── NOTIFICATIONS ──
// ══════════════════════════════════════════════
let notifications = [
  {id:1, icon:'🏠', text:'Nouvelle demande de visite pour votre appartement Paris 16e', time:'Il y a 5 min', read:false},
  {id:2, icon:'💬', text:'Lucas Bernard vous a envoyé un message concernant la Villa Nice', time:'Il y a 32 min', read:false},
  {id:3, icon:'⭐', text:'Un nouvel avis a été posté sur votre annonce à Lyon', time:'Il y a 2h', read:false},
  {id:4, icon:'✅', text:'Paiement reçu — Frais de visite 30€ pour Paris 16e', time:'Hier', read:true},
  {id:5, icon:'📋', text:'Votre annonce "T3 moderne Toulouse" a été vue 47 fois', time:'Il y a 2j', read:true},
];

function toggleNotif(e) {
  e.stopPropagation();
  document.getElementById('notifDropdown')?.classList.toggle('open');
}
function renderNotifList() {
  if(!el) return;
  if(!notifications.length) { el.innerHTML='<div class="notif-empty">Aucune notification</div>'; return; }
  el.innerHTML = notifications.map(n=>`
    <div class="notif-item ${n.read?'':'unread'}" onclick="markRead(${n.id})">
      <div class="notif-icon">${n.icon}</div>
      <div>
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>`).join('');
}
function markRead(id) {
  const n = notifications.find(n=>n.id===id); if(n) n.read=true;
  updateNavForUser();
}
function markAllRead() {
  notifications.forEach(n=>n.read=true);
  updateNavForUser();
}
document.addEventListener('click', e => {
  if(!e.target.closest('.notif-bell')) document.getElementById('notifDropdown')?.classList.remove('open');
});

// ══════════════════════════════════════════════
// ── DASHBOARD ──
// ══════════════════════════════════════════════
function openDash() {
  const myProps = properties.filter(p=>p.ownerId===currentUser?.id);
  const myVisits = 3; // simulated
  const myMsgs = 2;
  const myFavs = favorites.size;
  const body = document.getElementById('dashBody');
  body.innerHTML = `
    <div class="dash-grid">
      <div class="dash-card">
        <div class="dash-icon" style="background:#e8f4fd;">🏠</div>
        <div><div class="dash-val">${myProps.length}</div><div class="dash-label">Annonces publiées</div></div>
      </div>
      <div class="dash-card">
        <div class="dash-icon" style="background:#fdf8ee;">📅</div>
        <div><div class="dash-val">${myVisits}</div><div class="dash-label">Visites demandées</div></div>
      </div>
      <div class="dash-card">
        <div class="dash-icon" style="background:#fff0f0;">❤️</div>
        <div><div class="dash-val">${myFavs}</div><div class="dash-label">Favoris sauvegardés</div></div>
      </div>
      <div class="dash-card">
        <div class="dash-icon" style="background:#f0fff4;">💬</div>
        <div><div class="dash-val">${myMsgs}</div><div class="dash-label">Messages non lus</div></div>
      </div>
      <div class="dash-card">
        <div class="dash-icon" style="background:#fdf8ee;">👁️</div>
        <div><div class="dash-val">${myProps.length * 47}</div><div class="dash-label">Vues totales</div></div>
      </div>
      <div class="dash-card">
        <div class="dash-icon" style="background:#e8f4fd;">⭐</div>
        <div><div class="dash-val">${myProps.length ? getAvgRating(myProps[0].id) : '—'}</div><div class="dash-label">Note moyenne</div></div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px;">
      <div>
        <div class="dash-section-title">📈 Activité récente</div>
        <div class="dash-activity-item">
          <div class="dash-activity-icon" style="background:#fdf8ee;">👁️</div>
          <div class="dash-activity-text">47 vues sur votre annonce <strong>Paris 16e</strong></div>
          <div class="dash-activity-time">Auj.</div>
        </div>
        <div class="dash-activity-item">
          <div class="dash-activity-icon" style="background:#e8f4fd;">📅</div>
          <div class="dash-activity-text">Nouvelle demande de visite reçue</div>
          <div class="dash-activity-time">5 
