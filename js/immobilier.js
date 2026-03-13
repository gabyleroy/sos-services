/* SOS SERVICES — Immobilier JS */
'use strict';

// ── RENDER ──
function formatPrice(p, t) {
  if(t==='location') return p.toLocaleString('fr-FR') + ' €<span class="card-price-sub">/mois</span>';
  if(p >= 1000000) return (p/1000000).toFixed(2).replace('.',',') + ' M€';
  return p.toLocaleString('fr-FR') + ' €';
}

function renderCards() {
  const grid = document.getElementById('propertyGrid');
  const start = (currentPage-1)*PER_PAGE;
  const page = filtered.slice(start, start+PER_PAGE);
  document.getElementById('countDisplay').textContent = filtered.length;

  if(!filtered.length) {
    grid.innerHTML = `<div class="no-results"><div class="no-results-icon">🔍</div><h3>Aucun bien trouvé</h3><p>Essayez d'ajuster vos filtres.</p></div>`;
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  grid.innerHTML = page.map((p,i) => `
    <div class="property-card" style="animation-delay:${i*0.07}s" onclick="openModal(${p.id})">
      <div class="card-img">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
        <span class="card-badge badge-${p.transaction}">${p.transaction==='vente'?'Vente':'Location'}</span>
        <button class="card-fav ${favorites.has(p.id)?'active':''}" onclick="toggleFav(event,${p.id})">${favorites.has(p.id)?'❤️':'🤍'}</button>
      </div>
      <div class="card-body">
        <div class="card-price">${formatPrice(p.price,p.transaction)}</div>
        <div class="card-title">${p.title}</div>
        <div class="card-location">📍 ${p.city}</div>
        <div class="card-features">
          <div class="feature"><span class="feature-icon">📐</span>${p.surface} m²</div>
          <div class="feature"><span class="feature-icon">🚪</span>${p.rooms} pièces</div>
          <div class="feature"><span class="feature-icon">🛁</span>${p.bathrooms} sdb</div>
          ${p.features.parking?'<div class="feature"><span class="feature-icon">🚗</span>Parking</div>':''}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px solid var(--cream-dark);margin-top:6px;">
          <div style="display:flex;gap:2px;">${renderStarsMini(p.id)}</div>
          <button class="add-compare-btn ${compareList.includes(p.id)?'added':''}" onclick="event.stopPropagation();toggleCompare(${p.id})">${compareList.includes(p.id)?'✓ Comparé':'⚖️ Comparer'}</button>
        </div>
      </div>
    </div>
  `).join('');
  renderPagination();
  updateMap();
}

function renderPagination() {
  const total = Math.ceil(filtered.length / PER_PAGE);
  if(total <= 1) { document.getElementById('pagination').innerHTML=''; return; }
  let html = '';
  if(currentPage>1) html += `<button class="page-btn" onclick="goPage(${currentPage-1})">‹</button>`;
  for(let i=1;i<=total;i++) html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
  if(currentPage<total) html += `<button class="page-btn" onclick="goPage(${currentPage+1})">›</button>`;
  document.getElementById('pagination').innerHTML = html;
}
function goPage(n) { currentPage=n; renderCards(); window.scrollTo({top:300,behavior:'smooth'}); }

// ── FILTERS ──
function applyFilters() {
  const t = document.getElementById('fTransaction').value.toLowerCase();
  const type = document.getElementById('fType').value;
  const city = document.getElementById('fCity').value.toLowerCase();
  const pMin = parseInt(document.getElementById('fPriceMin').value)||0;
  const pMax = parseInt(document.getElementById('fPriceMax').value)||Infinity;
  const sMin = parseInt(document.getElementById('fSurfMin').value)||0;
  const sMax = parseInt(document.getElementById('fSurfMax').value)||Infinity;
  const rMin = parseInt(document.getElementById('fRooms').value)||0;
  const parking = document.getElementById('fParking').checked;
  const terrace = document.getElementById('fTerrace').checked;
  const garden = document.getElementById('fGarden').checked;
  const pool = document.getElementById('fPool').checked;
  const elevator = document.getElementById('fElevator').checked;

  filtered = properties.filter(p => {
    if(t && p.transaction !== t) return false;
    if(type && p.type !== type) return false;
    if(city && !p.city.toLowerCase().includes(city)) return false;
    if(p.price < pMin || p.price > pMax) return false;
    if(p.surface < sMin || p.surface > sMax) return false;
    if(p.rooms < rMin) return false;
    if(parking && !p.features.parking) return false;
    if(terrace && !p.features.terrace) return false;
    if(garden && !p.features.garden) return false;
    if(pool && !p.features.pool) return false;
    if(elevator && !p.features.elevator) return false;
    if(currentTab!=='all' && p.transaction!==currentTab) return false;
    return true;
  });
  currentPage=1;
  renderCards();
}

function resetFilters() {
  ['fTransaction','fType','fRooms'].forEach(id => document.getElementById(id).value='');
  ['fCity','fPriceMin','fPriceMax','fSurfMin','fSurfMax'].forEach(id => document.getElementById(id).value='');
  ['fParking','fTerrace','fGarden','fPool','fElevator'].forEach(id => document.getElementById(id).checked=false);
  currentTab='all';
  document.querySelectorAll('.tab').forEach((t,i)=>t.classList.toggle('active',i===0));
  filtered = [...properties]; currentPage=1; renderCards();
  showToast('Filtres réinitialisés');
}

function filterTab(val, el) {
  currentTab = val;
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  if(val==='all') document.getElementById('fTransaction').value='';
  else document.getElementById('fTransaction').value=val;
  applyFilters();
}

function applyHeroSearch() {
  const type = document.getElementById('heroType').value;
  const tr = document.getElementById('heroTransaction').value.toLowerCase();
  const city = document.getElementById('heroCity').value.toLowerCase();
  if(type) document.getElementById('fType').value=type;
  if(tr) document.getElementById('fTransaction').value=tr;
  if(city) document.getElementById('fCity').value=city;
  applyFilters();
  document.querySelector('.main-layout').scrollIntoView({behavior:'smooth'});
}

function sortProperties(val) {
  if(val==='price_asc') filtered.sort((a,b)=>a.price-b.price);
  else if(val==='price_desc') filtered.sort((a,b)=>b.price-a.price);
  else if(val==='surface') filtered.sort((a,b)=>b.surface-a.surface);
  else if(val==='recent') filtered.sort((a,b)=>b.date-a.date);
  else filtered = properties.filter(p => filtered.find(f=>f.id===p.id));
  currentPage=1; renderCards();
}

function setView(v, el) {
  document.querySelectorAll('.view-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  const grid = document.getElementById('propertyGrid');
  grid.style.gridTemplateColumns = v==='list' ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))';
}

// ── FAVORITES ──
function toggleFav(e, id) {
  e.stopPropagation();
  if(favorites.has(id)) { favorites.delete(id); showToast('Retiré des favoris'); }
  else {
    if(!currentUser) { showToast('⚠️ Connectez-vous pour gérer vos favoris'); openAuth(); return; }
    favorites.add(id); showToast('❤️ Ajouté aux favoris !');
  }
  renderCards();
}

// ── MODAL ──
function openModal(id) {
  const p = properties.find(x=>x.id===id);
  if(!p) return;
  const dpeColors = {A:'#2e7d32',B:'#558b2f',C:'#f57f17',D:'#e65100',E:'#b71c1c'};

  // Build Google Maps embed URLs using coordinates
  const lat = p.lat, lng = p.lng;
  const q = encodeURIComponent(p.title + ' ' + p.city);
  const mapEmbedUrl   = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${lat},${lng}&zoom=15&maptype=roadmap`;
  const satEmbedUrl   = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${lat},${lng}&zoom=16&maptype=satellite`;
  const streetUrl     = `https://www.google.com/maps/embed/v1/streetview?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&location=${lat},${lng}&heading=210&pitch=10&fov=90`;
  const gmapsFullUrl  = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const streetFullUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;

  // Proximity info based on city
  const proximityData = getProximityData(p.city);

  document.getElementById('modalContent').innerHTML = `
    <img class="modal-img" src="${p.img}" alt="${p.title}">
    <div class="modal-body">
      <div class="modal-badges">
        <span class="card-badge badge-${p.transaction}" style="position:static">${p.transaction==='vente'?'Vente':'Location'}</span>
        <span style="background:${dpeColors[p.dpe]||'#555'};color:#fff;padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:700;">DPE ${p.dpe}</span>
        <span style="background:var(--cream);border:1px solid var(--cream-dark);padding:4px 12px;border-radius:20px;font-size:0.75rem;color:var(--text-light);">${p.type}</span>
      </div>
      <div class="modal-price">${formatPrice(p.price,p.transaction)}</div>
      <div class="modal-title">${p.title}</div>
      <div class="modal-location">📍 ${p.city} — Étage : ${p.floor}</div>
      <div class="modal-features-grid">
        <div class="modal-feature"><div class="modal-feature-icon">📐</div><div class="modal-feature-val">${p.surface} m²</div><div class="modal-feature-label">Surface</div></div>
        <div class="modal-feature"><div class="modal-feature-icon">🚪</div><div class="modal-feature-val">${p.rooms}</div><div class="modal-feature-label">Pièces</div></div>
        <div class="modal-feature"><div class="modal-feature-icon">🛁</div><div class="modal-feature-val">${p.bathrooms}</div><div class="modal-feature-label">Salle(s) de bain</div></div>
        ${p.features.parking?'<div class="modal-feature"><div class="modal-feature-icon">🚗</div><div class="modal-feature-val">Oui</div><div class="modal-feature-label">Parking</div></div>':''}
        ${p.features.garden?'<div class="modal-feature"><div class="modal-feature-icon">🌿</div><div class="modal-feature-val">Oui</div><div class="modal-feature-label">Jardin</div></div>':''}
        ${p.features.pool?'<div class="modal-feature"><div class="modal-feature-icon">🏊</div><div class="modal-feature-val">Oui</div><div class="modal-feature-label">Piscine</div></div>':''}
      </div>
      <p class="modal-desc">${p.desc}</p>
      <div class="modal-tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>

      <!-- ── GOOGLE MAPS SECTION ── -->
      <div style="margin:24px 0 0;">
        <div style="font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--navy);margin-bottom:12px;display:flex;align-items:center;gap:8px;">
          📍 Localisation du bien
        </div>

        <div class="modal-map-section">
          <div class="modal-map-tabs">
            <button class="modal-map-tab active" onclick="switchMapView('plan','${id}',this)" id="tabPlan_${id}">🗺️ Plan</button>
            <button class="modal-map-tab" onclick="switchMapView('satellite','${id}',this)" id="tabSat_${id}">🛰️ Satellite</button>
            <button class="modal-map-tab" onclick="switchMapView('street','${id}',this)" id="tabStreet_${id}">👁️ Street View</button>
          </div>
          <div class="modal-map-frame" id="mapFrame_${id}">
            <div class="map-loading" id="mapLoading_${id}">
              <div class="map-spinner"></div>
              <span>Chargement de la carte…</span>
            </div>
            <iframe
              id="mapIframe_${id}"
              src="${mapEmbedUrl}"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              onload="document.getElementById('mapLoading_${id}').style.display='none'"
              style="position:absolute;inset:0;width:100%;height:100%;border:none;">
            </iframe>
          </div>
          <div class="modal-map-footer">
            <div class="modal-map-address">📍 ${p.city} · lat ${lat.toFixed(4)}, lng ${lng.toFixed(4)}</div>
            <div style="display:flex;gap:8px;">
              <a href="${streetFullUrl}" target="_blank" class="open-gmaps-btn" style="background:var(--cream);color:var(--text);border:1px solid var(--cream-dark);">👁️ Street View</a>
              <a href="${gmapsFullUrl}" target="_blank" class="open-gmaps-btn">🗺️ Ouvrir Maps</a>
            </div>
          </div>
        </div>

        <!-- Proximité -->
        <div style="margin-top:16px;">
          <div style="font-size:0.78rem;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">À proximité</div>
          <div class="proximity-row">
            ${proximityData.map(item => `<span class="proximity-badge">${item.icon} ${item.label}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Store embed URLs for tab switching -->
      <script>
        window._mapUrls = window._mapUrls || {};
        window._mapUrls['${id}'] = {
          plan: '${mapEmbedUrl}',
          satellite: '${satEmbedUrl}',
          street: '${streetUrl}'
        };
      <\/script>

      <div class="modal-actions" style="margin-top:24px;flex-wrap:wrap;gap:10px;">
        <button class="btn-primary" onclick="requireAuth(()=>{closeModal();openMsg(${p.id})})">💬 Contacter le vendeur</button>
        <button class="btn-secondary" onclick="requireAuth(()=>openVisitModal(${p.id}))">
          📅 Demander une visite <span style="background:rgba(15,28,46,0.15);padding:2px 8px;border-radius:10px;font-size:0.8rem;margin-left:4px;">${p.visitFee}€</span>
        </button>
        <button onclick="openRatings(${p.id})" style="width:100%;background:var(--cream);border:1.5px solid var(--cream-dark);padding:11px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:0.88rem;cursor:pointer;transition:var(--transition);display:flex;align-items:center;justify-content:center;gap:8px;color:var(--text);" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--cream-dark)'">
          ⭐ Voir les avis (${getRatingCount(p.id)}) — Note: ${getAvgRating(p.id)}
        </button>
      </div>
    </div>
  `;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}

function switchMapView(type, propId, el) {
  // Update tab active state
  ['tabPlan','tabSat','tabStreet'].forEach(t => {
    const btn = document.getElementById(t + '_' + propId);
    if(btn) btn.classList.remove('active');
  });
  el.classList.add('active');

  // Show loading
  const loading = document.getElementById('mapLoading_' + propId);
  if(loading) loading.style.display = 'flex';

  // Swap iframe src
  const iframe = document.getElementById('mapIframe_' + propId);
  if(iframe && window._mapUrls && window._mapUrls[propId]) {
    iframe.src = window._mapUrls[propId][type];
    iframe.onload = () => { if(loading) loading.style.display = 'none'; };
  }
}

function getProximityData(city) {
  const base = [
    { icon:'🚇', label:'Métro / Tram à 5 min' },
    { icon:'🛒', label:'Commerces à 3 min' },
    { icon:'🏫', label:'Écoles à 8 min' },
    { icon:'🌳', label:'Parc à 10 min' },
    { icon:'🏥', label:'Hôpital à 12 min' },
    { icon:'🚌', label:'Bus ligne proche' },
  ];
  // Slightly vary proximity data per city for realism
  const extras = {
    'Paris': [{ icon:'🗼', label:'Centre Paris à 15 min' }],
    'Nice': [{ icon:'🏖️', label:'Plage à 8 min' }],
    'Cannes': [{ icon:'🎬', label:'Croisette à 5 min' }],
    'Marseille': [{ icon:'⛵', label:'Vieux-Port à 10 min' }],
    'Lyon': [{ icon:'🍽️', label:'Quartier gastronomique à 7 min' }],
    'Bordeaux': [{ icon:'🍷', label:'Cité du Vin à 12 min' }],
  };
  const cityKey = Object.keys(extras).find(k => city.toLowerCase().includes(k.toLowerCase()));
  return cityKey ? [...base.slice(0,4), extras[cityKey][0], base[4]] : base;
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow='';
}
function closeModalOnOutside(e) { if(e.target===document.getElementById('modalOverlay')) closeModal(); }

// ── MAP ──
function initMap() {
  if (typeof L === 'undefined') {
    // Leaflet pas encore chargé — réessayer dans 500ms
    setTimeout(initMap, 500); return;
  }
  try {
    map = L.map('map').setView([46.5, 2.5], 5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{
      attribution:'© OpenStreetMap contributors © CARTO', maxZoom:19
    }).addTo(map);
    updateMap();
  } catch(e) { console.warn('Leaflet init error:', e); }
}
function updateMap() {
  if(!map || typeof L === 'undefined') return;
  markers.forEach(m=>{ try{map.removeLayer(m);}catch(e){} });
  markers=[];
  filtered.forEach(p => {
    try {
    const color = p.transaction==='vente' ? '#0f1c2e' : '#1a6b3c';
    const icon = L.divIcon({
      html:`<div style="background:${color};color:${p.transaction==='vente'?'#c9a84c':'#7ee3a8'};padding:5px 9px;border-radius:8px;font-size:0.75rem;font-weight:700;white-space:nowrap;box-shadow:0 3px 12px rgba(0,0,0,0.2);">${p.transaction==='vente'?(p.price>=1000000?(p.price/1000000).toFixed(1)+'M€':Math.round(p.price/1000)+'k€'):p.price+'€'}</div>`,
      className:'', iconAnchor:[30,20]
    });
    const m = L.marker([p.lat,p.lng],{icon}).addTo(map);
    m.bindPopup(`<div style="font-family:'DM Sans',sans-serif;min-width:180px;padding:4px;">
      <div style="font-weight:700;margin-bottom:4px;font-size:0.9rem;">${p.title}</div>
      <div style="color:#6b7c93;font-size:0.8rem;margin-bottom:6px;">📍 ${p.city}</div>
      <div style="font-size:0.85rem;color:#0f1c2e;font-weight:700;">${p.price.toLocaleString('fr-FR')} €${p.transaction==='location'?'/mois':''}</div>
      <div style="margin-top:6px;font-size:0.78rem;color:#6b7c93;">${p.surface}m² · ${p.rooms} pièces</div>
    </div>`);
    m.on('click',()=>openModal(p.id));
    markers.push(m);
    } catch(e) { console.warn('Marker error:', e); }
  });
}

// ── VISIT BOOKING SYSTEM ──
let currentVisitProp = null;
let selectedPayMethod = 'card';
let selectedOperator = 'orange';

function openVisitModal(propId) {
  currentVisitProp = properties.find(p => p.id === propId);
  if (!currentVisitProp) return;

  // Pre-fill from logged-in user
  if (currentUser) {
    document.getElementById('visitName').value = currentUser.first + ' ' + currentUser.last;
    document.getElementById('visitEmail').value = currentUser.email;
  }

  // Set min date to tomorrow
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('visitDate').min = tomorrow.toISOString().split('T')[0];
  document.getElementById('visitDate').value = '';
  document.getElementById('visitTime').value = '';
  document.getElementById('visitPhone').value = '';
  document.getElementById('visitMessage').value = '';

  // Update header
  document.getElementById('visitPropTitle').textContent = currentVisitProp.title;
  document.getElementById('visitFeeDisplay').textContent = currentVisitProp.visitFee + ' €';
  document.getElementById('visitAgencyDisplay').textContent = '🏢 ' + (currentVisitProp.agency || 'Agence SOS SERVICES');

  goToStep(1);
  document.getElementById('visitOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVisitModal() {
  document.getElementById('visitOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('visitOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('visitOverlay')) closeVisitModal();
});

function goToStep(n) {
  // Show/hide panels
  ['vstep1','vstep2','vstep3'].forEach((id,i) => {
    document.getElementById(id).style.display = (i+1 === n) ? 'block' : 'none';
  });
  // Update step indicators
  document.querySelectorAll('.vstep[data-step]').forEach(el => {
    const s = parseInt(el.dataset.step
