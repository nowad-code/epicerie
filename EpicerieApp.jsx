import { useState, useRef, useEffect, useCallback } from "react";
import {
  Home, Package, FileText, History, Bell, Search, Plus, Printer,
  Edit2, Trash2, Globe, ShoppingCart, AlertTriangle, CheckCircle,
  Clock, TrendingDown, X, Save, Upload, Camera, Settings,
  ShoppingBag, Layers, ChevronDown, ChevronUp, Tag
} from "lucide-react";

// ─── i18n ─────────────────────────────────────────────────────────────────────
const T = {
  fr: {
    appName: "StockEasy", tagline: "Gestion de stock simplifiée",
    dashboard: "Accueil", products: "Mes produits", addProduct: "Ajouter un produit",
    scanInvoice: "Scanner une facture", history: "Historique", alerts: "Alertes",
    cashier: "Mode caisse", settings: "Réglages",
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
    goodStock: "En bon état", welcomeMsg: "Bonjour", welcomeSub: "Voici l'état de votre stock aujourd'hui",
    addLot: "Ajouter un lot", lots: "Lots", lot: "Lot", lotDate: "Date du lot",
    totalStock: "Stock total", lotAdded: "Nouveau lot ajouté !",
    cashierMode: "Mode caisse actif", cashierSub: "Scannez les produits vendus",
    cashierReady: "Prêt à scanner", cashierScan: "En attente d'un scan...",
    cashierSold: "vendu", cashierHistory: "Ventes d'aujourd'hui",
    cashierEmpty: "Aucune vente enregistrée aujourd'hui",
    cashierTotal: "Total articles vendus",
    notifSettings: "Réglages des notifications",
    notifTypes: "Types d'alertes",
    notifExpiry: "Produit proche de péremption",
    notifExpired: "Produit périmé",
    notifLowStock: "Stock sous le seuil minimum",
    notifSalesSummary: "Résumé des ventes",
    notifTiming: "Moment de réception",
    notifInstant: "Instantané",
    notifClosing: "À la fermeture",
    notifBoth: "Les deux",
    notifChannel: "Canal de réception",
    notifInApp: "Dans l'application",
    notifPush: "Notifications écran",
    closingTime: "Heure de fermeture",
    settingsSaved: "Réglages sauvegardés !",
    scanBarcode: "Scanner le code barre",
    scanInstruction: "Pointez la caméra vers le code barre",
    readBarcode: "Lire le code barre",
    noBarcode: "Aucun code barre détecté. Réessayez.",
  },
  en: {
    appName: "StockEasy", tagline: "Simplified stock management",
    dashboard: "Home", products: "My products", addProduct: "Add product",
    scanInvoice: "Scan invoice", history: "History", alerts: "Alerts",
    cashier: "Cashier mode", settings: "Settings",
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
    goodStock: "Good condition", welcomeMsg: "Hello", welcomeSub: "Here is your stock status today",
    addLot: "Add a lot", lots: "Lots", lot: "Lot", lotDate: "Lot date",
    totalStock: "Total stock", lotAdded: "New lot added!",
    cashierMode: "Cashier mode active", cashierSub: "Scan sold products",
    cashierReady: "Ready to scan", cashierScan: "Waiting for a scan...",
    cashierSold: "sold", cashierHistory: "Today's sales",
    cashierEmpty: "No sales recorded today",
    cashierTotal: "Total items sold",
    notifSettings: "Notification settings",
    notifTypes: "Alert types",
    notifExpiry: "Product near expiry",
    notifExpired: "Expired product",
    notifLowStock: "Stock below minimum",
    notifSalesSummary: "Sales summary",
    notifTiming: "Reception timing",
    notifInstant: "Instant",
    notifClosing: "At closing time",
    notifBoth: "Both",
    notifChannel: "Reception channel",
    notifInApp: "In-app only",
    notifPush: "Screen notifications",
    closingTime: "Closing time",
    settingsSaved: "Settings saved!",
    scanBarcode: "Scan barcode",
    scanInstruction: "Point the camera at the barcode",
    readBarcode: "Read barcode",
    noBarcode: "No barcode detected. Try again.",
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
.sidebar{width:256px;background:white;border-right:1px solid var(--border);display:flex;flex-direction:column;padding:24px 14px;position:fixed;height:100vh;z-index:10;overflow-y:auto}
.main{margin-left:256px;flex:1;padding:36px;min-height:100vh}
.brand{display:flex;align-items:center;gap:10px;padding:4px 10px 24px;margin-bottom:4px;border-bottom:1px solid var(--border)}
.brand-icon{width:34px;height:34px;background:var(--coral);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.brand-text{font-size:17px;font-weight:800;letter-spacing:-0.4px}
.brand-text span{color:var(--coral)}
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
.ph{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px}
.ph-title{font-size:26px;font-weight:800;letter-spacing:-0.6px}
.ph-sub{font-size:13.5px;color:var(--text2);margin-top:3px}
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
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 18px;border-radius:var(--r-sm);border:none;font-family:var(--font);font-size:13.5px;font-weight:600;cursor:pointer;transition:all 0.15s;white-space:nowrap}
.btn-coral{background:var(--coral);color:white} .btn-coral:hover{background:var(--coral-dark)}
.btn-outline{background:white;border:1.5px solid var(--border);color:var(--text)} .btn-outline:hover{border-color:var(--coral);color:var(--coral)}
.btn-danger{background:var(--red-pale);color:var(--red);border:1px solid rgba(220,38,38,0.2)} .btn-danger:hover{background:var(--red);color:white}
.btn-amber{background:var(--amber-pale);color:var(--amber);border:1px solid rgba(217,119,6,0.2)} .btn-amber:hover{background:var(--amber);color:white}
.btn-green{background:var(--green-pale);color:var(--green);border:1px solid rgba(22,163,74,0.2)} .btn-green:hover{background:var(--green);color:white}
.btn-sm{padding:7px 13px;font-size:12px;border-radius:8px}
.btn:disabled{opacity:0.4;cursor:not-allowed}
.search-wrap{position:relative;margin-bottom:20px}
.search-wrap input{width:100%;padding:13px 16px 13px 44px;border:1.5px solid var(--border);border-radius:var(--r-sm);font-family:var(--font);font-size:13.5px;background:white;outline:none;transition:border-color 0.15s;color:var(--text)}
.search-wrap input:focus{border-color:var(--coral)}
.search-wrap input::placeholder{color:var(--text3)}
.search-ic{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text3)}

/* Product cards */
.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
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
.b-indigo{background:var(--indigo-pale);color:var(--indigo)} .b-green{background:var(--green-pale);color:var(--green)}
.pname{font-size:15px;font-weight:700;margin-bottom:5px;line-height:1.3}
.pbar{font-size:11.5px;color:var(--text3);margin-bottom:12px;font-family:monospace}
.pgrid2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}
.pinfo{background:var(--bg);border-radius:8px;padding:9px 11px}
.pinfo-l{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:var(--text3);margin-bottom:2px}
.pinfo-v{font-size:13.5px;font-weight:700;color:var(--text)}
.pinfo-v.red{color:var(--red)} .pinfo-v.amber{color:var(--amber)} .pinfo-v.green{color:var(--green)}
.pactions{display:flex;gap:7px;flex-wrap:wrap}

/* Lots */
.lots-section{margin-top:14px;border-top:1px solid var(--border);padding-top:14px}
.lot-row{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:var(--bg);border-radius:8px;margin-bottom:6px;font-size:13px}
.lot-badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px}
.lot-expand{background:none;border:none;cursor:pointer;color:var(--text3);display:flex;align-items:center;gap:4px;font-size:12px;font-family:var(--font);padding:0}
.lot-expand:hover{color:var(--coral)}

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

.errbox{background:var(--red-pale);border:1.5px solid rgba(220,38,38,0.25);border-radius:var(--r-sm);padding:11px 14px;font-size:13px;color:var(--red);margin-bottom:12px;font-weight:500}

/* Promo */
.promo-styles{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px}
.promo-style-btn{border:2px solid var(--border);border-radius:var(--r-sm);padding:14px 10px;cursor:pointer;text-align:center;transition:all 0.15s;background:white;font-family:var(--font)}
.promo-style-btn:hover{border-color:var(--coral)}
.promo-style-btn.selected{border-color:var(--coral);background:var(--coral-pale)}
.ps-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin:0 auto 8px}
.ps-label{font-size:12px;font-weight:600;color:var(--text2)}
.promo-style-btn.selected .ps-label{color:var(--coral)}

/* Cashier mode */
.cashier-screen{background:white;border-radius:var(--r-lg);padding:32px;border:1.5px solid var(--border);box-shadow:var(--shadow);margin-bottom:24px;text-align:center}
.cashier-status{width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}
.cashier-status.active{background:var(--green-pale);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0.3)}50%{box-shadow:0 0 0 12px rgba(22,163,74,0)}}
.cashier-last{background:var(--green-pale);border:1.5px solid rgba(22,163,74,0.2);border-radius:var(--r);padding:20px;margin-bottom:20px;text-align:left}
.cashier-last-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--green);margin-bottom:8px}
.cashier-last-name{font-size:18px;font-weight:800;color:var(--text);margin-bottom:4px}
.cashier-last-info{font-size:13px;color:var(--text2)}
.sale-row{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg);border-radius:8px;margin-bottom:6px}
.sale-name{font-size:14px;font-weight:600}
.sale-time{font-size:12px;color:var(--text3)}
.sale-badge{font-size:11px;font-weight:700;background:var(--green-pale);color:var(--green);padding:3px 9px;border-radius:20px}

/* Toggle switch */
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid var(--border)}
.toggle-row:last-child{border-bottom:none}
.toggle-label{font-size:14px;font-weight:600;color:var(--text);margin-bottom:2px}
.toggle-sub{font-size:12px;color:var(--text3)}
.toggle{position:relative;width:48px;height:26px;flex-shrink:0}
.toggle input{opacity:0;width:0;height:0;position:absolute}
.toggle-slider{position:absolute;inset:0;background:var(--border2);border-radius:30px;cursor:pointer;transition:all 0.25s}
.toggle-slider::before{content:'';position:absolute;width:20px;height:20px;left:3px;top:3px;background:white;border-radius:50%;transition:all 0.25s;box-shadow:0 1px 4px rgba(0,0,0,0.15)}
.toggle input:checked + .toggle-slider{background:var(--coral)}
.toggle input:checked + .toggle-slider::before{transform:translateX(22px)}

/* Settings sections */
.settings-section{background:white;border:1.5px solid var(--border);border-radius:var(--r);padding:20px 24px;margin-bottom:16px;box-shadow:var(--shadow)}
.settings-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text3);margin-bottom:16px}
.radio-group{display:flex;flex-direction:column;gap:10px}
.radio-opt{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1.5px solid var(--border);border-radius:var(--r-sm);cursor:pointer;transition:all 0.15s}
.radio-opt:hover{border-color:var(--coral)}
.radio-opt.selected{border-color:var(--coral);background:var(--coral-pale)}
.radio-dot{width:18px;height:18px;border-radius:50%;border:2px solid var(--border2);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all 0.15s}
.radio-opt.selected .radio-dot{border-color:var(--coral);background:var(--coral)}
.radio-dot::after{content:'';width:6px;height:6px;border-radius:50%;background:white;opacity:0}
.radio-opt.selected .radio-dot::after{opacity:1}
.radio-label{font-size:14px;font-weight:600}

@media(max-width:1024px){.stats{grid-template-columns:repeat(2,1fr)}.quick{grid-template-columns:1fr}}
@media(max-width:768px){.sidebar{display:none}.main{margin-left:0;padding:20px}.scanner{grid-template-columns:1fr}.fgrid{grid-template-columns:1fr}.stats{grid-template-columns:1fr 1fr}}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split("T")[0];
const daysUntil = (d) => d ? Math.ceil((new Date(d) - new Date(todayStr())) / 86400000) : null;
const fmtDate = (d) => { if (!d) return "—"; const [y, m, day] = d.split("-"); return `${day}/${m}/${y}`; };
const fmtTime = (d) => new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const uid = () => Math.random().toString(36).slice(2, 8).toUpperCase();

// ─── Toggle Component ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  );
}

// ─── Barcode Scanner ──────────────────────────────────────────────────────────
function BarcodeScanner({ onDetected, onClose, t }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setScanning(true);
      } catch { setError("Impossible d'accéder à la caméra."); }
    })();
    return () => { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); };
  }, []);

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
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 100, messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } }, { type: "text", text: "Lis le code barre dans cette image. Retourne UNIQUEMENT le numéro, rien d'autre. Si absent: NONE." }] }] })
      });
      const data = await resp.json();
      const result = data.content?.[0]?.text?.trim();
      if (result && result !== "NONE") { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); onDetected(result); }
      else { setError(t.noBarcode); setTimeout(() => setError(null), 2000); }
    } catch { setError("Erreur."); }
  };

  return (
    <div className="overlay">
      <div className="modal" style={{ maxWidth: 420 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="modal-title" style={{ margin: 0 }}>{t.scanBarcode}</div>
          <button className="btn btn-outline btn-sm" onClick={onClose}><X size={14} /></button>
        </div>
        {error && <div className="errbox">{error}</div>}
        <div style={{ position: "relative", borderRadius: "var(--r)", overflow: "hidden", background: "#000", marginBottom: 16 }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: "100%", display: "block", maxHeight: 300, objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ width: 220, height: 80, border: "2.5px solid var(--coral)", borderRadius: 8, boxShadow: "0 0 0 1000px rgba(0,0,0,0.45)" }} />
          </div>
        </div>
        <p style={{ fontSize: 13, color: "var(--text2)", textAlign: "center", marginBottom: 16 }}>{t.scanInstruction}</p>
        <button className="btn btn-coral" style={{ width: "100%" }} onClick={capture} disabled={!scanning}><Camera size={16} /> {t.readBarcode}</button>
      </div>
    </div>
  );
}

// ─── Promo Poster ─────────────────────────────────────────────────────────────
function PromoForm({ product, onClose, t }) {
  const [style, setStyle] = useState("minimal");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [deadline, setDeadline] = useState(product.lots?.[0]?.expiryDate || todayStr());
  const [showPoster, setShowPoster] = useState(false);
  const discount = oldPrice && newPrice ? Math.round((1 - newPrice / oldPrice) * 100) : null;

  const posters = {
    minimal: `<div style="width:595px;height:842px;background:white;padding:60px;display:flex;flex-direction:column;justify-content:center;border:2px solid #E8E8EE;font-family:sans-serif"><div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#9898B0;margin-bottom:32px">Offre spéciale</div><div style="font-size:42px;font-weight:800;color:#18181F;line-height:1.1;margin-bottom:40px">${product.description}</div><div style="display:flex;align-items:baseline;gap:20px;margin-bottom:16px"><div style="font-size:72px;font-weight:900;color:#FF5C40;letter-spacing:-2px">${newPrice}€</div><div style="font-size:28px;color:#9898B0;text-decoration:line-through">${oldPrice}€</div></div>${discount ? `<div style="font-size:18px;font-weight:700;color:#FF5C40;margin-bottom:32px">Économisez ${discount}%</div>` : ""}<div style="width:100%;height:1px;background:#E8E8EE;margin-bottom:32px"></div><div style="font-size:14px;color:#5A5A72;font-weight:500">Date limite : <strong>${fmtDate(deadline)}</strong></div></div>`,
    bold: `<div style="width:595px;height:842px;background:#FF5C40;padding:60px;display:flex;flex-direction:column;justify-content:center;font-family:sans-serif"><div style="background:white;border-radius:24px;padding:50px;text-align:center">${discount ? `<div style="display:inline-block;background:#FF5C40;color:white;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:2px;padding:8px 20px;border-radius:30px;margin-bottom:28px">-${discount}%</div>` : ""}<div style="font-size:38px;font-weight:800;color:#18181F;line-height:1.2;margin-bottom:36px">${product.description}</div><div style="display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:12px"><div style="font-size:26px;color:#9898B0;text-decoration:line-through">${oldPrice}€</div><div style="font-size:80px;font-weight:900;color:#FF5C40;letter-spacing:-2px;line-height:1">${newPrice}€</div></div><div style="margin-top:36px;padding-top:28px;border-top:2px solid #E8E8EE"><div style="font-size:14px;color:#5A5A72;font-weight:600">À saisir avant le ${fmtDate(deadline)}</div></div></div></div>`,
    tag: `<div style="width:595px;height:842px;background:#F7F7FA;padding:60px;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:sans-serif"><div style="width:100%;background:white;border:2.5px solid #18181F;border-radius:16px;overflow:hidden"><div style="background:#18181F;padding:20px 28px"><div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#9898B0">Offre spéciale</div></div><div style="padding:36px 28px"><div style="font-size:36px;font-weight:800;color:#18181F;margin-bottom:28px;line-height:1.2">${product.description}</div><div style="display:flex;align-items:baseline;gap:16px;margin-bottom:8px"><div style="font-size:56px;font-weight:900;color:#FF5C40;letter-spacing:-1.5px">${newPrice}€</div><div style="font-size:22px;color:#9898B0;text-decoration:line-through;padding-bottom:8px">${oldPrice}€</div></div>${discount ? `<div style="display:inline-block;background:#FFF0EE;color:#FF5C40;font-size:13px;font-weight:700;padding:5px 14px;border-radius:6px;margin-bottom:28px">Remise de ${discount}%</div>` : ""}<div style="border-top:1.5px dashed #E8E8EE;margin:24px 0"></div><div style="font-size:13px;font-weight:600;color:#5A5A72">Date limite : <span style="color:#18181F;font-weight:700">${fmtDate(deadline)}</span></div></div></div></div>`
  };

  const printPoster = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Affiche promo</title></head><body onload="window.print()">${posters[style]}</body></html>`);
    w.document.close();
  };

  const styleOpts = [
    { key: "minimal", label: t.promoStyleMinimal },
    { key: "bold", label: t.promoStyleBold },
    { key: "tag", label: t.promoStyleTag },
  ];

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 500 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div className="modal-title" style={{ margin: 0 }}>{t.promoTitle}</div>
          <button className="btn btn-outline btn-sm" onClick={onClose}><X size={14} /></button>
        </div>
        {!showPoster ? (
          <>
            <div style={{ marginBottom: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text2)" }}>{t.promoChooseStyle}</div>
            <div className="promo-styles">
              {styleOpts.map(s => (
                <button key={s.key} className={`promo-style-btn ${style === s.key ? "selected" : ""}`} onClick={() => setStyle(s.key)}>
                  <div className="ps-icon" style={{ background: style === s.key ? "var(--coral-pale)" : "var(--bg)" }}><Tag size={18} color={style === s.key ? "var(--coral)" : "var(--text3)"} /></div>
                  <div className="ps-label">{s.label}</div>
                </button>
              ))}
            </div>
            <div className="fgrid">
              <div className="fg full"><label className="flabel">{t.promoProduct}</label><input className="finput" value={product.description} readOnly style={{ background: "var(--bg)", color: "var(--text2)" }} /></div>
              <div className="fg"><label className="flabel">{t.promoOldPrice}</label><input className="finput" type="number" placeholder="2.50" value={oldPrice} onChange={e => setOldPrice(e.target.value)} /></div>
              <div className="fg"><label className="flabel">{t.promoNewPrice}</label><input className="finput" type="number" placeholder="1.50" value={newPrice} onChange={e => setNewPrice(e.target.value)} /></div>
              <div className="fg full"><label className="flabel">{t.promoDeadline}</label><input className="finput" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} /></div>
            </div>
            <div className="factions">
              <button className="btn btn-outline" onClick={onClose}>{t.cancel}</button>
              <button className="btn btn-coral" onClick={() => setShowPoster(true)} disabled={!oldPrice || !newPrice}><Printer size={15} /> {t.promoGenerate}</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ background: "var(--bg)", borderRadius: "var(--r)", overflow: "auto", border: "1.5px solid var(--border)", marginBottom: 20 }}
              dangerouslySetInnerHTML={{ __html: posters[style] }} />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setShowPoster(false)}>{t.cancel}</button>
              <button className="btn btn-coral" onClick={printPoster}><Printer size={15} /> {t.promoPrint}</button>
            </div>
          </>
        )}
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
  const [showLotForm, setShowLotForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [lotForm, setLotForm] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [promoProduct, setPromoProduct] = useState(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [expandedLots, setExpandedLots] = useState({});
  const [sales, setSales] = useState([]);
  const [cashierActive, setCashierActive] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const cashierInputRef = useRef(null);

  const [notifSettings, setNotifSettings] = useState({
    expiry: true, expired: true, lowStock: true, salesSummary: false,
    timing: "instant", channel: "both", closingTime: "19:00"
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  // Cashier mode — listen to barcode scanner input
  useEffect(() => {
    if (!cashierActive) return;
    const focus = () => { if (cashierInputRef.current) cashierInputRef.current.focus(); };
    focus();
    document.addEventListener("click", focus);
    return () => document.removeEventListener("click", focus);
  }, [cashierActive]);

  const handleCashierScan = (e) => {
    if (e.key !== "Enter") return;
    const code = e.target.value.trim();
    e.target.value = "";
    if (!code) return;
    processBarcodeScan(code);
  };

  const processBarcodeScan = (code) => {
    const product = products.find(p => p.barcode === code);
    if (!product) { showToast("⚠️ Produit non trouvé : " + code); return; }

    // Find oldest lot with stock
    const lots = [...(product.lots || [])].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    const lotIdx = lots.findIndex(l => parseInt(l.qty) > 0);
    if (lotIdx === -1) { showToast("⚠️ Plus de stock pour : " + product.description); return; }

    // Deduct 1 from oldest lot
    setProducts(ps => ps.map(p => {
      if (p.id !== product.id) return p;
      const newLots = p.lots.map(l => {
        if (l.id === lots[lotIdx].id) return { ...l, qty: String(parseInt(l.qty) - 1) };
        return l;
      });
      return { ...p, lots: newLots };
    }));

    const saleEntry = { product: product.description, barcode: code, lot: lots[lotIdx].id, time: new Date().toISOString() };
    setSales(s => [saleEntry, ...s]);
    setLastSale(saleEntry);
    showToast("✅ " + product.description + " — " + t.cashierSold);
  };

  // Alerts
  const alerts = products.flatMap(p => {
    const arr = [];
    (p.lots || []).forEach(l => {
      const d = daysUntil(l.expiryDate);
      if (notifSettings.expired && d !== null && d < 0) arr.push({ type: "red", Icon: AlertTriangle, title: p.description, sub: `${t.expiredLabel} le ${fmtDate(l.expiryDate)} (Lot ${l.id})`, id: l.id + "e", color: "var(--red)" });
      else if (notifSettings.expiry && d !== null && d <= 3) arr.push({ type: "amber", Icon: Clock, title: p.description, sub: `${t.expiresIn} ${d} ${t.days} (Lot ${l.id})`, id: l.id + "s", color: "var(--amber)" });
    });
    const totalQty = (p.lots || []).reduce((s, l) => s + parseInt(l.qty || 0), 0);
    if (notifSettings.lowStock && p.minStock && totalQty <= parseInt(p.minStock)) arr.push({ type: "indigo", Icon: TrendingDown, title: p.description, sub: `${t.minStockReached} (${totalQty} ${t.articles})`, id: p.id + "m", color: "var(--indigo)" });
    return arr;
  });

  const openAdd = () => { setForm({ id: uid(), purchaseDate: todayStr() }); setEditId(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditId(p.id); setShowForm(true); };

  const saveProduct = () => {
    if (!form.description) return;
    const firstLot = { id: uid(), qty: form.qtyArticles || "0", purchaseDate: form.purchaseDate || todayStr(), expiryDate: form.expiryDate || "" };
    if (editId) {
      setProducts(ps => ps.map(p => p.id === editId ? { ...form, lots: p.lots } : p));
      showToast("✅ " + t.productUpdated);
    } else {
      setProducts(ps => [...ps, { ...form, lots: [firstLot] }]);
      showToast("✅ " + t.productAdded);
    }
    setShowForm(false);
  };

  const addLot = () => {
    if (!lotForm.qty || !lotForm.expiryDate) return;
    const newLot = { id: uid(), qty: lotForm.qty, purchaseDate: lotForm.purchaseDate || todayStr(), expiryDate: lotForm.expiryDate };
    setProducts(ps => ps.map(p => p.id === showLotForm ? { ...p, lots: [...(p.lots || []), newLot] } : p));
    showToast("✅ " + t.lotAdded);
    setShowLotForm(null);
    setLotForm({});
  };

  const totalQty = (p) => (p.lots || []).reduce((s, l) => s + parseInt(l.qty || 0), 0);

  const filtered = products.filter(p =>
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode?.includes(search) || p.id?.toLowerCase().includes(search.toLowerCase())
  );

  const getBestExpiry = (p) => {
    const dates = (p.lots || []).filter(l => l.expiryDate).map(l => daysUntil(l.expiryDate));
    if (!dates.length) return null;
    return Math.min(...dates);
  };

  const cardClass = (p) => {
    const d = getBestExpiry(p);
    const qty = totalQty(p);
    if (d !== null && d < 0) return "pcard expired";
    if (d !== null && d <= 3) return "pcard expiring";
    if (p.minStock && qty <= parseInt(p.minStock)) return "pcard lowstock";
    return "pcard";
  };

  const navItems = [
    { key: "dashboard", Icon: Home, label: t.dashboard },
    { key: "products", Icon: Package, label: t.products },
    { key: "cashier", Icon: ShoppingBag, label: t.cashier },
    { key: "scanner", Icon: FileText, label: t.scanInvoice },
    { key: "history", Icon: History, label: t.history },
    { key: "alerts", Icon: Bell, label: t.alerts, badge: alerts.length || null },
    { key: "settings", Icon: Settings, label: t.settings },
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
                <Icon size={17} />{label}
                {badge ? <span className="nav-badge">{badge}</span> : null}
              </button>
            ))}
          </div>
          <div className="sidebar-footer">
            <button className="lang-btn" onClick={() => setLang(l => l === "fr" ? "en" : "fr")}><Globe size={15} /> {t.lang}</button>
          </div>
        </aside>

        <main className="main">
          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <>
              <div className="ph"><div><div className="ph-title">{t.welcomeMsg} 👋</div><div className="ph-sub">{t.welcomeSub}</div></div></div>
              <div className="stats">
                <div className="stat s-coral"><div className="stat-ic"><Package size={20} color="var(--coral)" /></div><div className="stat-val">{products.length}</div><div className="stat-lbl">{t.totalProducts}</div></div>
                <div className="stat s-green"><div className="stat-ic"><CheckCircle size={20} color="var(--green)" /></div><div className="stat-val">{products.filter(p => { const d = getBestExpiry(p); return d === null || d > 3; }).length}</div><div className="stat-lbl">{t.goodStock}</div></div>
                <div className="stat s-amber"><div className="stat-ic"><Clock size={20} color="var(--amber)" /></div><div className="stat-val">{products.filter(p => { const d = getBestExpiry(p); return d !== null && d >= 0 && d <= 3; }).length}</div><div className="stat-lbl">{t.expiringSoon}</div></div>
                <div className="stat s-red"><div className="stat-ic"><Bell size={20} color="var(--red)" /></div><div className="stat-val">{alerts.length}</div><div className="stat-lbl">{t.totalAlerts}</div></div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{t.quickActions}</div>
              <div className="quick">
                <div className="qa qa-primary" onClick={openAdd}><div className="qa-ic"><Plus size={24} color="var(--coral)" /></div><div><div className="qa-title">{t.addProduct}</div><div className="qa-sub">Saisir manuellement</div></div></div>
                <div className="qa" onClick={() => setTab("cashier")}><div className="qa-ic"><ShoppingBag size={24} color="var(--coral)" /></div><div><div className="qa-title">{t.cashier}</div><div className="qa-sub">Scanner les ventes</div></div></div>
              </div>
              {alerts.length > 0 && (<><div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{t.alerts}</div><div className="alist">{alerts.slice(0, 3).map(({ id, type, Icon, title, sub, color }) => (<div key={id} className={`arow ${type}`}><div className="arow-ic"><Icon size={20} color={color} /></div><div><div className="a-title">{title}</div><div className="a-sub">{sub}</div></div></div>))}</div></>)}
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
                    const d = getBestExpiry(p);
                    const qty = totalQty(p);
                    const isExpired = d !== null && d < 0;
                    const isExpiring = d !== null && d >= 0 && d <= 3;
                    const lotsExpanded = expandedLots[p.id];
                    return (
                      <div key={p.id} className={cardClass(p)}>
                        <div className="ptop">
                          <span className="pref">#{p.id}</span>
                          <div className="pbadges">
                            {isExpired && <span className="badge b-red">{t.expiredLabel}</span>}
                            {isExpiring && <span className="badge b-amber">J-{d}</span>}
                            {p.minStock && qty <= parseInt(p.minStock) && <span className="badge b-indigo">Stock bas</span>}
                          </div>
                        </div>
                        <div className="pname">{p.description}</div>
                        {p.barcode && <div className="pbar">{p.barcode}</div>}
                        <div className="pgrid2">
                          <div className="pinfo"><div className="pinfo-l">{t.totalStock}</div><div className={`pinfo-v ${p.minStock && qty <= parseInt(p.minStock) ? "amber" : "green"}`}>{qty} art.</div></div>
                          <div className="pinfo"><div className="pinfo-l">{t.lots}</div><div className="pinfo-v">{(p.lots || []).length} lot{(p.lots || []).length > 1 ? "s" : ""}</div></div>
                        </div>

                        {/* Lots section */}
                        <div className="lots-section">
                          <button className="lot-expand" onClick={() => setExpandedLots(e => ({ ...e, [p.id]: !e[p.id] }))}>
                            <Layers size={13} /> {t.lots} {lotsExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>
                          {lotsExpanded && (
                            <div style={{ marginTop: 8 }}>
                              {(p.lots || []).map((l, i) => {
                                const ld = daysUntil(l.expiryDate);
                                return (
                                  <div key={l.id} className="lot-row">
                                    <div>
                                      <div style={{ fontWeight: 600 }}>{t.lot} {i + 1} — {parseInt(l.qty)} art.</div>
                                      <div style={{ fontSize: 11, color: "var(--text3)" }}>Exp: {fmtDate(l.expiryDate)}</div>
                                    </div>
                                    <span className={`lot-badge ${ld === null ? "b-green" : ld < 0 ? "b-red" : ld <= 3 ? "b-amber" : "b-green"}`}>
                                      {ld === null ? "—" : ld < 0 ? "Périmé" : ld <= 3 ? `J-${ld}` : `J-${ld}`}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div className="pactions" style={{ marginTop: 12 }}>
                          <button className="btn btn-green btn-sm" onClick={() => { setShowLotForm(p.id); setLotForm({ purchaseDate: todayStr() }); }}><Plus size={13} /> {t.addLot}</button>
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

          {/* CASHIER MODE */}
          {tab === "cashier" && (
            <>
              <div className="ph"><div><div className="ph-title">{t.cashier}</div><div className="ph-sub">{t.cashierSub}</div></div></div>
              <input ref={cashierInputRef} onKeyDown={handleCashierScan} style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }} readOnly={false} />
              <div className="cashier-screen">
                <div className={`cashier-status ${cashierActive ? "active" : ""}`} style={{ background: cashierActive ? "var(--green-pale)" : "var(--bg)" }}>
                  <ShoppingBag size={32} color={cashierActive ? "var(--green)" : "var(--text3)"} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{cashierActive ? t.cashierMode : t.cashierReady}</div>
                <div style={{ fontSize: 13.5, color: "var(--text2)", marginBottom: 24 }}>{cashierActive ? t.cashierScan : "Activez le mode caisse puis scannez"}</div>
                <button className={`btn ${cashierActive ? "btn-danger" : "btn-coral"}`} style={{ minWidth: 200 }} onClick={() => setCashierActive(a => !a)}>
                  {cashierActive ? <><X size={16} /> Désactiver</> : <><ShoppingBag size={16} /> Activer le mode caisse</>}
                </button>
              </div>

              {lastSale && (
                <div className="cashier-last">
                  <div className="cashier-last-title">Dernier scan</div>
                  <div className="cashier-last-name">{lastSale.product}</div>
                  <div className="cashier-last-info">{fmtTime(lastSale.time)}</div>
                </div>
              )}

              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{t.cashierHistory} <span style={{ color: "var(--text3)", fontWeight: 500 }}>({sales.length} {t.cashierTotal})</span></div>
              {sales.length === 0 ? (
                <div className="empty" style={{ padding: "40px 20px" }}><div className="empty-ic"><ShoppingBag size={28} color="var(--text3)" /></div><div className="empty-title" style={{ fontSize: 15 }}>{t.cashierEmpty}</div></div>
              ) : (
                <div>{sales.map((s, i) => (<div key={i} className="sale-row"><div><div className="sale-name">{s.product}</div><div className="sale-time">{fmtTime(s.time)}</div></div><span className="sale-badge">Vendu</span></div>))}</div>
              )}
            </>
          )}

          {/* SCANNER */}
          {tab === "scanner" && (
            <>
              <div className="ph"><div><div className="ph-title">{t.scanInvoice}</div><div className="ph-sub">Importez une facture pour l'analyser automatiquement</div></div></div>
              <InvoiceScanner t={t} onSaved={(inv, prods) => { setInvoices(prev => [inv, ...prev]); setProducts(prev => [...prods.map(p => ({ ...p, lots: [{ id: uid(), qty: p.qtyArticles || "1", purchaseDate: p.purchaseDate || todayStr(), expiryDate: p.expiryDate || "" }] })), ...prev]); showToast("✅ " + t.invoiceAnalyzed); setTab("products"); }} />
            </>
          )}

          {/* HISTORY */}
          {tab === "history" && (
            <>
              <div className="ph"><div><div className="ph-title">{t.invoiceHistory}</div><div className="ph-sub">{invoices.length} facture{invoices.length !== 1 ? "s" : ""}</div></div></div>
              {invoices.length === 0 ? <div className="empty"><div className="empty-ic"><History size={32} color="var(--text3)" /></div><div className="empty-title">{t.noHistory}</div></div> : (
                <div className="hlist">{invoices.map((inv, i) => (<div key={i} className="hrow"><div className="htop"><div className="h-sup">{inv.supplier}</div><div className="h-amt">{inv.amount}</div></div><div className="h-date">{fmtDate(inv.date)}</div>{inv.products?.length > 0 && <div className="htags">{inv.products.map((pr, j) => <span key={j} className="htag">{pr}</span>)}</div>}</div>))}</div>
              )}
            </>
          )}

          {/* ALERTS */}
          {tab === "alerts" && (
            <>
              <div className="ph"><div><div className="ph-title">{t.alerts}</div><div className="ph-sub">{alerts.length} alerte{alerts.length !== 1 ? "s" : ""}</div></div></div>
              {alerts.length === 0 ? <div className="empty"><div className="empty-ic"><CheckCircle size={32} color="var(--text3)" /></div><div className="empty-title">{t.noAlerts}</div><div className="empty-sub">Tous vos produits sont en ordre</div></div> : (
                <div className="alist">{alerts.map(({ id, type, Icon, title, sub, color }) => (<div key={id} className={`arow ${type}`}><div className="arow-ic"><Icon size={20} color={color} /></div><div><div className="a-title">{title}</div><div className="a-sub">{sub}</div></div></div>))}</div>
              )}
            </>
          )}

          {/* SETTINGS */}
          {tab === "settings" && (
            <>
              <div className="ph"><div><div className="ph-title">{t.settings}</div><div className="ph-sub">Personnalisez votre expérience</div></div></div>

              <div className="settings-section">
                <div className="settings-title">{t.notifTypes}</div>
                <div className="toggle-row"><div><div className="toggle-label">{t.notifExpiry}</div><div className="toggle-sub">3 jours avant la date de péremption</div></div><Toggle checked={notifSettings.expiry} onChange={v => setNotifSettings(s => ({ ...s, expiry: v }))} /></div>
                <div className="toggle-row"><div><div className="toggle-label">{t.notifExpired}</div><div className="toggle-sub">Quand un produit est périmé</div></div><Toggle checked={notifSettings.expired} onChange={v => setNotifSettings(s => ({ ...s, expired: v }))} /></div>
                <div className="toggle-row"><div><div className="toggle-label">{t.notifLowStock}</div><div className="toggle-sub">Quand le stock passe sous le minimum</div></div><Toggle checked={notifSettings.lowStock} onChange={v => setNotifSettings(s => ({ ...s, lowStock: v }))} /></div>
                <div className="toggle-row" style={{ borderBottom: "none" }}><div><div className="toggle-label">{t.notifSalesSummary}</div><div className="toggle-sub">Résumé des ventes de la journée</div></div><Toggle checked={notifSettings.salesSummary} onChange={v => setNotifSettings(s => ({ ...s, salesSummary: v }))} /></div>
              </div>

              <div className="settings-section">
                <div className="settings-title">{t.notifTiming}</div>
                <div className="radio-group">
                  {[{ key: "instant", label: t.notifInstant, sub: "Dès qu'un événement se produit" }, { key: "closing", label: t.notifClosing, sub: "Un résumé à l'heure de fermeture" }, { key: "both", label: t.notifBoth, sub: "Instantané + résumé à la fermeture" }].map(o => (
                    <div key={o.key} className={`radio-opt ${notifSettings.timing === o.key ? "selected" : ""}`} onClick={() => setNotifSettings(s => ({ ...s, timing: o.key }))}>
                      <div className="radio-dot" />
                      <div><div className="radio-label">{o.label}</div><div style={{ fontSize: 12, color: "var(--text3)" }}>{o.sub}</div></div>
                    </div>
                  ))}
                </div>
                {(notifSettings.timing === "closing" || notifSettings.timing === "both") && (
                  <div style={{ marginTop: 16 }}>
                    <label className="flabel">{t.closingTime}</label>
                    <input className="finput" type="time" value={notifSettings.closingTime} onChange={e => setNotifSettings(s => ({ ...s, closingTime: e.target.value }))} style={{ marginTop: 6, maxWidth: 160 }} />
                  </div>
                )}
              </div>

              <div className="settings-section">
                <div className="settings-title">{t.notifChannel}</div>
                <div className="radio-group">
                  {[{ key: "app", label: t.notifInApp, sub: "Visible dans l'onglet Alertes" }, { key: "push", label: t.notifPush, sub: "Notification sur l'écran de l'appareil" }, { key: "both", label: "Les deux", sub: "Dans l'app et sur l'écran" }].map(o => (
                    <div key={o.key} className={`radio-opt ${notifSettings.channel === o.key ? "selected" : ""}`} onClick={() => setNotifSettings(s => ({ ...s, channel: o.key }))}>
                      <div className="radio-dot" />
                      <div><div className="radio-label">{o.label}</div><div style={{ fontSize: 12, color: "var(--text3)" }}>{o.sub}</div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn btn-coral" onClick={() => showToast("✅ " + t.settingsSaved)}><Save size={15} /> {t.save}</button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <div className="modal-title">{editId ? "Modifier le produit" : "Nouveau produit"}</div>
            <div className="fgrid">
              <div className="fg"><label className="flabel">{t.productId}</label><input className="finput" value={form.id || ""} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} /></div>
              <div className="fg"><label className="flabel">{t.barcode}</label><div style={{ display: "flex", gap: 8 }}><input className="finput" style={{ flex: 1 }} value={form.barcode || ""} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} placeholder="Ex: 3017620422003" /><button type="button" className="btn btn-outline btn-sm" onClick={() => setShowBarcodeScanner(true)}><Camera size={15} /></button></div></div>
              <div className="fg full"><label className="flabel">{t.description}</label><input className="finput" value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Ex: Chips Vivo nature" /></div>
              <div className="fg"><label className="flabel">{t.qtyArticles} (1er lot)</label><input className="finput" type="number" value={form.qtyArticles || ""} onChange={e => setForm(f => ({ ...f, qtyArticles: e.target.value }))} /></div>
              <div className="fg"><label className="flabel">{t.minStock}</label><input className="finput" type="number" value={form.minStock || ""} onChange={e => setForm(f => ({ ...f, minStock: e.target.value }))} placeholder="Ex: 5" /></div>
              <div className="fg"><label className="flabel">{t.purchaseDate}</label><input className="finput" type="date" value={form.purchaseDate || ""} onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))} /></div>
              <div className="fg"><label className="flabel">{t.expiryDate}</label><input className="finput" type="date" value={form.expiryDate || ""} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} /></div>
            </div>
            <div className="factions">
              <button className="btn btn-outline" onClick={() => setShowForm(false)}><X size={14} /> {t.cancel}</button>
              <button className="btn btn-coral" onClick={saveProduct}><Save size={14} /> {t.save}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lot Form */}
      {showLotForm && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowLotForm(null)}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-title">{t.addLot}</div>
            <div className="fgrid">
              <div className="fg"><label className="flabel">{t.qtyArticles}</label><input className="finput" type="number" value={lotForm.qty || ""} onChange={e => setLotForm(f => ({ ...f, qty: e.target.value }))} placeholder="Ex: 24" /></div>
              <div className="fg"><label className="flabel">{t.purchaseDate}</label><input className="finput" type="date" value={lotForm.purchaseDate || ""} onChange={e => setLotForm(f => ({ ...f, purchaseDate: e.target.value }))} /></div>
              <div className="fg full"><label className="flabel">{t.expiryDate}</label><input className="finput" type="date" value={lotForm.expiryDate || ""} onChange={e => setLotForm(f => ({ ...f, expiryDate: e.target.value }))} /></div>
            </div>
            <div className="factions">
              <button className="btn btn-outline" onClick={() => setShowLotForm(null)}><X size={14} /> {t.cancel}</button>
              <button className="btn btn-coral" onClick={addLot}><Save size={14} /> {t.save}</button>
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
      {showBarcodeScanner && <BarcodeScanner onDetected={(code) => { setForm(f => ({ ...f, barcode: code })); setShowBarcodeScanner(false); }} onClose={() => setShowBarcodeScanner(false)} t={t} />}
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
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: [block, { type: "text", text: `Analyse cette facture et retourne UNIQUEMENT un JSON valide sans markdown:\n{"supplier":"nom","date":"YYYY-MM-DD","amount":"montant €","products":[{"description":"nom","barcode":"","qtyArticles":"1","purchaseDate":"YYYY-MM-DD","expiryDate":""}]}` }] }] })
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      setExtracted(JSON.parse(data.content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim()));
    } catch { setError(t.errorAnalysis); } finally { setLoading(false); }
  };

  const save = () => {
    if (!extracted) return;
    const prods = (extracted.products || []).map(p => ({ id: Math.random().toString(36).slice(2, 8).toUpperCase(), barcode: p.barcode || "", description: p.description, minStock: "", qtyArticles: p.qtyArticles || "1", purchaseDate: p.purchaseDate || new Date().toISOString().split("T")[0], expiryDate: p.expiryDate || "" }));
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
