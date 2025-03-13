# Warehouse Management System

## Database Schema

This project uses Supabase as the backend database. The schema includes the following tables:

### warehouse_locations
- Stores information about physical locations in the warehouse
- Includes location code, type (RACK, TARIMA, CHAMBER), zone, storage type, and capacity information

### inventory_items
- Stores product inventory information
- Tracks product details, quantity, location, lot number, and expiration dates

### temperature_logs
- Records temperature readings for storage areas
- Includes status indicators for normal, warning, or critical temperatures

### quality_incidents
- Tracks quality issues and incidents
- Links to related products and locations
- Maintains status and resolution information

### inventory_movements
- Records all inventory movements (reception, dispatch, transfer, return, adjustment)
- Maintains FIFO tracking and movement history

### orders
- Stores order information
- Tracks status from pending through delivery

### order_items
- Links orders to inventory items
- Records quantities for each item in an order

### audit_logs
- Records warehouse audits
- Tracks findings, status, and recommendations

## Setting Up the Database

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key from the API settings
3. Set the following environment variables in your project:
   - VITE_SUPABASE_URL=your_project_url
   - VITE_SUPABASE_ANON_KEY=your_anon_key
4. Run the SQL in `src/db/schema.sql` in the Supabase SQL Editor to create the database schema

## API Services

The application includes several service modules for interacting with the database:

- `InventoryService` - Manages inventory items and movements
- `QualityService` - Handles temperature logs and quality incidents
- `LogisticsService` - Processes orders, shipments, and returns

## Type Definitions

Type definitions for the database schema are available in `src/types/database.types.ts`.

## Database Functions

Common database operations are abstracted in `src/lib/db.ts`, providing functions for:

- Getting, creating, and updating warehouse locations
- Managing inventory items
- Recording temperature logs
- Tracking quality incidents
- Processing inventory movements
- Managing orders and returns
- Recording audit logs
