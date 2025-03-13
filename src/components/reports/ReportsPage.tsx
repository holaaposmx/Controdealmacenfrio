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
import { FileText, Download, BarChart3, Calendar, Filter } from "lucide-react";

interface ReportsPageProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

const ReportsPage: React.FC<ReportsPageProps> = ({
  userName = "John Doe",
  userRole = "Reports Manager",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=reports",
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
              <h1 className="text-2xl font-bold">Informes y Reportes</h1>
              <p className="text-muted-foreground">
                Generar y visualizar informes de operaciones de almacén
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Reports Dashboard</CardTitle>
              <CardDescription>
                Generate and view various warehouse reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="inventory">
                <TabsList className="mb-4">
                  <TabsTrigger
                    value="inventory"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Inventory Reports</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="movement"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Movement History</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="inventory" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Inventory Reports
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Generate detailed inventory reports with current stock
                      levels
                    </p>
                    <Button>Generate Inventory Report</Button>
                  </div>
                </TabsContent>

                <TabsContent value="movement" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Movement History
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Track product movements within the warehouse
                    </p>
                    <Button>View Movement History</Button>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Analytics Dashboard
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      View warehouse performance metrics and analytics
                    </p>
                    <Button>View Analytics</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Reports</CardTitle>
                <CardDescription>Recently generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FileText className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Inventory Status Report
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Generated today at 10:30 AM
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <FileText className="h-4 w-4 text-green-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Monthly Movement Report
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Generated yesterday at 4:15 PM
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
                <CardTitle className="text-lg">Scheduled Reports</CardTitle>
                <CardDescription>Upcoming automated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Calendar className="h-4 w-4 text-purple-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Weekly Inventory Report
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Scheduled for Friday at 8:00 AM
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Calendar className="h-4 w-4 text-purple-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Monthly Analytics Report
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Scheduled for 1st of next month
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
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

export default ReportsPage;
