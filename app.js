(() => {
  const STORAGE_KEY = "celnaro-demo-v01-release";

  const icons = {
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.4-3.4"/></svg>`,
    car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 14.5V12l2.2-5h13.6l2.2 5v2.5"/><path d="M5 14h14v5H5z"/><circle cx="7.5" cy="17" r="1" fill="currentColor"/><circle cx="16.5" cy="17" r="1" fill="currentColor"/><path d="M6.5 11h11"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`,
    wrench: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 6a5 5 0 0 0-6.7 6.7l-4.8 4.8a2.1 2.1 0 0 0 3 3l4.8-4.8A5 5 0 0 0 17 9l-3 3-2-2 3-3Z"/></svg>`,
    receipt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6"/></svg>`,
    arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></svg>`,
  };

  const seed = {
    customers: [
      { id: "c1", firstName: "Lucía", lastName: "Fernández", phone: "11 4582-1930" },
      { id: "c2", firstName: "Martín", lastName: "Gómez", phone: "11 6240-7715" },
      { id: "c3", firstName: "Sofía", lastName: "Rossi", phone: "11 3561-9084" },
    ],
    vehicles: [
      { id: "v1", customerId: "c1", plate: "AB 123 CD", brand: "Toyota", model: "Etios XLS", year: "2019" },
      { id: "v2", customerId: "c2", plate: "AE 782 QL", brand: "Volkswagen", model: "Amarok", year: "2021" },
      { id: "v3", customerId: "c3", plate: "AC 450 NP", brand: "Renault", model: "Sandero", year: "2018" },
    ],
    jobs: [
      { id: "j1", vehicleId: "v1", date: "2026-09-22", mileage: 68420, description: "Service completo y revisión general", parts: "Aceite 5W-30, filtro de aceite, filtro de aire" },
      { id: "j2", vehicleId: "v1", date: "2026-05-14", mileage: 62105, description: "Cambio de pastillas de freno delanteras", parts: "Juego de pastillas delanteras" },
      { id: "j3", vehicleId: "v2", date: "2026-08-03", mileage: 89700, description: "Revisión de tren delantero y alineación", parts: "Bieleta delantera derecha" },
      { id: "j4", vehicleId: "v3", date: "2026-07-11", mileage: 74450, description: "Cambio de batería y control eléctrico", parts: "Batería 12V 65Ah" },
    ],
    budgets: [
      { id: "b1", vehicleId: "v1", customerId: "c1", date: "2026-10-12", number: "0001-000042", items: [
        { type: "Repuesto", description: "Kit de distribución", quantity: 1, unitPrice: 145000 },
        { type: "Mano de obra", description: "Cambio de distribución", quantity: 1, unitPrice: 85000 },
      ]},
    ],
  };

  let data = loadData();
  let searchTerm = "";

  function loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : structuredClone(seed);
    } catch (_) {
      return structuredClone(seed);
    }
  }

  function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  function uid(prefix) { return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[ch]); }
  function normalize(value = "") { return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, ""); }
  function money(value) { return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value || 0); }
  function dateLabel(value) { return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(value + "T12:00:00Z")); }
  function today() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function getCustomer(id) { return data.customers.find(c => c.id === id); }
  function getVehicle(id) { return data.vehicles.find(v => v.id === id); }
  function getBudget(id) { return data.budgets.find(b => b.id === id); }
  function customerName(customer) { return customer ? `${customer.firstName} ${customer.lastName}` : "Sin cliente"; }
  function totalBudget(budget) { return budget.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0); }

  function shell(content, active = "") {
    return `<div class="app-shell">
      <header class="topbar">
        <div class="topbar-inner">
          <a class="brand" href="#/">
            <span class="brand-mark">C</span>
            <span class="brand-copy"><strong>CELNARO</strong><span>Gestión de taller</span></span>
          </a>
          <nav class="topnav" aria-label="Navegación principal">
            <a class="nav-link ${active === "home" ? "active" : ""}" href="#/">Inicio</a>
            <a class="nav-link ${active === "vehicles" ? "active" : ""}" href="#/vehiculos">Vehículos</a>
            <a class="nav-link ${active === "new" ? "active" : ""}" href="#/nuevo">Nuevo registro</a>
          </nav>
          <span class="demo-chip">Demo v0.1</span>
        </div>
      </header>
      ${content}
    </div>`;
  }

  function homeView() {
    const results = filteredVehicles(searchTerm);
    return shell(`<main class="page">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Taller mecánico · Gestión simple</p>
          <h1>El historial de cada vehículo, siempre a mano.</h1>
          <p>Encontrá clientes, consultá trabajos anteriores y prepará presupuestos claros desde un solo lugar.</p>
        </div>
        <div class="hero-side">
          <span class="hero-side-label">Próximo paso sugerido</span>
          <strong>Buscá una patente</strong>
          <p>Probá con <b>AB 123 CD</b> para revisar el historial ficticio de Lucía Fernández.</p>
          <button class="btn btn-accent btn-sm" data-fill-search="AB 123 CD">Usar patente de prueba ${icons.arrow}</button>
        </div>
      </section>
      <section class="search-panel" aria-label="Búsqueda de clientes y vehículos">
        <div class="search-wrap">
          <span class="search-icon">${icons.search}</span>
          <input id="main-search" class="search-input" data-empty-title="Vehículos recientes" data-count-singular="registro" data-count-plural="registros" type="search" autocomplete="off" placeholder="Buscar por patente o apellido…" value="${escapeHtml(searchTerm)}" />
        </div>
        <a class="btn btn-primary" href="#/nuevo">${icons.plus} Nuevo cliente y vehículo</a>
      </section>
      <section class="dashboard-grid">
        <div class="card">
          <div class="card-head"><h2 id="results-title">${searchTerm ? "Resultados de búsqueda" : "Vehículos recientes"}</h2><span class="tag" id="results-count">${results.length} ${results.length === 1 ? "registro" : "registros"}</span></div>
          <div class="card-body" id="search-results">${vehicleRows(results)}</div>
        </div>
        <aside class="card">
          <div class="card-head"><h3>Resumen del taller</h3></div>
          <div class="card-body">
            <div class="stats">
              <div class="stat"><strong>${data.vehicles.length}</strong><span>Vehículos</span></div>
              <div class="stat"><strong>${data.jobs.length}</strong><span>Trabajos</span></div>
              <div class="stat"><strong>${data.budgets.length}</strong><span>Presupuestos</span></div>
            </div>
            <div class="quick-actions">
              <a class="quick-action" href="#/nuevo"><span class="quick-action-icon">${icons.plus}</span><span><strong>Registrar un vehículo</strong><small>Cliente y datos principales</small></span></a>
              <button class="quick-action" data-reset><span class="quick-action-icon">↺</span><span><strong>Restaurar datos de prueba</strong><small>Volver al estado inicial</small></span></button>
            </div>
            <div class="demo-note"><strong>Entorno de demostración.</strong> Los datos son ficticios y se guardan solamente en este navegador.</div>
          </div>
        </aside>
      </section>
      <p class="footer-note">CELNARO CORE · Caso Mariano · Demostración funcional sin datos reales</p>
    </main>`, "home");
  }

  function vehiclesView() {
    const results = filteredVehicles(searchTerm);
    return shell(`<main class="page">
      <div class="breadcrumbs"><a href="#/">Inicio</a><span>/</span><strong>Vehículos</strong></div>
      <div class="page-header">
        <div class="page-title"><p class="eyebrow">Clientes y vehículos</p><h1>Vehículos registrados</h1><p>Buscá por patente o apellido y abrí la ficha completa.</p></div>
        <div class="header-actions"><a class="btn btn-primary" href="#/nuevo">${icons.plus} Nuevo cliente y vehículo</a></div>
      </div>
      <section class="card vehicle-directory">
        <div class="directory-toolbar">
          <div class="search-wrap">
            <span class="search-icon">${icons.search}</span>
            <input id="main-search" class="search-input" data-empty-title="Todos los vehículos" data-count-singular="coincidencia" data-count-plural="coincidencias" type="search" autocomplete="off" placeholder="Buscar por patente o apellido…" value="${escapeHtml(searchTerm)}" />
          </div>
          <span class="tag">${data.vehicles.length} ${data.vehicles.length === 1 ? "vehículo" : "vehículos"}</span>
        </div>
        <div class="card-head"><h2 id="results-title">${searchTerm ? "Resultados de búsqueda" : "Todos los vehículos"}</h2><span class="tag" id="results-count">${results.length} ${results.length === 1 ? "coincidencia" : "coincidencias"}</span></div>
        <div class="card-body" id="search-results">${vehicleRows(results)}</div>
      </section>
      <p class="footer-note">CELNARO CORE · Vehículos y clientes ficticios para la demostración</p>
    </main>`, "vehicles");
  }

  function filteredVehicles(term) {
    const q = normalize(term);
    return data.vehicles.filter(vehicle => {
      const customer = getCustomer(vehicle.customerId);
      return !q || normalize(vehicle.plate).includes(q) || normalize(customer?.lastName).includes(q) || normalize(customerName(customer)).includes(q);
    });
  }

  function vehicleRows(vehicles) {
    if (!vehicles.length) return `<div class="empty-state"><div class="empty-icon">${icons.search}</div><h3>No encontramos coincidencias</h3><p>Revisá la patente o el apellido. También podés registrar un nuevo cliente y vehículo.</p><a class="btn btn-primary btn-sm" href="#/nuevo">${icons.plus} Crear registro</a></div>`;
    return `<div class="result-list">${vehicles.map(vehicle => {
      const customer = getCustomer(vehicle.customerId);
      return `<button class="vehicle-row" data-open-vehicle="${vehicle.id}">
        <span class="vehicle-icon">${icons.car}</span>
        <span class="vehicle-main"><strong>${escapeHtml(vehicle.brand)} ${escapeHtml(vehicle.model)}</strong><span>${escapeHtml(customerName(customer))} · ${(() => { const count = data.jobs.filter(j => j.vehicleId === vehicle.id).length; return `${count} ${count === 1 ? "trabajo registrado" : "trabajos registrados"}`; })()}</span></span>
        <span class="vehicle-row-end"><span class="plate">${escapeHtml(vehicle.plate)}</span><span class="chevron" aria-hidden="true">${icons.arrow}</span></span>
      </button>`;
    }).join("")}</div>`;
  }

  function newRegistrationView() {
    return shell(`<main class="page">
      <div class="breadcrumbs"><a href="#/">Inicio</a><span>/</span><strong>Nuevo registro</strong></div>
      <div class="page-header"><div class="page-title"><p class="eyebrow">Alta rápida</p><h1>Nuevo cliente y vehículo</h1><p>Completá la información mínima para empezar a registrar el historial.</p></div></div>
      <form id="registration-form" class="card form-card">
        <section class="form-section">
          <h2 class="section-title"><span class="section-number">1</span> Datos del cliente</h2>
          <div class="form-grid">
            <div class="field"><label for="firstName">Nombre</label><input class="control" id="firstName" name="firstName" required autocomplete="given-name" placeholder="Ej. Juan" /></div>
            <div class="field"><label for="lastName">Apellido</label><input class="control" id="lastName" name="lastName" required autocomplete="family-name" placeholder="Ej. Pérez" /></div>
            <div class="field full"><label for="phone">Teléfono <span class="optional">· opcional</span></label><input class="control" id="phone" name="phone" autocomplete="tel" placeholder="Ej. 11 4567-8901" /></div>
          </div>
        </section>
        <section class="form-section">
          <h2 class="section-title"><span class="section-number">2</span> Datos del vehículo</h2>
          <div class="form-grid">
            <div class="field"><label for="plate">Patente</label><input class="control" id="plate" name="plate" required autocapitalize="characters" placeholder="Ej. AF 123 BC" /><span class="field-hint">Se usará para encontrar el vehículo rápidamente.</span></div>
            <div class="field"><label for="year">Año <span class="optional">· opcional</span></label><input class="control" id="year" name="year" type="number" min="1950" max="2030" placeholder="Ej. 2020" /></div>
            <div class="field"><label for="brand">Marca</label><input class="control" id="brand" name="brand" required placeholder="Ej. Ford" /></div>
            <div class="field"><label for="model">Modelo</label><input class="control" id="model" name="model" required placeholder="Ej. Focus" /></div>
          </div>
        </section>
        <div class="form-actions"><a class="btn btn-secondary" href="#/">Cancelar</a><button class="btn btn-primary" type="submit">Guardar y abrir ficha ${icons.arrow}</button></div>
      </form>
      <p class="footer-note">Los campos obligatorios son provisionales para esta demostración.</p>
    </main>`, "new");
  }

  function vehicleView(id, tab = "history") {
    const vehicle = getVehicle(id);
    if (!vehicle) return notFoundView();
    const customer = getCustomer(vehicle.customerId);
    const jobs = data.jobs.filter(j => j.vehicleId === id).sort((a,b) => b.date.localeCompare(a.date));
    const budgets = data.budgets.filter(b => b.vehicleId === id).sort((a,b) => b.date.localeCompare(a.date));
    const tabContent = tab === "budgets" ? budgetsContent(budgets, id) : historyContent(jobs, id);
    return shell(`<main class="page">
      <div class="breadcrumbs"><a href="#/">Inicio</a><span>/</span><a href="#/vehiculos">Vehículos</a><span>/</span><strong>${escapeHtml(vehicle.plate)}</strong></div>
      <section class="vehicle-banner">
        <div class="vehicle-id"><span class="vehicle-id-icon">${icons.car}</span><div><h1>${escapeHtml(vehicle.brand)} ${escapeHtml(vehicle.model)}</h1><p>${vehicle.year ? `Año ${escapeHtml(vehicle.year)} · ` : ""}Cliente: ${escapeHtml(customerName(customer))}</p></div></div>
        <div class="banner-meta"><span class="plate">${escapeHtml(vehicle.plate)}</span></div>
      </section>
      <div class="detail-grid">
        <section class="card">
          <div class="tabs" role="tablist" aria-label="Contenido de la ficha">
            <button class="tab ${tab === "history" ? "active" : ""}" role="tab" aria-selected="${tab === "history"}" data-tab="history" data-vehicle="${id}">Historial <span class="tab-count">${jobs.length}</span></button>
            <button class="tab ${tab === "budgets" ? "active" : ""}" role="tab" aria-selected="${tab === "budgets"}" data-tab="budgets" data-vehicle="${id}">Presupuestos <span class="tab-count">${budgets.length}</span></button>
          </div>
          <div class="card-body" id="tab-content" role="tabpanel">${tabContent}</div>
        </section>
        <aside class="card">
          <div class="card-head"><h3>Datos de la ficha</h3></div>
          <div class="card-body">
            <div class="info-list">
              <div class="info-item"><span>Cliente</span><strong>${escapeHtml(customerName(customer))}</strong></div>
              <div class="info-item"><span>Teléfono</span><strong>${escapeHtml(customer?.phone || "No informado")}</strong></div>
              <div class="info-item"><span>Vehículo</span><strong>${escapeHtml(vehicle.brand)} ${escapeHtml(vehicle.model)}${vehicle.year ? ` · ${escapeHtml(vehicle.year)}` : ""}</strong></div>
              <div class="info-item"><span>Patente</span><strong>${escapeHtml(vehicle.plate)}</strong></div>
            </div>
            <div class="side-actions">
              <a class="btn btn-primary" href="#/vehiculo/${id}/trabajo">${icons.wrench} Registrar trabajo</a>
              <a class="btn btn-secondary" href="#/vehiculo/${id}/presupuesto">${icons.receipt} Nuevo presupuesto</a>
            </div>
          </div>
        </aside>
      </div>
      <p class="footer-note">Ficha ficticia para validación funcional · CELNARO Demo v0.1</p>
    </main>`, "vehicles");
  }

  function historyContent(jobs, vehicleId) {
    if (!jobs.length) return `<div class="empty-state"><div class="empty-icon">${icons.wrench}</div><h3>Todavía no hay trabajos</h3><p>Registrá la primera intervención para empezar el historial de este vehículo.</p><a class="btn btn-primary btn-sm" href="#/vehiculo/${vehicleId}/trabajo">${icons.plus} Registrar trabajo</a></div>`;
    return `<div class="timeline">${jobs.map(job => `<article class="timeline-item"><span class="timeline-dot"></span><button class="delete-job" type="button" data-delete-job="${escapeHtml(job.id)}" aria-label="Eliminar trabajo ${escapeHtml(job.description)} del ${dateLabel(job.date)}" title="Eliminar trabajo">${icons.trash}</button><div class="timeline-date">${dateLabel(job.date)}</div><h3 class="timeline-title">${escapeHtml(job.description)}</h3><div class="timeline-meta"><span class="tag">${Number(job.mileage).toLocaleString("es-AR")} km</span></div><p class="parts"><strong>Repuestos:</strong> ${escapeHtml(job.parts || "Sin repuestos registrados")}</p></article>`).join("")}</div>`;
  }

  function budgetsContent(budgets, vehicleId) {
    if (!budgets.length) return `<div class="empty-state"><div class="empty-icon">${icons.receipt}</div><h3>No hay presupuestos</h3><p>Prepará un presupuesto con repuestos y mano de obra para este vehículo.</p><a class="btn btn-primary btn-sm" href="#/vehiculo/${vehicleId}/presupuesto">${icons.plus} Crear presupuesto</a></div>`;
    return `<div class="budget-list">${budgets.map(budget => `<article class="budget-row"><div><h3>Presupuesto N.º ${escapeHtml(budget.number)}</h3><p>${dateLabel(budget.date)} · ${budget.items.length} ${budget.items.length === 1 ? "ítem" : "ítems"}</p></div><div class="budget-row-actions"><div class="budget-total"><strong>${money(totalBudget(budget))}</strong><span>Total estimado</span></div><a class="btn btn-secondary btn-sm" href="#/vehiculo/${vehicleId}/presupuesto/${budget.id}">Ver vista previa ${icons.arrow}</a></div></article>`).join("")}</div>`;
  }

  function budgetPreviewView(vehicleId, budgetId) {
    const vehicle = getVehicle(vehicleId);
    const budget = getBudget(budgetId);
    const customer = budget && getCustomer(budget.customerId || vehicle?.customerId);
    if (!vehicle || !budget || budget.vehicleId !== vehicleId || !customer) return notFoundView();

    return shell(`<main class="page budget-preview-page">
      <div class="breadcrumbs preview-only"><a href="#/">Inicio</a><span>/</span><a href="#/vehiculos">Vehículos</a><span>/</span><a href="#/vehiculo/${vehicleId}/presupuestos">${escapeHtml(vehicle.plate)}</a><span>/</span><strong>Vista previa</strong></div>
      <div class="page-header preview-only">
        <div class="page-title"><p class="eyebrow">Documento listo para revisar</p><h1>Vista previa del presupuesto</h1><p>Comprobá los datos antes de compartirlo con el cliente.</p></div>
        <div class="header-actions"><a class="btn btn-secondary" href="#/vehiculo/${vehicleId}/presupuestos">Volver</a><button class="btn btn-primary" type="button" data-print>${icons.receipt} Imprimir</button></div>
      </div>
      <article class="quote-sheet" aria-label="Presupuesto ${escapeHtml(budget.number)}">
        <header class="quote-header">
          <div class="quote-brand"><span class="quote-brand-mark">C</span><div><strong>CELNARO</strong><span>Taller mecánico · Gestión de taller</span></div></div>
          <div class="quote-heading"><span>PRESUPUESTO</span><strong>N.º ${escapeHtml(budget.number)}</strong><small>Emitido el ${dateLabel(budget.date)}</small></div>
        </header>
        <div class="quote-rule"></div>
        <section class="quote-parties" aria-label="Datos del cliente y del vehículo">
          <div class="quote-info-block"><span class="quote-label">Cliente</span><strong>${escapeHtml(customerName(customer))}</strong><p>${escapeHtml(customer.phone || "Teléfono no informado")}</p></div>
          <div class="quote-info-block"><span class="quote-label">Vehículo</span><strong>${escapeHtml(vehicle.brand)} ${escapeHtml(vehicle.model)}</strong><p>${vehicle.year ? `Año ${escapeHtml(vehicle.year)} · ` : ""}Patente ${escapeHtml(vehicle.plate)}</p></div>
        </section>
        <section class="quote-items" aria-label="Ítems del presupuesto">
          <table>
            <thead><tr><th>Descripción</th><th>Tipo</th><th class="quote-number">Cant.</th><th class="quote-number">Precio unit.</th><th class="quote-number">Subtotal</th></tr></thead>
            <tbody>${budget.items.map(item => `<tr><td data-label="Descripción"><strong>${escapeHtml(item.description)}</strong></td><td data-label="Tipo"><span class="quote-item-type">${escapeHtml(item.type)}</span></td><td class="quote-number" data-label="Cantidad">${Number(item.quantity).toLocaleString("es-AR")}</td><td class="quote-number" data-label="Precio unitario">${money(item.unitPrice)}</td><td class="quote-number" data-label="Subtotal"><strong>${money(Number(item.quantity) * Number(item.unitPrice))}</strong></td></tr>`).join("")}</tbody>
          </table>
        </section>
        <footer class="quote-footer">
          <p>Valores expresados en pesos argentinos. Presupuesto de demostración, no válido como factura.</p>
          <div class="quote-grand-total"><span>Total estimado</span><strong>${money(totalBudget(budget))}</strong></div>
        </footer>
      </article>
      <p class="footer-note preview-only">Vista previa legible para revisión · CELNARO Demo v0.1</p>
    </main>`, "vehicles");
  }

  function jobView(vehicleId) {
    const vehicle = getVehicle(vehicleId);
    if (!vehicle) return notFoundView();
    return shell(`<main class="page">
      <div class="breadcrumbs"><a href="#/">Inicio</a><span>/</span><a href="#/vehiculos">Vehículos</a><span>/</span><a href="#/vehiculo/${vehicleId}">${escapeHtml(vehicle.plate)}</a><span>/</span><strong>Nuevo trabajo</strong></div>
      <div class="page-header"><div class="page-title"><p class="eyebrow">Registro de intervención</p><h1>Nuevo trabajo realizado</h1><p>${escapeHtml(vehicle.brand)} ${escapeHtml(vehicle.model)} · ${escapeHtml(vehicle.plate)}</p></div></div>
      <form id="job-form" data-vehicle="${vehicleId}" class="card form-card">
        <section class="form-section">
          <div class="form-grid">
            <div class="field"><label for="date">Fecha del trabajo</label><input class="control" id="date" name="date" type="date" value="${today()}" required /></div>
            <div class="field"><label for="mileage">Kilometraje</label><input class="control" id="mileage" name="mileage" type="number" min="0" required placeholder="Ej. 75000" /></div>
            <div class="field full"><label for="description">Trabajos realizados</label><textarea class="control" id="description" name="description" required placeholder="Describí las tareas realizadas…"></textarea></div>
            <div class="field full"><label for="parts">Repuestos utilizados <span class="optional">· opcional</span></label><textarea class="control" id="parts" name="parts" placeholder="Detallá las piezas o materiales utilizados…"></textarea></div>
          </div>
        </section>
        <div class="form-actions"><a class="btn btn-secondary" href="#/vehiculo/${vehicleId}">Cancelar</a><button class="btn btn-primary" type="submit">Guardar en el historial</button></div>
      </form>
    </main>`, "vehicles");
  }

  function budgetView(vehicleId) {
    const vehicle = getVehicle(vehicleId);
    const customer = vehicle && getCustomer(vehicle.customerId);
    if (!vehicle || !customer) return notFoundView();
    return shell(`<main class="page">
      <div class="breadcrumbs"><a href="#/">Inicio</a><span>/</span><a href="#/vehiculos">Vehículos</a><span>/</span><a href="#/vehiculo/${vehicleId}">${escapeHtml(vehicle.plate)}</a><span>/</span><strong>Nuevo presupuesto</strong></div>
      <div class="page-header"><div class="page-title"><p class="eyebrow">Presupuesto básico</p><h1>Preparar presupuesto</h1><p>${escapeHtml(customerName(customer))} · ${escapeHtml(vehicle.brand)} ${escapeHtml(vehicle.model)}</p></div></div>
      <form id="budget-form" data-vehicle="${vehicleId}" class="card form-card" style="max-width:1080px">
        <section class="form-section">
          <div class="form-grid">
            <div class="field"><label for="budget-date">Fecha de emisión</label><input class="control" id="budget-date" name="date" type="date" value="${today()}" required /></div>
            <div class="field"><label for="budget-number">Número</label><input class="control" id="budget-number" name="number" value="0001-${String(43 + data.budgets.length).padStart(6,"0")}" required /></div>
          </div>
        </section>
        <section class="form-section">
          <h2 class="section-title">Ítems del presupuesto</h2>
          <div style="overflow-x:auto">
            <table class="budget-table">
              <thead><tr><th>Descripción</th><th>Tipo</th><th>Cantidad</th><th>Precio unitario</th><th></th></tr></thead>
              <tbody id="budget-items"></tbody>
            </table>
          </div>
          <button class="btn btn-secondary btn-sm" type="button" id="add-budget-item">${icons.plus} Agregar ítem</button>
          <div class="budget-summary"><div class="summary-line"><span>Total estimado</span><strong id="budget-total">$ 0</strong></div></div>
        </section>
        <div class="form-actions"><a class="btn btn-secondary" href="#/vehiculo/${vehicleId}">Cancelar</a><button class="btn btn-primary" type="submit">Guardar presupuesto</button></div>
      </form>
    </main>`, "vehicles");
  }

  function notFoundView() {
    return shell(`<main class="page"><div class="card"><div class="empty-state"><div class="empty-icon">?</div><h3>No encontramos esta ficha</h3><p>El registro solicitado no existe o fue eliminado.</p><a class="btn btn-primary" href="#/">Volver al inicio</a></div></div></main>`);
  }

  function route() {
    const path = location.hash.slice(1) || "/";
    const parts = path.split("/").filter(Boolean);
    if (!parts.length) render(homeView());
    else if (parts[0] === "vehiculos" && parts.length === 1) render(vehiclesView());
    else if (parts[0] === "nuevo" && parts.length === 1) render(newRegistrationView());
    else if (parts[0] === "vehiculo" && parts[1] && parts[2] === "trabajo" && parts.length === 3) render(jobView(parts[1]));
    else if (parts[0] === "vehiculo" && parts[1] && parts[2] === "presupuesto" && parts[3] && parts.length === 4) render(budgetPreviewView(parts[1], parts[3]));
    else if (parts[0] === "vehiculo" && parts[1] && parts[2] === "presupuesto" && parts.length === 3) { render(budgetView(parts[1])); requestAnimationFrame(() => { addBudgetItem(); addBudgetItem(); }); }
    else if (parts[0] === "vehiculo" && parts[1] && (parts.length === 2 || (parts.length === 3 && parts[2] === "presupuestos"))) render(vehicleView(parts[1], parts[2] === "presupuestos" ? "budgets" : "history"));
    else render(notFoundView());
  }

  function render(html) {
    document.getElementById("app").innerHTML = html;
    window.scrollTo({ top: 0, behavior: "instant" });
    bindEvents();
  }

  function bindEvents() {
    const search = document.getElementById("main-search");
    if (search) search.addEventListener("input", e => {
      searchTerm = e.target.value;
      const results = filteredVehicles(searchTerm);
      document.getElementById("results-title").textContent = searchTerm ? "Resultados de búsqueda" : e.target.dataset.emptyTitle;
      const countLabel = results.length === 1 ? e.target.dataset.countSingular : e.target.dataset.countPlural;
      document.getElementById("results-count").textContent = `${results.length} ${countLabel}`;
      document.getElementById("search-results").innerHTML = vehicleRows(results);
    });

    document.querySelectorAll("[data-fill-search]").forEach(el => el.addEventListener("click", () => {
      searchTerm = el.dataset.fillSearch;
      const input = document.getElementById("main-search");
      input.value = searchTerm;
      input.dispatchEvent(new Event("input"));
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }));
    document.querySelectorAll("[data-reset]").forEach(el => el.addEventListener("click", () => {
      if (!confirm("¿Querés restaurar los datos ficticios iniciales? Los cambios realizados en esta demo se perderán.")) return;
      data = structuredClone(seed); saveData(); searchTerm = ""; route(); toast("Datos de prueba restaurados");
    }));

    const registrationForm = document.getElementById("registration-form");
    if (registrationForm) registrationForm.addEventListener("submit", handleRegistration);
    const jobForm = document.getElementById("job-form");
    if (jobForm) jobForm.addEventListener("submit", handleJob);
    const budgetForm = document.getElementById("budget-form");
    if (budgetForm) budgetForm.addEventListener("submit", handleBudget);
    const addItem = document.getElementById("add-budget-item");
    if (addItem) addItem.addEventListener("click", () => addBudgetItem());
    const printButton = document.querySelector("[data-print]");
    if (printButton) printButton.addEventListener("click", () => window.print());

    document.querySelectorAll("[data-tab]").forEach(tab => tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      location.hash = target === "budgets" ? `/vehiculo/${tab.dataset.vehicle}/presupuestos` : `/vehiculo/${tab.dataset.vehicle}`;
    }));

    document.querySelectorAll("[data-delete-job]").forEach(button => button.addEventListener("click", () => {
      const job = data.jobs.find(item => item.id === button.dataset.deleteJob);
      if (!job) return;
      if (!confirm(`¿Eliminar el trabajo "${job.description}" del ${dateLabel(job.date)}? Esta acción no se puede deshacer.`)) return;
      data.jobs = data.jobs.filter(item => item.id !== job.id);
      saveData();
      route();
      toast("Trabajo eliminado");
    }));
  }

  function handleRegistration(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const plate = String(form.get("plate")).trim().toUpperCase();
    if (data.vehicles.some(v => normalize(v.plate) === normalize(plate))) {
      alert("Ya existe un vehículo registrado con esa patente."); return;
    }
    const customerId = uid("c");
    const vehicleId = uid("v");
    data.customers.push({ id: customerId, firstName: String(form.get("firstName")).trim(), lastName: String(form.get("lastName")).trim(), phone: String(form.get("phone")).trim() });
    data.vehicles.push({ id: vehicleId, customerId, plate, brand: String(form.get("brand")).trim(), model: String(form.get("model")).trim(), year: String(form.get("year")).trim() });
    saveData();
    location.hash = `/vehiculo/${vehicleId}`;
    setTimeout(() => toast("Cliente y vehículo guardados"), 70);
  }

  function handleJob(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const vehicleId = event.currentTarget.dataset.vehicle;
    data.jobs.push({ id: uid("j"), vehicleId, date: String(form.get("date")), mileage: Number(form.get("mileage")), description: String(form.get("description")).trim(), parts: String(form.get("parts")).trim() });
    saveData();
    location.hash = `/vehiculo/${vehicleId}`;
    setTimeout(() => toast("Trabajo agregado al historial"), 70);
  }

  function addBudgetItem() {
    const body = document.getElementById("budget-items");
    if (!body) return;
    const row = document.createElement("tr");
    row.innerHTML = `<td data-label="Descripción"><input class="control item-description" required aria-label="Descripción del ítem" placeholder="Ej. Filtro de aceite" /></td><td class="type-cell" data-label="Tipo"><select class="control item-type" aria-label="Tipo de ítem"><option>Repuesto</option><option>Mano de obra</option></select></td><td class="qty-cell" data-label="Cantidad"><input class="control item-quantity" aria-label="Cantidad" type="number" min="0.01" step="0.01" value="1" required /></td><td class="money-cell" data-label="Precio unitario"><input class="control item-price" aria-label="Precio unitario" type="number" min="0" step="1" placeholder="0" required /></td><td class="item-remove-cell"><button class="remove-item" type="button" aria-label="Eliminar ítem">${icons.trash}</button></td>`;
    body.appendChild(row);
    row.querySelectorAll("input").forEach(input => input.addEventListener("input", updateBudgetTotal));
    row.querySelector(".remove-item").addEventListener("click", () => { row.remove(); updateBudgetTotal(); });
    updateBudgetTotal();
  }

  function updateBudgetTotal() {
    const total = [...document.querySelectorAll("#budget-items tr")].reduce((sum, row) => sum + Number(row.querySelector(".item-quantity").value || 0) * Number(row.querySelector(".item-price").value || 0), 0);
    const target = document.getElementById("budget-total");
    if (target) target.textContent = money(total);
  }

  function handleBudget(event) {
    event.preventDefault();
    const rows = [...document.querySelectorAll("#budget-items tr")];
    if (!rows.length) { alert("Agregá al menos un ítem al presupuesto."); return; }
    const items = rows.map(row => ({ type: row.querySelector(".item-type").value, description: row.querySelector(".item-description").value.trim(), quantity: Number(row.querySelector(".item-quantity").value), unitPrice: Number(row.querySelector(".item-price").value) }));
    const vehicleId = event.currentTarget.dataset.vehicle;
    const vehicle = getVehicle(vehicleId);
    const form = new FormData(event.currentTarget);
    const budget = { id: uid("b"), vehicleId, customerId: vehicle.customerId, date: String(form.get("date")), number: String(form.get("number")).trim(), items };
    data.budgets.push(budget);
    saveData();
    location.hash = `/vehiculo/${vehicleId}/presupuesto/${budget.id}`;
    setTimeout(() => toast("Presupuesto guardado · vista previa lista"), 70);
  }

  function toast(message) {
    const region = document.getElementById("toast-region");
    const element = document.createElement("div");
    element.className = "toast";
    element.textContent = message;
    region.appendChild(element);
    setTimeout(() => element.remove(), 3500);
  }

  window.addEventListener("hashchange", route);
  document.addEventListener("click", event => {
    const row = event.target.closest("[data-open-vehicle]");
    if (row) location.hash = `/vehiculo/${row.dataset.openVehicle}`;
  });
  route();
})();
