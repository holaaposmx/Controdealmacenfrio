import {
  getInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  getWarehouseLocations,
  createInventoryMovement,
} from "@/lib/db";
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
  const items = await getInventoryItems();
  return sortByFifo ? sortByFIFO(items) : items;
}

export async function getItemById(id: string): Promise<InventoryItem> {
  return await getInventoryItemById(id);
}

export async function getAllLocations(): Promise<WarehouseLocation[]> {
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
  const newItem = await createInventoryItem({
    product_id: item.productId,
    product_name: item.productName,
    category: item.category,
    quantity: item.quantity,
    location_id: item.locationId || null,
    lot_number: item.lotNumber || null,
    received_date: item.receivedDate,
    expiration_date: item.expirationDate || null,
    status: item.status,
  });

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

  return (await updateInventoryItem(id, dbUpdates)) as InventoryItem;
}

export async function recordInventoryMovement(
  movement: InventoryMovement,
): Promise<void> {
  await createInventoryMovement({
    inventory_item_id: movement.inventoryItemId,
    movement_type: movement.movementType,
    from_location_id: movement.fromLocationId || null,
    to_location_id: movement.toLocationId || null,
    quantity: movement.quantity,
    performed_by: movement.performedBy,
    reference_code: movement.referenceCode || null,
    notes: movement.notes || null,
  });

  // Update the inventory item quantity based on the movement type
  const item = await getInventoryItemById(movement.inventoryItemId);
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

  // Update the item
  await updateInventoryItem(item.id, {
    quantity: newQuantity,
    location_id: newLocationId,
    status: newStatus,
    updated_at: new Date().toISOString(),
  });
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
