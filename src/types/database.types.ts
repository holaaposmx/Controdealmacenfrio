export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      warehouse_locations: {
        Row: {
          id: string;
          location_code: string;
          location_type: "RACK" | "TARIMA" | "CHAMBER";
          zone: string;
          storage_type: "conservation" | "frozen";
          max_capacity: number;
          current_occupation: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          location_code: string;
          location_type: "RACK" | "TARIMA" | "CHAMBER";
          zone: string;
          storage_type: "conservation" | "frozen";
          max_capacity: number;
          current_occupation?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          location_code?: string;
          location_type?: "RACK" | "TARIMA" | "CHAMBER";
          zone?: string;
          storage_type?: "conservation" | "frozen";
          max_capacity?: number;
          current_occupation?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory_items: {
        Row: {
          id: string;
          product_id: string;
          product_name: string;
          category: string;
          quantity: number;
          location_id: string | null;
          lot_number: string | null;
          received_date: string;
          expiration_date: string | null;
          status:
            | "in-stock"
            | "low-stock"
            | "out-of-stock"
            | "expired"
            | "reserved";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          product_name: string;
          category: string;
          quantity?: number;
          location_id?: string | null;
          lot_number?: string | null;
          received_date: string;
          expiration_date?: string | null;
          status:
            | "in-stock"
            | "low-stock"
            | "out-of-stock"
            | "expired"
            | "reserved";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          product_name?: string;
          category?: string;
          quantity?: number;
          location_id?: string | null;
          lot_number?: string | null;
          received_date?: string;
          expiration_date?: string | null;
          status?:
            | "in-stock"
            | "low-stock"
            | "out-of-stock"
            | "expired"
            | "reserved";
          created_at?: string;
          updated_at?: string;
        };
      };
      temperature_logs: {
        Row: {
          id: string;
          storage_area: string;
          temperature: number;
          status: "normal" | "warning" | "critical";
          recorded_by: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          storage_area: string;
          temperature: number;
          status: "normal" | "warning" | "critical";
          recorded_by: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          storage_area?: string;
          temperature?: number;
          status?: "normal" | "warning" | "critical";
          recorded_by?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      quality_incidents: {
        Row: {
          id: string;
          incident_type: string;
          description: string;
          severity: "low" | "medium" | "high" | "critical";
          related_product_id: string | null;
          related_location_id: string | null;
          reported_by: string;
          status: "open" | "investigating" | "resolved" | "closed";
          resolution_notes: string | null;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          incident_type: string;
          description: string;
          severity: "low" | "medium" | "high" | "critical";
          related_product_id?: string | null;
          related_location_id?: string | null;
          reported_by: string;
          status: "open" | "investigating" | "resolved" | "closed";
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          incident_type?: string;
          description?: string;
          severity?: "low" | "medium" | "high" | "critical";
          related_product_id?: string | null;
          related_location_id?: string | null;
          reported_by?: string;
          status?: "open" | "investigating" | "resolved" | "closed";
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
      };
      inventory_movements: {
        Row: {
          id: string;
          inventory_item_id: string | null;
          movement_type:
            | "reception"
            | "dispatch"
            | "transfer"
            | "return"
            | "adjustment";
          from_location_id: string | null;
          to_location_id: string | null;
          quantity: number;
          performed_by: string;
          reference_code: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          inventory_item_id?: string | null;
          movement_type:
            | "reception"
            | "dispatch"
            | "transfer"
            | "return"
            | "adjustment";
          from_location_id?: string | null;
          to_location_id?: string | null;
          quantity: number;
          performed_by: string;
          reference_code?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          inventory_item_id?: string | null;
          movement_type?:
            | "reception"
            | "dispatch"
            | "transfer"
            | "return"
            | "adjustment";
          from_location_id?: string | null;
          to_location_id?: string | null;
          quantity?: number;
          performed_by?: string;
          reference_code?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer: string;
          status:
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "urgent";
          order_date: string;
          shipping_date: string | null;
          delivery_date: string | null;
          total_items: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer: string;
          status:
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "urgent";
          order_date: string;
          shipping_date?: string | null;
          delivery_date?: string | null;
          total_items?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer?: string;
          status?:
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "urgent";
          order_date?: string;
          shipping_date?: string | null;
          delivery_date?: string | null;
          total_items?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string | null;
          inventory_item_id: string | null;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          inventory_item_id?: string | null;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          inventory_item_id?: string | null;
          quantity?: number;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          audit_id: string;
          audit_date: string;
          auditor: string;
          findings: string | null;
          status: "passed" | "issues" | "failed";
          recommendations: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          audit_id: string;
          audit_date: string;
          auditor: string;
          findings?: string | null;
          status: "passed" | "issues" | "failed";
          recommendations?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          audit_id?: string;
          audit_date?: string;
          auditor?: string;
          findings?: string | null;
          status?: "passed" | "issues" | "failed";
          recommendations?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
