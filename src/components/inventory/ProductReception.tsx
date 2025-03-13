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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Barcode,
  Scan,
  ClipboardCheck,
  Package,
  Thermometer,
  CheckCircle,
  XCircle,
  Camera,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import BarcodeScanner from "./BarcodeScanner";
import { addInventoryItem } from "./InventoryService";
import { recordTemperature } from "@/components/quality/QualityService";
import { determineTemperatureStatus } from "@/components/quality/QualityService";

interface ProductReceptionProps {
  onComplete?: (data: ReceptionData) => void;
  onCancel?: () => void;
  locations?: Array<{ id: string; code: string; type: string }>;
}

export interface ReceptionData {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  locationId: string;
  lotNumber: string;
  receivedDate: string;
  expirationDate: string;
  temperature: number;
  qualityChecks: QualityCheck[];
  notes: string;
}

interface QualityCheck {
  id: string;
  name: string;
  passed: boolean;
  notes?: string;
}

const ProductReception: React.FC<ProductReceptionProps> = ({
  onComplete = () => {},
  onCancel = () => {},
  locations = [
    { id: "loc1", code: "RACK-A1", type: "conservation" },
    { id: "loc2", code: "RACK-A2", type: "conservation" },
    { id: "loc3", code: "RACK-B1", type: "conservation" },
    { id: "loc4", code: "RACK-B2", type: "conservation" },
    { id: "loc5", code: "RACK-C1", type: "conservation" },
    { id: "loc6", code: "TARIMA-A1", type: "conservation" },
    { id: "loc7", code: "FROZEN-1", type: "frozen" },
    { id: "loc8", code: "FROZEN-2", type: "frozen" },
  ],
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [showScanner, setShowScanner] = useState(false);
  const [scanTarget, setScanTarget] = useState<"product" | "location">(
    "product",
  );
  const [receptionData, setReceptionData] = useState<Partial<ReceptionData>>({
    receivedDate: new Date().toISOString().split("T")[0],
    qualityChecks: [
      { id: "qc1", name: "Packaging Integrity", passed: true },
      { id: "qc2", name: "Visual Inspection", passed: true },
      { id: "qc3", name: "Documentation Complete", passed: true },
      { id: "qc4", name: "Temperature Appropriate", passed: true },
      { id: "qc5", name: "Expiration Date Verified", passed: true },
    ],
    notes: "",
  });
  const [temperatureStatus, setTemperatureStatus] = useState<
    "normal" | "warning" | "critical"
  >("normal");
  const [selectedLocationType, setSelectedLocationType] = useState<
    "conservation" | "frozen"
  >("conservation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter locations based on selected type
  const filteredLocations = locations.filter(
    (loc) => loc.type === selectedLocationType,
  );

  const handleScanComplete = (code: string) => {
    setShowScanner(false);
    if (scanTarget === "product") {
      setReceptionData({
        ...receptionData,
        productId: code,
        // In a real app, you would fetch product details from the database
        productName:
          code === "PROD-12345"
            ? "Beef Quarters"
            : code === "PROD-12346"
              ? "Chicken Breasts"
              : code === "PROD-12347"
                ? "Pork Ribs"
                : code === "PROD-12348"
                  ? "Fish Fillets"
                  : code === "PROD-12349"
                    ? "Dairy Products"
                    : "Unknown Product",
        category:
          code === "PROD-12345" || code === "PROD-12347"
            ? "Meat"
            : code === "PROD-12346"
              ? "Poultry"
              : code === "PROD-12348"
                ? "Seafood"
                : code === "PROD-12349"
                  ? "Dairy"
                  : "Other",
      });
    } else {
      // Find the location by code
      const location = locations.find((loc) => loc.code === code);
      if (location) {
        setReceptionData({
          ...receptionData,
          locationId: location.id,
        });
        setSelectedLocationType(location.type as "conservation" | "frozen");
      }
    }
  };

  const handleTemperatureChange = (temp: number) => {
    // Determine temperature status based on selected location type
    const status = determineTemperatureStatus(temp, selectedLocationType);
    setTemperatureStatus(status);

    // Update quality check for temperature
    const updatedChecks = receptionData.qualityChecks?.map((check) =>
      check.id === "qc4"
        ? {
            ...check,
            passed: status !== "critical",
            notes:
              status === "critical"
                ? `Temperature (${temp}°C) outside acceptable range for ${selectedLocationType}`
                : undefined,
          }
        : check,
    );

    setReceptionData({
      ...receptionData,
      temperature: temp,
      qualityChecks: updatedChecks,
    });
  };

  const handleQualityCheckChange = (checkId: string, passed: boolean) => {
    const updatedChecks = receptionData.qualityChecks?.map((check) =>
      check.id === checkId ? { ...check, passed } : check,
    );

    setReceptionData({
      ...receptionData,
      qualityChecks: updatedChecks,
    });
  };

  const handleQualityCheckNotes = (checkId: string, notes: string) => {
    const updatedChecks = receptionData.qualityChecks?.map((check) =>
      check.id === checkId ? { ...check, notes } : check,
    );

    setReceptionData({
      ...receptionData,
      qualityChecks: updatedChecks,
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!receptionData.productId)
        newErrors.productId = "Product ID is required";
      if (!receptionData.productName)
        newErrors.productName = "Product name is required";
      if (!receptionData.category) newErrors.category = "Category is required";
      if (!receptionData.quantity || receptionData.quantity <= 0)
        newErrors.quantity = "Valid quantity is required";
      if (!receptionData.lotNumber)
        newErrors.lotNumber = "Lot number is required";
      if (!receptionData.expirationDate)
        newErrors.expirationDate = "Expiration date is required";
    } else if (step === 2) {
      if (!receptionData.locationId)
        newErrors.locationId = "Storage location is required";
      if (receptionData.temperature === undefined)
        newErrors.temperature = "Temperature reading is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setIsSubmitting(true);

    try {
      // In a real implementation, these would be actual API calls
      // Add the inventory item
      if (
        receptionData.productId &&
        receptionData.productName &&
        receptionData.category &&
        receptionData.quantity &&
        receptionData.locationId &&
        receptionData.lotNumber &&
        receptionData.receivedDate &&
        receptionData.expirationDate
      ) {
        // Add inventory item
        await addInventoryItem({
          productId: receptionData.productId,
          productName: receptionData.productName,
          category: receptionData.category,
          quantity: receptionData.quantity,
          locationId: receptionData.locationId,
          lotNumber: receptionData.lotNumber,
          receivedDate: receptionData.receivedDate,
          expirationDate: receptionData.expirationDate,
          status: "in-stock",
        });

        // Record temperature if provided
        if (
          receptionData.temperature !== undefined &&
          receptionData.locationId
        ) {
          const location = locations.find(
            (loc) => loc.id === receptionData.locationId,
          );
          if (location) {
            await recordTemperature({
              storageArea: location.code,
              temperature: receptionData.temperature,
              status: temperatureStatus,
              recordedBy: "Warehouse Operator", // In a real app, this would be the current user
              notes: receptionData.notes || undefined,
            });
          }
        }

        // Call the onComplete callback with the full data
        onComplete(receptionData as ReceptionData);
      }
    } catch (error) {
      console.error("Error during product reception:", error);
      // In a real app, you would show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const allQualityChecksPassed = receptionData.qualityChecks?.every(
    (check) => check.passed,
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border">
      <div className="border-b px-6 py-3">
        <h2 className="text-xl font-bold mb-2">Product Reception</h2>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Badge
              variant={activeStep === 1 ? "default" : "outline"}
              className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
            >
              1
            </Badge>
            <div className="h-0.5 w-8 bg-gray-200"></div>
            <Badge
              variant={activeStep === 2 ? "default" : "outline"}
              className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
            >
              2
            </Badge>
            <div className="h-0.5 w-8 bg-gray-200"></div>
            <Badge
              variant={activeStep === 3 ? "default" : "outline"}
              className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
            >
              3
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {activeStep} of 3
          </div>
        </div>
      </div>

      {/* Step 1: Product Information */}
      {activeStep === 1 && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Information</CardTitle>
                  <CardDescription>
                    Scan or enter product details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label htmlFor="productId">Product ID</Label>
                      <Input
                        id="productId"
                        placeholder="e.g., PROD-12345"
                        value={receptionData.productId || ""}
                        onChange={(e) =>
                          setReceptionData({
                            ...receptionData,
                            productId: e.target.value,
                          })
                        }
                        className={errors.productId ? "border-red-500" : ""}
                      />
                      {errors.productId && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.productId}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="mt-6"
                      onClick={() => {
                        setScanTarget("product");
                        setShowScanner(true);
                      }}
                      title="Scan Product Barcode"
                    >
                      <Scan className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      placeholder="e.g., Beef Quarters"
                      value={receptionData.productName || ""}
                      onChange={(e) =>
                        setReceptionData({
                          ...receptionData,
                          productName: e.target.value,
                        })
                      }
                      className={errors.productName ? "border-red-500" : ""}
                    />
                    {errors.productName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.productName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={receptionData.category}
                      onValueChange={(value) =>
                        setReceptionData({ ...receptionData, category: value })
                      }
                    >
                      <SelectTrigger
                        id="category"
                        className={errors.category ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Meat">Meat</SelectItem>
                        <SelectItem value="Poultry">Poultry</SelectItem>
                        <SelectItem value="Seafood">Seafood</SelectItem>
                        <SelectItem value="Dairy">Dairy</SelectItem>
                        <SelectItem value="Produce">Produce</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="e.g., 10"
                      value={receptionData.quantity || ""}
                      onChange={(e) =>
                        setReceptionData({
                          ...receptionData,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      className={errors.quantity ? "border-red-500" : ""}
                    />
                    {errors.quantity && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.quantity}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lot Information</CardTitle>
                  <CardDescription>
                    Enter lot and expiration details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lotNumber">Lot Number</Label>
                    <Input
                      id="lotNumber"
                      placeholder="e.g., LOT-2023-06-15"
                      value={receptionData.lotNumber || ""}
                      onChange={(e) =>
                        setReceptionData({
                          ...receptionData,
                          lotNumber: e.target.value,
                        })
                      }
                      className={errors.lotNumber ? "border-red-500" : ""}
                    />
                    {errors.lotNumber && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.lotNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receivedDate">Received Date</Label>
                    <Input
                      id="receivedDate"
                      type="date"
                      value={receptionData.receivedDate || ""}
                      onChange={(e) =>
                        setReceptionData({
                          ...receptionData,
                          receivedDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expirationDate">Expiration Date</Label>
                    <Input
                      id="expirationDate"
                      type="date"
                      value={receptionData.expirationDate || ""}
                      onChange={(e) =>
                        setReceptionData({
                          ...receptionData,
                          expirationDate: e.target.value,
                        })
                      }
                      className={errors.expirationDate ? "border-red-500" : ""}
                    />
                    {errors.expirationDate && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.expirationDate}
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-blue-50 rounded-md mt-4">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        FIFO Tracking Information
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      Products will be automatically tracked using FIFO (First
                      In, First Out) principles based on expiration date.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={nextStep}>Next Step</Button>
          </div>
        </div>
      )}

      {/* Step 2: Location and Temperature */}
      {activeStep === 2 && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Storage Location</CardTitle>
                  <CardDescription>Assign a warehouse location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storageType">Storage Type</Label>
                    <Select
                      value={selectedLocationType}
                      onValueChange={(value: "conservation" | "frozen") => {
                        setSelectedLocationType(value);
                        // Clear selected location when changing type
                        setReceptionData({
                          ...receptionData,
                          locationId: undefined,
                        });
                      }}
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

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label htmlFor="location">Location</Label>
                      <Select
                        value={receptionData.locationId}
                        onValueChange={(value) =>
                          setReceptionData({
                            ...receptionData,
                            locationId: value,
                          })
                        }
                      >
                        <SelectTrigger
                          id="location"
                          className={errors.locationId ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredLocations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.locationId && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.locationId}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="mt-6"
                      onClick={() => {
                        setScanTarget("location");
                        setShowScanner(true);
                      }}
                      title="Scan Location Barcode"
                    >
                      <Scan className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-md mt-4">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Package className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Location Guidelines
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      {selectedLocationType === "conservation"
                        ? "Conservation storage is for fresh products with temperatures between 0°C and 4°C."
                        : "Frozen storage is for products requiring temperatures of -18°C or lower."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Temperature Check</CardTitle>
                  <CardDescription>
                    Record product temperature on arrival
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">
                      Temperature Reading (°C)
                    </Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      placeholder={
                        selectedLocationType === "conservation"
                          ? "e.g., 2.5"
                          : "e.g., -18.5"
                      }
                      value={receptionData.temperature ?? ""}
                      onChange={(e) =>
                        handleTemperatureChange(parseFloat(e.target.value))
                      }
                      className={errors.temperature ? "border-red-500" : ""}
                    />
                    {errors.temperature && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.temperature}
                      </p>
                    )}
                  </div>

                  {receptionData.temperature !== undefined && (
                    <div
                      className={`p-3 rounded-md mt-2 ${temperatureStatus === "normal" ? "bg-green-50" : temperatureStatus === "warning" ? "bg-yellow-50" : "bg-red-50"}`}
                    >
                      <div
                        className={`flex items-center gap-2 ${temperatureStatus === "normal" ? "text-green-700" : temperatureStatus === "warning" ? "text-yellow-700" : "text-red-700"}`}
                      >
                        <Thermometer className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {temperatureStatus === "normal"
                            ? "Temperature within acceptable range"
                            : temperatureStatus === "warning"
                              ? "Temperature outside optimal range"
                              : "Temperature critical - action required"}
                        </span>
                      </div>
                      <p
                        className={`text-xs mt-1 ${temperatureStatus === "normal" ? "text-green-600" : temperatureStatus === "warning" ? "text-yellow-600" : "text-red-600"}`}
                      >
                        {selectedLocationType === "conservation"
                          ? "Conservation products should be between 0°C and 4°C"
                          : "Frozen products should be at -18°C or below"}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any observations about the product condition"
                      value={receptionData.notes || ""}
                      onChange={(e) =>
                        setReceptionData({
                          ...receptionData,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep}>
              Previous Step
            </Button>
            <Button onClick={nextStep}>Next Step</Button>
          </div>
        </div>
      )}

      {/* Step 3: Quality Checks and Confirmation */}
      {activeStep === 3 && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quality Checks</CardTitle>
                  <CardDescription>
                    Verify product quality requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {receptionData.qualityChecks?.map((check) => (
                      <div key={check.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={check.id}
                              checked={check.passed}
                              onCheckedChange={(checked) =>
                                handleQualityCheckChange(
                                  check.id,
                                  checked as boolean,
                                )
                              }
                            />
                            <Label
                              htmlFor={check.id}
                              className="text-sm font-medium"
                            >
                              {check.name}
                            </Label>
                          </div>
                          {check.passed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        {!check.passed && (
                          <div className="pl-6">
                            <Textarea
                              placeholder="Describe the issue"
                              className="text-xs h-20"
                              value={check.notes || ""}
                              onChange={(e) =>
                                handleQualityCheckNotes(
                                  check.id,
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    ))}

                    <div
                      className={`p-3 rounded-md mt-4 ${allQualityChecksPassed ? "bg-green-50" : "bg-red-50"}`}
                    >
                      <div
                        className={`flex items-center gap-2 ${allQualityChecksPassed ? "text-green-700" : "text-red-700"}`}
                      >
                        {allQualityChecksPassed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {allQualityChecksPassed
                            ? "All quality checks passed"
                            : "Some quality checks failed"}
                        </span>
                      </div>
                      <p
                        className={`text-xs mt-1 ${allQualityChecksPassed ? "text-green-600" : "text-red-600"}`}
                      >
                        {allQualityChecksPassed
                          ? "Product meets all quality requirements"
                          : "Review failed checks and take appropriate action"}
                      </p>
                    </div>

                    <div className="flex justify-center mt-4">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Document with Photo</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reception Summary</CardTitle>
                  <CardDescription>
                    Review and confirm product reception
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Product</TableCell>
                        <TableCell>
                          {receptionData.productName || "Not specified"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Product ID
                        </TableCell>
                        <TableCell>
                          {receptionData.productId || "Not specified"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Category</TableCell>
                        <TableCell>
                          {receptionData.category || "Not specified"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Quantity</TableCell>
                        <TableCell>
                          {receptionData.quantity || "Not specified"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Lot Number
                        </TableCell>
                        <TableCell>
                          {receptionData.lotNumber || "Not specified"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Expiration Date
                        </TableCell>
                        <TableCell>
                          {receptionData.expirationDate || "Not specified"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Location</TableCell>
                        <TableCell>
                          {locations.find(
                            (loc) => loc.id === receptionData.locationId,
                          )?.code || "Not specified"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Temperature
                        </TableCell>
                        <TableCell>
                          {receptionData.temperature !== undefined
                            ? `${receptionData.temperature}°C`
                            : "Not recorded"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Status</TableCell>
                        <TableCell>
                          {allQualityChecksPassed ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700"
                            >
                              Ready for Storage
                            </Badge>
                          ) : (
                            <Badge variant="destructive">Quality Issues</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <div className="mt-6 space-y-2">
                    <Label htmlFor="confirmation" className="text-sm">
                      Reception Confirmation
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="confirmation" />
                      <Label htmlFor="confirmation" className="text-xs">
                        I confirm that all product information is correct and
                        quality checks have been performed according to
                        procedures.
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep}>
              Previous Step
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !allQualityChecksPassed}
            >
              {isSubmitting ? "Processing..." : "Complete Reception"}
            </Button>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <BarcodeScanner
              onScan={handleScanComplete}
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

export default ProductReception;
