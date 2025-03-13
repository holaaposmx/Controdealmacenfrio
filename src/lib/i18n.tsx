import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "es" | "en";

interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

interface I18nContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language) => void;
}

const translations: Translations = {
  // Sidebar navigation
  "sidebar.dashboard": {
    es: "Panel de Control",
    en: "Dashboard",
  },
  "sidebar.inventory": {
    es: "Inventario",
    en: "Inventory",
  },
  "sidebar.spaceAllocation": {
    es: "Asignación de Espacios",
    en: "Space Allocation",
  },
  "sidebar.qualityControl": {
    es: "Control de Calidad",
    en: "Quality Control",
  },
  "sidebar.reports": {
    es: "Informes",
    en: "Reports",
  },
  "sidebar.logistics": {
    es: "Logística",
    en: "Logistics",
  },
  "sidebar.analytics": {
    es: "Analítica",
    en: "Analytics",
  },
  "sidebar.settings": {
    es: "Configuración",
    en: "Settings",
  },
  "sidebar.appName": {
    es: "AlmacénTrack",
    en: "WareTrack",
  },

  // User roles
  "role.warehouseManager": {
    es: "Gerente de Almacén",
    en: "Warehouse Manager",
  },

  // Common actions
  "action.logout": {
    es: "Cerrar Sesión",
    en: "Logout",
  },
  "action.profile": {
    es: "Perfil",
    en: "Profile",
  },
  "action.settings": {
    es: "Configuración",
    en: "Settings",
  },
  "action.search": {
    es: "Buscar...",
    en: "Search...",
  },

  // Notifications
  "notifications.title": {
    es: "Notificaciones",
    en: "Notifications",
  },
  "notifications.new": {
    es: "Nuevas",
    en: "New",
  },
  "notifications.viewAll": {
    es: "Ver todas las notificaciones",
    en: "View all notifications",
  },
  "notifications.temperatureAlert": {
    es: "Alerta de Temperatura",
    en: "Temperature Alert",
  },
  "notifications.temperatureDesc": {
    es: "Desviación de temperatura detectada en la sección B de almacenamiento en frío",
    en: "Cold storage section B temperature deviation detected",
  },
  "notifications.newOrder": {
    es: "Nuevo Pedido Recibido",
    en: "New Order Received",
  },
  "notifications.newOrderDesc": {
    es: "El pedido #WH-5782 ha sido recibido y está pendiente de procesamiento",
    en: "Order #WH-5782 has been received and is pending processing",
  },
  "notifications.expiringProducts": {
    es: "Productos a Punto de Caducar",
    en: "Expiring Products",
  },
  "notifications.expiringProductsDesc": {
    es: "15 productos en el Pasillo C caducarán en 7 días",
    en: "15 products in Aisle C are expiring within 7 days",
  },
  "notifications.timeAgo.minutes": {
    es: "minutos atrás",
    en: "minutes ago",
  },
  "notifications.timeAgo.hour": {
    es: "hora atrás",
    en: "hour ago",
  },

  // Dashboard
  "dashboard.warehouseOccupation": {
    es: "Ocupación del Almacén",
    en: "Warehouse Occupation",
  },
  "dashboard.pendingOrders": {
    es: "Pedidos Pendientes",
    en: "Pending Orders",
  },
  "dashboard.criticalAlerts": {
    es: "Alertas Críticas",
    en: "Critical Alerts",
  },
  "dashboard.incomingShipments": {
    es: "Envíos Entrantes",
    en: "Incoming Shipments",
  },
  "dashboard.outgoingShipments": {
    es: "Envíos Salientes",
    en: "Outgoing Shipments",
  },
  "dashboard.expiringProducts": {
    es: "Productos por Caducar",
    en: "Expiring Products",
  },
  "dashboard.fromLastWeek": {
    es: "desde la semana pasada",
    en: "from last week",
  },

  // Inventory
  "inventory.title": {
    es: "Gestión de Inventario",
    en: "Inventory Management",
  },
  "inventory.subtitle": {
    es: "Gestionar productos, niveles de stock y ubicaciones",
    en: "Manage products, stock levels, and locations",
  },
  "inventory.scanBarcode": {
    es: "Escanear Código",
    en: "Scan Barcode",
  },
  "inventory.addProduct": {
    es: "Añadir Producto",
    en: "Add Product",
  },
  "inventory.overview": {
    es: "Resumen de Inventario",
    en: "Inventory Overview",
  },
  "inventory.search": {
    es: "Buscar inventario...",
    en: "Search inventory...",
  },
  "inventory.products": {
    es: "Productos",
    en: "Products",
  },
  "inventory.movements": {
    es: "Movimientos",
    en: "Movements",
  },
  "inventory.shipments": {
    es: "Envíos",
    en: "Shipments",
  },

  // Space Allocation
  "spaceAllocation.title": {
    es: "Gestión de Asignación de Espacios",
    en: "Space Allocation Management",
  },
  "spaceAllocation.subtitle": {
    es: "Gestionar espacios de almacén, control de temperatura y auditorías",
    en: "Manage warehouse space, temperature control, and audits",
  },
  "spaceAllocation.management": {
    es: "Gestión",
    en: "Management",
  },
  "spaceAllocation.guidelines": {
    es: "Directrices",
    en: "Guidelines",
  },

  // Language
  "language.spanish": {
    es: "Español",
    en: "Spanish",
  },
  "language.english": {
    es: "Inglés",
    en: "English",
  },
  "language.change": {
    es: "Cambiar idioma",
    en: "Change language",
  },
};

export const I18nContext = createContext<I18nContextType>({
  language: "es",
  t: (key: string) => key,
  changeLanguage: () => {},
});

export const useI18n = () => useContext(I18nContext);

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [language, setLanguage] = useState<Language>("es");

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    // Optional: save language preference in localStorage
    localStorage.setItem("language", lang);
  };

  return (
    <I18nContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};
