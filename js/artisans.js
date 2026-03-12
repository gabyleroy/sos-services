/* SOS SERVICES — Artisans JS */
'use strict';

// ══════════════════════════════════════════════
// 👷 ESPACE ARTISAN — LOGIQUE COMPLÈTE
// ══════════════════════════════════════════════

// ── ÉTAT ──
let artisanRegStep = 1;
let artisanSelectedSpecs  = new Set();
let artisanSelectedCertif = new Set();
let artisanSelectedDays   = new Set(['mar','mer','jeu','ven']);
let artisanUploadedDocs   = {};
let artisanPhotoDataURL   = null;
let currentArtisanDashTab = 'demandes';
let currentAdminTab       = 'pending';

// ── DONNÉES ARTISANS INSCRITS (localStorage) ──
function loadArtisans() {
  return JSON.parse(localStorage.getItem('immo_artisans') || '[]');
}
function saveArtisans(arr) {
  localStorage.setItem('immo_artisans', JSON.stringify(arr));
}

// Données démo pré-chargées si vide
function initArtisanData() {
  const existing = loadArtisans();
  if (existing.length) return;
  const demo = [
    { id:'a1', firstName:'Marc', lastName:'Leblanc', company:'Leblanc Plomberie', email:'marc@plomberie.fr', phone:'+33 6 11 22 33 44', siret:'12345678901234', status:'approved', specs:['plomberie','chauffage'], certifs:['RGE'], city:'Paris', radius:20, rateMin:65, rateMax:120, deplacement:20, urgence:true, experience:'5-10 ans', bio:'Plombier certifié RGE avec 8 ans d\'expérience dans Paris et banlieue.', note:4.8, avisCount:127, interventions:243, photo:null, days:['lun','mar','mer','jeu','ven'], createdAt:'2024-01-15' },
    { id:'a2', firstName:'Sophie', lastName:'Renard', company:'Renard Électricité', email:'sophie@elec.fr', phone:'+33 6 22 33 44 55', siret:'23456789012345', status:'pending', specs:['electricite','climatisation'], certifs:['QUALIFELEC'], city:'Lyon', radius:30, rateMin:75, rateMax:130, deplacement:25, urgence:false, experience:'+10 ans', bio:'Électricienne qualifiée QUALIFELEC, spécialiste domotique.', note:4.9, avisCount:84, interventions:167, photo:null, days:['mar','mer','jeu','ven','sam'], createdAt:'2024-03-02' },
    { id:'a3', firstName:'Ahmed', lastName:'Benali', company:'Benali Serrurerie', email:'ahmed@serr.fr', phone:'+33 6 33 44 55 66', siret:'34567890123456', status:'pending', specs:['serrurerie','vitrerie'], certifs:['Artisan de qualité'], city:'Marseille', radius:20, rateMin:80, rateMax:150, deplacement:0, urgence:true, experience:'3-5 ans', bio:'Serrurier disponible 24h/24 pour urgences.', note:4.7, avisCount:209, interventions:412, photo:null, days:['lun','mar','mer','jeu','ven','sam','dim'], createdAt:'2024-03-10' },
    { id:'a4', firstName:'Lucie', lastName:'Martin', company:'Martin Toiture', email:'lucie@toiture.fr', phone:'+33 6 44 55 66 77', siret:'45678901234567', status:'rejected', specs:['toiture','peinture'], certifs:['QUALIBAT'], city:'Bordeaux', radius:50, rateMin:90, rateMax:160, deplacement:30, urgence:false, experience:'1-2 ans', bio:'Couvreure spécialisée tuiles et ardoises.', note:0, avisCount:0, interventions:0, photo:null, days:['lun','mar','mer','jeu','ven'], createdAt:'2024-03-08' },
  ];
  saveArtisans(demo);
}

// Demandes simulées pour le dashboard artisan
const artisanDemoRequests = [
  { id:'r1', artisanId:'a1', client:'Sophie Martin', problem:'Fuite d\'eau sous évier', address:'12 rue de Rivoli, Paris', urgence:'high', date:'Aujourd\'hui 14h22', status:'new' },
  { id:'r2', artisanId:'a1', client:'Pierre Durand', problem:'Chauffe-eau en panne', address:'45 bd Haussmann, Paris', urgence:'med', date:'Hier 09h15', status:'accepted' },
  { id:'r3', artisanId:'a1', client:'Marie Leclerc', problem:'Canalisation bouchée', address:'8 rue Oberkampf, Paris', urgence:'low', date:'Il y a 3 jours', status:'done' },
];

// ── OPEN / CLOSE ──
function openArtisanReg() {
  artisanRegStep = 1; artisanSelectedSpecs.clear(); artisanSelectedCertif.clear();
  artisanSelectedDays = new Set(['mar','mer','jeu','ven']);
  artisanUploadedDocs = {}; artisanPhotoDataURL = null;
  artisanGoStep(1);
  document.getElementById('artisanRegOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeArtisanReg() {
  document.getElementById('artisanRegOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function openArtisanDash() {
  initArtisanData();
  const artisans = loadArtisans();
  // Détecter si un artisan est connecté (simulation : prendre a1)
  const me = artisans.find(a => a.id === 'a1') || artisans[0];
  if (!me) { openArtisanReg(); return; }
  document.getElementById('artisanDashTitle').textContent = '👷 ' + me.firstName + ' ' + me.lastName;
  document.getElementById('artisanDashSub').textContent = me.company;
  const badge = document.getElementById('artisanStatusBadge');
  const bannerEl = document.getElementById('artisanPendingBanner');
  if (me.status === 'approved') {
    badge.className = 'artisan-status-badge approved'; badge.textContent = '✅ Compte validé';
    if (bannerEl) bannerEl.style.display = 'none';
  } else if (me.status === 'rejected') {
    badge.className = 'artisan-status-badge rejected'; badge.textContent = '❌ Dossier refusé';
  } else {
    badge.className = 'artisan-status-badge pending'; badge.textContent = '⏳ En attente de validation';
    if (bannerEl) bannerEl.style.display = 'flex';
  }
  switchArtisanTab('demandes', document.getElementById('adTab_demandes'));
  document.getElementById('artisanDashOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeArtisanDash() {
  document.getElementById('artisanDashOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function openAdminPanel() {
  initArtisanData();
  switchAdminTab('pending', document.getElementById('adminTab_pending'));
  document.getElementById('adminOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAdminPanel() {
  document.getElementById('adminOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── STEPPER ──
function artisanGoStep(n) {
  artisanRegStep = n;
  [1,2,3,4].forEach(i => {
    const s = document.getElementById('artisanStep' + i);
    if (s) s.style.display = (i === n) ? 'block' : 'none';
    const step = document.getElementById('astep' + i);
    if (step) {
      step.classList.remove('active','done');
      if (i === n) step.classList.add('active');
      else if (i < n) step.classList.add('done');
    }
  });
  const succ = document.getElementById('artisanStepSuccess');
  if (succ) succ.style.display = 'none';
  document.getElementById('artisanRegPanel').scrollTop = 0;
}

function artisanNextStep(n) {
  if (!validateArtisanStep(artisanRegStep)) return;
  artisanGoStep(n);
}

function validateArtisanStep(step) {
  if (step === 1) {
    const fn = document.getElementById('aRegFirstName')?.value.trim();
    const ln = document.getElementById('aRegLastName')?.value.trim();
    const em = document.getElementById('aRegEmail')?.value.trim();
    const ph = document.getElementById('aRegPhone')?.value.trim();
    const pw = document.getElementById('aRegPassword')?.value;
    const si = document.getElementById('aRegSiret')?.value.trim();
    const co = document.getElementById('aRegCompany')?.value.trim();
    if (!fn||!ln||!em||!ph||!pw||!si||!co) { showToast('⚠️ Remplissez tous les champs obligatoires'); return false; }
    if (pw.length < 8) { showToast('⚠️ Mot de passe : 8 caractères minimum'); return false; }
    if (!/^\d{14}$/.test(si.replace(/\s/g,''))) { showToast('⚠️ SIRET invalide (14 chiffres requis)'); return false; }
  }
  if (step === 2) {
    if (artisanSelectedSpecs.size === 0) { showToast('⚠️ Sélectionnez au moins une spécialité'); return false; }
    if (!document.getElementById('aRegExperience')?.value) { showToast('⚠️ Sélectionnez votre expérience'); return false; }
  }
  if (step === 3) {
    const city = document.getElementById('aRegCity')?.value.trim();
    const rMin = document.getElementById('aRegRateMin')?.value;
    const rMax = document.getElementById('aRegRateMax')?.value;
    if (!city) { showToast('⚠️ Entrez votre ville principale'); return false; }
    if (!rMin || !rMax) { showToast('⚠️ Entrez vos tarifs horaires'); return false; }
    if (parseInt(rMax) < parseInt(rMin)) { showToast('⚠️ Le tarif max doit être ≥ au tarif min'); return false; }
  }
  return true;
}

// ── INTERACTIONS FORMULAIRE ──
function toggleSpec(el, spec) {
  el.classList.toggle('active');
  if (artisanSelectedSpecs.has(spec)) artisanSelectedSpecs.delete(spec);
  else artisanSelectedSpecs.add(spec);
}
function toggleCertif(el, certif) {
  el.classList.toggle('active');
  if (artisanSelectedCertif.has(certif)) artisanSelectedCertif.delete(certif);
  else artisanSelectedCertif.add(certif);
}
function toggleDispoDay(el, day) {
  el.classList.toggle('active');
  const isActive = el.classList.contains('active');
  el.querySelector('.dispo-day-check').textContent = isActive ? '✓' : '○';
  if (artisanSelectedDays.has(day)) artisanSelectedDays.delete(day);
  else artisanSelectedDays.add(day);
}

function previewArtisanPhoto(input) {
  const file = input.files[0]; if (!file) return;
  if (file.size > 5*1024*1024) { showToast('⚠️ Photo trop lourde (max 5 Mo)'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    artisanPhotoDataURL = e.target.result;
    const preview = document.getElementById('artisanPhotoPreview');
    const placeholder = document.getElementById('artisanPhotoPlaceholder');
    if (preview) { preview.src = e.target.result; preview.style.display = 'block'; }
    if (placeholder) placeholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function triggerDocUpload(inputId) {
  document.getElementById(inputId)?.click();
}

function handleDocUpload(input, zoneId, docType) {
  const file = input.files[0]; if (!file) return;
  if (file.size > 5*1024*1024) { showToast('⚠️ Fichier trop lourd (max 5 Mo)'); return; }
  artisanUploadedDocs[docType] = { name: file.name, size: (file.size/1024).toFixed(0) + ' Ko' };
  const zone = document.getElementById(zoneId);
  if (zone) {
    zone.innerHTML = `
      <div class="doc-uploaded">
        <span class="doc-uploaded-icon">${docType==='kbis'?'📄':docType==='assurance'?'🛡️':'🪪'}</span>
        <span style="flex:1;font-weight:600;color:var(--navy);font-size:.85rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(file.name)}</span>
        <span style="font-size:.75rem;color:var(--text-light);">${(file.size/1024).toFixed(0)} Ko</span>
        <span style="color:#27ae60;font-weight:700;margin-left:8px;">✓</span>
      </div>`;
  }
}

// ── SOUMISSION INSCRIPTION ──
function submitArtisanReg() {
  if (!document.getElementById('aRegCGV')?.checked) {
    showToast('⚠️ Acceptez les CGU pour continuer'); return;
  }
  if (!artisanUploadedDocs['kbis'] && !artisanUploadedDocs['assurance']) {
    showToast('⚠️ Joignez au moins le KBIS et l\'assurance'); return;
  }
  const newArtisan = {
    id: 'a' + Date.now(),
    firstName: document.getElementById('aRegFirstName').value.trim(),
    lastName: document.getElementById('aRegLastName').value.trim(),
    company: document.getElementById('aRegCompany').value.trim(),
    email: document.getElementById('aRegEmail').value.trim(),
    phone: document.getElementById('aRegPhone').value.trim(),
    siret: document.getElementById('aRegSiret').value.trim(),
    status: 'pending',
    specs: [...artisanSelectedSpecs],
    certifs: [...artisanSelectedCertif],
    city: document.getElementById('aRegCity').value.trim(),
    radius: parseInt(document.getElementById('aRegRadius').value) || 20,
    rateMin: parseInt(document.getElementById('aRegRateMin').value) || 60,
    rateMax: parseInt(document.getElementById('aRegRateMax').value) || 120,
    deplacement: parseInt(document.getElementById('aRegDepl').value) || 0,
    urgence: document.getElementById('aRegUrgence')?.checked || false,
    experience: document.getElementById('aRegExperience').value,
    statut: document.getElementById('aRegStatut').value,
    bio: document.getElementById('aRegBio').value.trim(),
    days: [...artisanSelectedDays],
    timeStart: document.getElementById('aRegTimeStart').value,
    timeEnd: document.getElementById('aRegTimeEnd').value,
    docs: Object.keys(artisanUploadedDocs),
    photo: artisanPhotoDataURL,
    note: 0, avisCount: 0, interventions: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };
  const artisans = loadArtisans();
  artisans.push(newArtisan);
  saveArtisans(artisans);

  // Afficher succès
  [1,2,3,4].forEach(i => { const el = document.getElementById('artisanStep'+i); if(el) el.style.display='none'; });
  document.getElementById('artisanStepSuccess').style.display = 'block';

  // Notif admin
  notifications.unshift({ id:Date.now(), icon:'👷', text:'Nouveau artisan à valider : '+newArtisan.firstName+' '+newArtisan.lastName, time:'À l\'instant', read:false });
  updateNavForUser();
}

// ── DASHBOARD ARTISAN — ONGLETS ──
function switchArtisanTab(tab, btn) {
  currentArtisanDashTab = tab;
  ['demandes','dispo','profil','stats'].forEach(t => {
    const b = document.getElementById('adTab_' + t);
    const c = document.getElementById('adContent_' + t);
    if (b) b.classList.toggle('active', t === tab);
    if (c) c.style.display = (t === tab) ? 'block' : 'none';
  });
  if (tab === 'demandes') renderArtisanRequests();
  if (tab === 'dispo') renderArtisanDispo();
  if (tab === 'profil') renderArtisanProfil();
  if (tab === 'stats') renderArtisanStats();
}

function renderArtisanRequests() {
  const list = document.getElementById('artisanRequestList');
  if (!list) return;
  if (!artisanDemoRequests.length) {
    list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-light);">📭 Aucune demande pour l\'instant</div>'; return;
  }
  list.innerHTML = artisanDemoRequests.map(r => `
    <div class="artisan-request-card">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
        <span class="artisan-request-urgence ${r.urgence === 'high' ? 'urgence-high' : r.urgence === 'med' ? 'urgence-med' : 'urgence-low'}">
          ${r.urgence === 'high' ? '🔴 Urgent' : r.urgence === 'med' ? '🟡 Modéré' : '🟢 Faible'}
        </span>
        <span style="font-size:.75rem;color:var(--text-light);margin-left:auto;">${r.date}</span>
        <span style="font-size:.75rem;padding:3px 9px;border-radius:20px;font-weight:700;${r.status==='new'?'background:#e3f0ff;color:#2980b9;':r.status==='accepted'?'background:#eafaf1;color:#27ae60;':'background:var(--cream);color:var(--text-light);'}">
          ${r.status === 'new' ? '🆕 Nouveau' : r.status === 'accepted' ? '✅ Accepté' : '✔ Terminé'}
        </span>
      </div>
      <div style="font-weight:700;font-size:.92rem;color:var(--navy);margin-bottom:4px;">${escHtml(r.problem)}</div>
      <div style="font-size:.8rem;color:var(--text-light);margin-bottom:4px;">👤 ${escHtml(r.client)}</div>
      <div style="font-size:.8rem;color:var(--text-light);">📍 ${escHtml(r.address)}</div>
      ${r.status === 'new' ? `
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button class="req-btn-accept" onclick="acceptArtisanRequest('${r.id}')">✅ Accepter</button>
          <button class="req-btn-decline" onclick="declineArtisanRequest('${r.id}')">✕ Refuser</button>
        </div>` : ''}
    </div>`).join('');
}

function acceptArtisanRequest(id) {
  const r = artisanDemoRequests.find(x => x.id === id);
  if (r) { r.status = 'accepted'; renderArtisanRequests(); showToast('✅ Demande acceptée — Client notifié !'); }
}
function declineArtisanRequest(id) {
  const idx = artisanDemoRequests.findIndex(x => x.id === id);
  if (idx !== -1) { artisanDemoRequests.splice(idx, 1); renderArtisanRequests(); showToast('Demande refusée'); }
}

function renderArtisanDispo() {
  const container = document.getElementById('artisanDispoToggles');
  if (!container) return;
  const days = [
    { key:'lun', label:'Lundi' },{ key:'mar', label:'Mardi' },{ key:'mer', label:'Mercredi' },
    { key:'jeu', label:'Jeudi' },{ key:'ven', label:'Vendredi' },{ key:'sam', label:'Samedi' },{ key:'dim', label:'Dimanche' }
  ];
  container.innerHTML = days.map(d => `
    <div class="dispo-toggle-row">
      <span style="font-weight:600;font-size:.88rem;color:var(--text);">${d.label}</span>
      <label class="dispo-switch">
        <input type="checkbox" ${artisanSelectedDays.has(d.key) ? 'checked' : ''} onchange="toggleDashDispo('${d.key}',this)">
        <span class="dispo-switch-slider"></span>
      </label>
    </div>`).join('');
}

function toggleDashDispo(day, el) {
  if (el.checked) artisanSelectedDays.add(day);
  else artisanSelectedDays.delete(day);
  showToast('📅 Disponibilités mises à jour');
}
function toggleArtisanUrgence(el) {
  showToast(el.checked ? '⚡ Mode urgence activé — Vous recevrez les demandes urgentes' : 'Mode urgence désactivé');
}

function renderArtisanProfil() {
  const artisans = loadArtisans();
  const me = artisans.find(a => a.id === 'a1') || artisans[0];
  if (!me) return;
  const preview = document.getElementById('artisanProfilPreview');
  const bioEdit = document.getElementById('artisanBioEdit');
  if (bioEdit) bioEdit.value = me.bio || '';
  if (!preview) return;
  const stars = me.note ? ('★'.repeat(Math.floor(me.note)) + (me.note%1>=0.5?'★':'')).slice(0,5) : '—';
  const specsHtml = (me.specs||[]).map(s => `<span class="artisan-profil-spec">${s}</span>`).join('');
  const certifsHtml = (me.certifs||[]).map(c => `<span class="artisan-profil-spec" style="border-color:#f39c12;color:#e67e22;">${c}</span>`).join('');
  const initials = (me.firstName[0] + me.lastName[0]).toUpperCase();
  preview.innerHTML = `
    <div class="artisan-profil-card">
      <div class="artisan-profil-banner">
        <div class="artisan-profil-avatar-wrap">${me.photo ? `<img src="${me.photo}" alt="${escHtml(me.firstName)}">` : initials}</div>
      </div>
      <div class="artisan-profil-body">
        <div class="artisan-profil-name">${escHtml(me.firstName)} ${escHtml(me.lastName)}</div>
        <div style="font-size:.82rem;color:var(--text-light);margin-top:2px;">${escHtml(me.company)} · ${escHtml(me.city)}</div>
        <div style="font-size:.82rem;color:var(--text);margin-top:8px;">${escHtml(me.bio||'')}</div>
        <div class="artisan-profil-specs">${specsHtml}${certifsHtml}</div>
        <div style="font-size:.8rem;color:var(--text-light);margin-top:8px;">📍 Zone : ${me.radius} km autour de ${escHtml(me.city)} · 💶 ${me.rateMin}–${me.rateMax} €/h${me.urgence?' · ⚡ Urgences':''}</div>
        <div class="artisan-profil-stats">
          <div class="artisan-profil-stat"><div class="artisan-profil-stat-val" style="color:#f39c12;">${me.note||'–'}</div><div class="artisan-profil-stat-label">Note moyenne</div></div>
          <div class="artisan-profil-stat"><div class="artisan-profil-stat-val">${me.avisCount}</div><div class="artisan-profil-stat-label">Avis clients</div></div>
          <div class="artisan-profil-stat"><div class="artisan-profil-stat-val">${me.interventions}</div><div class="artisan-profil-stat-label">Interventions</div></div>
        </div>
      </div>
    </div>`;
}

function saveArtisanBio() {
  const artisans = loadArtisans();
  const idx = artisans.findIndex(a => a.id === 'a1');
  if (idx !== -1) {
    artisans[idx].bio = document.getElementById('artisanBioEdit')?.value?.trim() || '';
    saveArtisans(artisans);
    renderArtisanProfil();
    showToast('💾 Profil mis à jour');
  }
}

function renderArtisanStats() {
  const artisans = loadArtisans();
  const me = artisans.find(a => a.id === 'a1') || artisans[0];
  if (!me) return;
  const kpiRow = document.getElementById('artisanKpiRow');
  if (kpiRow) kpiRow.innerHTML = `
    <div class="artisan-kpi"><div class="artisan-kpi-icon">🔧</div><div class="artisan-kpi-val">${me.interventions}</div><div class="artisan-kpi-label">Interventions</div></div>
    <div class="artisan-kpi"><div class="artisan-kpi-icon">⭐</div><div class="artisan-kpi-val
