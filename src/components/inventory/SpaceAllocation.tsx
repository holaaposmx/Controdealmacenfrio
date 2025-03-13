import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Thermometer,
  Package,
  Calendar,
  ClipboardList,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface SpaceAllocationProps {
  onAssignSpace?: (data: SpaceAssignmentData) => void;
  onTemperatureLog?: (data: TemperatureLogData) => void;
  onAuditComplete?: (data: AuditData) => void;
}

interface SpaceAssignmentData {
  productId: string;
  productName: string;
  storageType: "conservation" | "frozen";
  location: string;
  quantity: number;
  lotNumber: string;
  expirationDate: string;
  receivedDate: string;
  assignedBy: string;
}

interface TemperatureLogData {
  storageArea: string;
  temperature: number;
  timestamp: Date;
  recordedBy: string;
  status: "normal" | "warning" | "critical";
  notes?: string;
}

interface AuditData {
  auditId: string;
  auditDate: Date;
  auditor: string;
  findings: string;
  status: "passed" | "issues" | "failed";
  recommendations?: string;
}

const SpaceAllocation: React.FC<SpaceAllocationProps> = ({
  onAssignSpace = () => {},
  onTemperatureLog = () => {},
  onAuditComplete = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("assignment");

  // Mock data for demonstration
  const recentAssignments = [
    {
      productId: "PROD-12345",
      productName: "Beef Quarters",
      storageType: "conservation",
      location: "RACK-A1",
      quantity: 12,
      lotNumber: "LOT-2023-06-15",
      expirationDate: "2023-06-22",
      receivedDate: "2023-06-15",
      assignedBy: "Warehouse Operator",
    },
    {
      productId: "PROD-12346",
      productName: "Chicken Breasts",
      storageType: "frozen",
      location: "RACK-B3",
      quantity: 50,
      lotNumber: "LOT-2023-06-14",
      expirationDate: "2023-09-14",
      receivedDate: "2023-06-14",
      assignedBy: "Warehouse Operator",
    },
    {
      productId: "PROD-12347",
      productName: "Pork Ribs",
      storageType: "conservation",
      location: "TARIMA-C2",
      quantity: 30,
      lotNumber: "LOT-2023-06-13",
      expirationDate: "2023-06-20",
      receivedDate: "2023-06-13",
      assignedBy: "Warehouse Operator",
    },
  ];

  const temperatureLogs = [
    {
      storageArea: "Conservation Chamber 1",
      temperature: 2.5,
      timestamp: new Date(Date.now() - 3600000),
      recordedBy: "Quality Control",
      status: "normal",
    },
    {
      storageArea: "Frozen Chamber 2",
      temperature: -19.2,
      timestamp: new Date(Date.now() - 3600000),
      recordedBy: "Quality Control",
      status: "normal",
    },
    {
      storageArea: "Conservation Chamber 2",
      temperature: 5.1,
      timestamp: new Date(Date.now() - 7200000),
      recordedBy: "Quality Control",
      status: "warning",
      notes: "Temperature slightly above range, maintenance notified",
    },
  ];

  const auditHistory = [
    {
      auditId: "AUDIT-2023-06",
      auditDate: new Date(2023, 5, 10),
      auditor: "Inventory Manager",
      findings: "All products properly labeled and stored according to FIFO",
      status: "passed",
    },
    {
      auditId: "AUDIT-2023-05",
      auditDate: new Date(2023, 4, 15),
      auditor: "Inventory Manager",
      findings: "Two products found with incorrect location labels",
      status: "issues",
      recommendations: "Retrain staff on labeling procedures",
    },
  ];

  // Form state for new space assignment
  const [newAssignment, setNewAssignment] = useState<
    Partial<SpaceAssignmentData>
  >({
    storageType: "conservation",
  });

  // Form state for temperature log
  const [newTemperatureLog, setNewTemperatureLog] = useState<
    Partial<TemperatureLogData>
  >({
    status: "normal",
  });

  // Handle form submissions
  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newAssignment.productId &&
      newAssignment.location &&
      newAssignment.lotNumber
    ) {
      onAssignSpace(newAssignment as SpaceAssignmentData);
      // Reset form or show success message
      setNewAssignment({ storageType: "conservation" });
    }
  };

  const handleTemperatureLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newTemperatureLog.storageArea &&
      newTemperatureLog.temperature !== undefined
    ) {
      const logData: TemperatureLogData = {
        ...newTemperatureLog,
        timestamp: new Date(),
        recordedBy: "Quality Control",
      } as TemperatureLogData;

      onTemperatureLog(logData);
      // Reset form or show success message
      setNewTemperatureLog({ status: "normal" });
    }
  };

  // Helper function to format dates
  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString();
  };

  // Helper function to format times
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Normal
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Warning
          </Badge>
        );
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "passed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Passed
          </Badge>
        );
      case "issues":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Issues Found
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b px-6 py-3">
          <h2 className="text-xl font-bold mb-2">
            Space Allocation Management
          </h2>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="assignment" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Product Assignment</span>
            </TabsTrigger>
            <TabsTrigger
              value="temperature"
              className="flex items-center gap-2"
            >
              <Thermometer className="h-4 w-4" />
              <span>Temperature Control</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>Audits</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Product Assignment Tab */}
        <TabsContent value="assignment" className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assignment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assign Storage Space</CardTitle>
                <CardDescription>
                  Register new products and assign them to storage locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productId">Product ID</Label>
                      <Input
                        id="productId"
                        placeholder="e.g., PROD-12345"
                        value={newAssignment.productId || ""}
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            productId: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        placeholder="e.g., Beef Quarters"
                        value={newAssignment.productName || ""}
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            productName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storageType">Storage Type</Label>
                      <Select
                        value={newAssignment.storageType}
                        onValueChange={(value: "conservation" | "frozen") =>
                          setNewAssignment({
                            ...newAssignment,
                            storageType: value,
                          })
                        }
                      >
                        <SelectTrigger id="storageType">
                          <SelectValue placeholder="Select storage type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conservation">
                            Conservation (0°C to 4°C)
                          </SelectItem>
                          <SelectItem value="frozen">
                            Frozen (-18°C or less)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., RACK-A1 or TARIMA-B3"
                        value={newAssignment.location || ""}
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="e.g., 10"
                        value={newAssignment.quantity || ""}
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            quantity: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lotNumber">Lot Number</Label>
                      <Input
                        id="lotNumber"
                        placeholder="e.g., LOT-2023-06-15"
                        value={newAssignment.lotNumber || ""}
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            lotNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expirationDate">Expiration Date</Label>
                      <Input
                        id="expirationDate"
                        type="date"
                        value={newAssignment.expirationDate || ""}
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            expirationDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receivedDate">Received Date</Label>
                      <Input
                        id="receivedDate"
                        type="date"
                        value={newAssignment.receivedDate || ""}
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            receivedDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Assign Space
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Recent Space Assignments
                </CardTitle>
                <CardDescription>
                  Products recently assigned to storage locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto max-h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Expiration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentAssignments.map((assignment, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {assignment.productName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {assignment.productId}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{assignment.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${assignment.storageType === "conservation" ? "bg-blue-50 text-blue-700" : "bg-indigo-50 text-indigo-700"}`}
                            >
                              {assignment.storageType === "conservation"
                                ? "Conservation"
                                : "Frozen"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(assignment.expirationDate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Temperature Control Tab */}
        <TabsContent value="temperature" className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Temperature Log Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Temperature Log</CardTitle>
                <CardDescription>
                  Record temperature readings for storage areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleTemperatureLogSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="storageArea">Storage Area</Label>
                    <Select
                      value={newTemperatureLog.storageArea}
                      onValueChange={(value) =>
                        setNewTemperatureLog({
                          ...newTemperatureLog,
                          storageArea: value,
                        })
                      }
                    >
                      <SelectTrigger id="storageArea">
                        <SelectValue placeholder="Select storage area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Conservation Chamber 1">
                          Conservation Chamber 1
                        </SelectItem>
                        <SelectItem value="Conservation Chamber 2">
                          Conservation Chamber 2
                        </SelectItem>
                        <SelectItem value="Frozen Chamber 1">
                          Frozen Chamber 1
                        </SelectItem>
                        <SelectItem value="Frozen Chamber 2">
                          Frozen Chamber 2
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 2.5"
                      value={newTemperatureLog.temperature || ""}
                      onChange={(e) => {
                        const temp = parseFloat(e.target.value);
                        let status = "normal";

                        // Determine status based on temperature
                        if (
                          newTemperatureLog.storageArea?.includes(
                            "Conservation",
                          )
                        ) {
                          if (temp > 4) status = "warning";
                          if (temp > 6) status = "critical";
                          if (temp < 0) status = "warning";
                        } else if (
                          newTemperatureLog.storageArea?.includes("Frozen")
                        ) {
                          if (temp > -18) status = "warning";
                          if (temp > -15) status = "critical";
                        }

                        setNewTemperatureLog({
                          ...newTemperatureLog,
                          temperature: temp,
                          status: status as "normal" | "warning" | "critical",
                        });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Input
                      id="notes"
                      placeholder="Any observations or issues"
                      value={newTemperatureLog.notes || ""}
                      onChange={(e) =>
                        setNewTemperatureLog({
                          ...newTemperatureLog,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Record Temperature
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Temperature Log History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Temperature History</CardTitle>
                <CardDescription>
                  Recent temperature readings and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto max-h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Storage Area</TableHead>
                        <TableHead>Temperature</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {temperatureLogs.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell>{log.storageArea}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Thermometer className="h-4 w-4" />
                              <span>{log.temperature}°C</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                          <TableCell>{formatTime(log.timestamp)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium text-sm mb-2">
                    Temperature Guidelines
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      Conservation: 0°C to 4°C
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      Frozen: -18°C or less
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Audit Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Monthly Audit Checklist
                </CardTitle>
                <CardDescription>
                  Verify inventory and storage conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Product Verification
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">
                          All products properly labeled with location, lot and
                          date
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">
                          FIFO methodology correctly applied
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">
                          Inventory counts match system records
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      Storage Conditions
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">
                          Temperature logs complete and within range
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                        <span className="text-sm">
                          No frost accumulation in frozen storage
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">
                          No signs of damage or contamination
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Staff Compliance
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">
                          Staff following proper storage procedures
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">
                          Temperature logs being updated hourly
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <span className="text-sm">
                          Product rotation training needed
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Button className="w-full">Complete Monthly Audit</Button>
                </div>
              </CardContent>
            </Card>

            {/* Audit History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Audit History</CardTitle>
                <CardDescription>Previous audits and findings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditHistory.map((audit, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{audit.auditId}</h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(audit.auditDate)} • {audit.auditor}
                          </p>
                        </div>
                        {getStatusBadge(audit.status)}
                      </div>
                      <p className="text-sm mb-2">{audit.findings}</p>
                      {audit.recommendations && (
                        <div className="bg-yellow-50 p-2 rounded text-sm">
                          <span className="font-medium">Recommendations: </span>
                          {audit.recommendations}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="text-center">
                    <Button variant="outline" className="w-full">
                      View All Audit Reports
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpaceAllocation;
