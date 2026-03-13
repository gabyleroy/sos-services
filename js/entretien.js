/* SOS SERVICES — Entretien JS */
'use strict';

// ══════════════════════════════════════════════
// 🌿 MODULE ENTRETIEN — LOGIQUE COMPLÈTE
// ══════════════════════════════════════════════

let currentEntCat = 'all';

// ── DONNÉES PRESTATAIRES ENTRETIEN ──
const prestatairesEntretien = [
  { id:'e1', nom:'Marie Fontaine', cat:'menage', avatar:'MF', couleur:'#27ae60',
    services:['Ménage & nettoyage','Repassage','Vitres'], note:4.9, avis:87, distance:0.7,
    tarif:'18–25 €/h', tarifMin:18, tarifMax:25, certif:'Assurée', disponible:true,
    bio:'Femme de ménage professionnelle avec 6 ans d\'expérience. Produits écologiques sur demande.', ville:'Paris 15e' },
  { id:'e2', nom:'Jean-Pierre Camus', cat:'jardinage', avatar:'JC', couleur:'#1e8449',
    services:['Tonte pelouse','Taille haies','Débroussaillage'], note:4.7, avis:124, distance:1.4,
    tarif:'25–40 €/h', tarifMin:25, tarifMax:40, certif:'Certifié', disponible:true,
    bio:'Jardinier paysagiste diplômé. Entretien régulier ou ponctuel. Devis gratuit.', ville:'Boulogne-Billancourt' },
  { id:'e3', nom:'Sophie Leroux', cat:'enfants', avatar:'SL', couleur:'#e74c3c',
    services:['Baby-sitting','Aide devoirs','Activités créatives'], note:5.0, avis:43, distance:0.4,
    tarif:'12–18 €/h', tarifMin:12, tarifMax:18, certif:'BAFA', disponible:true,
    bio:'Titulaire du BAFA, 4 ans d\'expérience avec des enfants de 1 à 12 ans.', ville:'Paris 16e' },
  { id:'e4', nom:'Ahmed Safi', cat:'seniors', avatar:'AS', couleur:'#8e44ad',
    services:['Accompagnement sorties','Courses','Compagnie'], note:4.8, avis:61, distance:2.1,
    tarif:'15–22 €/h', tarifMin:15, tarifMax:22, certif:'Auxiliaire de vie', disponible:true,
    bio:'Auxiliaire de vie diplômé, spécialisé dans l\'accompagnement des personnes âgées autonomes.', ville:'Paris 17e' },
  { id:'e5', nom:'Lucie Bernard', cat:'animaux', avatar:'LB', couleur:'#e67e22',
    services:['Garde chien/chat','Promenades','Pet-sitting'], note:4.9, avis:156, distance:0.9,
    tarif:'15–30 €/j', tarifMin:15, tarifMax:30, certif:'Assurée', disponible:true,
    bio:'Passionnée d\'animaux, garde à domicile ou chez moi. Références disponibles.', ville:'Paris 14e' },
  { id:'e6', nom:'Dr. Claire Morin', cat:'cours', avatar:'CM', couleur:'#2980b9',
    services:['Maths','Physique-Chimie','Prépa concours'], note:4.8, avis:38, distance:1.6,
    tarif:'35–60 €/h', tarifMin:35, tarifMax:60, certif:'Bac+5', disponible:true,
    bio:'Professeure agrégée de mathématiques, donne des cours particuliers depuis 10 ans.', ville:'Paris 13e' },
  { id:'e7', nom:'Fatima Ouali', cat:'menage', avatar:'FO', couleur:'#16a085',
    services:['Grand ménage','Après travaux','Bureau'], note:4.6, avis:203, distance:1.1,
    tarif:'20–28 €/h', tarifMin:20, tarifMax:28, certif:'Auto-entrepreneur', disponible:false,
    bio:'Spécialiste ménage professionnel et après travaux. Équipe possible pour grands chantiers.', ville:'Issy-les-Moulineaux' },
  { id:'e8', nom:'Thomas Girard', cat:'jardinage', avatar:'TG', couleur:'#27ae60',
    services:['Création jardin','Plantation','Arrosage automatique'], note:4.7, avis:77, distance:3.2,
    tarif:'30–50 €/h', tarifMin:30, tarifMax:50, certif:'Paysagiste diplômé', disponible:true,
    bio:'Paysagiste créatif, conception et entretien de jardins en Île-de-France.', ville:'Vincennes' },
  { id:'e9', nom:'Emma Petit', cat:'enfants', avatar:'EP', couleur:'#e91e63',
    services:['Garde périscolaire','Activités','Bain et repas'], note:4.9, avis:29, distance:0.6,
    tarif:'10–15 €/h', tarifMin:10, tarifMax:15, certif:'BAFA + PSC1', disponible:true,
    bio:'Étudiante en éducation spécialisée, expérience de 3 ans en crèche.', ville:'Paris 15e' },
  { id:'e10', nom:'Robert Nguyen', cat:'cours', avatar:'RN', couleur:'#3498db',
    services:['Anglais','Espagnol','FLE'], note:4.7, avis:52, distance:2.4,
    tarif:'25–45 €/h', tarifMin:25, tarifMax:45, certif:'Bilingue certifié', disponible:true,
    bio:'Professeur de langues natif bilingue, méthode dynamique adaptée à tous niveaux.', ville:'Neuilly-sur-Seine' },
  { id:'e11', nom:'Isabelle Dupuis', cat:'seniors', avatar:'ID', couleur:'#9b59b6',
    services:['Aide toilette','Repas','Activités mémoire'], note:4.9, avis:91, distance:1.7,
    tarif:'18–25 €/h', tarifMin:18, tarifMax:25, certif:'DEAVS', disponible:true,
    bio:'Diplômée DEAVS, 12 ans d\'expérience auprès des personnes âgées dépendantes.', ville:'Paris 20e' },
  { id:'e12', nom:'Marc Tissot', cat:'animaux', avatar:'MT', couleur:'#f39c12',
    services:['Garde NAC','Veterinaire accompagnement','Dressage'], note:4.6, avis:34, distance:2.8,
    tarif:'20–35 €/j', tarifMin:20, tarifMax:35, certif:'Comportementaliste', disponible:true,
    bio:'Comportementaliste animalier certifié. Spécialiste chiens, chats et nouveaux animaux de compagnie.', ville:'Montreuil' },
];

const entretienPrices = {
  menage:    { min:18, max:28, unite:'h' },
  jardinage: { min:25, max:50, unite:'h' },
  enfants:   { min:10, max:18, unite:'h' },
  seniors:   { min:15, max:25, unite:'h' },
  animaux:   { min:15, max:35, unite:'j' },
  cours:     { min:25, max:60, unite:'h' },
};

// ── RENDU CARDS PRESTATAIRES ──
function renderEntretienCards() {
  const grid = document.getElementById('entretienGrid');
  const empty = document.getElementById('entretienEmpty');
  const countEl = document.getElementById('entretienCount');
  if (!grid) return;

  let data = currentEntCat === 'all'
    ? [...prestatairesEntretien]
    : prestatairesEntretien.filter(p => p.cat === currentEntCat);

  const sort = document.getElementById('entretienSort')?.value || 'note';
  if (sort === 'note')     data.sort((a,b) => b.note - a.note);
  if (sort === 'prix')     data.sort((a,b) => a.tarifMin - b.tarifMin);
  if (sort === 'distance') data.sort((a,b) => a.distance - b.distance);

  if (countEl) countEl.textContent = data.length;

  if (!data.length) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  const catIcons = { menage:'🧹', jardinage:'🌿', enfants:'👶', seniors:'👨‍🦳', animaux:'🐶', cours:'💻' };
  const catLabels = { menage:'Ménage', jardinage:'Jardinage', enfants:'Garde enfants', seniors:'Aide seniors', animaux:'Garde animaux', cours:'Cours particuliers' };

  grid.innerHTML = data.map(p => {
    const stars = '★'.repeat(Math.floor(p.note)) + (p.note % 1 >= 0.5 ? '★' : '');
    return `<div class="ent-card" onclick="openEntretienBooking('${p.id}')">
      <div class="ent-card-banner"></div>
      <div class="ent-card-body">
        <div class="ent-card-header">
          <div class="ent-card-avatar" style="background:${p.couleur}">${p.avatar}</div>
          <div style="flex:1;min-width:0;">
            <div class="ent-card-name">${escHtml(p.nom)}</div>
            <div class="ent-card-cat">${catIcons[p.cat]||'🔧'} ${catLabels[p.cat]||p.cat} · 📍 ${escHtml(p.ville)}</div>
          </div>
          <div style="text-align:right;flex-shrink:0;">
            <div style="font-size:.78rem;font-weight:700;color:var(--navy);">${p.distance} km</div>
            <div style="${p.disponible?'color:#27ae60;':'color:#e74c3c;'}font-size:.7rem;margin-top:2px;font-weight:600;">${p.disponible?'● Dispo':'● Occupé'}</div>
          </div>
        </div>
        <div class="ent-card-tags">
          ${p.services.map(s => `<span class="ent-tag">${s}</span>`).join('')}
          <span class="ent-tag green">✓ ${p.certif}</span>
        </div>
        <div style="font-size:.78rem;color:var(--text-light);line-height:1.5;margin-bottom:12px;">${escHtml(p.bio)}</div>
        <div class="ent-card-footer">
          <div>
            <div class="ent-card-rate">${p.tarif}</div>
            <div style="font-size:.7rem;color:var(--text-light);margin-top:2px;">
              <span style="color:#f39c12;">${stars.slice(0,5)}</span>
              <span style="font-weight:700;color:var(--navy);margin-left:3px;">${p.note}</span>
              <span style="color:var(--text-light);margin-left:2px;">(${p.avis})</span>
            </div>
          </div>
          <button class="ent-card-btn" onclick="event.stopPropagation();openEntretienBooking('${p.id}')">📅 Réserver</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function selectEntretienCat(el, cat) {
  currentEntCat = cat;
  document.querySelectorAll('.ent-cat-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderEntretienCards();
}

// ── RÉSERVATION ENTRETIEN ──
let currentEntPrestataire = null;

function openEntretienBooking(prestId) {
  currentEntPrestataire = prestId ? prestatairesEntretien.find(p => p.id === prestId) : null;
  const title = document.getElementById('entBookingTitle');
  const sub   = document.getElementById('entBookingSub');
  if (currentEntPrestataire) {
    if (title) title.textContent = '📅 Réserver — ' + currentEntPrestataire.nom;
    if (sub)   sub.textContent   = currentEntPrestataire.services.join(' · ') + ' · ' + currentEntPrestataire.tarif;
    // Pré-sélectionner le type de service
    const sel = document.getElementById('entServiceType');
    if (sel) sel.value = currentEntPrestataire.cat;
    updateEntretienEstimate();
  }
  // Pré-remplir user si connecté
  if (currentUser) {
    const nameEl = document.getElementById('entClientName');
    const emailEl = document.getElementById('entClientEmail');
    if (nameEl && !nameEl.value) nameEl.value = currentUser.first + ' ' + currentUser.last;
    if (emailEl && !emailEl.value) emailEl.value = currentUser.email;
  }
  // Date min = demain
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const dateEl = document.getElementById('entDate');
  if (dateEl) dateEl.min = tomorrow.toISOString().split('T')[0];

  document.getElementById('entretienBookingOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeEntretienBooking() {
  document.getElementById('entretienBookingOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function updateEntretienEstimate() {
  const type = document.getElementById('entServiceType')?.value;
  const duree = document.getElementById('entDuree')?.value || '2h';
  const box = document.getElementById('entTarifBox');
  if (!type) { if (box) box.style.display = 'none'; return; }

  const prices = entretienPrices[type] || { min:15, max:30, unite:'h' };
  const p = currentEntPrestataire;
  const min = p ? p.tarifMin : prices.min;
  const max = p ? p.tarifMax : prices.max;
  const dureeMap = { '1h':1, '2h':2, '3h':3, 'demi-journée':4, 'journée':8 };
  const h = dureeMap[duree] || 2;
  const unite = prices.unite;

  if (box) {
    box.style.display = 'block';
    document.getElementById('entEstMin').textContent = (min * h) + ' €';
    document.getElementById('entEstMax').textContent = (max * h) + ' €';
    document.getElementById('entEstDuree').textContent = duree;
  }
}

function submitEntretienBooking() {
  const type  = document.getElementById('entServiceType')?.value;
  const date  = document.getElementById('entDate')?.value;
  const addr  = document.getElementById('entAddress')?.value?.trim();
  const name  = document.getElementById('entClientName')?.value?.trim();
  const phone = document.getElementById('entClientPhone')?.value?.trim();
  const email = document.getElementById('entClientEmail')?.value?.trim();

  if (!type || !date || !addr || !name || !phone || !email) {
    showToast('⚠️ Remplissez tous les champs obligatoires'); return;
  }

  const booking = {
    id: 'ent_' + Date.now(),
    prestataireId: currentEntPrestataire?.id,
    prestataireName: currentEntPrestataire?.nom || 'Prestataire',
    type, date, addr, name, phone, email,
    creneau: document.getElementById('entCreneau')?.value,
    duree: document.getElementById('entDuree')?.value,
    frequence: document.getElementById('entFrequence')?.value,
    details: document.getElementById('entDetails')?.value || '',
    createdAt: new Date().toISOString(),
    status: 'confirmed'
  };

  const bookings = JSON.parse(localStorage.getItem('sos_entretien_bookings') || '[]');
  bookings.unshift(booking);
  localStorage.setItem('sos_entretien_bookings', JSON.stringify(bookings));

  closeEntretienBooking();
  showToast('✅ Réservation confirmée ! ' + booking.prestataireName + ' vous contactera sous 2h.');

  notifications.unshift({
    id: Date.now(), icon: '🌿',
    text: 'Réservation entretien confirmée — ' + booking.prestataireName,
    time: 'À l\'instant', read: false
  });
  updateNavForUser();
   }
   
