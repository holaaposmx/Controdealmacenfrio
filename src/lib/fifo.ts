import {
  getInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
} from "./db";
import { supabase } from "./supabase";
import type { Database } from "@/types/database.types";

type InventoryItem = Database["public"]["Tables"]["inventory_items"]["Row"];

/**
 * Sorts inventory items by expiration date (oldest first) to implement FIFO
 * @param items Array of inventory items to sort
 * @returns Sorted array with oldest expiration dates first
 */
export function sortByFIFO(items: InventoryItem[]): InventoryItem[] {
  return [...items].sort((a, b) => {
    // Items with no expiration date go last
    if (!a.expiration_date && !b.expiration_date) return 0;
    if (!a.expiration_date) return 1;
    if (!b.expiration_date) return -1;

    // Sort by expiration date (oldest first)
    return (
      new Date(a.expiration_date).getTime() -
      new Date(b.expiration_date).getTime()
    );
  });
}

/**
 * Gets inventory items for a specific product sorted by FIFO principle
 * @param productId The product ID to get inventory for
 * @returns Array of inventory items sorted by expiration date (oldest first)
 */
export async function getFIFOInventoryForProduct(
  productId: string,
): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("product_id", productId)
    .gt("quantity", 0);

  if (error) throw error;
  if (!data) return [];

  return sortByFIFO(data);
}

/**
 * Identifies items that should be dispatched next based on FIFO principle
 * @param category Optional category to filter by
 * @param limit Number of items to return
 * @returns Array of inventory items that should be dispatched next
 */
export async function getNextItemsToDispatch(
  category?: string,
  limit = 10,
): Promise<InventoryItem[]> {
  const items = await getInventoryItems();

  // Filter by category if provided
  const filteredItems = category
    ? items.filter((item) => item.category === category && item.quantity > 0)
    : items.filter((item) => item.quantity > 0);

  // Sort by FIFO principle
  const sortedItems = sortByFIFO(filteredItems);

  // Return the specified number of items
  return sortedItems.slice(0, limit);
}

/**
 * Dispatches inventory following FIFO principle
 * @param productId Product ID to dispatch
 * @param quantityNeeded Total quantity needed
 * @returns Array of inventory items used for dispatch with quantities
 */
export async function dispatchInventoryByFIFO(
  productId: string,
  quantityNeeded: number,
): Promise<{ item: InventoryItem; quantityTaken: number }[]> {
  // Get all inventory items for this product sorted by FIFO
  const fifoItems = await getFIFOInventoryForProduct(productId);

  if (fifoItems.length === 0) {
    throw new Error(`No inventory found for product ${productId}`);
  }

  // Calculate total available quantity
  const totalAvailable = fifoItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  if (totalAvailable < quantityNeeded) {
    throw new Error(
      `Insufficient inventory for product ${productId}. Requested: ${quantityNeeded}, Available: ${totalAvailable}`,
    );
  }

  const result: { item: InventoryItem; quantityTaken: number }[] = [];
  let remainingNeeded = quantityNeeded;

  // Take from each item following FIFO order until we have enough
  for (const item of fifoItems) {
    if (remainingNeeded <= 0) break;

    const quantityToTake = Math.min(item.quantity, remainingNeeded);
    remainingNeeded -= quantityToTake;

    // Update the inventory item
    const newQuantity = item.quantity - quantityToTake;
    const newStatus =
      newQuantity <= 0
        ? "out-of-stock"
        : newQuantity < 10
          ? "low-stock"
          : "in-stock";

    await updateInventoryItem(item.id, {
      quantity: newQuantity,
      status: newStatus,
      updated_at: new Date().toISOString(),
    });

    // Add to result
    result.push({
      item,
      quantityTaken: quantityToTake,
    });
  }

  return result;
}

/**
 * Checks for items that are about to expire and should be prioritized
 * @param daysThreshold Number of days to consider as "about to expire"
 * @returns Array of inventory items that are about to expire
 */
export async function getExpiringItems(
  daysThreshold = 7,
): Promise<InventoryItem[]> {
  const items = await getInventoryItems();
  const today = new Date();
  const thresholdDate = new Date(today);
  thresholdDate.setDate(today.getDate() + daysThreshold);

  return items
    .filter((item) => {
      if (!item.expiration_date || item.quantity <= 0) return false;

      const expirationDate = new Date(item.expiration_date);
      return expirationDate <= thresholdDate && expirationDate >= today;
    })
    .sort((a, b) => {
      // Sort by expiration date (closest first)
      return (
        new Date(a.expiration_date!).getTime() -
        new Date(b.expiration_date!).getTime()
      );
    });
}

/**
 * Calculates FIFO metrics for inventory management
 * @returns Object with FIFO metrics
 */
export async function calculateFIFOMetrics() {
  const items = await getInventoryItems();
  const today = new Date();

  // Count items by expiration status
  const expiringIn7Days = items.filter((item) => {
    if (!item.expiration_date || item.quantity <= 0) return false;

    const expirationDate = new Date(item.expiration_date);
    const daysUntilExpiration = Math.ceil(
      (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiration <= 7 && daysUntilExpiration > 0;
  }).length;

  const expiringIn14Days = items.filter((item) => {
    if (!item.expiration_date || item.quantity <= 0) return false;

    const expirationDate = new Date(item.expiration_date);
    const daysUntilExpiration = Math.ceil(
      (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiration <= 14 && daysUntilExpiration > 7;
  }).length;

  const expired = items.filter((item) => {
    if (!item.expiration_date || item.quantity <= 0) return false;

    const expirationDate = new Date(item.expiration_date);
    return expirationDate < today;
  }).length;

  // Calculate FIFO compliance percentage
  // This is a simplified metric - in a real system you might want to track
  // if dispatches actually followed FIFO order
  const totalWithExpiration = items.filter(
    (item) => item.expiration_date && item.quantity > 0,
  ).length;
  const fifoCompliancePercentage =
    totalWithExpiration > 0
      ? ((totalWithExpiration - expired) / totalWithExpiration) * 100
      : 100;

  return {
    expiringIn7Days,
    expiringIn14Days,
    expired,
    fifoCompliancePercentage: Math.round(fifoCompliancePercentage),
  };
}
