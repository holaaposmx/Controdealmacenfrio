import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import DashboardHeader from "./dashboard/DashboardHeader";
import MetricsOverview from "./dashboard/MetricsOverview";
import WarehouseOccupation from "./dashboard/WarehouseOccupation";
import PendingOrdersList from "./dashboard/PendingOrdersList";
import AlertsPanel from "./dashboard/AlertsPanel";
import BarcodeScanner from "./inventory/BarcodeScanner";
import { Button } from "./ui/button";
import { Package, Barcode, ClipboardCheck, Scan } from "lucide-react";

interface HomeProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

const Home: React.FC<HomeProps> = ({
  userName = "John Doe",
  userRole = "Warehouse Manager",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=warehouse",
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [isMobileMenuOpen]);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleScanBarcode = (code: string) => {
    // In a real implementation, this would process the scanned barcode
    console.log("Barcode scanned:", code);
    // Close scanner after successful scan
    setShowScanner(false);
  };

  const handleViewOrder = (orderId: string) => {
    // In a real implementation, this would navigate to order details
    console.log("View order:", orderId);
  };

  const handleProcessOrder = (orderId: string) => {
    // In a real implementation, this would start order processing
    console.log("Process order:", orderId);
  };

  const handleResolveAlert = (alertId: string) => {
    // In a real implementation, this would mark an alert as resolved
    console.log("Resolve alert:", alertId);
  };

  const handleViewAlertDetails = (alertId: string) => {
    // In a real implementation, this would show alert details
    console.log("View alert details:", alertId);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop version is inside the component, mobile version is conditionally rendered */}
      <Sidebar
        userName={userName}
        userRole={userRole}
        userAvatar={userAvatar}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          userName={userName}
          userRole={userRole}
          userAvatar={userAvatar}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Main Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-gradient-to-b from-blue-50/50 to-white">
          {/* Quick Access Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <Link to="/inventory" className="w-full">
              <Button
                variant="gradient"
                className="w-full h-14 md:h-16 flex items-center justify-center gap-2 shadow-md rounded-xl"
              >
                <Barcode className="h-5 w-5 text-white" />
                <span>Gestión de Inventario</span>
              </Button>
            </Link>
            <Link to="/space-allocation" className="w-full">
              <Button
                variant="gradient"
                className="w-full h-14 md:h-16 flex items-center justify-center gap-2 shadow-md rounded-xl"
              >
                <Package className="h-5 w-5 text-white" />
                <span>Asignación de Espacios</span>
              </Button>
            </Link>
            <Link to="/quality" className="w-full">
              <Button
                variant="gradient"
                className="w-full h-14 md:h-16 flex items-center justify-center gap-2 shadow-md rounded-xl"
              >
                <ClipboardCheck className="h-5 w-5 text-white" />
                <span>Control de Calidad</span>
              </Button>
            </Link>
          </div>

          {/* Metrics Overview */}
          <MetricsOverview />

          {/* Middle Section - Warehouse Occupation and Pending Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <WarehouseOccupation />
            <PendingOrdersList
              onViewOrder={handleViewOrder}
              onProcessOrder={handleProcessOrder}
            />
          </div>

          {/* Alerts Panel */}
          <AlertsPanel
            onResolve={handleResolveAlert}
            onViewDetails={handleViewAlertDetails}
          />

          {/* Barcode Scanner Modal */}
          {showScanner && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="max-w-md w-full">
                <BarcodeScanner
                  onScan={handleScanBarcode}
                  onError={(error) => console.error(error)}
                  isScanning={true}
                />
              </div>
            </div>
          )}

          {/* Floating Action Button for Barcode Scanner */}
          <button
            onClick={() => setShowScanner(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-primary to-secondary text-white p-3 md:p-4 rounded-full shadow-lg hover:brightness-105 transition-all z-10 flex items-center justify-center animate-pulse"
            aria-label="Scan Barcode"
          >
            <Scan className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
