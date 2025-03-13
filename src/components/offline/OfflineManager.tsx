import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  Upload,
  CheckCircle,
} from "lucide-react";
import {
  saveOfflineOperation,
  getOfflineDataByKey,
  isOnline,
  syncOfflineOperations,
  initNetworkListeners,
  getNetworkStatus,
  cacheEssentialData,
} from "@/lib/offlineStorage";

interface OfflineManagerProps {
  onClose?: () => void;
}

const OfflineManager: React.FC<OfflineManagerProps> = ({ onClose }) => {
  const [networkStatus, setNetworkStatus] = useState(isOnline());
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [caching, setCaching] = useState(false);

  useEffect(() => {
    // Initialize network listeners
    initNetworkListeners();

    // Update state based on network status
    const handleNetworkChange = () => {
      setNetworkStatus(isOnline());
      updatePendingOperations();
    };

    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);

    // Get initial pending operations
    updatePendingOperations();

    // Get last sync time
    const networkStatus = getNetworkStatus();
    if (networkStatus.lastUpdated) {
      setLastSync(new Date(networkStatus.lastUpdated).toLocaleString());
    }

    return () => {
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, []);

  const updatePendingOperations = () => {
    const operations = getOfflineOperations();
    setPendingCount(operations.filter((op) => !op.synced).length);
  };

  const handleSync = async () => {
    if (!networkStatus) return;

    setSyncing(true);
    setSyncProgress(0);

    try {
      // Simulate progress for better UX
      const interval = setInterval(() => {
        setSyncProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 300);

      await syncOfflineOperations();

      clearInterval(interval);
      setSyncProgress(100);

      // Update pending operations count
      updatePendingOperations();

      // Update last sync time
      setLastSync(new Date().toLocaleString());

      // Reset progress after a delay
      setTimeout(() => {
        setSyncing(false);
        setSyncProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncing(false);
    }
  };

  const handleCacheData = async () => {
    setCaching(true);
    try {
      await cacheEssentialData();
      // Update last sync time
      setLastSync(new Date().toLocaleString());
    } catch (error) {
      console.error("Caching failed:", error);
    } finally {
      setCaching(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Offline Mode</CardTitle>
        <Badge
          variant={networkStatus ? "outline" : "destructive"}
          className={`flex items-center gap-1 ${networkStatus ? "bg-green-50 text-green-700" : ""}`}
        >
          {networkStatus ? (
            <>
              <Wifi className="h-3 w-3" /> Online
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" /> Offline
            </>
          )}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Pending Operations</p>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Database className="h-5 w-5 text-blue-600" />
          </div>
        </div>

        {syncing && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Syncing data...</p>
              <p className="text-sm font-medium">{syncProgress}%</p>
            </div>
            <Progress value={syncProgress} className="h-2" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleSync}
            disabled={!networkStatus || syncing || pendingCount === 0}
            className="w-full flex items-center gap-2"
          >
            {syncing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>{syncing ? "Syncing..." : "Sync Pending Operations"}</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleCacheData}
            disabled={!networkStatus || caching}
            className="w-full flex items-center gap-2"
          >
            {caching ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            <span>{caching ? "Caching..." : "Cache Data for Offline Use"}</span>
          </Button>
        </div>

        {lastSync && (
          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span>Last synchronized:</span>
            <span className="font-medium">{lastSync}</span>
          </div>
        )}

        {!networkStatus && (
          <div className="p-3 bg-yellow-50 rounded-md">
            <div className="flex items-center gap-2 text-yellow-700">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">Working Offline</span>
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              Changes will be synchronized when you're back online.
            </p>
          </div>
        )}

        {networkStatus && pendingCount > 0 && (
          <div className="p-3 bg-blue-50 rounded-md">
            <div className="flex items-center gap-2 text-blue-700">
              <Upload className="h-4 w-4" />
              <span className="text-sm font-medium">
                {pendingCount} operations pending
              </span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Click "Sync" to upload your offline changes.
            </p>
          </div>
        )}

        {networkStatus && pendingCount === 0 && (
          <div className="p-3 bg-green-50 rounded-md">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">All data synchronized</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Your data is up to date with the server.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OfflineManager;
