import React, { useState } from "react";
import DashboardHeader from "../dashboard/DashboardHeader";
import Sidebar from "../layout/Sidebar";
import ProductReception, { ReceptionData } from "./ProductReception";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductReceptionPageProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

const ProductReceptionPage: React.FC<ProductReceptionPageProps> = ({
  userName = "John Doe",
  userRole = "Warehouse Operator",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=warehouse",
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [receptionComplete, setReceptionComplete] = useState(false);
  const [completedData, setCompletedData] = useState<ReceptionData | null>(
    null,
  );
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleReceptionComplete = (data: ReceptionData) => {
    setCompletedData(data);
    setReceptionComplete(true);
    // In a real app, you would save this data to your database
    console.log("Reception completed:", data);
  };

  const handleBackToInventory = () => {
    navigate("/inventory");
  };

  const handleNewReception = () => {
    setReceptionComplete(false);
    setCompletedData(null);
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
              <h1 className="text-2xl font-bold">Product Reception</h1>
              <p className="text-muted-foreground">
                Register new products entering the warehouse
              </p>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleBackToInventory}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Inventory</span>
            </Button>
          </div>

          {receptionComplete ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Reception Complete</h2>
              <p className="text-gray-500 mb-6">
                Product has been successfully received and added to inventory
              </p>
              <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm">
                  <span className="font-medium">Product:</span>{" "}
                  {completedData?.productName}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Quantity:</span>{" "}
                  {completedData?.quantity} units
                </p>
                <p className="text-sm">
                  <span className="font-medium">Location:</span>{" "}
                  {completedData?.locationId}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Lot Number:</span>{" "}
                  {completedData?.lotNumber}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="flex items-center gap-2"
                  onClick={handleNewReception}
                >
                  <Package className="h-4 w-4" />
                  <span>Receive Another Product</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleBackToInventory}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Return to Inventory</span>
                </Button>
              </div>
            </div>
          ) : (
            <ProductReception
              onComplete={handleReceptionComplete}
              onCancel={handleBackToInventory}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReceptionPage;
