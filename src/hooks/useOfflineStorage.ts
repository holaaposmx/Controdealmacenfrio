import { useState, useEffect } from "react";
import {
  saveOfflineOperation,
  getOfflineDataByKey,
  isOnline,
  syncOfflineOperations,
} from "@/lib/offlineStorage";

/**
 * Hook for handling offline operations in components
 */
export function useOfflineStorage() {
  const [networkStatus, setNetworkStatus] = useState(isOnline());
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      const online = isOnline();
      setNetworkStatus(online);

      // Try to sync when coming back online
      if (online) {
        syncOfflineOperations();
      }
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  /**
   * Save an operation to be processed when online
   */
  const saveOperation = (type: string, data: any) => {
    const operationId = saveOfflineOperation(type as any, data);
    setPendingCount((prev) => prev + 1);
    return operationId;
  };

  /**
   * Get cached data for offline use
   */
  const getCachedData = (key: string) => {
    return getOfflineDataByKey(key);
  };

  /**
   * Sync pending operations with the server
   */
  const syncOperations = async () => {
    if (isOnline()) {
      await syncOfflineOperations();
      setPendingCount(0);
    }
  };

  return {
    isOnline: networkStatus,
    pendingCount,
    saveOperation,
    getCachedData,
    syncOperations,
  };
}
