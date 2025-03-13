import { supabase } from "./supabase";

// Define types for offline operations
type OperationType =
  | "inventory_add"
  | "inventory_update"
  | "movement_add"
  | "temperature_log"
  | "quality_incident"
  | "barcode_scan";

interface OfflineOperation {
  id: string;
  type: OperationType;
  data: any;
  timestamp: number;
  synced: boolean;
}

// Storage keys
const OFFLINE_OPERATIONS_KEY = "warehouse_offline_operations";
const OFFLINE_DATA_KEY = "warehouse_offline_data";
const NETWORK_STATUS_KEY = "warehouse_network_status";

/**
 * Check if the device is online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Save operation to be processed when online
 */
export const saveOfflineOperation = (
  type: OperationType,
  data: any,
): string => {
  const operations = getOfflineOperations();

  const id = generateId();
  const operation: OfflineOperation = {
    id,
    type,
    data,
    timestamp: Date.now(),
    synced: false,
  };

  operations.push(operation);
  localStorage.setItem(OFFLINE_OPERATIONS_KEY, JSON.stringify(operations));

  return id;
};

/**
 * Get all pending offline operations
 */
export const getOfflineOperations = (): OfflineOperation[] => {
  const operations = localStorage.getItem(OFFLINE_OPERATIONS_KEY);
  return operations ? JSON.parse(operations) : [];
};

/**
 * Mark operation as synced
 */
export const markOperationAsSynced = (id: string): void => {
  const operations = getOfflineOperations();
  const updatedOperations = operations.map((op) =>
    op.id === id ? { ...op, synced: true } : op,
  );

  localStorage.setItem(
    OFFLINE_OPERATIONS_KEY,
    JSON.stringify(updatedOperations),
  );
};

/**
 * Remove synced operations
 */
export const cleanSyncedOperations = (): void => {
  const operations = getOfflineOperations();
  const pendingOperations = operations.filter((op) => !op.synced);

  localStorage.setItem(
    OFFLINE_OPERATIONS_KEY,
    JSON.stringify(pendingOperations),
  );
};

/**
 * Save data for offline use
 */
export const saveOfflineData = (key: string, data: any): void => {
  const offlineData = getOfflineData();
  offlineData[key] = {
    data,
    timestamp: Date.now(),
  };

  localStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(offlineData));
};

/**
 * Get offline data
 */
export const getOfflineData = (): Record<
  string,
  { data: any; timestamp: number }
> => {
  const data = localStorage.getItem(OFFLINE_DATA_KEY);
  return data ? JSON.parse(data) : {};
};

/**
 * Get specific offline data by key
 */
export const getOfflineDataByKey = (key: string): any => {
  const offlineData = getOfflineData();
  return offlineData[key]?.data || null;
};

/**
 * Clear all offline data
 */
export const clearOfflineData = (): void => {
  localStorage.removeItem(OFFLINE_DATA_KEY);
  localStorage.removeItem(OFFLINE_OPERATIONS_KEY);
};

/**
 * Generate a unique ID for operations
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Set network status
 */
export const setNetworkStatus = (online: boolean): void => {
  localStorage.setItem(
    NETWORK_STATUS_KEY,
    JSON.stringify({ online, lastUpdated: Date.now() }),
  );
};

/**
 * Get network status
 */
export const getNetworkStatus = (): {
  online: boolean;
  lastUpdated: number;
} => {
  const status = localStorage.getItem(NETWORK_STATUS_KEY);
  return status
    ? JSON.parse(status)
    : { online: navigator.onLine, lastUpdated: Date.now() };
};

/**
 * Initialize network status listeners
 */
export const initNetworkListeners = (): void => {
  window.addEventListener("online", () => {
    setNetworkStatus(true);
    syncOfflineOperations();
  });

  window.addEventListener("offline", () => {
    setNetworkStatus(false);
  });

  // Set initial status
  setNetworkStatus(navigator.onLine);
};

/**
 * Sync offline operations when back online
 */
export const syncOfflineOperations = async (): Promise<void> => {
  if (!navigator.onLine) return;

  const operations = getOfflineOperations().filter((op) => !op.synced);

  for (const operation of operations) {
    try {
      await processOperation(operation);
      markOperationAsSynced(operation.id);
    } catch (error) {
      console.error(`Failed to sync operation ${operation.id}:`, error);
    }
  }

  cleanSyncedOperations();
};

/**
 * Process a single operation
 */
const processOperation = async (operation: OfflineOperation): Promise<void> => {
  switch (operation.type) {
    case "inventory_add":
      await supabase.from("inventory_items").insert(operation.data);
      break;

    case "inventory_update":
      await supabase
        .from("inventory_items")
        .update(operation.data.updates)
        .eq("id", operation.data.id);
      break;

    case "movement_add":
      await supabase.from("inventory_movements").insert(operation.data);
      break;

    case "temperature_log":
      await supabase.from("temperature_logs").insert(operation.data);
      break;

    case "quality_incident":
      await supabase.from("quality_incidents").insert(operation.data);
      break;

    default:
      console.warn(`Unknown operation type: ${operation.type}`);
  }
};

/**
 * Cache essential data for offline use
 */
export const cacheEssentialData = async (): Promise<void> => {
  try {
    // Cache warehouse locations
    const { data: locations } = await supabase
      .from("warehouse_locations")
      .select("*")
      .order("location_code");

    if (locations) {
      saveOfflineData("warehouse_locations", locations);
    }

    // Cache inventory items
    const { data: inventory } = await supabase
      .from("inventory_items")
      .select("*, warehouse_locations(location_code, storage_type)")
      .order("product_name");

    if (inventory) {
      saveOfflineData("inventory_items", inventory);
    }

    // Cache pending orders
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .in("status", ["pending", "processing", "urgent"])
      .order("created_at", { ascending: false });

    if (orders) {
      saveOfflineData("pending_orders", orders);
    }
  } catch (error) {
    console.error("Failed to cache essential data:", error);
  }
};
