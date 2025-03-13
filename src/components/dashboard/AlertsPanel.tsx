import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  ThermometerIcon,
  AlertTriangleIcon,
  ClockIcon,
  ShieldAlertIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "lucide-react";

type AlertType = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: "critical" | "warning" | "info";
  type: "temperature" | "expiration" | "security" | "system";
  status: "active" | "resolved";
};

type AlertsPanelProps = {
  alerts?: AlertType[];
  onResolve?: (id: string) => void;
  onViewDetails?: (id: string) => void;
};

const AlertsPanel = ({
  alerts = [
    {
      id: "alert-1",
      title: "Temperature Deviation in Cold Storage",
      description:
        "Zone B temperature is 8°C, exceeding the 5°C threshold for dairy products.",
      timestamp: "2023-06-15T09:23:00",
      severity: "critical",
      type: "temperature",
      status: "active",
    },
    {
      id: "alert-2",
      title: "Products Expiring Soon",
      description: "15 dairy products in Rack A3 will expire within 48 hours.",
      timestamp: "2023-06-15T08:15:00",
      severity: "warning",
      type: "expiration",
      status: "active",
    },
    {
      id: "alert-3",
      title: "Unauthorized Access Attempt",
      description:
        "Multiple failed login attempts detected from IP 192.168.1.45.",
      timestamp: "2023-06-15T07:30:00",
      severity: "critical",
      type: "security",
      status: "resolved",
    },
    {
      id: "alert-4",
      title: "System Backup Failed",
      description:
        "Scheduled database backup failed at 02:00 AM. Check server logs.",
      timestamp: "2023-06-15T02:00:00",
      severity: "info",
      type: "system",
      status: "active",
    },
  ],
  onResolve = () => {},
  onViewDetails = () => {},
}: AlertsPanelProps) => {
  const getAlertIcon = (type: AlertType["type"]) => {
    switch (type) {
      case "temperature":
        return <ThermometerIcon className="h-5 w-5" />;
      case "expiration":
        return <ClockIcon className="h-5 w-5" />;
      case "security":
        return <ShieldAlertIcon className="h-5 w-5" />;
      case "system":
        return <AlertTriangleIcon className="h-5 w-5" />;
      default:
        return <AlertTriangleIcon className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: AlertType["severity"]) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      case "info":
        return "default";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const activeAlerts = alerts.filter((alert) => alert.status === "active");
  const resolvedAlerts = alerts.filter((alert) => alert.status === "resolved");

  return (
    <Card className="w-full bg-white shadow-md rounded-xl border-blue-100">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Alertas Críticas</CardTitle>
          <div className="flex gap-2">
            <Badge variant="destructive" className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
              {activeAlerts.length} Activas
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircleIcon className="h-3 w-3" />
              {resolvedAlerts.length} Resueltas
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeAlerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircleIcon className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No hay alertas activas en este momento.</p>
            </div>
          )}

          {activeAlerts.map((alert) => (
            <Alert
              key={alert.id}
              variant={
                alert.severity === "critical" ? "destructive" : "default"
              }
              className={`border-l-4 ${alert.severity === "critical" ? "border-l-red-500" : alert.severity === "warning" ? "border-l-yellow-500" : "border-l-blue-500"}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full ${alert.severity === "critical" ? "bg-red-100 text-red-500" : alert.severity === "warning" ? "bg-yellow-100 text-yellow-500" : "bg-blue-100 text-blue-500"}`}
                  >
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <AlertTitle className="text-base font-semibold">
                      {alert.title}
                    </AlertTitle>
                    <AlertDescription className="text-sm mt-1">
                      {alert.description}
                    </AlertDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={getSeverityColor(alert.severity)}
                        className="text-xs"
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onResolve(alert.id)}
                    className="flex items-center gap-1"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    Resolver
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(alert.id)}
                  >
                    Detalles
                  </Button>
                </div>
              </div>
            </Alert>
          ))}

          {resolvedAlerts.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Resueltas Recientemente
              </h4>
              {resolvedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between py-2 px-3 rounded-md bg-gray-50 mb-2"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{alert.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(alert.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
