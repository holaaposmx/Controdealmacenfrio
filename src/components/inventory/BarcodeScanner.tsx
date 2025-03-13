import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Barcode,
  Upload,
  History,
  X,
  Scan,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface BarcodeScannerProps {
  onScan?: (code: string) => void;
  onError?: (error: string) => void;
  isScanning?: boolean;
  onClose?: () => void;
  scanHistory?: Array<{
    code: string;
    timestamp: Date;
    type: string;
  }>;
}

const BarcodeScanner = ({
  onScan = () => {},
  onError = () => {},
  isScanning = false,
  onClose,
  scanHistory = [
    {
      code: "PROD-12345",
      timestamp: new Date(Date.now() - 3600000),
      type: "Product",
    },
    {
      code: "LOC-RACK-A1",
      timestamp: new Date(Date.now() - 7200000),
      type: "Location",
    },
    {
      code: "PROD-67890",
      timestamp: new Date(Date.now() - 10800000),
      type: "Product",
    },
  ],
}: BarcodeScannerProps) => {
  const [activeTab, setActiveTab] = useState("camera");
  const [manualCode, setManualCode] = useState("");
  const [codeType, setCodeType] = useState("product");
  const [showCamera, setShowCamera] = useState(isScanning);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset success state when changing tabs
  useEffect(() => {
    setScanSuccess(false);
    setScannedCode("");
  }, [activeTab]);

  // Mock function to simulate starting the camera
  const startCamera = () => {
    setShowCamera(true);
    // In a real implementation, this would access the device camera
    // navigator.mediaDevices.getUserMedia({ video: true })
    //   .then(stream => {
    //     if (videoRef.current) {
    //       videoRef.current.srcObject = stream;
    //     }
    //   })
    //   .catch(err => onError(`Camera access error: ${err.message}`));
  };

  // Mock function to simulate stopping the camera
  const stopCamera = () => {
    setShowCamera(false);
    // In a real implementation, this would stop the camera stream
    // if (videoRef.current && videoRef.current.srcObject) {
    //   const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
    //   tracks.forEach(track => track.stop());
    //   videoRef.current.srcObject = null;
    // }
  };

  // Mock function to simulate scanning a barcode
  const scanBarcode = () => {
    // In a real implementation, this would process video frames to detect barcodes
    const mockBarcode = "PROD-" + Math.floor(10000 + Math.random() * 90000);
    setScannedCode(mockBarcode);
    setScanSuccess(true);

    // Auto-close after 2 seconds
    setTimeout(() => {
      onScan(mockBarcode);
    }, 1500);
  };

  // Handle manual code submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      setScannedCode(manualCode);
      setScanSuccess(true);

      // Auto-close after 1.5 seconds
      setTimeout(() => {
        onScan(manualCode);
        setManualCode("");
      }, 1500);
    } else {
      onError("Please enter a valid code");
    }
  };

  // Format timestamp for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl border-blue-100 overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Scan className="h-5 w-5 text-primary" />
            <span>Barcode Scanner</span>
          </CardTitle>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="camera" className="flex items-center gap-1">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Camera</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-1">
              <Barcode className="h-4 w-4" />
              <span className="hidden sm:inline">Manual</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          {scanSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium mb-1">Scan Successful!</h3>
                <p className="text-sm text-gray-500 mb-2">Code detected:</p>
                <Badge
                  variant="outline"
                  className="text-base px-3 py-1 bg-gray-50"
                >
                  {scannedCode}
                </Badge>
              </div>
            </div>
          ) : (
            <>
              <TabsContent value="camera" className="space-y-4">
                <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden border">
                  {showCamera ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3/4 h-1/2 border-2 border-primary opacity-50 rounded-md"></div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="secondary"
                          className="bg-black/70 text-white"
                        >
                          Camera Active
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center px-4">
                        Camera preview will appear here
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  {!showCamera ? (
                    <Button onClick={startCamera} className="w-full">
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  ) : (
                    <Button
                      onClick={scanBarcode}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <Scan className="h-4 w-4 mr-2" />
                      Scan Now
                    </Button>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Select value={codeType} onValueChange={setCodeType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select code type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="location">Location</SelectItem>
                        <SelectItem value="order">Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Input
                      type="text"
                      placeholder="Enter barcode manually"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" className="whitespace-nowrap">
                      <Upload className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-blue-700 mb-1">
                      Code Format Tips
                    </h4>
                    <ul className="text-xs text-blue-600 space-y-1 pl-4 list-disc">
                      <li>Product codes start with PROD- (e.g., PROD-12345)</li>
                      <li>
                        Location codes include rack info (e.g., RACK-A1,
                        TARIMA-B3)
                      </li>
                      <li>Order codes start with ORD- (e.g., ORD-2023-1234)</li>
                    </ul>
                  </div>
                </form>
              </TabsContent>

              <TabsContent
                value="history"
                className="max-h-[300px] overflow-y-auto"
              >
                {scanHistory.length > 0 ? (
                  <ul className="space-y-2">
                    {scanHistory.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => {
                          setScannedCode(item.code);
                          setScanSuccess(true);
                          setTimeout(() => onScan(item.code), 1500);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-gray-200 p-2 rounded-full">
                            {item.type === "Product" ? (
                              <Barcode className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Scan className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.code}</p>
                            <p className="text-xs text-gray-500">{item.type}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTime(item.timestamp)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No scan history available</p>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-gray-500 border-t bg-gray-50 py-3">
        {scanSuccess ? (
          <p className="w-full text-center">Processing code, please wait...</p>
        ) : (
          <p className="w-full text-center">
            Position the barcode within the frame to scan
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default BarcodeScanner;
