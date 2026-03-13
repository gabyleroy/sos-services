/* SOS SERVICES — Dépannage JS */
'use strict';

// ══════════════════════════════════════════════
// 🔧 DÉPANNAGE D'URGENCE — LOGIQUE
// ══════════════════════════════════════════════

// ── DONNÉES TECHNICIENS ──
const techniciens = [
  { id:1, nom:'Marc Leblanc', specialites:['plomberie','chauffage'], avatar:'ML', couleur:'#2980b9',
    note:4.8, avis:127, distance:0.8, eta:12, tarif:'65–120 €/h', dispo:true,
    certif:'RGE', tel:'+33 6 11 22 33 44', badge:'Artisan certifié' },
  { id:2, nom:'Sophie Renard', specialites:['electricite','climatisation'], avatar:'SR', couleur:'#8e44ad',
    note:4.9, avis:84, distance:1.2, eta:18, tarif:'75–130 €/h', dispo:true,
    certif:'QUALIFELEC', tel:'+33 6 22 33 44 55', badge:'Qualifiée QUALIFELEC' },
  { id:3, nom:'Ahmed Benali', specialites:['serrurerie','vitrerie'], avatar:'AB', couleur:'#16a085',
    note:4.7, avis:209, distance:0.5, eta:8, tarif:'80–150 €/h', dispo:true,
    certif:'Pro', tel:'+33 6 33 44 55 66', badge:'Intervention rapide' },
  { id:4, nom:'Pierre Dumont', specialites:['chauffage','plomberie'], avatar:'PD', couleur:'#e67e22',
    note:4.6, avis:156, distance:2.1, eta:22, tarif:'55–100 €/h', dispo:true,
    certif:'RGE', tel:'+33 6 44 55 66 77', badge:'RGE certifié' },
  { id:5, nom:'Lucie Martin', specialites:['electricite','toiture'], avatar:'LM', couleur:'#c0392b',
    note:4.9, avis:63, distance:1.8, eta:20, tarif:'70–125 €/h', dispo:false,
    certif:'Pro', tel:'+33 6 55 66 77 88', badge:'Expert toiture' },
  { id:6, nom:'Karim Hassani', specialites:['plomberie','vitrerie','autre'], avatar:'KH', couleur:'#27ae60',
    note:4.5, avis:312, distance:3.2, eta:30, tarif:'50–95 €/h', dispo:true,
    certif:'Artisan', tel:'+33 6 66 77 88 99', badge:'Multi-services' },
];

// ── TARIFS PAR PRESTATION ──
const depPrices = {
  fuite_eau: { min:80, max:250, label:'Fuite d\'eau' },
  canalisation_bouchee: { min:90, max:200, label:'Débouchage' },
  wc_bouche: { min:70, max:150, label:'WC bouché' },
  chauffe_eau: { min:150, max:400, label:'Chauffe-eau' },
  panne_generale: { min:80, max:180, label:'Panne élec.' },
  disjoncteur: { min:60, max:140, label:'Disjoncteur' },
  prise_defectueuse: { min:50, max:120, label:'Prise élec.' },
  eclairage: { min:50, max:130, label:'Éclairage' },
  porte_claquee: { min:80, max:200, label:'Porte claquée' },
  serrure_bloquee: { min:70, max:180, label:'Serrure bloquée' },
  changement_serrure: { min:120, max:300, label:'Changement serrure' },
  chaudiere_panne: { min:120, max:350, label:'Chaudière' },
  radiateur_froid: { min:70, max:160, label:'Radiateur' },
  fuite_gaz: { min:100, max:300, label:'Fuite gaz ⚠️' },
  vitre_cassee: { min:80, max:250, label:'Vitre cassée' },
  toiture_fuite: { min:150, max:500, label:'Fuite toiture' },
  autre: { min:60, max:200, label:'Intervention' }
};

const urgenceMultipliers = { low: 1, med: 1.2, high: 1.5 };
const depCatMap = {
  plomberie:['fuite_eau','canalisation_bouchee','wc_bouche','chauffe_eau'],
  electricite:['panne_generale','disjoncteur','prise_defectueuse','eclairage'],
  serrurerie:['porte_claquee','serrure_bloquee','changement_serrure'],
  chauffage:['chaudiere_panne','radiateur_froid','fuite_gaz'],
  toiture:['toiture_fuite'], vitrerie:['vitre_cassee'],
  climatisation:['autre'], autre:['autre']
};

let currentDepCat = 'plomberie';
let currentDepUrgence = 'med';
let currentDepTech = null;
let depReviewStars = 0;
let depChatInterval = null;
let depTrackInterval = null;
let depCurrentStep = 1;

// ── OPEN / CLOSE ──
function openDepannage() {
  document.getElementById('depOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  depGoStep(1);
  // Pré-remplir si utilisateur connecté
  if (currentUser) {
    const nameEl = document.getElementById('depClientName');
    if (nameEl && !nameEl.value) nameEl.value = currentUser.first + ' ' + currentUser.last;
  }
}
function closeDepannage() {
  document.getElementById('depOverlay').classList.remove('open');
  document.body.style.overflow = '';
  if (depChatInterval) clearInterval(depChatInterval);
  if (depTrackInterval) clearInterval(depTrackInterval);
}

// ── NAVIGATION ÉTAPES ──
function depGoStep(n, sub) {
  depCurrentStep = n;
  ['depStep1','depStep2','depStep3'].forEach((id,i) => {
    const el = document.getElementById(id);
    if (el) el.style.display = (i+1 === n) ? 'block' : 'none';
  });
  document.getElementById('depBody').scrollTop = 0;
  document.getElementById('depPanel').scrollTop = 0;
}

// ── SÉLECTION CATÉGORIE ──
function selectDepCat(el, cat) {
  currentDepCat = cat;
  document.querySelectorAll('.dep-cat').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  // Mettre à jour le select du problème
  const sel = document.getElementById('depProblemType');
  if (sel) {
    const options = depCatMap[cat] || [];
    // Highlight first matching option
    for (let opt of sel.options) {
      if (options.includes(opt.value)) { sel.value = opt.value; break; }
    }
    updateDepEstimate();
  }
}

// ── SÉLECTION NIVEAU URGENCE ──
function selectUrgenceLevel(el, level) {
  currentDepUrgence = level;
  document.querySelectorAll('.urgence-level').forEach(l => l.classList.remove('active'));
  el.classList.add('active');
  updateDepEstimate();
}

// ── ESTIMATION DYNAMIQUE ──
function updateDepEstimate() {
  const type = document.getElementById('depProblemType')?.value;
  const addr = document.getElementById('depAddress')?.value?.trim();
  const estimBox = document.getElementById('depEstimateBox');
  const mapPreview = document.getElementById('depMapPreview');
  if (!type) { if(estimBox) estimBox.style.display='none'; return; }

  const prices = depPrices[type] || depPrices['autre'];
  const mult = urgenceMultipliers[currentDepUrgence] || 1;
  const minP = Math.round(prices.min * mult);
  const maxP = Math.round(prices.max * mult);

  const delayMap = { low:'24–48h', med:'2–4h', high:'15–30 min' };
  const techCount = techniciens.filter(t => t.dispo &&
    (t.specialites.some(s => depCatMap[currentDepCat]?.includes(type) || t.specialites.includes(currentDepCat)))).length || 3;

  if (estimBox) {
    estimBox.style.display = 'grid';
    document.getElementById('depEstPrice').textContent = minP + ' – ' + maxP + ' €';
    document.getElementById('depEstDelay').textContent = delayMap[currentDepUrgence];
    document.getElementById('depEstTechs').textContent = techCount + ' dispo';
  }

  // Carte localisation
  if (addr && addr.length > 5 && mapPreview) {
    mapPreview.style.display = 'block';
    const encoded = encodeURIComponent(addr + ', France');
    document.getElementById('depMapFrame').src =
      `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${encoded}&zoom=15`;
    document.getElementById('depMapBadge').textContent = '📍 ' + addr;
  }
}

// ── RECHERCHE TECHNICIENS ──
function depSearchTechs() {
  const type  = document.getElementById('depProblemType')?.value;
  const addr  = document.getElementById('depAddress')?.value?.trim();
  const name  = document.getElementById('depClientName')?.value?.trim();
  const phone = document.getElementById('depClientPhone')?.value?.trim();
  if (!type) { showToast('⚠️ Sélectionnez un type de problème'); return; }
  if (!addr) { showToast('⚠️ Entrez votre adresse'); return; }
  if (!name) { showToast('⚠️ Entrez votre prénom'); return; }
  if (!phone) { showToast('⚠️ Entrez votre téléphone'); return; }

  // Filtrer techniciens disponibles selon catégorie
  const available = techniciens.filter(t => t.dispo)
    .sort((a, b) => {
      if (currentDepUrgence === 'high') return a.eta - b.eta;
      return a.distance - b.distance;
    });

  const list = document.getElementById('depTechList');
  list.innerHTML = available.map(t => renderDepTechCard(t)).join('');
  depGoStep(2);
}

function renderDepTechCard(t) {
  const stars = '★'.repeat(Math.floor(t.note)) + (t.note % 1 >= 0.5 ? '½' : '');
  return `
    <div class="dep-tech-card" id="depTech_${t.id}" onclick="selectDepTech(${t.id})">
      <div class="dep-tech-avatar" style="background:${t.couleur}">${t.avatar}</div>
      <div style="flex:1;min-width:0;">
        <div class="dep-tech-name">${escHtml(t.nom)}</div>
        <div class="dep-tech-meta">
          <span class="dep-stars">${stars}</span>
          <span style="font-weight:700;color:var(--navy);margin-left:4px;">${t.note}</span>
          <span style="color:var(--text-light);margin-left:4px;">(${t.avis} avis)</span>
        </div>
        <div class="dep-tech-badges">
          <span class="dep-tech-badge green">✓ ${t.certif}</span>
          <span class="dep-tech-badge">${t.badge}</span>
          <span class="dep-tech-badge">${t.tarif}</span>
        </div>
      </div>
      <div class="dep-tech-right">
        <div class="dep-tech-distance">📍 ${t.distance} km</div>
        <div class="dep-tech-eta">⏱ ~${t.eta} min</div>
        <div class="dep-tech-rate" style="margin-top:6px;font-size:0.72rem;">${t.dispo ? '<span style="color:#27ae60;">● Disponible</span>' : '<span style="color:#e74c3c;">● Occupé</span>'}</div>
      </div>
    </div>`;
}

function selectDepTech(id) {
  currentDepTech = techniciens.find(t => t.id === id);
  document.querySelectorAll('.dep-tech-card').forEach(c => c.classList.remove('selected'));
  const el = document.getElementById('depTech_' + id);
  if (el) el.classList.add('selected');
}

// ── CONFIRMER TECHNICIEN ──
function depConfirmTech() {
  if (!currentDepTech) { showToast('⚠️ Sélectionnez un technicien'); return; }
  depGoStep(3);

  // Initialise bouton appel
  document.getElementById('depCallBtn').innerHTML = `📞 Appeler ${escHtml(currentDepTech.nom)} (${currentDepTech.tel})`;

  // Initialise chat
  initDepChat();

  // Lance le suivi
  initDepTracking();

  // Notification
  notifications.unshift({
    id: Date.now(), icon: '🔧',
    text: 'Technicien ' + currentDepTech.nom + ' confirmé — arrivée dans ' + currentDepTech.eta + ' min',
    time: 'À l\'instant', read: false
  });
  updateNavForUser();
  showToast('✅ ' + currentDepTech.nom + ' a été contacté !');
}

// ── APPEL SIMULÉ ──
function depSimulateCall() {
  if (!currentDepTech) return;
  showToast('📞 Appel en cours vers ' + currentDepTech.nom + '...');
  setTimeout(() => showToast('✅ Ligne établie — ' + currentDepTech.nom + ' confirme l\'heure d\'arrivée'), 2500);
}

// ── CHAT TECHNICIEN ──
function initDepChat() {
  if (!currentDepTech) return;
  const chatBody = document.getElementById('depChatBody');
  const chatAvatar = document.getElementById('depChatAvatar');
  const chatName = document.getElementById('depChatTechName');
  const chatEta = document.getElementById('depChatEta');

  if (chatAvatar) { chatAvatar.textContent = currentDepTech.avatar; chatAvatar.style.background = currentDepTech.couleur; }
  if (chatName) chatName.textContent = currentDepTech.nom;
  if (chatEta) chatEta.textContent = '~' + currentDepTech.eta + ' min';

  const type = document.getElementById('depProblemType')?.value;
  const prob = depPrices[type]?.label || 'votre problème';

  const initMsgs = [
    { from: 'tech', text: 'Bonjour ! J\'ai bien reçu votre demande pour ' + prob + '.', time: 'maintenant' },
    { from: 'tech', text: 'Je suis à ' + currentDepTech.distance + ' km de chez vous, j\'arrive dans environ ' + currentDepTech.eta + ' minutes.', time: 'maintenant' },
    { from: 'tech', text: 'Pouvez-vous me donner plus de détails sur le problème ? Est-ce que vous avez coupé l\'eau / l\'électricité si nécessaire ?', time: 'maintenant' }
  ];

  if (chatBody) {
    chatBody.innerHTML = initMsgs.map(m => renderDepMsg(m)).join('');
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Auto-réponse du technicien après 8s
  depChatInterval = setTimeout(() => {
    const autoReply = { from: 'tech', text: 'Je suis en route ! Préparez l\'accès si possible. À tout de suite 👍', time: 'il y a 1 min' };
    if (chatBody) {
      chatBody.insertAdjacentHTML('beforeend', renderDepMsg(autoReply));
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, 8000);
}

function renderDepMsg(m) {
  return `<div class="dep-msg ${m.from === 'mine' ? 'mine' : ''}">
    <div class="dep-msg-bubble">${escHtml(m.text)}</div>
    <div class="dep-msg-time">${m.time}</div>
  </div>`;
}

function sendDepMsg() {
  const input = document.getElementById('depChatInput');
  const chatBody = document.getElementById('depChatBody');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';
  if (chatBody) {
    chatBody.insertAdjacentHTML('beforeend', renderDepMsg({ from:'mine', text, time:'maintenant' }));
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  // Auto-réponse
  const replies = [
    'Bien reçu, merci !',
    'D\'accord, je prends note. J\'arrive bientôt.',
    'OK, j\'apporte le matériel nécessaire.',
    'Compris ! Pas d\'inquiétude, je gère ça.',
    'Merci pour l\'information. Je serai là dans quelques minutes.'
  ];
  setTimeout(() => {
    const reply = { from:'tech', text: replies[Math.floor(Math.random() * replies.length)], time:'maintenant' };
    if (chatBody) {
      chatBody.insertAdjacentHTML('beforeend', renderDepMsg(reply));
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, 1500);
}

// ── SUIVI EN TEMPS RÉEL ──
const depTrackSteps = [
  { icon: '✅', label: 'Demande reçue', detail: 'Votre demande a été enregistrée', done: true },
  { icon: '🔍', label: 'Technicien sélectionné', detail: '', done: true },
  { icon: '🚗', label: 'Technicien en route', detail: '', active: true },
  { icon: '🏠', label: 'Arrivée sur place', detail: 'Sonnez à l\'interphone', done: false },
  { icon: '🔧', label: 'Intervention en cours', detail: '', done: false },
  { icon: '✔️', label: 'Intervention terminée', detail: '', done: false },
];

function initDepTracking() {
  if (!currentDepTech) return;
  depTrackSteps[1].detail = 'Par ' + currentDepTech.nom + ' — ' + currentDepTech.distance + ' km';
  depTrackSteps[2].detail = 'Arrivée estimée dans ' + currentDepTech.eta + ' min';

  renderDepTracking();

  // Simulation progression automatique
  let stepIdx = 3;
  const interval = setInterval(() => {
    if (stepIdx >= depTrackSteps.length) { clearInterval(interval); return; }
    depTrackSteps[stepIdx - 1].active = false;
    depTrackSteps[stepIdx - 1].done = true;
    if (stepIdx < depTrackSteps.length) {
      depTrackSteps[stepIdx].active = true;
      depTrackSteps[stepIdx].done = false;
    }
    renderDepTracking();

    // Afficher avis après dernière étape
    if (stepIdx === depTrackSteps.length - 1) {
      setTimeout(() => {
        const reviewForm = document.getElementById('depReviewForm');
        if (reviewForm) reviewForm.style.display = 'block';
        showToast('✅ Intervention terminée ! Laissez un avis.');
      }, 1000);
    }
    stepIdx++;
  }, currentDepUrgence === 'high' ? 12000 : 20000);
  depTrackInterval = interval;
}

function renderDepTracking() {
  const container = document.getElementById('depTrackSteps');
  if (!container) return;
  container.innerHTML = depTrackSteps.map(s => `
    <div class="dep-track-step ${s.done ? 'done' : ''} ${s.active ? 'active' : ''}">
      <div class="dep-track-dot">${s.done ? '✓' : s.active ? '●' : s.icon}</div>
      <div class="dep-track-content">
        <div class="dep-track-title">${s.label}</div>
        <div class="dep-track-time">${s.detail || ''}</div>
      </div>
    </div>`).join('');
}

// ── AVIS TECHNICIEN ──
function setDepStar(n) {
  depReviewStars = n;
  document.querySelectorAll('.dep-star').forEach((s, i) => {
    s.classList.toggle('active', i < n);
  });
}

function submitDepReview() {
  if (!depReviewStars) { showToast('⚠️ Sélectionnez une note'); return; }
  const text = document.getElementById('depReviewText')?.value?.trim() || '';
  const review = {
    techId: currentDepTech?.id,
    techName: currentDepTech?.nom,
    stars: depReviewStars,
    text,
    date: new Date().toLocaleDateString('fr-FR', {day:'numeric', month:'long', year:'numeric'})
  };
  const depReviews = JSON.parse(localStorage.getItem('immo_dep_reviews') || '[]');
  depReviews.unshift(review);
  localStorage.setItem('immo_dep_reviews', JSON.stringify(depReviews));

  document.getElementById('depReviewForm').innerHTML = `
    <div style="text-align:center;padding:24px;">
      <div style="font-size:2.5rem;margin-bottom:12px;">🙏</div>
      <div style="font-family:'Playfair Display',serif;font-size:1.1rem;color:var(--navy);margin-bottom:8px;">Merci pour votre avis !</div>
      <div style="font-size:0.85rem;color:var(--text-light);">Votre retour aide à améliorer notre service.</div>
    </div>`;

  showToast('⭐ Avis publié — Merci !');
  notifications.unshift({
    id: Date.now(), icon: '⭐',
    text: 'Avis posté pour ' + (currentDepTech?.nom || 'le technicien'),
    time: 'À l\'instant', read: false
  });
  updateNavForUser();
   }
   
