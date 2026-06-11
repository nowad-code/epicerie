import { useState, useEffect, useRef } from "react";

// ─── i18n ─────────────────────────────────────────────────────────────────────
const T = {
  fr: {
    appName: "MonÉpicerie",
    dashboard: "Tableau de bord",
    products: "Produits",
    addProduct: "Ajouter un produit",
    scanInvoice: "Scanner une facture",
    history: "Historique",
    alerts: "Alertes",
    search: "Rechercher un produit...",
    productId: "N° Produit",
    barcode: "Code barre",
    description: "Description",
    qtyProducts: "Qté produits",
    qtyArticles: "Qté articles / produit",
    purchaseDate: "Date d'achat",
    expiryDate: "Date de péremption",
    minStock: "Seuil minimum",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    analyze: "Analyser la facture",
    analyzing: "Analyse en cours...",
    dragDrop: "Glisser ou cliquer pour importer",
    formats: "JPG · PNG · PDF",
    expiredLabel: "PÉRIMÉ",
    expiresIn: "Expire dans",
    days: "jours",
    lowStock: "Stock bas",
    totalProducts: "Produits",
    totalAlerts: "Alertes actives",
    expiringSoon: "Expirent bientôt",
    lowStockAlert: "Stock faible",
    noProducts: "Aucun produit enregistré",
    noAlerts: "Aucune alerte active",
    addFirst: "Ajoutez votre premier produit",
    invoiceHistory: "Historique des factures",
    noHistory: "Aucune facture enregistrée",
    supplier: "Fournisseur",
    invoiceDate: "Date facture",
    amount: "Montant",
    manualEntry: "Saisie manuelle",
    lang: "EN",
    confirmDelete: "Supprimer ce produit ?",
    yes: "Oui",
    no: "Non",
    today: "Aujourd'hui",
    errorAnalysis: "Erreur d'analyse. Vérifiez le fichier.",
    productAdded: "Produit ajouté !",
    productUpdated: "Produit mis à jour !",
    invoiceAnalyzed: "Facture analysée !",
    articles: "articles",
    minStockReached: "Seuil minimum atteint",
  },
  en: {
    appName: "MyGrocery",
    dashboard: "Dashboard",
    products: "Products",
    addProduct: "Add product",
    scanInvoice: "Scan invoice",
    history: "History",
    alerts: "Alerts",
    search: "Search a product...",
    productId: "Product #",
    barcode: "Barcode",
    description: "Description",
    qtyProducts: "Product qty",
    qtyArticles: "Articles / product",
    purchaseDate: "Purchase date",
    expiryDate: "Expiry date",
    minStock: "Min. stock",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    analyze: "Analyze invoice",
    analyzing: "Analyzing...",
    dragDrop: "Drag or click to import",
    formats: "JPG · PNG · PDF",
    expiredLabel: "EXPIRED",
    expiresIn: "Expires in",
    days: "days",
    lowStock: "Low stock",
    totalProducts: "Products",
    totalAlerts: "Active alerts",
    expiringSoon: "Expiring soon",
    lowStockAlert: "Low stock",
    noProducts: "No products registered",
    noAlerts: "No active alerts",
    addFirst: "Add your first product",
    invoiceHistory: "Invoice history",
    noHistory: "No invoice registered",
    supplier: "Supplier",
    invoiceDate: "Invoice date",
    amount: "Amount",
    manualEntry: "Manual entry",
    lang: "FR",
    confirmDelete: "Delete this product?",
    yes: "Yes",
    no: "No",
    today: "Today",
    errorAnalysis: "Analysis error. Check the file.",
    productAdded: "Product added!",
    productUpdated: "Product updated!",
    invoiceAnalyzed: "Invoice analyzed!",
    articles: "articles",
    minStockReached: "Minimum stock reached",
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];
const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date(today());
  return Math.ceil(diff / 86400000);
};
const fmtDate = (d) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};
const uid = () => Math.random().toString(36).slice(2, 8).toUpperCase();

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#F7F5F0;--surface:#FFFFFF;--surface2:#F0EDE6;
  --border:#E2DDD4;--border2:#C8C2B5;
  --green:#2D6A4F;--green-light:#52B788;--green-pale:#D8F3DC;
  --amber:#E76F00;--amber-pale:#FFF3E0;
  --red:#C0392B;--red-pale:#FDEDEC;
  --blue:#1A6B8A;--blue-pale:#E3F2FD;
  --text:#1C1917;--muted:#78716C;--muted2:#A8A29E;
  --font:'Outfit',sans-serif;--mono:'JetBrains Mono',monospace;
  --radius:14px;--shadow:0 2px 12px rgba(0,0,0,0.08);
}
body{background:var(--bg);color:var(--text);font-family:var(--font);min-height:100vh}
.app{display:grid;grid-template-columns:220px 1fr;min-height:100vh;max-width:1400px;margin:0 auto}

/* Sidebar */
.sidebar{background:var(--green);padding:28px 16px;display:flex;flex-direction:column;gap:6px;position:sticky;top:0;height:100vh}
.brand{padding:0 8px 24px;border-bottom:1px solid rgba(255,255,255,0.15);margin-bottom:8px}
.brand-name{font-size:18px;font-weight:800;color:#fff;letter-spacing:-0.5px}
.brand-sub{font-size:11px;color:rgba(255,255,255,0.55);font-family:var(--mono);margin-top:2px}
.nav-btn{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;border:none;background:transparent;color:rgba(255,255,255,0.7);font-family:var(--font);font-size:13px;font-weight:500;cursor:pointer;transition:all 0.15s;width:100%;text-align:left}
.nav-btn:hover{background:rgba(255,255,255,0.1);color:#fff}
.nav-btn.active{background:rgba(255,255,255,0.18);color:#fff;font-weight:600}
.nav-icon{font-size:16px;width:20px;text-align:center}
.nav-badge{margin-left:auto;background:var(--amber);color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:20px;font-family:var(--mono)}
.lang-btn{margin-top:auto;padding:8px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:rgba(255,255,255,0.7);font-family:var(--mono);font-size:12px;cursor:pointer;transition:all 0.15s}
.lang-btn:hover{background:rgba(255,255,255,0.1);color:#fff}

/* Main */
.main{padding:32px;overflow-y:auto}
.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px}
.page-title{font-size:26px;font-weight:800;letter-spacing:-0.5px}
.btn{display:inline-flex;align-items:center;gap:7px;padding:10px 18px;border-radius:10px;border:none;font-family:var(--font);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s}
.btn-primary{background:var(--green);color:#fff}
.btn-primary:hover{background:var(--green-light)}
.btn-secondary{background:var(--surface);border:1px solid var(--border);color:var(--text)}
.btn-secondary:hover{border-color:var(--green);color:var(--green)}
.btn-danger{background:var(--red-pale);color:var(--red);border:1px solid rgba(192,57,43,0.2)}
.btn-danger:hover{background:var(--red);color:#fff}
.btn-sm{padding:6px 12px;font-size:12px}
.btn:disabled{opacity:0.4;cursor:not-allowed}

/* Stats */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow)}
.stat-icon{font-size:24px;margin-bottom:10px}
.stat-val{font-size:28px;font-weight:800;font-family:var(--mono);letter-spacing:-1px}
.stat-lbl{font-size:12px;color:var(--muted);margin-top:2px;font-weight:500}
.stat-card.alert-card{border-color:rgba(231,111,0,0.3);background:var(--amber-pale)}
.stat-card.alert-card .stat-val{color:var(--amber)}
.stat-card.red-card{border-color:rgba(192,57,43,0.3);background:var(--red-pale)}
.stat-card.red-card .stat-val{color:var(--red)}
.stat-card.green-card{border-color:rgba(82,183,136,0.3);background:var(--green-pale)}
.stat-card.green-card .stat-val{color:var(--green)}

/* Search */
.search-bar{position:relative;margin-bottom:20px}
.search-bar input{width:100%;padding:12px 16px 12px 40px;border:1px solid var(--border);border-radius:10px;font-family:var(--font);font-size:14px;background:var(--surface);outline:none;transition:border-color 0.15s}
.search-bar input:focus{border-color:var(--green)}
.search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted2);font-size:16px}

/* Product grid */
.products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
.product-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow);transition:all 0.15s;position:relative}
.product-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.12);transform:translateY(-1px)}
.product-card.expired{border-color:var(--red);background:var(--red-pale)}
.product-card.expiring{border-color:var(--amber)}
.product-card.low-stock{border-left:4px solid var(--amber)}
.prod-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
.prod-id{font-family:var(--mono);font-size:11px;color:var(--muted);background:var(--surface2);padding:3px 8px;border-radius:20px}
.prod-badges{display:flex;gap:6px;flex-wrap:wrap}
.badge{font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;font-family:var(--mono)}
.badge-red{background:var(--red);color:#fff}
.badge-amber{background:var(--amber);color:#fff}
.badge-green{background:var(--green-pale);color:var(--green)}
.badge-blue{background:var(--blue-pale);color:var(--blue)}
.prod-name{font-size:15px;font-weight:700;margin-bottom:6px;line-height:1.3}
.prod-barcode{font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:10px}
.prod-info{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.info-item{background:var(--surface2);border-radius:8px;padding:8px 10px}
.info-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:2px}
.info-val{font-size:13px;font-weight:600;font-family:var(--mono)}
.info-val.red{color:var(--red)}
.info-val.amber{color:var(--amber)}
.info-val.green{color:var(--green)}
.prod-actions{display:flex;gap:8px}

/* Form */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px}
.modal{background:var(--surface);border-radius:20px;padding:28px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.2)}
.modal-title{font-size:20px;font-weight:800;margin-bottom:24px}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.form-group{display:flex;flex-direction:column;gap:6px}
.form-group.full{grid-column:1/-1}
.form-label{font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.8px}
.form-input{padding:10px 14px;border:1px solid var(--border);border-radius:10px;font-family:var(--font);font-size:14px;outline:none;transition:border-color 0.15s;background:var(--surface)}
.form-input:focus{border-color:var(--green)}
.form-actions{display:flex;gap:10px;margin-top:20px;justify-content:flex-end}

/* Invoice scanner */
.scanner-layout{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.drop-zone{border:2px dashed var(--border2);border-radius:var(--radius);padding:48px 24px;text-align:center;cursor:pointer;transition:all 0.15s;position:relative}
.drop-zone:hover,.drop-zone.drag{border-color:var(--green);background:var(--green-pale)}
.drop-zone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%}
.drop-icon{font-size:48px;margin-bottom:16px}
.drop-title{font-size:15px;font-weight:600;margin-bottom:6px}
.drop-sub{font-size:12px;color:var(--muted);font-family:var(--mono)}
.preview-img{width:100%;border-radius:10px;border:1px solid var(--border);max-height:280px;object-fit:cover;margin-bottom:12px}
.extracted-fields{display:flex;flex-direction:column;gap:10px}
.extract-item{background:var(--surface2);border-radius:10px;padding:12px 14px}
.extract-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px}
.extract-val{font-size:14px;font-weight:600}
.loading-wrap{display:flex;flex-direction:column;align-items:center;gap:12px;padding:32px}
.spinner{width:40px;height:40px;border:3px solid var(--green-pale);border-top-color:var(--green);border-radius:50%;animation:spin 0.8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-text{font-size:13px;color:var(--muted);font-family:var(--mono)}

/* Alerts */
.alerts-list{display:flex;flex-direction:column;gap:12px}
.alert-item{background:var(--surface);border-radius:var(--radius);padding:16px 18px;border:1px solid var(--border);display:flex;align-items:center;gap:14px;box-shadow:var(--shadow)}
.alert-item.red{border-color:rgba(192,57,43,0.4);background:var(--red-pale)}
.alert-item.amber{border-color:rgba(231,111,0,0.4);background:var(--amber-pale)}
.alert-item.blue{border-color:rgba(26,107,138,0.3);background:var(--blue-pale)}
.alert-icon{font-size:24px;flex-shrink:0}
.alert-content{flex:1}
.alert-title{font-size:14px;font-weight:700;margin-bottom:2px}
.alert-sub{font-size:12px;color:var(--muted);font-family:var(--mono)}

/* History */
.history-list{display:flex;flex-direction:column;gap:12px}
.history-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 20px;box-shadow:var(--shadow)}
.history-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.history-supplier{font-size:15px;font-weight:700}
.history-amount{font-size:16px;font-weight:800;font-family:var(--mono);color:var(--green)}
.history-meta{font-size:12px;color:var(--muted);font-family:var(--mono)}
.history-products{margin-top:10px;display:flex;flex-wrap:wrap;gap:6px}
.history-tag{background:var(--surface2);border-radius:6px;padding:3px 8px;font-size:11px;font-family:var(--mono)}

/* Empty */
.empty{text-align:center;padding:80px 20px;color:var(--muted)}
.empty-icon{font-size:56px;margin-bottom:16px;opacity:0.3}
.empty-title{font-size:18px;font-weight:700;color:var(--text);opacity:0.5;margin-bottom:8px}
.empty-sub{font-size:13px;font-family:var(--mono)}

/* Toast */
.toast{position:fixed;bottom:24px;right:24px;background:var(--green);color:#fff;padding:14px 20px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.2);z-index:999;animation:slideIn 0.3s ease}
@keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}

/* Confirm dialog */
.confirm{position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:200}
.confirm-box{background:var(--surface);border-radius:16px;padding:24px;width:320px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.2)}
.confirm-title{font-size:16px;font-weight:700;margin-bottom:20px}
.confirm-actions{display:flex;gap:10px;justify-content:center}

@media(max-width:900px){
  .app{grid-template-columns:1fr}
  .sidebar{display:flex;flex-direction:row;height:auto;position:static;padding:12px 16px;overflow-x:auto}
  .brand{display:none}
  .stats-grid{grid-template-columns:repeat(2,1fr)}
  .scanner-layout{grid-template-columns:1fr}
  .form-grid{grid-template-columns:1fr}
}
`;

// ─── App ───────────────────────────────────────────────────────────────────────
export default function EpicerieApp() {
  const [lang, setLang] = useState("fr");
  const t = T[lang];
  const [tab, setTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Form state
  const emptyForm = { id: "", barcode: "", description: "", qtyProducts: "", qtyArticles: "", purchaseDate: today(), expiryDate: "", minStock: "" };
  const [form, setForm] = useState(emptyForm);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // Alerts computation
  const alerts = products.flatMap(p => {
    const arr = [];
    const days = daysUntil(p.expiryDate);
    if (days !== null && days < 0) arr.push({ type: "red", icon: "🔴", title: p.description, sub: `${t.expiredLabel} — ${fmtDate(p.expiryDate)}`, id: p.id + "-exp" });
    else if (days !== null && days <= 3) arr.push({ type: "amber", icon: "🟡", title: p.description, sub: `${t.expiresIn} ${days} ${t.days} — ${fmtDate(p.expiryDate)}`, id: p.id + "-soon" });
    if (p.minStock && parseInt(p.qtyArticles) <= parseInt(p.minStock)) arr.push({ type: "blue", icon: "📦", title: p.description, sub: `${t.minStockReached} (${p.qtyArticles} ${t.articles})`, id: p.id + "-stock" });
    return arr;
  });

  const openAdd = () => { setForm({ ...emptyForm, id: uid() }); setEditProduct(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditProduct(p.id); setShowForm(true); };

  const saveProduct = () => {
    if (!form.description) return;
    if (editProduct) {
      setProducts(ps => ps.map(p => p.id === editProduct ? { ...form } : p));
      showToast(t.productUpdated);
    } else {
      setProducts(ps => [...ps, { ...form }]);
      showToast(t.productAdded);
    }
    setShowForm(false);
  };

  const deleteProduct = (id) => {
    setProducts(ps => ps.filter(p => p.id !== id));
    setConfirmDelete(null);
  };

  const filtered = products.filter(p =>
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode?.includes(search) ||
    p.id?.toLowerCase().includes(search.toLowerCase())
  );

  const getCardClass = (p) => {
    const days = daysUntil(p.expiryDate);
    if (days !== null && days < 0) return "product-card expired";
    if (days !== null && days <= 3) return "product-card expiring";
    if (p.minStock && parseInt(p.qtyArticles) <= parseInt(p.minStock)) return "product-card low-stock";
    return "product-card";
  };

  const getExpiryColor = (p) => {
    const days = daysUntil(p.expiryDate);
    if (days === null) return "";
    if (days < 0) return "red";
    if (days <= 3) return "amber";
    return "green";
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* Sidebar */}
        <nav className="sidebar">
          <div className="brand">
            <div className="brand-name">🛒 {t.appName}</div>
            <div className="brand-sub">v1.0 · {lang.toUpperCase()}</div>
          </div>
          {[
            { key: "dashboard", icon: "📊", label: t.dashboard },
            { key: "products", icon: "📦", label: t.products },
            { key: "scanner", icon: "📄", label: t.scanInvoice },
            { key: "history", icon: "🗂️", label: t.history },
            { key: "alerts", icon: "🔔", label: t.alerts, badge: alerts.length || null },
          ].map(n => (
            <button key={n.key} className={`nav-btn ${tab === n.key ? "active" : ""}`} onClick={() => setTab(n.key)}>
              <span className="nav-icon">{n.icon}</span>
              {n.label}
              {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
            </button>
          ))}
          <button className="lang-btn" onClick={() => setLang(l => l === "fr" ? "en" : "fr")}>{t.lang}</button>
        </nav>

        {/* Main */}
        <main className="main">

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <>
              <div className="page-header">
                <h1 className="page-title">{t.dashboard}</h1>
                <button className="btn btn-primary" onClick={openAdd}>+ {t.addProduct}</button>
              </div>
              <div className="stats-grid">
                <div className="stat-card green-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-val">{products.length}</div>
                  <div className="stat-lbl">{t.totalProducts}</div>
                </div>
                <div className="stat-card alert-card">
                  <div className="stat-icon">🔔</div>
                  <div className="stat-val">{alerts.length}</div>
                  <div className="stat-lbl">{t.totalAlerts}</div>
                </div>
                <div className="stat-card red-card">
                  <div className="stat-icon">⏰</div>
                  <div className="stat-val">{products.filter(p => { const d = daysUntil(p.expiryDate); return d !== null && d >= 0 && d <= 3; }).length}</div>
                  <div className="stat-lbl">{t.expiringSoon}</div>
                </div>
                <div className="stat-card alert-card">
                  <div className="stat-icon">📉</div>
                  <div className="stat-val">{products.filter(p => p.minStock && parseInt(p.qtyArticles) <= parseInt(p.minStock)).length}</div>
                  <div className="stat-lbl">{t.lowStockAlert}</div>
                </div>
              </div>
              {alerts.length > 0 && (
                <div className="alerts-list">
                  {alerts.map(a => (
                    <div key={a.id} className={`alert-item ${a.type}`}>
                      <span className="alert-icon">{a.icon}</span>
                      <div className="alert-content">
                        <div className="alert-title">{a.title}</div>
                        <div className="alert-sub">{a.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {products.length === 0 && (
                <div className="empty">
                  <div className="empty-icon">🛒</div>
                  <div className="empty-title">{t.noProducts}</div>
                  <div className="empty-sub">{t.addFirst}</div>
                </div>
              )}
            </>
          )}

          {/* PRODUCTS */}
          {tab === "products" && (
            <>
              <div className="page-header">
                <h1 className="page-title">{t.products}</h1>
                <button className="btn btn-primary" onClick={openAdd}>+ {t.addProduct}</button>
              </div>
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search} />
              </div>
              {filtered.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">📦</div>
                  <div className="empty-title">{t.noProducts}</div>
                  <div className="empty-sub">{t.addFirst}</div>
                </div>
              ) : (
                <div className="products-grid">
                  {filtered.map(p => {
                    const days = daysUntil(p.expiryDate);
                    return (
                      <div key={p.id} className={getCardClass(p)}>
                        <div className="prod-header">
                          <span className="prod-id">#{p.id}</span>
                          <div className="prod-badges">
                            {days !== null && days < 0 && <span className="badge badge-red">{t.expiredLabel}</span>}
                            {days !== null && days >= 0 && days <= 3 && <span className="badge badge-amber">{t.expiresIn} {days}j</span>}
                            {p.minStock && parseInt(p.qtyArticles) <= parseInt(p.minStock) && <span className="badge badge-blue">{t.lowStock}</span>}
                          </div>
                        </div>
                        <div className="prod-name">{p.description}</div>
                        <div className="prod-barcode">🔖 {p.barcode || "—"}</div>
                        <div className="prod-info">
                          <div className="info-item">
                            <div className="info-label">{t.qtyProducts}</div>
                            <div className="info-val">{p.qtyProducts || "—"}</div>
                          </div>
                          <div className="info-item">
                            <div className="info-label">{t.qtyArticles}</div>
                            <div className="info-val">{p.qtyArticles || "—"}</div>
                          </div>
                          <div className="info-item">
                            <div className="info-label">{t.purchaseDate}</div>
                            <div className="info-val">{fmtDate(p.purchaseDate)}</div>
                          </div>
                          <div className="info-item">
                            <div className="info-label">{t.expiryDate}</div>
                            <div className={`info-val ${getExpiryColor(p)}`}>{fmtDate(p.expiryDate)}</div>
                          </div>
                        </div>
                        <div className="prod-actions">
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️ {t.edit}</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(p.id)}>🗑️ {t.delete}</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* SCANNER */}
          {tab === "scanner" && (
            <>
              <div className="page-header">
                <h1 className="page-title">{t.scanInvoice}</h1>
              </div>
              <InvoiceScanner t={t} lang={lang} onInvoiceSaved={(inv, prods) => {
                setInvoices(prev => [inv, ...prev]);
                setProducts(prev => [...prods, ...prev]);
                showToast(t.invoiceAnalyzed);
                setTab("products");
              }} />
            </>
          )}

          {/* HISTORY */}
          {tab === "history" && (
            <>
              <div className="page-header">
                <h1 className="page-title">{t.invoiceHistory}</h1>
              </div>
              {invoices.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">🗂️</div>
                  <div className="empty-title">{t.noHistory}</div>
                </div>
              ) : (
                <div className="history-list">
                  {invoices.map((inv, i) => (
                    <div key={i} className="history-card">
                      <div className="history-header">
                        <div className="history-supplier">{inv.supplier}</div>
                        <div className="history-amount">{inv.amount}</div>
                      </div>
                      <div className="history-meta">📅 {inv.date}</div>
                      {inv.products?.length > 0 && (
                        <div className="history-products">
                          {inv.products.map((pr, j) => <span key={j} className="history-tag">{pr}</span>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ALERTS */}
          {tab === "alerts" && (
            <>
              <div className="page-header">
                <h1 className="page-title">{t.alerts}</h1>
              </div>
              {alerts.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">✅</div>
                  <div className="empty-title">{t.noAlerts}</div>
                </div>
              ) : (
                <div className="alerts-list">
                  {alerts.map(a => (
                    <div key={a.id} className={`alert-item ${a.type}`}>
                      <span className="alert-icon">{a.icon}</span>
                      <div className="alert-content">
                        <div className="alert-title">{a.title}</div>
                        <div className="alert-sub">{a.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <div className="modal-title">{editProduct ? "✏️ " + t.edit : "➕ " + t.addProduct}</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">{t.productId}</label>
                <input className="form-input" value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">{t.barcode}</label>
                <input className="form-input" value={form.barcode} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} />
              </div>
              <div className="form-group full">
                <label className="form-label">{t.description}</label>
                <input className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">{t.qtyProducts}</label>
                <input className="form-input" type="number" value={form.qtyProducts} onChange={e => setForm(f => ({ ...f, qtyProducts: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">{t.qtyArticles}</label>
                <input className="form-input" type="number" value={form.qtyArticles} onChange={e => setForm(f => ({ ...f, qtyArticles: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">{t.purchaseDate}</label>
                <input className="form-input" type="date" value={form.purchaseDate} onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">{t.expiryDate}</label>
                <input className="form-input" type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} />
              </div>
              <div className="form-group full">
                <label className="form-label">{t.minStock}</label>
                <input className="form-input" type="number" value={form.minStock} onChange={e => setForm(f => ({ ...f, minStock: e.target.value }))} />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>{t.cancel}</button>
              <button className="btn btn-primary" onClick={saveProduct}>{t.save}</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="confirm">
          <div className="confirm-box">
            <div className="confirm-title">{t.confirmDelete}</div>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>{t.no}</button>
              <button className="btn btn-danger" onClick={() => deleteProduct(confirmDelete)}>{t.yes}</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="toast">✅ {toast}</div>}
    </>
  );
}

// ─── Invoice Scanner Component ─────────────────────────────────────────────────
function InvoiceScanner({ t, onInvoiceSaved }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drag, setDrag] = useState(false);
  const [extracted, setExtracted] = useState(null);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f); setError(null); setExtracted(null);
    const r = new FileReader();
    r.onload = e => setPreview(e.target.result);
    r.readAsDataURL(f);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });

      const contentBlock = file.type === "application/pdf"
        ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }
        : { type: "image", source: { type: "base64", media_type: file.type, data: base64 } };

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [contentBlock, {
              type: "text",
              text: `Analyse cette facture d'épicerie et retourne UNIQUEMENT un JSON valide (sans markdown) avec cette structure exacte:
{
  "supplier": "nom du fournisseur",
  "date": "YYYY-MM-DD",
  "amount": "montant total avec devise ex: 150.00 €",
  "products": [
    {
      "description": "nom du produit",
      "barcode": "code barre si visible sinon vide",
      "qtyProducts": "1",
      "qtyArticles": "nombre d'articles",
      "purchaseDate": "YYYY-MM-DD"
    }
  ]
}
Réponds UNIQUEMENT avec le JSON.`
            }]
          }]
        })
      });

      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      const raw = data.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(raw);
      setExtracted(parsed);
    } catch (e) {
      setError(t.errorAnalysis);
    } finally {
      setLoading(false);
    }
  };

  const saveInvoice = () => {
    if (!extracted) return;
    const uid = () => Math.random().toString(36).slice(2, 8).toUpperCase();
    const prods = (extracted.products || []).map(p => ({
      id: uid(), barcode: p.barcode || "", description: p.description,
      qtyProducts: p.qtyProducts || "1", qtyArticles: p.qtyArticles || "1",
      purchaseDate: p.purchaseDate || new Date().toISOString().split("T")[0],
      expiryDate: "", minStock: ""
    }));
    onInvoiceSaved({
      supplier: extracted.supplier, date: extracted.date,
      amount: extracted.amount, products: prods.map(p => p.description)
    }, prods);
  };

  return (
    <div className="scanner-layout">
      <div>
        {!preview ? (
          <div className={`drop-zone ${drag ? "drag" : ""}`}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current.click()}>
            <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={e => handleFile(e.target.files[0])} />
            <div className="drop-icon">📤</div>
            <div className="drop-title">{t.dragDrop}</div>
            <div className="drop-sub">{t.formats}</div>
          </div>
        ) : (
          <>
            <img src={preview} alt="preview" className="preview-img" />
            {error && <div style={{ color: "var(--red)", fontSize: 13, marginBottom: 12, fontFamily: "var(--mono)" }}>⚠ {error}</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" onClick={analyze} disabled={loading}>
                {loading ? t.analyzing : "✨ " + t.analyze}
              </button>
              <button className="btn btn-secondary" onClick={() => { setFile(null); setPreview(null); setExtracted(null); }}>✕</button>
            </div>
          </>
        )}
      </div>

      <div>
        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <div className="loading-text">{t.analyzing}</div>
          </div>
        )}
        {extracted && !loading && (
          <div className="extracted-fields">
            <div className="extract-item">
              <div className="extract-label">{t.supplier}</div>
              <div className="extract-val">{extracted.supplier}</div>
            </div>
            <div className="extract-item">
              <div className="extract-label">{t.invoiceDate}</div>
              <div className="extract-val">{extracted.date}</div>
            </div>
            <div className="extract-item">
              <div className="extract-label">{t.amount}</div>
              <div className="extract-val" style={{ color: "var(--green)", fontFamily: "var(--mono)" }}>{extracted.amount}</div>
            </div>
            <div className="extract-item">
              <div className="extract-label">{t.products}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                {(extracted.products || []).map((p, i) => (
                  <div key={i} style={{ fontSize: 13, fontFamily: "var(--mono)" }}>• {p.description} (x{p.qtyArticles})</div>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" onClick={saveInvoice}>💾 {t.save}</button>
          </div>
        )}
      </div>
    </div>
  );
}
