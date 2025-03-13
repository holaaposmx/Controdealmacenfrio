import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BarcodeScanner from "./BarcodeScanner";
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
  Barcode,
  Package,
  Truck,
  RotateCcw,
  Search,
  Filter,
  Plus,
  Download,
  Scan,
  Clock,
} from "lucide-react";
import FIFODashboard from "./FIFODashboard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InventoryPageProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

const InventoryPage: React.FC<InventoryPageProps> = ({
  userName = "John Doe",
  userRole = "Warehouse Manager",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=warehouse",
}) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
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
    console.log("Barcode scanned:", code);
    setShowScanner(false);
    // In a real app, we would search for this product or update inventory
  };

  // Mock inventory data
  const inventoryItems = [
    {
      id: "PROD-12345",
      name: "Beef Quarters",
      category: "Meat",
      quantity: 120,
      location: "RACK-A1",
      status: "in-stock",
      expirationDate: "2023-06-22",
    },
    {
      id: "PROD-12346",
      name: "Chicken Breasts",
      category: "Poultry",
      quantity: 250,
      location: "RACK-B3",
      status: "in-stock",
      expirationDate: "2023-09-14",
    },
    {
      id: "PROD-12347",
      name: "Pork Ribs",
      category: "Meat",
      quantity: 180,
      location: "RACK-C2",
      status: "in-stock",
      expirationDate: "2023-06-30",
    },
    {
      id: "PROD-12348",
      name: "Fish Fillets",
      category: "Seafood",
      quantity: 75,
      location: "RACK-D1",
      status: "low-stock",
      expirationDate: "2023-06-18",
    },
    {
      id: "PROD-12349",
      name: "Dairy Products",
      category: "Dairy",
      quantity: 320,
      location: "RACK-E3",
      status: "in-stock",
      expirationDate: "2023-07-05",
    },
  ];

  // Filter items based on search query
  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            In Stock
          </Badge>
        );
      case "low-stock":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Low Stock
          </Badge>
        );
      case "out-of-stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
              <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
              <p className="text-muted-foreground">
                Gestionar productos, niveles de stock y ubicaciones
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowScanner(true)}
                className="flex items-center gap-2"
              >
                <Scan className="h-4 w-4" />
                <span>Scan Barcode</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate("/inventory/receive")}
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Inventory Overview</CardTitle>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search inventory..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger
                    value="products"
                    className="flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    <span>Products</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="movements"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Movements</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="shipments"
                    className="flex items-center gap-2"
                  >
                    <Truck className="h-4 w-4" />
                    <span>Shipments</span>
                  </TabsTrigger>
                  <TabsTrigger value="fifo" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>FIFO Management</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="space-y-4">
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expiration Date</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                  {item.id}
                                </TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700"
                                  >
                                    {item.location}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(item.status)}
                                </TableCell>
                                <TableCell>{item.expirationDate}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    Edit
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={8}
                                className="text-center py-8 text-muted-foreground"
                              >
                                No products found matching your search criteria
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="movements" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <RotateCcw className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Product Movement History
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Track the movement of products within the warehouse
                    </p>
                    <Button>View Movement History</Button>
                  </div>
                </TabsContent>

                <TabsContent value="shipments" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Shipment Tracking
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Monitor incoming and outgoing shipments
                    </p>
                    <Button>View Shipments</Button>
                  </div>
                </TabsContent>

                <TabsContent value="fifo" className="space-y-4">
                  <FIFODashboard
                    onViewItem={(itemId) => console.log("View item:", itemId)}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stock Alerts</CardTitle>
                <CardDescription>Products requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <Package className="h-4 w-4 text-yellow-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Fish Fillets</p>
                        <p className="text-xs text-muted-foreground">
                          Low stock (75 units)
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Order
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Package className="h-4 w-4 text-red-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Beef Quarters</p>
                        <p className="text-xs text-muted-foreground">
                          Expiring in 7 days
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
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest inventory changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-blue-500 pl-3 py-1">
                    <p className="text-sm font-medium">Product Received</p>
                    <p className="text-xs text-muted-foreground">
                      Chicken Breasts - 50 units
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Today, 10:23 AM
                    </p>
                  </div>
                  <div className="border-l-2 border-green-500 pl-3 py-1">
                    <p className="text-sm font-medium">Location Changed</p>
                    <p className="text-xs text-muted-foreground">
                      Pork Ribs moved to RACK-C2
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Today, 9:45 AM
                    </p>
                  </div>
                  <div className="border-l-2 border-red-500 pl-3 py-1">
                    <p className="text-sm font-medium">Product Dispatched</p>
                    <p className="text-xs text-muted-foreground">
                      Beef Quarters - 30 units
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Yesterday, 4:30 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Common inventory tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Register New Product
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Barcode className="h-4 w-4 mr-2" />
                    Print Barcode Labels
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Record Product Movement
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Inventory Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <BarcodeScanner
              onScan={handleScanBarcode}
              onError={(error) => console.error(error)}
              isScanning={true}
              onClose={() => setShowScanner(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
