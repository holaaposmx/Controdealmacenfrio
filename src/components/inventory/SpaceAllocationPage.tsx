import React, { useState, useEffect } from "react";
import SpaceAllocation from "./SpaceAllocation";
import SpaceAllocationGuide from "./SpaceAllocationGuide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Package, FileText, HelpCircle } from "lucide-react";
import DashboardHeader from "../dashboard/DashboardHeader";
import Sidebar from "../layout/Sidebar";

interface SpaceAllocationPageProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

const SpaceAllocationPage: React.FC<SpaceAllocationPageProps> = ({
  userName = "John Doe",
  userRole = "Warehouse Manager",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=warehouse",
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("allocation");
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

  const handleSpaceAssignment = (data: any) => {
    console.log("Space assigned:", data);
    // In a real implementation, this would save the data to a database
  };

  const handleTemperatureLog = (data: any) => {
    console.log("Temperature logged:", data);
    // In a real implementation, this would save the temperature log
  };

  const handleAuditComplete = (data: any) => {
    console.log("Audit completed:", data);
    // In a real implementation, this would save the audit data
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
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

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Asignación de Espacios</h1>
              <p className="text-muted-foreground">
                Gestionar espacios de almacén, control de temperatura y
                auditorías
              </p>
            </div>
            <div className="flex gap-2">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full max-w-md"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger
                    value="allocation"
                    className="flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    <span>Management</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="guide"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Guidelines</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="icon" title="Help">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === "allocation" && (
              <SpaceAllocation
                onAssignSpace={handleSpaceAssignment}
                onTemperatureLog={handleTemperatureLog}
                onAuditComplete={handleAuditComplete}
              />
            )}
            {activeTab === "guide" && <SpaceAllocationGuide />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceAllocationPage;
