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
import { Truck, Package, ArrowLeftRight, Calendar, Plus } from "lucide-react";

interface LogisticsPageProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

const LogisticsPage: React.FC<LogisticsPageProps> = ({
  userName = "John Doe",
  userRole = "Logistics Manager",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=logistics",
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
              <h1 className="text-2xl font-bold">Logistics Operations</h1>
              <p className="text-muted-foreground">
                Manage shipments, deliveries, and returns
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>New Shipment</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Schedule</span>
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Logistics Dashboard</CardTitle>
              <CardDescription>
                Manage incoming and outgoing shipments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="shipments">
                <TabsList className="mb-4">
                  <TabsTrigger
                    value="shipments"
                    className="flex items-center gap-2"
                  >
                    <Truck className="h-4 w-4" />
                    <span>Shipments</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="returns"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    <span>Returns</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="schedule"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Schedule</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="shipments" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Shipment Management
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Track and manage incoming and outgoing shipments
                    </p>
                    <Button>View Shipments</Button>
                  </div>
                </TabsContent>

                <TabsContent value="returns" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <ArrowLeftRight className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Returns Processing
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Process and track returned items
                    </p>
                    <Button>Process Returns</Button>
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Delivery Schedule
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      View and manage delivery schedules
                    </p>
                    <Button>View Schedule</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pending Shipments</CardTitle>
                <CardDescription>Shipments awaiting processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Truck className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Outbound Shipment #SH-2023-001
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Scheduled for today at 2:00 PM
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Process
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Truck className="h-4 w-4 text-green-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Inbound Shipment #SH-2023-002
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Expected tomorrow at 9:00 AM
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Returns</CardTitle>
                <CardDescription>Recently processed returns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Package className="h-4 w-4 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Return #RET-2023-001
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Processed yesterday - Quality Issue
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Package className="h-4 w-4 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Return #RET-2023-002
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Processed 2 days ago - Damaged in Transit
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsPage;
