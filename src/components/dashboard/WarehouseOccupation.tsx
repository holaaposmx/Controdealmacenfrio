import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { BarChart, Activity, Package, AlertTriangle } from "lucide-react";

interface WarehouseOccupationProps {
  occupationPercentage?: number;
  totalCapacity?: number;
  usedCapacity?: number;
  rackUtilization?: {
    rackId: string;
    occupationPercentage: number;
    status: "low" | "medium" | "high" | "critical";
  }[];
}

const WarehouseOccupation = ({
  occupationPercentage = 68,
  totalCapacity = 5000,
  usedCapacity = 3400,
  rackUtilization = [
    { rackId: "RACK-A1", occupationPercentage: 95, status: "critical" },
    { rackId: "RACK-A2", occupationPercentage: 82, status: "high" },
    { rackId: "RACK-B1", occupationPercentage: 75, status: "high" },
    { rackId: "RACK-B2", occupationPercentage: 60, status: "medium" },
    { rackId: "RACK-C1", occupationPercentage: 45, status: "medium" },
    { rackId: "TARIMA-A1", occupationPercentage: 30, status: "low" },
    { rackId: "TARIMA-B1", occupationPercentage: 25, status: "low" },
    { rackId: "TARIMA-C1", occupationPercentage: 20, status: "low" },
  ],
}: WarehouseOccupationProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return "bg-green-500";
    if (percentage < 60) return "bg-yellow-500";
    if (percentage < 85) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          Warehouse Occupation
        </CardTitle>
        <BarChart className="h-5 w-5 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Occupation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Occupation</span>
              <span className="text-sm font-bold">{occupationPercentage}%</span>
            </div>
            <Progress
              value={occupationPercentage}
              className="h-2"
              indicatorClassName={getProgressColor(occupationPercentage)}
            />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Used: {usedCapacity} units</span>
              <span>Total: {totalCapacity} units</span>
            </div>
          </div>

          {/* Rack Utilization */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-1">
              <Activity className="h-4 w-4" /> Rack Utilization
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {rackUtilization.map((rack) => (
                <div key={rack.rackId} className="border rounded-md p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{rack.rackId}</span>
                    <div className="flex items-center gap-1">
                      {rack.status === "critical" && (
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                      )}
                      <span className="text-xs font-bold">
                        {rack.occupationPercentage}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={rack.occupationPercentage}
                    className="h-1.5"
                    indicatorClassName={getStatusColor(rack.status)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Capacity Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Available Space</p>
                <p className="text-lg font-bold">
                  {totalCapacity - usedCapacity} units
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Critical Racks</p>
                <p className="text-lg font-bold">
                  {
                    rackUtilization.filter((rack) => rack.status === "critical")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WarehouseOccupation;
