import {
  getTemperatureLogs,
  createTemperatureLog,
  getQualityIncidents,
  getQualityIncidentById,
  createQualityIncident,
  updateQualityIncident,
} from "@/lib/db";
import type { Database } from "@/types/database.types";

// Types for the service
type TemperatureLog = Database["public"]["Tables"]["temperature_logs"]["Row"];

type QualityIncident =
  Database["public"]["Tables"]["quality_incidents"]["Row"] & {
    inventory_items?: {
      product_name: string;
    } | null;
    warehouse_locations?: {
      location_code: string;
    } | null;
  };

// Service functions
export async function getAllTemperatureLogs(): Promise<TemperatureLog[]> {
  return await getTemperatureLogs();
}

export async function recordTemperature(log: {
  storageArea: string;
  temperature: number;
  status: "normal" | "warning" | "critical";
  recordedBy: string;
  notes?: string;
}): Promise<TemperatureLog> {
  return await createTemperatureLog({
    storage_area: log.storageArea,
    temperature: log.temperature,
    status: log.status,
    recorded_by: log.recordedBy,
    notes: log.notes || null,
  });
}

export async function getAllQualityIncidents(): Promise<QualityIncident[]> {
  return await getQualityIncidents();
}

export async function getIncidentById(id: string): Promise<QualityIncident> {
  return await getQualityIncidentById(id);
}

export async function reportQualityIncident(incident: {
  incidentType: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  relatedProductId?: string;
  relatedLocationId?: string;
  reportedBy: string;
  notes?: string;
}): Promise<QualityIncident> {
  return await createQualityIncident({
    incident_type: incident.incidentType,
    description: incident.description,
    severity: incident.severity,
    related_product_id: incident.relatedProductId || null,
    related_location_id: incident.relatedLocationId || null,
    reported_by: incident.reportedBy,
    status: "open",
    resolution_notes: incident.notes || null,
  });
}

export async function updateIncidentStatus(
  id: string,
  status: "open" | "investigating" | "resolved" | "closed",
  resolutionNotes?: string,
): Promise<QualityIncident> {
  const updates: Database["public"]["Tables"]["quality_incidents"]["Update"] = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (resolutionNotes) {
    updates.resolution_notes = resolutionNotes;
  }

  if (status === "resolved" || status === "closed") {
    updates.resolved_at = new Date().toISOString();
  }

  return await updateQualityIncident(id, updates);
}

// Helper function to determine temperature status
export function determineTemperatureStatus(
  temperature: number,
  storageType: "conservation" | "frozen",
): "normal" | "warning" | "critical" {
  if (storageType === "conservation") {
    if (temperature >= 0 && temperature <= 4) return "normal";
    if (
      (temperature > 4 && temperature <= 6) ||
      (temperature < 0 && temperature >= -2)
    )
      return "warning";
    return "critical";
  } else {
    // frozen
    if (temperature <= -18) return "normal";
    if (temperature > -18 && temperature <= -15) return "warning";
    return "critical";
  }
}
