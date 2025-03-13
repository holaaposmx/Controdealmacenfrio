import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  createInventoryMovement,
  getInventoryItemById,
  updateInventoryItem,
} from "@/lib/db";
import { dispatchInventoryByFIFO } from "@/lib/fifo";
import type { Database } from "@/types/database.types";

// Types for the service
type Order = Database["public"]["Tables"]["orders"]["Row"];

type OrderWithItems = Order & {
  order_items: (Database["public"]["Tables"]["order_items"]["Row"] & {
    inventory_items: {
      product_name: string;
      product_id: string;
    } | null;
  })[];
};

// Service functions
export async function getAllOrders(): Promise<Order[]> {
  return await getOrders();
}

export async function getOrderDetails(id: string): Promise<OrderWithItems> {
  return await getOrderById(id);
}

export async function createNewOrder(order: {
  orderNumber: string;
  customer: string;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "urgent";
  orderDate: string;
  shippingDate?: string;
  deliveryDate?: string;
  totalItems: number;
  notes?: string;
}): Promise<Order> {
  return await createOrder({
    order_number: order.orderNumber,
    customer: order.customer,
    status: order.status,
    order_date: order.orderDate,
    shipping_date: order.shippingDate || null,
    delivery_date: order.deliveryDate || null,
    total_items: order.totalItems,
    notes: order.notes || null,
  });
}

export async function updateOrderStatus(
  id: string,
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "urgent",
  shippingDate?: string,
  deliveryDate?: string,
  notes?: string,
): Promise<Order> {
  const updates: Database["public"]["Tables"]["orders"]["Update"] = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (shippingDate) updates.shipping_date = shippingDate;
  if (deliveryDate) updates.delivery_date = deliveryDate;
  if (notes) updates.notes = notes;

  return await updateOrder(id, updates);
}

// Process an order for shipping using FIFO principle
export async function processOrderForShipping(
  orderId: string,
  processedBy: string,
): Promise<void> {
  // Get the order with items
  const order = await getOrderById(orderId);

  if (!order.order_items || order.order_items.length === 0) {
    throw new Error("Order has no items to process");
  }

  // Process each item in the order
  for (const item of order.order_items) {
    if (!item.inventory_item_id) continue;

    // Get the inventory item to get the product ID
    const inventoryItem = await getInventoryItemById(item.inventory_item_id);

    try {
      // Use FIFO to dispatch inventory
      const dispatchedItems = await dispatchInventoryByFIFO(
        inventoryItem.product_id,
        item.quantity,
      );

      // Record movements for each dispatched item
      for (const dispatched of dispatchedItems) {
        if (!dispatched.item.location_id) {
          throw new Error(
            `Item ${dispatched.item.product_id} has no location assigned`,
          );
        }

        // Record the movement
        await createInventoryMovement({
          inventory_item_id: dispatched.item.id,
          movement_type: "dispatch",
          from_location_id: dispatched.item.location_id,
          quantity: dispatched.quantityTaken,
          performed_by: processedBy,
          reference_code: order.order_number,
          notes: `Dispatched for order ${order.order_number} (FIFO)`,
        });
      }
    } catch (error) {
      throw new Error(
        `Failed to process item ${inventoryItem.product_id}: ${error.message}`,
      );
    }
  }

  // Update the order status
  await updateOrder(orderId, {
    status: "shipped",
    shipping_date: new Date().toISOString().split("T")[0],
    updated_at: new Date().toISOString(),
  });
}

// Process a return
export async function processReturn(
  orderId: string,
  returnedItems: Array<{
    inventoryItemId: string;
    quantity: number;
    reason: string;
  }>,
  processedBy: string,
): Promise<void> {
  // Get the order
  const order = await getOrderById(orderId);

  // Process each returned item
  for (const item of returnedItems) {
    // Get the inventory item
    const inventoryItem = await getInventoryItemById(item.inventoryItemId);

    if (!inventoryItem.location_id) {
      throw new Error(
        `Item ${inventoryItem.product_id} has no location assigned`,
      );
    }

    // Record the return movement
    await createInventoryMovement({
      inventory_item_id: item.inventoryItemId,
      movement_type: "return",
      to_location_id: inventoryItem.location_id,
      quantity: item.quantity,
      performed_by: processedBy,
      reference_code: order.order_number,
      notes: `Return from order ${order.order_number}: ${item.reason}`,
    });

    // Update the inventory item
    const newQuantity = inventoryItem.quantity + item.quantity;
    const newStatus =
      newQuantity <= 0
        ? "out-of-stock"
        : newQuantity < 10
          ? "low-stock"
          : "in-stock";

    await updateInventoryItem(item.inventoryItemId, {
      quantity: newQuantity,
      status: newStatus,
      updated_at: new Date().toISOString(),
    });
  }

  // Add a note to the order about the return
  const returnNote = `Return processed on ${new Date().toISOString().split("T")[0]} by ${processedBy}`;
  const updatedNotes = order.notes
    ? `${order.notes}\n${returnNote}`
    : returnNote;

  await updateOrder(orderId, {
    notes: updatedNotes,
    updated_at: new Date().toISOString(),
  });
}
