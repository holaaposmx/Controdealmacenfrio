import {
  getInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  getWarehouseLocations,
  createInventoryMovement,
} from "@/lib/db";
import {
  isOnline,
  saveOfflineOperation,
  getOfflineDataByKey,
} from "@/lib/offlineStorage";
import { sortByFIFO, getExpiringItems } from "@/lib/fifo";
import type { Database } from "@/types/database.types";

// Types for the service
type InventoryItem = Database["public"]["Tables"]["inventory_items"]["Row"] & {
  warehouse_locations: {
    location_code: string;
    storage_type: "conservation" | "frozen";
  } | null;
};

type WarehouseLocation =
  Database["public"]["Tables"]["warehouse_locations"]["Row"];

type InventoryMovement = {
  inventoryItemId: string;
  movementType: "reception" | "dispatch" | "transfer" | "return" | "adjustment";
  fromLocationId?: string;
  toLocationId?: string;
  quantity: number;
  performedBy: string;
  referenceCode?: string;
  notes?: string;
};

// Service functions
export async function getAllInventoryItems(
  sortByFifo = false,
): Promise<InventoryItem[]> {
  // Check if we're online
  if (!isOnline()) {
    // Use cached data when offline
    const cachedItems = getOfflineDataByKey("inventory_items");
    if (cachedItems) {
      return sortByFifo ? sortByFIFO(cachedItems) : cachedItems;
    }
    // If no cached data, return empty array
    return [];
  }

  // Online flow
  const items = await getInventoryItems();
  return sortByFifo ? sortByFIFO(items) : items;
}

export async function getItemById(id: string): Promise<InventoryItem> {
  return await getInventoryItemById(id);
}

export async function getAllLocations(): Promise<WarehouseLocation[]> {
  // Check if we're online
  if (!isOnline()) {
    // Use cached data when offline
    const cachedLocations = getOfflineDataByKey("warehouse_locations");
    if (cachedLocations) {
      return cachedLocations;
    }
    // If no cached data, return empty array
    return [];
  }

  // Online flow
  return await getWarehouseLocations();
}

export async function addInventoryItem(item: {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  locationId?: string;
  lotNumber?: string;
  receivedDate: string;
  expirationDate?: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "expired" | "reserved";
}): Promise<InventoryItem> {
  const dbItem = {
    product_id: item.productId,
    product_name: item.productName,
    category: item.category,
    quantity: item.quantity,
    location_id: item.locationId || null,
    lot_number: item.lotNumber || null,
    received_date: item.receivedDate,
    expiration_date: item.expirationDate || null,
    status: item.status,
  };

  // Check if we're online
  if (!isOnline()) {
    // Store operation for later sync
    const operationId = saveOfflineOperation("inventory_add", dbItem);

    // Create a mock item with a temporary ID for the UI
    const mockItem: any = {
      ...dbItem,
      id: `temp_${operationId}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      warehouse_locations: item.locationId
        ? {
            location_code: item.locationId,
            storage_type: "conservation", // Default assumption
          }
        : null,
    };

    // If we're adding inventory, record the movement for later sync
    if (item.locationId && item.quantity > 0) {
      const movementData = {
        inventory_item_id: mockItem.id,
        movement_type: "reception",
        to_location_id: item.locationId,
        quantity: item.quantity,
        performed_by: "System", // This should be the actual user in a real app
        reference_code: item.lotNumber || null,
        notes: "Initial inventory reception (offline)",
      };

      saveOfflineOperation("movement_add", movementData);
    }

    return mockItem as InventoryItem;
  }

  // Online flow
  const newItem = await createInventoryItem(dbItem);

  // If we're adding inventory, record the movement
  if (item.locationId && item.quantity > 0) {
    await createInventoryMovement({
      inventory_item_id: newItem.id,
      movement_type: "reception",
      to_location_id: item.locationId,
      quantity: item.quantity,
      performed_by: "System", // This should be the actual user in a real app
      reference_code: item.lotNumber || null,
      notes: "Initial inventory reception",
    });
  }

  return newItem as InventoryItem;
}

export async function updateItem(
  id: string,
  updates: Partial<{
    productId: string;
    productName: string;
    category: string;
    quantity: number;
    locationId: string | null;
    lotNumber: string | null;
    receivedDate: string;
    expirationDate: string | null;
    status: "in-stock" | "low-stock" | "out-of-stock" | "expired" | "reserved";
  }>,
): Promise<InventoryItem> {
  // Convert to database format
  const dbUpdates: Database["public"]["Tables"]["inventory_items"]["Update"] =
    {};

  if (updates.productId !== undefined) dbUpdates.product_id = updates.productId;
  if (updates.productName !== undefined)
    dbUpdates.product_name = updates.productName;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
  if (updates.locationId !== undefined)
    dbUpdates.location_id = updates.locationId;
  if (updates.lotNumber !== undefined) dbUpdates.lot_number = updates.lotNumber;
  if (updates.receivedDate !== undefined)
    dbUpdates.received_date = updates.receivedDate;
  if (updates.expirationDate !== undefined)
    dbUpdates.expiration_date = updates.expirationDate;
  if (updates.status !== undefined) dbUpdates.status = updates.status;

  // Check if we're online
  if (!isOnline()) {
    // Store operation for later sync
    saveOfflineOperation("inventory_update", { id, updates: dbUpdates });

    // Return a mock updated item for the UI
    // In a real app, you would need to find the item in local storage and update it
    const cachedItems = getOfflineDataByKey("inventory_items") || [];
    const itemIndex = cachedItems.findIndex((item: any) => item.id === id);

    if (itemIndex >= 0) {
      const updatedItem = { ...cachedItems[itemIndex] };

      // Apply updates to the cached item
      Object.keys(dbUpdates).forEach((key) => {
        (updatedItem as any)[key] = (dbUpdates as any)[key];
      });

      updatedItem.updated_at = new Date().toISOString();

      // Update the item in the cached array
      cachedItems[itemIndex] = updatedItem;

      // Save the updated array back to offline storage
      saveOfflineOperation("_update_cache", {
        key: "inventory_items",
        data: cachedItems,
      });

      return updatedItem as InventoryItem;
    }

    // If item not found in cache, return a mock item
    return {
      id,
      ...dbUpdates,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;
  }

  // Online flow
  return (await updateInventoryItem(id, dbUpdates)) as InventoryItem;
}

export async function recordInventoryMovement(
  movement: InventoryMovement,
): Promise<void> {
  const movementData = {
    inventory_item_id: movement.inventoryItemId,
    movement_type: movement.movementType,
    from_location_id: movement.fromLocationId || null,
    to_location_id: movement.toLocationId || null,
    quantity: movement.quantity,
    performed_by: movement.performedBy,
    reference_code: movement.referenceCode || null,
    notes: movement.notes || null,
  };

  // Calculate new quantity and location based on movement type
  const calculateUpdates = async (item: any) => {
    let newQuantity = item.quantity;
    let newLocationId = item.location_id;

    switch (movement.movementType) {
      case "reception":
        newQuantity += movement.quantity;
        newLocationId = movement.toLocationId || item.location_id;
        break;
      case "dispatch":
        newQuantity -= movement.quantity;
        break;
      case "transfer":
        newLocationId = movement.toLocationId || item.location_id;
        break;
      case "return":
        newQuantity += movement.quantity;
        break;
      case "adjustment":
        newQuantity = movement.quantity; // Direct set for adjustments
        break;
    }

    // Update the status based on the new quantity
    let newStatus = item.status;
    if (newQuantity <= 0) {
      newStatus = "out-of-stock";
    } else if (newQuantity < 10) {
      // This threshold should be configurable
      newStatus = "low-stock";
    } else {
      newStatus = "in-stock";
    }

    return {
      quantity: newQuantity,
      location_id: newLocationId,
      status: newStatus,
      updated_at: new Date().toISOString(),
    };
  };

  // Check if we're online
  if (!isOnline()) {
    // Store movement operation for later sync
    saveOfflineOperation("movement_add", movementData);

    // Get item from cache or create a mock one
    const cachedItems = getOfflineDataByKey("inventory_items") || [];
    const item = cachedItems.find(
      (i: any) => i.id === movement.inventoryItemId,
    ) || {
      id: movement.inventoryItemId,
      quantity: 0,
      location_id: movement.fromLocationId || movement.toLocationId,
      status: "in-stock",
    };

    // Calculate updates
    const updates = await calculateUpdates(item);

    // Store inventory update operation for later sync
    saveOfflineOperation("inventory_update", {
      id: movement.inventoryItemId,
      updates,
    });

    // Update the cached item if it exists
    if (cachedItems.length > 0) {
      const itemIndex = cachedItems.findIndex(
        (i: any) => i.id === movement.inventoryItemId,
      );
      if (itemIndex >= 0) {
        cachedItems[itemIndex] = { ...cachedItems[itemIndex], ...updates };
        // Update the cache
        saveOfflineOperation("_update_cache", {
          key: "inventory_items",
          data: cachedItems,
        });
      }
    }

    return;
  }

  // Online flow
  await createInventoryMovement(movementData);

  // Update the inventory item quantity based on the movement type
  const item = await getInventoryItemById(movement.inventoryItemId);
  const updates = await calculateUpdates(item);

  // Update the item
  await updateInventoryItem(item.id, updates);
}

// Get items that are expiring soon for FIFO management
export async function getItemsExpiringSoon(
  daysThreshold = 7,
): Promise<InventoryItem[]> {
  return await getExpiringItems(daysThreshold);
}

// Get inventory items sorted by FIFO principle (oldest expiration first)
export async function getInventoryItemsByFIFO(): Promise<InventoryItem[]> {
  const items = await getInventoryItems();
  return sortByFIFO(items);
}
