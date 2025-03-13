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
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Download,
} from "lucide-react";

interface AnalyticsPageProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  userName = "John Doe",
  userRole = "Analytics Manager",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=analytics",
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
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                View warehouse performance metrics and analytics
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Date Range</span>
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Warehouse Analytics</CardTitle>
              <CardDescription>
                Performance metrics and data visualization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger
                    value="overview"
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="inventory"
                    className="flex items-center gap-2"
                  >
                    <PieChart className="h-4 w-4" />
                    <span>Inventory Analysis</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="trends"
                    className="flex items-center gap-2"
                  >
                    <LineChart className="h-4 w-4" />
                    <span>Trends</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Performance Overview
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Key performance indicators and metrics
                    </p>
                    <Button>View Detailed Analytics</Button>
                  </div>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Inventory Analysis
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Detailed analysis of inventory distribution and
                      utilization
                    </p>
                    <Button>View Inventory Analysis</Button>
                  </div>
                </TabsContent>

                <TabsContent value="trends" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Trend Analysis</h3>
                    <p className="text-muted-foreground mb-4">
                      Historical data trends and forecasting
                    </p>
                    <Button>View Trends</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Metrics</CardTitle>
                <CardDescription>
                  Important performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <BarChart3 className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Warehouse Utilization
                        </p>
                        <p className="text-xs text-muted-foreground">
                          78% - Increased by 5% from last month
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <BarChart3 className="h-4 w-4 text-green-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Order Processing Time
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Average: 2.3 hours - Improved by 15%
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
                <CardTitle className="text-lg">Recent Reports</CardTitle>
                <CardDescription>
                  Recently generated analytics reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <LineChart className="h-4 w-4 text-purple-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Monthly Performance Report
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Generated yesterday at 4:30 PM
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <PieChart className="h-4 w-4 text-purple-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Inventory Distribution Analysis
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Generated 3 days ago
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

export default AnalyticsPage;
