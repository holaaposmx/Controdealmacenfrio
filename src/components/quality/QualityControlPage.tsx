import React, { useState } from "react";
import DashboardHeader from "../dashboard/DashboardHeader";
import Sidebar from "../layout/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardCheck,
  FileText,
  Camera,
  Thermometer,
  AlertTriangle,
} from "lucide-react";

interface QualityControlPageProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

const QualityControlPage: React.FC<QualityControlPageProps> = ({
  userName = "John Doe",
  userRole = "Quality Control Manager",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=quality",
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
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
              <h1 className="text-2xl font-bold">Control de Calidad</h1>
              <p className="text-muted-foreground">
                Monitorear calidad de productos, condiciones de temperatura y
                gestionar incidentes
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span>Document Issue</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Reports</span>
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quality Control Dashboard</CardTitle>
              <CardDescription>
                Monitor temperature conditions and quality incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="temperature">
                <TabsList className="mb-4">
                  <TabsTrigger
                    value="temperature"
                    className="flex items-center gap-2"
                  >
                    <Thermometer className="h-4 w-4" />
                    <span>Temperature Monitoring</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="incidents"
                    className="flex items-center gap-2"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Quality Incidents</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="checks"
                    className="flex items-center gap-2"
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    <span>Routine Checks</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="temperature" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <Thermometer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Temperature Monitoring System
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Real-time temperature monitoring for all storage areas
                    </p>
                    <Button>View Temperature Logs</Button>
                  </div>
                </TabsContent>

                <TabsContent value="incidents" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Quality Incidents Management
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Track and resolve quality issues and incidents
                    </p>
                    <Button>View Incidents</Button>
                  </div>
                </TabsContent>

                <TabsContent value="checks" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Routine Quality Checks
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Schedule and perform routine quality inspections
                    </p>
                    <Button>Start New Check</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Recent Quality Incidents
                </CardTitle>
                <CardDescription>
                  Latest reported quality issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-2 rounded-full">
                        <AlertTriangle className="h-4 w-4 text-red-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Temperature Deviation
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cold storage section B - 8°C (above threshold)
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <AlertTriangle className="h-4 w-4 text-yellow-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Packaging Damage</p>
                        <p className="text-xs text-muted-foreground">
                          Beef Quarters - Lot #LOT-2023-06-15
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expiring Products</CardTitle>
                <CardDescription>
                  Products nearing expiration date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <ClipboardCheck className="h-4 w-4 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Beef Quarters</p>
                        <p className="text-xs text-muted-foreground">
                          Expires in 2 days - RACK-A1
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Check
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <ClipboardCheck className="h-4 w-4 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Fish Fillets</p>
                        <p className="text-xs text-muted-foreground">
                          Expires in 3 days - RACK-D1
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Check
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityControlPage;
