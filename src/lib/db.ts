import { supabase } from "./supabase";
import type { Database } from "@/types/database.types";

// Warehouse Locations
export async function getWarehouseLocations() {
  const { data, error } = await supabase
    .from("warehouse_locations")
    .select("*")
    .order("location_code");

  if (error) throw error;
  return data;
}

export async function getWarehouseLocationByCode(locationCode: string) {
  const { data, error } = await supabase
    .from("warehouse_locations")
    .select("*")
    .eq("location_code", locationCode)
    .single();

  if (error) throw error;
  return data;
}

export async function createWarehouseLocation(
  location: Database["public"]["Tables"]["warehouse_locations"]["Insert"],
) {
  const { data, error } = await supabase
    .from("warehouse_locations")
    .insert(location)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateWarehouseLocation(
  id: string,
  updates: Database["public"]["Tables"]["warehouse_locations"]["Update"],
) {
  const { data, error } = await supabase
    .from("warehouse_locations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Inventory Items
export async function getInventoryItems() {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*, warehouse_locations(location_code, storage_type)")
    .order("product_name");

  if (error) throw error;
  return data;
}

export async function getInventoryItemById(id: string) {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*, warehouse_locations(location_code, storage_type)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getInventoryItemByProductId(productId: string) {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*, warehouse_locations(location_code, storage_type)")
    .eq("product_id", productId)
    .single();

  if (error) throw error;
  return data;
}

export async function createInventoryItem(
  item: Database["public"]["Tables"]["inventory_items"]["Insert"],
) {
  const { data, error } = await supabase
    .from("inventory_items")
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateInventoryItem(
  id: string,
  updates: Database["public"]["Tables"]["inventory_items"]["Update"],
) {
  const { data, error } = await supabase
    .from("inventory_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Temperature Logs
export async function getTemperatureLogs() {
  const { data, error } = await supabase
    .from("temperature_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTemperatureLog(
  log: Database["public"]["Tables"]["temperature_logs"]["Insert"],
) {
  const { data, error } = await supabase
    .from("temperature_logs")
    .insert(log)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Quality Incidents
export async function getQualityIncidents() {
  const { data, error } = await supabase
    .from("quality_incidents")
    .select(
      "*, inventory_items(product_name), warehouse_locations(location_code)",
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getQualityIncidentById(id: string) {
  const { data, error } = await supabase
    .from("quality_incidents")
    .select(
      "*, inventory_items(product_name), warehouse_locations(location_code)",
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createQualityIncident(
  incident: Database["public"]["Tables"]["quality_incidents"]["Insert"],
) {
  const { data, error } = await supabase
    .from("quality_incidents")
    .insert(incident)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateQualityIncident(
  id: string,
  updates: Database["public"]["Tables"]["quality_incidents"]["Update"],
) {
  const { data, error } = await supabase
    .from("quality_incidents")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Inventory Movements
export async function createInventoryMovement(
  movement: Database["public"]["Tables"]["inventory_movements"]["Insert"],
) {
  const { data, error } = await supabase
    .from("inventory_movements")
    .insert(movement)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getInventoryMovements() {
  const { data, error } = await supabase
    .from("inventory_movements")
    .select(
      "*, inventory_items(product_name), from_location:warehouse_locations!from_location_id(location_code), to_location:warehouse_locations!to_location_id(location_code)",
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Orders
export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, inventory_items(product_name, product_id))")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createOrder(
  order: Database["public"]["Tables"]["orders"]["Insert"],
) {
  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrder(
  id: string,
  updates: Database["public"]["Tables"]["orders"]["Update"],
) {
  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Audit Logs
export async function getAuditLogs() {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("audit_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createAuditLog(
  log: Database["public"]["Tables"]["audit_logs"]["Insert"],
) {
  const { data, error } = await supabase
    .from("audit_logs")
    .insert(log)
    .select()
    .single();

  if (error) throw error;
  return data;
}
