import React, { Suspense } from "react";
import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import routes from "tempo-routes";

// Import page components
import Home from "./components/home";
import InventoryPage from "./components/inventory/InventoryPage";
import SpaceAllocationPage from "./components/inventory/SpaceAllocationPage";
import ProductReceptionPage from "./components/inventory/ProductReceptionPage";
import QualityControlPage from "./components/quality/QualityControlPage";
import ReportsPage from "./components/reports/ReportsPage";
import LogisticsPage from "./components/logistics/LogisticsPage";
import AnalyticsPage from "./components/analytics/AnalyticsPage";
import SettingsPage from "./components/settings/SettingsPage";

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen w-screen">
    <div className="flex flex-col items-center gap-2">
      <div className="flex space-x-2">
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce animation-delay-200"></div>
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce animation-delay-500"></div>
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce animation-delay-700"></div>
      </div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Main application routes
const MainRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/inventory" element={<InventoryPage />} />
    <Route path="/inventory/receive" element={<ProductReceptionPage />} />
    <Route path="/space-allocation" element={<SpaceAllocationPage />} />
    <Route path="/quality" element={<QualityControlPage />} />
    <Route path="/reports" element={<ReportsPage />} />
    <Route path="/logistics" element={<LogisticsPage />} />
    <Route path="/analytics" element={<AnalyticsPage />} />
    <Route path="/settings" element={<SettingsPage />} />

    {/* Add Tempo route conditionally */}
    {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}

    {/* Fallback route */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  // Tempo routes for development environment
  const tempoRoutesElement =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <>
        <MainRoutes />
        {tempoRoutesElement}
      </>
    </Suspense>
  );
}

export default App;
