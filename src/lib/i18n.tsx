import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
    es: "Gestión de Inventario",
    en: "Inventory Management",
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
    es: "Informes y Reportes",
    en: "Reports",
  },
  "sidebar.logistics": {
    es: "Logística y Distribución",
    en: "Logistics",
  },
  "sidebar.analytics": {
    es: "Análisis y Estadísticas",
    en: "Analytics",
  },
  "sidebar.settings": {
    es: "Configuración",
    en: "Settings",
  },
  "sidebar.appName": {
    es: "Control de Almacén Congelado",
    en: "Frozen Warehouse Control",
  },

  // User roles
  "role.warehouseManager": {
    es: "Gerente de Almacén",
    en: "Warehouse Manager",
  },
  "role.qualityManager": {
    es: "Gerente de Calidad",
    en: "Quality Manager",
  },
  "role.logisticsManager": {
    es: "Gerente de Logística",
    en: "Logistics Manager",
  },
  "role.inventoryManager": {
    es: "Gerente de Inventario",
    en: "Inventory Manager",
  },
  "role.warehouseOperator": {
    es: "Operador de Almacén",
    en: "Warehouse Operator",
  },
  "role.analyticsManager": {
    es: "Gerente de Análisis",
    en: "Analytics Manager",
  },
  "role.reportsManager": {
    es: "Gerente de Informes",
    en: "Reports Manager",
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
  "action.save": {
    es: "Guardar",
    en: "Save",
  },
  "action.cancel": {
    es: "Cancelar",
    en: "Cancel",
  },
  "action.edit": {
    es: "Editar",
    en: "Edit",
  },
  "action.delete": {
    es: "Eliminar",
    en: "Delete",
  },
  "action.view": {
    es: "Ver",
    en: "View",
  },
  "action.process": {
    es: "Procesar",
    en: "Process",
  },
  "action.details": {
    es: "Detalles",
    en: "Details",
  },
  "action.export": {
    es: "Exportar",
    en: "Export",
  },
  "action.import": {
    es: "Importar",
    en: "Import",
  },
  "action.filter": {
    es: "Filtrar",
    en: "Filter",
  },
  "action.refresh": {
    es: "Actualizar",
    en: "Refresh",
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
  "inventory.fifoManagement": {
    es: "Gestión FIFO",
    en: "FIFO Management",
  },
  "inventory.stockAlerts": {
    es: "Alertas de Stock",
    en: "Stock Alerts",
  },
  "inventory.recentActivity": {
    es: "Actividad Reciente",
    en: "Recent Activity",
  },
  "inventory.quickActions": {
    es: "Acciones Rápidas",
    en: "Quick Actions",
  },
  "inventory.registerNewProduct": {
    es: "Registrar Nuevo Producto",
    en: "Register New Product",
  },
  "inventory.printBarcodeLabels": {
    es: "Imprimir Etiquetas de Código",
    en: "Print Barcode Labels",
  },
  "inventory.recordProductMovement": {
    es: "Registrar Movimiento de Producto",
    en: "Record Product Movement",
  },
  "inventory.exportInventoryReport": {
    es: "Exportar Informe de Inventario",
    en: "Export Inventory Report",
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
  "spaceAllocation.productAssignment": {
    es: "Asignación de Productos",
    en: "Product Assignment",
  },
  "spaceAllocation.temperatureControl": {
    es: "Control de Temperatura",
    en: "Temperature Control",
  },
  "spaceAllocation.audits": {
    es: "Auditorías",
    en: "Audits",
  },
  "spaceAllocation.assignSpace": {
    es: "Asignar Espacio",
    en: "Assign Space",
  },
  "spaceAllocation.recentAssignments": {
    es: "Asignaciones Recientes",
    en: "Recent Assignments",
  },
  "spaceAllocation.temperatureLog": {
    es: "Registro de Temperatura",
    en: "Temperature Log",
  },
  "spaceAllocation.temperatureHistory": {
    es: "Historial de Temperatura",
    en: "Temperature History",
  },
  "spaceAllocation.monthlyAuditChecklist": {
    es: "Lista de Verificación de Auditoría Mensual",
    en: "Monthly Audit Checklist",
  },
  "spaceAllocation.auditHistory": {
    es: "Historial de Auditorías",
    en: "Audit History",
  },

  // Quality Control
  "quality.title": {
    es: "Control de Calidad",
    en: "Quality Control",
  },
  "quality.subtitle": {
    es: "Monitorear calidad de productos, condiciones de temperatura y gestionar incidentes",
    en: "Monitor product quality, temperature conditions, and manage incidents",
  },
  "quality.documentIssue": {
    es: "Documentar Incidente",
    en: "Document Issue",
  },
  "quality.reports": {
    es: "Informes",
    en: "Reports",
  },
  "quality.temperatureMonitoring": {
    es: "Monitoreo de Temperatura",
    en: "Temperature Monitoring",
  },
  "quality.qualityIncidents": {
    es: "Incidentes de Calidad",
    en: "Quality Incidents",
  },
  "quality.routineChecks": {
    es: "Verificaciones Rutinarias",
    en: "Routine Checks",
  },
  "quality.recentQualityIncidents": {
    es: "Incidentes de Calidad Recientes",
    en: "Recent Quality Incidents",
  },
  "quality.expiringProducts": {
    es: "Productos por Caducar",
    en: "Expiring Products",
  },

  // Reports
  "reports.title": {
    es: "Informes y Reportes",
    en: "Reports",
  },
  "reports.subtitle": {
    es: "Generar y visualizar informes de operaciones de almacén",
    en: "Generate and view warehouse operation reports",
  },
  "reports.exportReport": {
    es: "Exportar Informe",
    en: "Export Report",
  },
  "reports.filter": {
    es: "Filtrar",
    en: "Filter",
  },
  "reports.inventoryReports": {
    es: "Informes de Inventario",
    en: "Inventory Reports",
  },
  "reports.movementHistory": {
    es: "Historial de Movimientos",
    en: "Movement History",
  },
  "reports.analytics": {
    es: "Análisis",
    en: "Analytics",
  },
  "reports.recentReports": {
    es: "Informes Recientes",
    en: "Recent Reports",
  },
  "reports.scheduledReports": {
    es: "Informes Programados",
    en: "Scheduled Reports",
  },

  // Logistics
  "logistics.title": {
    es: "Operaciones de Logística",
    en: "Logistics Operations",
  },
  "logistics.subtitle": {
    es: "Gestionar envíos, entregas y devoluciones",
    en: "Manage shipments, deliveries, and returns",
  },
  "logistics.newShipment": {
    es: "Nuevo Envío",
    en: "New Shipment",
  },
  "logistics.schedule": {
    es: "Programación",
    en: "Schedule",
  },
  "logistics.dashboard": {
    es: "Panel de Logística",
    en: "Logistics Dashboard",
  },
  "logistics.shipments": {
    es: "Envíos",
    en: "Shipments",
  },
  "logistics.returns": {
    es: "Devoluciones",
    en: "Returns",
  },
  "logistics.pendingShipments": {
    es: "Envíos Pendientes",
    en: "Pending Shipments",
  },
  "logistics.recentReturns": {
    es: "Devoluciones Recientes",
    en: "Recent Returns",
  },

  // Analytics
  "analytics.title": {
    es: "Panel de Análisis",
    en: "Analytics Dashboard",
  },
  "analytics.subtitle": {
    es: "Ver métricas de rendimiento y análisis del almacén",
    en: "View warehouse performance metrics and analytics",
  },
  "analytics.exportData": {
    es: "Exportar Datos",
    en: "Export Data",
  },
  "analytics.dateRange": {
    es: "Rango de Fechas",
    en: "Date Range",
  },
  "analytics.warehouseAnalytics": {
    es: "Análisis de Almacén",
    en: "Warehouse Analytics",
  },
  "analytics.overview": {
    es: "Resumen",
    en: "Overview",
  },
  "analytics.inventoryAnalysis": {
    es: "Análisis de Inventario",
    en: "Inventory Analysis",
  },
  "analytics.trends": {
    es: "Tendencias",
    en: "Trends",
  },
  "analytics.keyMetrics": {
    es: "Métricas Clave",
    en: "Key Metrics",
  },
  "analytics.recentReports": {
    es: "Informes Recientes",
    en: "Recent Reports",
  },

  // Settings
  "settings.title": {
    es: "Configuración",
    en: "Settings",
  },
  "settings.subtitle": {
    es: "Gestionar tu cuenta y preferencias de aplicación",
    en: "Manage your account and application preferences",
  },
  "settings.saveChanges": {
    es: "Guardar Cambios",
    en: "Save Changes",
  },
  "settings.userSettings": {
    es: "Configuración de Usuario",
    en: "User Settings",
  },
  "settings.profile": {
    es: "Perfil",
    en: "Profile",
  },
  "settings.notifications": {
    es: "Notificaciones",
    en: "Notifications",
  },
  "settings.security": {
    es: "Seguridad",
    en: "Security",
  },
  "settings.language": {
    es: "Idioma",
    en: "Language",
  },
  "settings.applicationSettings": {
    es: "Configuración de Aplicación",
    en: "Application Settings",
  },
  "settings.systemInformation": {
    es: "Información del Sistema",
    en: "System Information",
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
  // Intentar recuperar el idioma guardado, o usar español por defecto
  const savedLanguage = localStorage.getItem("language");
  const [language, setLanguage] = useState<Language>(
    (savedLanguage as Language) || "es",
  );

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  // Efecto para asegurar que se cargue el idioma al iniciar
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && (savedLang === "es" || savedLang === "en")) {
      setLanguage(savedLang as Language);
    }
  }, []);

  return (
    <I18nContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};
