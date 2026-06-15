import { useState, useRef, useEffect } from "react";
import {
  Home, Package, FileText, History, Bell, Search, Plus, Printer,
  Edit2, Trash2, Globe, ShoppingCart, AlertTriangle, CheckCircle,
  Clock, TrendingDown, X, Save, Upload, ChevronRight, Tag, Camera
} from "lucide-react";

// ─── Barcode Scanner Component ────────────────────────────────────────────────
function BarcodeScanner({ onDetected, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setScanning(true);
    } catch {
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
  };

  const capture = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg").split(",")[1];
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "REPLACE_API_KEY", "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 200,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } },
            { type: "text", text: "Lis le code barre dans cette image. Retourne UNIQUEMENT le numéro du code barre, rien d'autre. Si tu ne vois pas de code barre, retourne 'NONE'." }
          ]}]
        })
      });
      const data = await resp.json();
      const result = data.content?.[0]?.text?.trim();
      if (result && result !== "NONE") { stopCamera(); onDetected(result); }
      else { setError("Aucun code barre détecté. Réessayez."); setTimeout(() => setError(null), 2000); }
    } catch { setError("Erreur lors de la lecture."); }
  };

  return (
    <div className="overlay">
      <div className="modal" style={{ maxWidth: 420 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="modal-title" style={{ margin: 0 }}>Scanner le code barre</div>
          <button className="btn btn-outline btn-sm" onClick={() => { stopCamera(); onClose(); }}><X size={14} /></button>
        </div>
        {error && <div className="errbox">{error}</div>}
        <div style={{ position: "relative", borderRadius: "var(--r)", overflow: "hidden", background: "#000", marginBottom: 16 }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: "100%", display: "block", maxHeight: 300, objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ width: 220, height: 80, border: "2.5px solid var(--coral)", borderRadius: 8, boxShadow: "0 0 0 1000px rgba(0,0,0,0.45)" }} />
          </div>
        </div>
        <p style={{ fontSize: 13, color: "var(--text2)", textAlign: "center", marginBottom: 16 }}>Pointez la caméra vers le code barre et appuyez sur le bouton</p>
        <button className="btn btn-coral" style={{ width: "100%" }} onClick={capture} disabled={!scanning}>
          <Camera size={16} /> Lire le code barre
        </button>
      </div>
    </div>
  );
}

// ─── i18n ─────────────────────────────────────────────────────────────────────
const T = {
  fr: {
    appName: "StockEasy", tagline: "Gestion de stock simplifiée",
    dashboard: "Accueil", products: "Mes produits", addProduct: "Ajouter un produit",
    scanInvoice: "Scanner une facture", history: "Historique", alerts: "Alertes",
    search: "Rechercher un produit...", productId: "Référence", barcode: "Code barre",
    description: "Nom du produit", qtyProducts: "Nb de références", qtyArticles: "Nb d'articles",
    purchaseDate: "Date d'achat", expiryDate: "Date de péremption", minStock: "Stock minimum",
    save: "Enregistrer", cancel: "Annuler", delete: "Supprimer", edit: "Modifier",
    analyze: "Analyser la facture", analyzing: "Analyse en cours...",
    dragDrop: "Cliquez ou glissez pour importer une facture", formats: "JPG · PNG · PDF acceptés",
    expiredLabel: "PÉRIMÉ", expiresIn: "Expire dans", days: "jours", lowStock: "Stock bas",
    totalProducts: "Produits", totalAlerts: "Alertes", expiringSoon: "Expirent bientôt",
    noProducts: "Aucun produit encore", noAlerts: "Tout est en ordre !",
    addFirst: "Commencez par ajouter votre premier produit",
    invoiceHistory: "Historique des factures", noHistory: "Aucune facture enregistrée",
    supplier: "Fournisseur", invoiceDate: "Date", amount: "Montant",
    confirmDelete: "Supprimer ce produit ?", yes: "Oui, supprimer", no: "Annuler",
    errorAnalysis: "Erreur lors de l'analyse.", productAdded: "Produit ajouté !",
    productUpdated: "Produit mis à jour !", invoiceAnalyzed: "Facture analysée !",
    articles: "articles", minStockReached: "Stock minimum atteint",
    quickActions: "Actions rapides", lang: "EN",
    promoTitle: "Affiche promotionnelle", promoProduct: "Nom du produit",
    promoOldPrice: "Ancien prix (€)", promoNewPrice: "Nouveau prix (€)",
    promoDeadline: "Date limite", promoPrint: "Imprimer l'affiche",
    promoStyleMinimal: "Minimaliste", promoStyleBold: "Colorée", promoStyleTag: "Étiquette",
    promoChooseStyle: "Choisir un style", promoGenerate: "Générer l'affiche",
    goodStock: "En bon état", welcomeMsg: "Bonjour 👋",
    welcomeSub: "Voici l'état de votre stock aujourd'hui",
  },
  en: {
    appName: "StockEasy", tagline: "Simplified stock management",
    dashboard: "Home", products: "My products", addProduct: "Add product",
    scanInvoice: "Scan invoice", history: "History", alerts: "Alerts",
    search: "Search a product...", productId: "Reference", barcode: "Barcode",
    description: "Product name", qtyProducts: "References", qtyArticles: "Articles",
    purchaseDate: "Purchase date", expiryDate: "Expiry date", minStock: "Min. stock",
    save: "Save", cancel: "Cancel", delete: "Delete", edit: "Edit",
    analyze: "Analyze invoice", analyzing: "Analyzing...",
    dragDrop: "Click or drag to import an invoice", formats: "JPG · PNG · PDF accepted",
    expiredLabel: "EXPIRED", expiresIn: "Expires in", days: "days", lowStock: "Low stock",
    totalProducts: "Products", totalAlerts: "Alerts", expiringSoon: "Expiring soon",
    noProducts: "No products yet", noAlerts: "Everything is fine!",
    addFirst: "Start by adding your first product",
    invoiceHistory: "Invoice history", noHistory: "No invoice registered",
    supplier: "Supplier", invoiceDate: "Date", amount: "Amount",
    confirmDelete: "Delete this product?", yes: "Yes, delete", no: "Cancel",
    errorAnalysis: "Analysis error.", productAdded: "Product added!",
    productUpdated: "Product updated!", invoiceAnalyzed: "Invoice analyzed!",
    articles: "articles", minStockReached: "Minimum stock reached",
    quickActions: "Quick actions", lang: "FR",
    promoTitle: "Promotional poster", promoProduct: "Product name",
    promoOldPrice: "Old price (€)", promoNewPrice: "New price (€)",
    promoDeadline: "Deadline", promoPrint: "Print poster",
    promoStyleMinimal: "Minimal", promoStyleBold: "Colorful", promoStyleTag: "Label",
    promoChooseStyle: "Choose a style", promoGenerate: "Generate poster",
    goodStock: "Good condition", welcomeMsg: "Hello 👋",
    welcomeSub: "Here is your stock status today",
  },
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --coral:#FF5C40;--coral-light:#FF7A62;--coral-pale:#FFF0EE;--coral-dark:#E04430;
  --bg:#F7F7FA;--surface:#FFFFFF;--border:#E8E8EE;--border2:#D0D0DC;
  --text:#18181F;--text2:#5A5A72;--text3:#9898B0;
  --green:#16A34A;--green-pale:#F0FDF4;
  --amber:#D97706;--amber-pale:#FFFBEB;
  --red:#DC2626;--red-pale:#FEF2F2;
  --indigo:#4F46E5;--indigo-pale:#EEF2FF;
  --font:'Plus Jakarta Sans',sans-serif;
  --r:14px;--r-sm:10px;--r-lg:20px;
  --shadow:0 1px 3px rgba(0,0,0,0.05),0 4px 12px rgba(0,0,0,0.04);
  --shadow-lg:0 8px 32px rgba(0,0,0,0.1);
}
body{background:var(--bg);color:var(--text);font-family:var(--font);min-height:100vh}
.app{display:flex;min-height:100vh}

/* Sidebar */
.sidebar{width:256px;background:white;border-right:1px solid var(--border);display:flex;flex-direction:column;padding:24px 14px;position:fixed;height:100vh;z-index:10;overflow-y:auto}
.main{margin-left:256px;flex:1;padding:36px;min-height:100vh}

/* Brand */
.brand{display:flex;align-items:center;gap:10px;padding:4px 10px 24px;margin-bottom:4px;border-bottom:1px solid var(--border)}
.brand-icon{width:34px;height:34px;background:var(--coral);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.brand-text{font-size:17px;font-weight:800;letter-spacing:-0.4px}
.brand-text span{color:var(--coral)}

/* Nav */
.nav-group{margin-top:16px}
.nav-group-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--text3);padding:0 10px;margin-bottom:4px}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px;border-radius:var(--r-sm);border:none;background:transparent;color:var(--text2);font-family:var(--font);font-size:13.5px;font-weight:500;cursor:pointer;transition:all 0.15s;width:100%;text-align:left}
.nav-item:hover{background:var(--bg);color:var(--text)}
.nav-item.active{background:var(--coral-pale);color:var(--coral);font-weight:600}
.nav-item svg{flex-shrink:0;opacity:0.7}
.nav-item.active svg{opacity:1}
.nav-badge{margin-left:auto;background:var(--coral);color:white;font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px}

.sidebar-footer{margin-top:auto;padding-top:16px;border-top:1px solid var(--border)}
.lang-btn{display:flex;align-items:center;gap:8px;padding:9px 10px;border-radius:var(--r-sm);border:1.5px solid var(--border);background:transparent;color:var(--text2);font-family:var(--font);font-size:13px;font-weight:500;cursor:pointer;width:100%;transition:all 0.15s}
.lang-btn:hover{border-color:var(--coral);color:var(--coral)}

/* Page header */
.ph{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px}
.ph-title{font-size:26px;font-weight:800;letter-spacing:-0.6px}
.ph-sub{font-size:13.5px;color:var(--text2);margin-top:3px}

/* Stats */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
.stat{background:white;border:1px solid var(--border);border-radius:var(--r);padding:18px;box-shadow:var(--shadow);transition:transform 0.15s}
.stat:hover{transform:translateY(-2px)}
.stat-ic{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;margin-bottom:12px}
.stat-val{font-size:30px;font-weight:800;letter-spacing:-1px;line-height:1}
.stat-lbl{font-size:12.5px;color:var(--text2);margin-top:3px;font-weight:500}
.s-coral .stat-ic{background:var(--coral-pale)} .s-coral .stat-val{color:var(--coral)}
.s-green .stat-ic{background:var(--green-pale)} .s-green .stat-val{color:var(--green)}
.s-amber .stat-ic{background:var(--amber-pale)} .s-amber .stat-val{color:var(--amber)}
.s-red .stat-ic{background:var(--red-pale)} .s-red .stat-val{color:var(--red)}

/* Quick actions */
.quick{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:28px}
.qa{background:white;border:1.5px solid var(--border);border-radius:var(--r);padding:22px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:14px;box-shadow:var(--shadow)}
.qa:hover{border-color:var(--coral);box-shadow:0 4px 20px rgba(255,92,64,0.1);transform:translateY(-2px)}
.qa.qa-primary{background:var(--coral);border-color:var(--coral)}
.qa.qa-primary .qa-title{color:white}
.qa.qa-primary .qa-sub{color:rgba(255,255,255,0.7)}
.qa-ic{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:var(--coral-pale)}
.qa.qa-primary .qa-ic{background:rgba(255,255,255,0.2)}
.qa-title{font-size:15px;font-weight:700;margin-bottom:3px}
.qa-sub{font-size:12.5px;color:var(--text2)}

/* Buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 18px;border-radius:var(--r-sm);border:none;font-family:var(--font);font-size:13.5px;font-weight:600;cursor:pointer;transition:all 0.15s;white-space:nowrap}
.btn-coral{background:var(--coral);color:white} .btn-coral:hover{background:var(--coral-dark)}
.btn-outline{background:white;border:1.5px solid var(--border);color:var(--text)} .btn-outline:hover{border-color:var(--coral);color:var(--coral)}
.btn-danger{background:var(--red-pale);color:var(--red);border:1px solid rgba(220,38,38,0.2)} .btn-danger:hover{background:var(--red);color:white}
.btn-indigo{background:var(--indigo);color:white} .btn-indigo:hover{background:#4338CA}
.btn-amber{background:var(--amber-pale);color:var(--amber);border:1px solid rgba(217,119,6,0.2)} .btn-amber:hover{background:var(--amber);color:white}
.btn-sm{padding:7px 13px;font-size:12px;border-radius:8px}
.btn:disabled{opacity:0.4;cursor:not-allowed}

/* Search */
.search-wrap{position:relative;margin-bottom:20px}
.search-wrap input{width:100%;padding:13px 16px 13px 44px;border:1.5px solid var(--border);border-radius:var(--r-sm);font-family:var(--font);font-size:13.5px;background:white;outline:none;transition:border-color 0.15s;color:var(--text)}
.search-wrap input:focus{border-color:var(--coral)}
.search-wrap input::placeholder{color:var(--text3)}
.search-ic{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text3)}

/* Products */
.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(272px,1fr));gap:14px}
.pcard{background:white;border:1.5px solid var(--border);border-radius:var(--r);padding:18px;transition:all 0.15s;box-shadow:var(--shadow)}
.pcard:hover{box-shadow:var(--shadow-lg);transform:translateY(-2px)}
.pcard.expired{border-color:var(--red);background:var(--red-pale)}
.pcard.expiring{border-color:var(--amber)}
.pcard.lowstock{border-left:4px solid var(--amber)}
.ptop{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
.pref{font-size:11px;font-weight:600;color:var(--text3);background:var(--bg);padding:3px 9px;border-radius:20px;font-family:monospace}
.pbadges{display:flex;gap:5px;flex-wrap:wrap}
.badge{font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px}
.b-red{background:var(--red);color:white} .b-amber{background:var(--amber);color:white}
.b-indigo{background:var(--indigo-pale);color:var(--indigo)}
.pname{font-size:15px;font-weight:700;margin-bottom:5px;line-height:1.3}
.pbar{font-size:11.5px;color:var(--text3);margin-bottom:12px;font-family:monospace}
.pgrid2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}
.pinfo{background:var(--bg);border-radius:8px;padding:9px 11px}
.pinfo-l{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:var(--text3);margin-bottom:2px}
.pinfo-v{font-size:13.5px;font-weight:700;color:var(--text)}
.pinfo-v.red{color:var(--red)} .pinfo-v.amber{color:var(--amber)} .pinfo-v.green{color:var(--green)}
.pactions{display:flex;gap:7px;flex-wrap:wrap}

/* Modal */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;backdrop-filter:blur(3px)}
.modal{background:white;border-radius:var(--r-lg);padding:30px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;box-shadow:var(--shadow-lg)}
.modal-title{font-size:20px;font-weight:800;margin-bottom:22px;letter-spacing:-0.4px}
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:13px}
.fg{display:flex;flex-direction:column;gap:5px}
.fg.full{grid-column:1/-1}
.flabel{font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.8px}
.finput{padding:11px 13px;border:1.5px solid var(--border);border-radius:var(--r-sm);font-family:var(--font);font-size:13.5px;outline:none;transition:border-color 0.15s;color:var(--text);background:white}
.finput:focus{border-color:var(--coral)}
.factions{display:flex;gap:10px;margin-top:22px;justify-content:flex-end}

/* Scanner */
.scanner{display:grid;grid-template-columns:1fr 1fr;gap:22px}
.dropzone{border:2px dashed var(--border2);border-radius:var(--r);padding:52px 24px;text-align:center;cursor:pointer;transition:all 0.2s;position:relative;background:white}
.dropzone:hover,.dropzone.drag{border-color:var(--coral);background:var(--coral-pale)}
.dropzone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%}
.dz-ic{width:56px;height:56px;border-radius:14px;background:var(--coral-pale);display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
.dz-title{font-size:15px;font-weight:700;margin-bottom:5px}
.dz-sub{font-size:12.5px;color:var(--text2)}
.prev-img{width:100%;border-radius:var(--r-sm);border:1.5px solid var(--border);max-height:260px;object-fit:cover;margin-bottom:12px}
.extracted{background:white;border:1.5px solid var(--border);border-radius:var(--r);padding:18px;display:flex;flex-direction:column;gap:10px}
.ex-item{background:var(--bg);border-radius:var(--r-sm);padding:11px 13px}
.ex-l{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--text3);margin-bottom:3px}
.ex-v{font-size:14px;font-weight:600}
.spin-wrap{display:flex;flex-direction:column;align-items:center;gap:12px;padding:40px;background:white;border-radius:var(--r);border:1.5px solid var(--border)}
.spin{width:42px;height:42px;border:3px solid var(--coral-pale);border-top-color:var(--coral);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* Alerts */
.alist{display:flex;flex-direction:column;gap:10px}
.arow{background:white;border-radius:var(--r);padding:16px 18px;border:1.5px solid var(--border);display:flex;align-items:center;gap:14px;box-shadow:var(--shadow)}
.arow.red{border-color:rgba(220,38,38,0.3);background:var(--red-pale)}
.arow.amber{border-color:rgba(217,119,6,0.3);background:var(--amber-pale)}
.arow.indigo{border-color:rgba(79,70,229,0.2);background:var(--indigo-pale)}
.arow-ic{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.arow.red .arow-ic{background:rgba(220,38,38,0.12)}
.arow.amber .arow-ic{background:rgba(217,119,6,0.12)}
.arow.indigo .arow-ic{background:rgba(79,70,229,0.12)}
.a-title{font-size:14px;font-weight:700;margin-bottom:2px}
.a-sub{font-size:12.5px;color:var(--text2)}

/* History */
.hlist{display:flex;flex-direction:column;gap:10px}
.hrow{background:white;border:1.5px solid var(--border);border-radius:var(--r);padding:17px 20px;box-shadow:var(--shadow)}
.htop{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px}
.h-sup{font-size:15px;font-weight:700}
.h-amt{font-size:17px;font-weight:800;color:var(--coral)}
.h-date{font-size:12.5px;color:var(--text2)}
.htags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.htag{background:var(--bg);border-radius:6px;padding:3px 9px;font-size:12px;color:var(--text2)}

/* Empty */
.empty{text-align:center;padding:72px 20px}
.empty-ic{width:64px;height:64px;border-radius:16px;background:var(--bg);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;opacity:0.4}
.empty-title{font-size:18px;font-weight:700;opacity:0.35;margin-bottom:6px}
.empty-sub{font-size:13px;color:var(--text3)}

/* Toast */
.toast{position:fixed;bottom:24px;right:24px;background:var(--text);color:white;padding:13px 20px;border-radius:var(--r-sm);font-size:13.5px;font-weight:600;box-shadow:var(--shadow-lg);z-index:999;animation:tin .3s ease}
@keyframes tin{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}

/* Confirm */
.cover{position:fixed;inset:0;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(3px)}
.cbox{background:white;border-radius:var(--r-lg);padding:26px;width:310px;text-align:center;box-shadow:var(--shadow-lg)}
.c-title{font-size:16px;font-weight:700;margin-bottom:6px}
.c-sub{font-size:13px;color:var(--text2);margin-bottom:22px}
.c-actions{display:flex;gap:9px;justify-content:center}

/* Error */
.errbox{background:var(--red-pale);border:1.5px solid rgba(220,38,38,0.25);border-radius:var(--r-sm);padding:11px 14px;font-size:13px;color:var(--red);margin-bottom:12px;font-weight:500}

/* Promo Modal */
.promo-styles{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px}
.promo-style-btn{border:2px solid var(--border);border-radius:var(--r-sm);padding:14px 10px;cursor:pointer;text-align:center;transition:all 0.15s;background:white;font-family:var(--font)}
.promo-style-btn:hover{border-color:var(--coral)}
.promo-style-btn.selected{border-color:var(--coral);background:var(--coral-pale)}
.promo-style-btn .ps-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin:0 auto 8px}
.promo-style-btn .ps-label{font-size:12px;font-weight:600;color:var(--text2)}
.promo-style-btn.selected .ps-label{color:var(--coral)}

/* Print poster styles */
@media print {
  .app, .sidebar, .main { display: none !important; }
  .print-poster { display: block !important; }
}
.print-poster { display: none; }

@media(max-width:1024px){.stats{grid-template-columns:repeat(2,1fr)}.quick{grid-template-columns:1fr}}
@media(max-width:768px){.sidebar{display:none}.main{margin-left:0;padding:20px}.scanner{grid-template-columns:1fr}.fgrid{grid-template-columns:1fr}.stats{grid-template-columns:1fr 1fr}}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];
const daysUntil = (d) => d ? Math.ceil((new Date(d) - new Date(today())) / 86400000) : null;
const fmtDate = (d) => { if (!d) return "—"; const [y, m, day] = d.split("-"); return `${day}/${m}/${y}`; };

// ─── Promo Poster Component ───────────────────────────────────────────────────
function PromoPoster({ product, style, oldPrice, newPrice, deadline, onClose, t }) {
  const discount = oldPrice && newPrice ? Math.round((1 - newPrice / oldPrice) * 100) : null;

  const printPoster = () => {
    const posterContent = document.getElementById("poster-content").innerHTML;
    const printWin = window.open("", "_blank");
    printWin.document.write(`
      <html><head><title>Affiche promo</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
        body { margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        * { box-sizing: border-box; }
      </style></head>
      <body onload="window.print()">
        ${posterContent}
      </body></html>
    `);
    printWin.document.close();
  };

  const posterMinimal = `
    <div style="width:595px;height:842px;background:white;padding:60px;display:flex;flex-direction:column;justify-content:center;border:2px solid #E8E8EE;">
      <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#9898B0;margin-bottom:32px;">Offre spéciale</div>
      <div style="font-size:42px;font-weight:800;color:#18181F;line-height:1.1;margin-bottom:40px;">${product}</div>
      <div style="display:flex;align-items:baseline;gap:20px;margin-bottom:16px;">
        <div style="font-size:72px;font-weight:900;color:#FF5C40;letter-spacing:-2px;">${newPrice}€</div>
        <div style="font-size:28px;color:#9898B0;text-decoration:line-through;">${oldPrice}€</div>
      </div>
      ${discount ? `<div style="font-size:18px;font-weight:700;color:#FF5C40;margin-bottom:32px;">Économisez ${discount}%</div>` : ""}
      <div style="width:100%;height:1px;background:#E8E8EE;margin-bottom:32px;"></div>
      <div style="font-size:14px;color:#5A5A72;font-weight:500;">Date limite de vente : <strong>${fmtDate(deadline)}</strong></div>
    </div>
  `;

  const posterBold = `
    <div style="width:595px;height:842px;background:#FF5C40;padding:60px;display:flex;flex-direction:column;justify-content:center;">
      <div style="background:white;border-radius:24px;padding:50px;text-align:center;">
        ${discount ? `<div style="display:inline-block;background:#FF5C40;color:white;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:2px;padding:8px 20px;border-radius:30px;margin-bottom:28px;">-${discount}%</div>` : ""}
        <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#9898B0;margin-bottom:16px;">Offre spéciale</div>
        <div style="font-size:38px;font-weight:800;color:#18181F;line-height:1.2;margin-bottom:36px;">${product}</div>
        <div style="display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:12px;">
          <div style="font-size:26px;color:#9898B0;text-decoration:line-through;">${oldPrice}€</div>
          <div style="font-size:80px;font-weight:900;color:#FF5C40;letter-spacing:-2px;line-height:1;">${newPrice}€</div>
        </div>
        <div style="margin-top:36px;padding-top:28px;border-top:2px solid #E8E8EE;">
          <div style="font-size:14px;color:#5A5A72;font-weight:600;">À saisir avant le ${fmtDate(deadline)}</div>
        </div>
      </div>
    </div>
  `;

  const posterTag = `
    <div style="width:595px;height:842px;background:#F7F7FA;padding:60px;display:flex;flex-direction:column;justify-content:center;align-items:center;">
      <div style="width:100%;background:white;border:2.5px solid #18181F;border-radius:16px;overflow:hidden;">
        <div style="background:#18181F;padding:20px 28px;">
          <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#9898B0;">Offre spéciale</div>
        </div>
        <div style="padding:36px 28px;">
          <div style="font-size:36px;font-weight:800;color:#18181F;margin-bottom:28px;line-height:1.2;">${product}</div>
          <div style="display:flex;align-items:baseline;gap:16px;margin-bottom:8px;">
            <div style="font-size:56px;font-weight:900;color:#FF5C40;letter-spacing:-1.5px;">${newPrice}€</div>
            <div style="font-size:22px;color:#9898B0;text-decoration:line-through;padding-bottom:8px;">${oldPrice}€</div>
          </div>
          ${discount ? `<div style="display:inline-block;background:#FFF0EE;color:#FF5C40;font-size:13px;font-weight:700;padding:5px 14px;border-radius:6px;margin-bottom:28px;">Remise de ${discount}%</div>` : ""}
          <div style="border-top:1.5px dashed #E8E8EE;margin:24px 0;"></div>
          <div style="font-size:13px;font-weight:600;color:#5A5A72;">Date limite : <span style="color:#18181F;font-weight:700;">${fmtDate(deadline)}</span></div>
        </div>
      </div>
    </div>
  `;

  const posters = { minimal: posterMinimal, bold: posterBold, tag: posterTag };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 560 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div className="modal-title" style={{ margin: 0 }}>🎯 {t.promoTitle}</div>
          <button className="btn btn-outline btn-sm" onClick={onClose}><X size={14} /></button>
        </div>
        <div style={{ marginBottom: 18, fontSize: 13.5, color: "var(--text2)" }}>
          Produit : <strong>{product}</strong>
        </div>
        <div style={{ background: "var(--bg)", borderRadius: "var(--r)", overflow: "hidden", border: "1.5px solid var(--border)", marginBottom: 20 }}>
          <div style={{ padding: 16, overflow: "auto" }} id="poster-content"
            dangerouslySetInnerHTML={{ __html: posters[style] || posterMinimal }} />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-outline" onClick={onClose}>{t.cancel}</button>
          <button className="btn btn-coral" onClick={printPoster}><Printer size={15} /> {t.promoPrint}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Promo Form ───────────────────────────────────────────────────────────────
function PromoForm({ product, onClose, t }) {
  const [style, setStyle] = useState("minimal");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [deadline, setDeadline] = useState(product.expiryDate || today());
  const [showPoster, setShowPoster] = useState(false);

  const styles = [
    { key: "minimal", label: t.promoStyleMinimal, icon: <Tag size={18} color="#5A5A72" />, bg: "#F7F7FA" },
    { key: "bold", label: t.promoStyleBold, icon: <Tag size={18} color="#FF5C40" />, bg: "#FFF0EE" },
    { key: "tag", label: t.promoStyleTag, icon: <Tag size={18} color="#18181F" />, bg: "#F0F0F4" },
  ];

  if (showPoster) return (
    <PromoPoster product={product.description} style={style}
      oldPrice={oldPrice} newPrice={newPrice} deadline={deadline}
      onClose={onClose} t={t} />
  );

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 500 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div className="modal-title" style={{ margin: 0 }}><Printer size={20} style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }} />{t.promoTitle}</div>
          <button className="btn btn-outline btn-sm" onClick={onClose}><X size={14} /></button>
        </div>

        <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text2)" }}>{t.promoChooseStyle}</div>
        <div className="promo-styles">
          {styles.map(s => (
            <button key={s.key} className={`promo-style-btn ${style === s.key ? "selected" : ""}`} onClick={() => setStyle(s.key)}>
              <div className="ps-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div className="ps-label">{s.label}</div>
            </button>
          ))}
        </div>

        <div className="fgrid">
          <div className="fg full">
            <label className="flabel">{t.promoProduct}</label>
            <input className="finput" value={product.description} readOnly style={{ background: "var(--bg)", color: "var(--text2)" }} />
          </div>
          <div className="fg">
            <label className="flabel">{t.promoOldPrice}</label>
            <input className="finput" type="number" placeholder="Ex: 2.50" value={oldPrice} onChange={e => setOldPrice(e.target.value)} />
          </div>
          <div className="fg">
            <label className="flabel">{t.promoNewPrice}</label>
            <input className="finput" type="number" placeholder="Ex: 1.50" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
          </div>
          <div className="fg full">
            <label className="flabel">{t.promoDeadline}</label>
            <input className="finput" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </div>
        </div>
        <div className="factions">
          <button className="btn btn-outline" onClick={onClose}>{t.cancel}</button>
          <button className="btn btn-coral" onClick={() => setShowPoster(true)} disabled={!oldPrice || !newPrice}>
            <Printer size={15} /> {t.promoGenerate}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function StockEasy() {
  const [lang, setLang] = useState("fr");
  const t = T[lang];
  const [tab, setTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [promoProduct, setPromoProduct] = useState(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const alerts = products.flatMap(p => {
    const arr = [];
    const d = daysUntil(p.expiryDate);
    if (d !== null && d < 0) arr.push({ type: "red", Icon: AlertTriangle, title: p.description, sub: `${t.expiredLabel} le ${fmtDate(p.expiryDate)}`, id: p.id + "e", color: "var(--red)" });
    else if (d !== null && d <= 3) arr.push({ type: "amber", Icon: Clock, title: p.description, sub: `${t.expiresIn} ${d} ${t.days}`, id: p.id + "s", color: "var(--amber)" });
    if (p.minStock && parseInt(p.qtyArticles) <= parseInt(p.minStock)) arr.push({ type: "indigo", Icon: TrendingDown, title: p.description, sub: `${t.minStockReached} (${p.qtyArticles} ${t.articles})`, id: p.id + "m", color: "var(--indigo)" });
    return arr;
  });

  const openAdd = () => { setForm({ id: Math.random().toString(36).slice(2, 8).toUpperCase(), purchaseDate: today() }); setEditId(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditId(p.id); setShowForm(true); };
  const saveProduct = () => {
    if (!form.description) return;
    if (editId) { setProducts(ps => ps.map(p => p.id === editId ? { ...form } : p)); showToast("✅ " + t.productUpdated); }
    else { setProducts(ps => [...ps, { ...form }]); showToast("✅ " + t.productAdded); }
    setShowForm(false);
  };

  const filtered = products.filter(p =>
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode?.includes(search) || p.id?.toLowerCase().includes(search.toLowerCase())
  );

  const cardClass = (p) => {
    const d = daysUntil(p.expiryDate);
    if (d !== null && d < 0) return "pcard expired";
    if (d !== null && d <= 3) return "pcard expiring";
    if (p.minStock && parseInt(p.qtyArticles) <= parseInt(p.minStock)) return "pcard lowstock";
    return "pcard";
  };

  const expiryColor = (p) => {
    const d = daysUntil(p.expiryDate);
    if (d === null) return "";
    if (d < 0) return "red";
    if (d <= 3) return "amber";
    return "green";
  };

  const navItems = [
    { key: "dashboard", Icon: Home, label: t.dashboard },
    { key: "products", Icon: Package, label: t.products },
    { key: "scanner", Icon: FileText, label: t.scanInvoice },
    { key: "history", Icon: History, label: t.history },
    { key: "alerts", Icon: Bell, label: t.alerts, badge: alerts.length || null },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon"><ShoppingCart size={18} color="white" /></div>
            <div className="brand-text">Stock<span>Easy</span></div>
          </div>
          <div className="nav-group">
            <div className="nav-group-label">Navigation</div>
            {navItems.map(({ key, Icon, label, badge }) => (
              <button key={key} className={`nav-item ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
                <Icon size={17} />
                {label}
                {badge ? <span className="nav-badge">{badge}</span> : null}
              </button>
            ))}
          </div>
          <div className="sidebar-footer">
            <button className="lang-btn" onClick={() => setLang(l => l === "fr" ? "en" : "fr")}>
              <Globe size={15} /> {t.lang}
            </button>
          </div>
        </aside>

        <main className="main">
          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <>
              <div className="ph">
                <div><div className="ph-title">{t.welcomeMsg}</div><div className="ph-sub">{t.welcomeSub}</div></div>
              </div>
              <div className="stats">
                <div className="stat s-coral"><div className="stat-ic"><Package size={20} color="var(--coral)" /></div><div className="stat-val">{products.length}</div><div className="stat-lbl">{t.totalProducts}</div></div>
                <div className="stat s-green"><div className="stat-ic"><CheckCircle size={20} color="var(--green)" /></div><div className="stat-val">{products.filter(p => { const d = daysUntil(p.expiryDate); return d === null || d > 3; }).length}</div><div className="stat-lbl">{t.goodStock}</div></div>
                <div className="stat s-amber"><div className="stat-ic"><Clock size={20} color="var(--amber)" /></div><div className="stat-val">{products.filter(p => { const d = daysUntil(p.expiryDate); return d !== null && d >= 0 && d <= 3; }).length}</div><div className="stat-lbl">{t.expiringSoon}</div></div>
                <div className="stat s-red"><div className="stat-ic"><Bell size={20} color="var(--red)" /></div><div className="stat-val">{alerts.length}</div><div className="stat-lbl">{t.totalAlerts}</div></div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{t.quickActions}</div>
              <div className="quick">
                <div className="qa qa-primary" onClick={openAdd}><div className="qa-ic"><Plus size={24} color="var(--coral)" /></div><div><div className="qa-title">{t.addProduct}</div><div className="qa-sub">Saisir manuellement</div></div></div>
                <div className="qa" onClick={() => setTab("scanner")}><div className="qa-ic"><FileText size={24} color="var(--coral)" /></div><div><div className="qa-title">{t.scanInvoice}</div><div className="qa-sub">Importer une facture</div></div></div>
              </div>
              {alerts.length > 0 && (
                <>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{t.alerts}</div>
                  <div className="alist">
                    {alerts.slice(0, 3).map(({ id, type, Icon, title, sub, color }) => (
                      <div key={id} className={`arow ${type}`}>
                        <div className="arow-ic"><Icon size={20} color={color} /></div>
                        <div><div className="a-title">{title}</div><div className="a-sub">{sub}</div></div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {products.length === 0 && <div className="empty"><div className="empty-ic"><Package size={32} color="var(--text3)" /></div><div className="empty-title">{t.noProducts}</div><div className="empty-sub">{t.addFirst}</div></div>}
            </>
          )}

          {/* PRODUCTS */}
          {tab === "products" && (
            <>
              <div className="ph">
                <div><div className="ph-title">{t.products}</div><div className="ph-sub">{products.length} produit{products.length !== 1 ? "s" : ""}</div></div>
                <button className="btn btn-coral" onClick={openAdd}><Plus size={15} /> {t.addProduct}</button>
              </div>
              <div className="search-wrap"><Search size={16} className="search-ic" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search} /></div>
              {filtered.length === 0 ? (
                <div className="empty"><div className="empty-ic"><Package size={32} color="var(--text3)" /></div><div className="empty-title">{t.noProducts}</div><div className="empty-sub">{t.addFirst}</div></div>
              ) : (
                <div className="pgrid">
                  {filtered.map(p => {
                    const d = daysUntil(p.expiryDate);
                    const isExpiring = d !== null && d >= 0 && d <= 3;
                    const isExpired = d !== null && d < 0;
                    return (
                      <div key={p.id} className={cardClass(p)}>
                        <div className="ptop">
                          <span className="pref">#{p.id}</span>
                          <div className="pbadges">
                            {isExpired && <span className="badge b-red">{t.expiredLabel}</span>}
                            {isExpiring && <span className="badge b-amber">J-{d}</span>}
                            {p.minStock && parseInt(p.qtyArticles) <= parseInt(p.minStock) && <span className="badge b-indigo">Stock bas</span>}
                          </div>
                        </div>
                        <div className="pname">{p.description}</div>
                        {p.barcode && <div className="pbar">{p.barcode}</div>}
                        <div className="pgrid2">
                          <div className="pinfo"><div className="pinfo-l">Articles</div><div className={`pinfo-v ${p.minStock && parseInt(p.qtyArticles) <= parseInt(p.minStock) ? "amber" : ""}`}>{p.qtyArticles || "—"}</div></div>
                          <div className="pinfo"><div className="pinfo-l">Achat</div><div className="pinfo-v">{fmtDate(p.purchaseDate)}</div></div>
                          <div className="pinfo" style={{ gridColumn: "1/-1" }}><div className="pinfo-l">Péremption</div><div className={`pinfo-v ${expiryColor(p)}`}>{fmtDate(p.expiryDate)}</div></div>
                        </div>
                        <div className="pactions">
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}><Edit2 size={13} /> {t.edit}</button>
                          <button className="btn btn-amber btn-sm" onClick={() => setPromoProduct(p)}><Printer size={13} /> Promo</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(p.id)}><Trash2 size={13} /></button>
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
              <div className="ph"><div><div className="ph-title">{t.scanInvoice}</div><div className="ph-sub">Importez une facture pour l'analyser automatiquement</div></div></div>
              <InvoiceScanner t={t} onSaved={(inv, prods) => { setInvoices(prev => [inv, ...prev]); setProducts(prev => [...prods, ...prev]); showToast("✅ " + t.invoiceAnalyzed); setTab("products"); }} />
            </>
          )}

          {/* HISTORY */}
          {tab === "history" && (
            <>
              <div className="ph"><div><div className="ph-title">{t.invoiceHistory}</div><div className="ph-sub">{invoices.length} facture{invoices.length !== 1 ? "s" : ""}</div></div></div>
              {invoices.length === 0 ? <div className="empty"><div className="empty-ic"><History size={32} color="var(--text3)" /></div><div className="empty-title">{t.noHistory}</div></div> : (
                <div className="hlist">
                  {invoices.map((inv, i) => (
                    <div key={i} className="hrow">
                      <div className="htop"><div className="h-sup">{inv.supplier}</div><div className="h-amt">{inv.amount}</div></div>
                      <div className="h-date">{fmtDate(inv.date)}</div>
                      {inv.products?.length > 0 && <div className="htags">{inv.products.map((pr, j) => <span key={j} className="htag">{pr}</span>)}</div>}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ALERTS */}
          {tab === "alerts" && (
            <>
              <div className="ph"><div><div className="ph-title">{t.alerts}</div><div className="ph-sub">{alerts.length} alerte{alerts.length !== 1 ? "s" : ""}</div></div></div>
              {alerts.length === 0 ? <div className="empty"><div className="empty-ic"><CheckCircle size={32} color="var(--text3)" /></div><div className="empty-title">{t.noAlerts}</div><div className="empty-sub">Tous vos produits sont en ordre</div></div> : (
                <div className="alist">
                  {alerts.map(({ id, type, Icon, title, sub, color }) => (
                    <div key={id} className={`arow ${type}`}>
                      <div className="arow-ic"><Icon size={20} color={color} /></div>
                      <div><div className="a-title">{title}</div><div className="a-sub">{sub}</div></div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {showForm && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <div className="modal-title">{editId ? "Modifier le produit" : "Nouveau produit"}</div>
            <div className="fgrid">
              <div className="fg"><label className="flabel">{t.productId}</label><input className="finput" value={form.id || ""} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} /></div>
              <div className="fg"><label className="flabel">{t.barcode}</label><div style={{ display: "flex", gap: 8 }}><input className="finput" style={{ flex: 1 }} value={form.barcode || ""} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} placeholder="Ex: 3017620422003" /><button type="button" className="btn btn-outline btn-sm" style={{ flexShrink: 0 }} onClick={() => setShowBarcodeScanner(true)} title="Scanner avec la caméra"><Camera size={15} /></button></div></div>
              <div className="fg full"><label className="flabel">{t.description}</label><input className="finput" value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Ex: Chips Vivo nature" /></div>
              <div className="fg"><label className="flabel">{t.qtyProducts}</label><input className="finput" type="number" value={form.qtyProducts || ""} onChange={e => setForm(f => ({ ...f, qtyProducts: e.target.value }))} /></div>
              <div className="fg"><label className="flabel">{t.qtyArticles}</label><input className="finput" type="number" value={form.qtyArticles || ""} onChange={e => setForm(f => ({ ...f, qtyArticles: e.target.value }))} /></div>
              <div className="fg"><label className="flabel">{t.purchaseDate}</label><input className="finput" type="date" value={form.purchaseDate || ""} onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))} /></div>
              <div className="fg"><label className="flabel">{t.expiryDate}</label><input className="finput" type="date" value={form.expiryDate || ""} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} /></div>
              <div className="fg full"><label className="flabel">{t.minStock}</label><input className="finput" type="number" value={form.minStock || ""} onChange={e => setForm(f => ({ ...f, minStock: e.target.value }))} placeholder="Ex: 5" /></div>
            </div>
            <div className="factions">
              <button className="btn btn-outline" onClick={() => setShowForm(false)}><X size={14} /> {t.cancel}</button>
              <button className="btn btn-coral" onClick={saveProduct}><Save size={14} /> {t.save}</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="cover">
          <div className="cbox">
            <div className="c-title">{t.confirmDelete}</div>
            <div className="c-sub">Cette action est irréversible.</div>
            <div className="c-actions">
              <button className="btn btn-outline" onClick={() => setConfirmDelete(null)}>{t.no}</button>
              <button className="btn btn-danger" onClick={() => { setProducts(ps => ps.filter(p => p.id !== confirmDelete)); setConfirmDelete(null); }}>{t.yes}</button>
            </div>
          </div>
        </div>
      )}

      {promoProduct && <PromoForm product={promoProduct} onClose={() => setPromoProduct(null)} t={t} />}
      {showBarcodeScanner && <BarcodeScanner onDetected={(code) => { setForm(f => ({ ...f, barcode: code })); setShowBarcodeScanner(false); }} onClose={() => setShowBarcodeScanner(false)} />}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

// ─── Invoice Scanner ──────────────────────────────────────────────────────────
function InvoiceScanner({ t, onSaved }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drag, setDrag] = useState(false);
  const [extracted, setExtracted] = useState(null);
  const fileRef = useRef();

  const handleFile = (f) => { if (!f) return; setFile(f); setError(null); setExtracted(null); const r = new FileReader(); r.onload = e => setPreview(e.target.result); r.readAsDataURL(f); };

  const analyze = async () => {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const base64 = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.onerror = rej; r.readAsDataURL(file); });
      const block = file.type === "application/pdf" ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } } : { type: "image", source: { type: "base64", media_type: file.type, data: base64 } };
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "REPLACE_API_KEY", "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: [block, { type: "text", text: `Analyse cette facture et retourne UNIQUEMENT un JSON valide sans markdown:\n{"supplier":"nom","date":"YYYY-MM-DD","amount":"montant €","products":[{"description":"nom","barcode":"","qtyArticles":"1","purchaseDate":"YYYY-MM-DD"}]}` }] }] })
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      setExtracted(JSON.parse(data.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim()));
    } catch { setError(t.errorAnalysis); } finally { setLoading(false); }
  };

  const save = () => {
    if (!extracted) return;
    const prods = (extracted.products || []).map(p => ({ id: Math.random().toString(36).slice(2, 8).toUpperCase(), barcode: p.barcode || "", description: p.description, qtyProducts: "1", qtyArticles: p.qtyArticles || "1", purchaseDate: p.purchaseDate || today(), expiryDate: "", minStock: "" }));
    onSaved({ supplier: extracted.supplier, date: extracted.date, amount: extracted.amount, products: prods.map(p => p.description) }, prods);
  };

  return (
    <div className="scanner">
      <div>
        {!preview ? (
          <div className={`dropzone ${drag ? "drag" : ""}`} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }} onClick={() => fileRef.current.click()}>
            <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={e => handleFile(e.target.files[0])} />
            <div className="dz-ic"><Upload size={24} color="var(--coral)" /></div>
            <div className="dz-title">{t.dragDrop}</div>
            <div className="dz-sub">{t.formats}</div>
          </div>
        ) : (
          <>
            <img src={preview} alt="preview" className="prev-img" />
            {error && <div className="errbox">{error}</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-coral" onClick={analyze} disabled={loading}>{loading ? t.analyzing : t.analyze}</button>
              <button className="btn btn-outline" onClick={() => { setFile(null); setPreview(null); setExtracted(null); }}><X size={14} /></button>
            </div>
          </>
        )}
      </div>
      <div>
        {loading && <div className="spin-wrap"><div className="spin" /><div style={{ fontSize: 13.5, color: "var(--text2)" }}>{t.analyzing}</div></div>}
        {extracted && !loading && (
          <div className="extracted">
            <div className="ex-item"><div className="ex-l">{t.supplier}</div><div className="ex-v">{extracted.supplier}</div></div>
            <div className="ex-item"><div className="ex-l">{t.invoiceDate}</div><div className="ex-v">{fmtDate(extracted.date)}</div></div>
            <div className="ex-item"><div className="ex-l">{t.amount}</div><div className="ex-v" style={{ color: "var(--coral)", fontWeight: 800 }}>{extracted.amount}</div></div>
            <div className="ex-item"><div className="ex-l">{t.products}</div>{(extracted.products || []).map((p, i) => <div key={i} style={{ fontSize: 13, marginTop: 4 }}>• {p.description} ×{p.qtyArticles}</div>)}</div>
            <button className="btn btn-coral" onClick={save}><Save size={15} /> {t.save}</button>
          </div>
        )}
      </div>
    </div>
  );
}
