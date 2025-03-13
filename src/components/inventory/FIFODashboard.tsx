import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Clock, CheckCircle, RotateCcw } from "lucide-react";
import { calculateFIFOMetrics, getExpiringItems } from "@/lib/fifo";
import type { Database } from "@/types/database.types";

type InventoryItem = Database["public"]["Tables"]["inventory_items"]["Row"] & {
  warehouse_locations?: {
    location_code: string;
    storage_type: "conservation" | "frozen";
  } | null;
};

interface FIFODashboardProps {
  onViewItem?: (itemId: string) => void;
}

const FIFODashboard: React.FC<FIFODashboardProps> = ({
  onViewItem = () => {},
}) => {
  const [metrics, setMetrics] = useState({
    expiringIn7Days: 0,
    expiringIn14Days: 0,
    expired: 0,
    fifoCompliancePercentage: 100,
  });
  const [expiringItems, setExpiringItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const fifoMetrics = await calculateFIFOMetrics();
        setMetrics(fifoMetrics);

        const expiring = await getExpiringItems(7);
        setExpiringItems(expiring as InventoryItem[]);
      } catch (error) {
        console.error("Error loading FIFO data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getDaysUntilExpiration = (dateString: string) => {
    const today = new Date();
    const expirationDate = new Date(dateString);
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpirationBadge = (dateString: string) => {
    const daysLeft = getDaysUntilExpiration(dateString);

    if (daysLeft <= 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Expired
        </Badge>
      );
    } else if (daysLeft <= 3) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {daysLeft} days left
        </Badge>
      );
    } else if (daysLeft <= 7) {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 flex items-center gap-1"
        >
          <Clock className="h-3 w-3" />
          {daysLeft} days left
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 flex items-center gap-1"
        >
          <Clock className="h-3 w-3" />
          {daysLeft} days left
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">FIFO Inventory Management</CardTitle>
          <CardDescription>
            First-In-First-Out inventory tracking and expiration management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-amber-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Expiring in 7 Days
                    </p>
                    <p className="text-2xl font-bold text-amber-900">
                      {metrics.expiringIn7Days}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Expiring in 14 Days
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {metrics.expiringIn14Days}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Expired Items
                    </p>
                    <p className="text-2xl font-bold text-red-900">
                      {metrics.expired}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      FIFO Compliance
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {metrics.fifoCompliancePercentage}%
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Items Expiring Soon</h3>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading FIFO data...</p>
              </div>
            ) : expiringItems.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.product_id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.warehouse_locations?.location_code ||
                            item.location_id ||
                            "Not assigned"}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {formatDate(item.expiration_date!)}
                        </TableCell>
                        <TableCell>
                          {getExpirationBadge(item.expiration_date!)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewItem(item.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-md">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-muted-foreground">No items expiring soon</p>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium mb-2">FIFO Compliance</h3>
            <Progress
              value={metrics.fifoCompliancePercentage}
              className="h-2 mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FIFODashboard;
