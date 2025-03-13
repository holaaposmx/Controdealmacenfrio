import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  Package,
  AlertTriangle,
  Truck,
  Clock,
  BarChart,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
}

const MetricCard = ({
  title = "Metric",
  value = "0",
  icon = <BarChart className="h-5 w-5" />,
  trend,
  bgColor = "bg-white",
}: MetricCardProps) => {
  return (
    <Card className={`${bgColor} h-full`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted/20 p-1.5 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center mt-1">
            {trend.isPositive ? (
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-xs ${trend.isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {trend.value}% from last week
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface MetricsOverviewProps {
  metrics?: {
    warehouseOccupation: number;
    pendingOrders: number;
    criticalAlerts: number;
    incomingShipments: number;
    outgoingShipments: number;
    expiringProducts: number;
  };
}

const MetricsOverview = ({
  metrics = {
    warehouseOccupation: 78,
    pendingOrders: 24,
    criticalAlerts: 3,
    incomingShipments: 12,
    outgoingShipments: 18,
    expiringProducts: 7,
  },
}: MetricsOverviewProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Warehouse Occupation"
          value={`${metrics.warehouseOccupation}%`}
          icon={<Package className="h-5 w-5 text-blue-600" />}
          trend={{ value: 5, isPositive: true }}
        />

        <MetricCard
          title="Pending Orders"
          value={metrics.pendingOrders}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          trend={{ value: 12, isPositive: false }}
        />

        <MetricCard
          title="Critical Alerts"
          value={metrics.criticalAlerts}
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
          bgColor={metrics.criticalAlerts > 0 ? "bg-red-50" : "bg-white"}
        />

        <MetricCard
          title="Incoming Shipments"
          value={metrics.incomingShipments}
          icon={<Truck className="h-5 w-5 text-green-600" />}
          trend={{ value: 8, isPositive: true }}
        />

        <MetricCard
          title="Outgoing Shipments"
          value={metrics.outgoingShipments}
          icon={<Truck className="h-5 w-5 text-purple-600" />}
          trend={{ value: 3, isPositive: true }}
        />

        <MetricCard
          title="Expiring Products"
          value={metrics.expiringProducts}
          icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
          bgColor={metrics.expiringProducts > 5 ? "bg-amber-50" : "bg-white"}
        />
      </div>
    </div>
  );
};

export default MetricsOverview;
