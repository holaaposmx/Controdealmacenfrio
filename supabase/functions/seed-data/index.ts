// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/getting_started/javascript_typescript

// This edge function seeds the database with sample data

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.6'

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    } })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the request body
    const { action } = await req.json()

    let result = {}

    // Seed the database with sample data
    if (action === 'seed_inventory') {
      result = await seedInventory(supabaseClient)
    } else if (action === 'seed_temperature_logs') {
      result = await seedTemperatureLogs(supabaseClient)
    } else if (action === 'seed_quality_incidents') {
      result = await seedQualityIncidents(supabaseClient)
    } else if (action === 'seed_orders') {
      result = await seedOrders(supabaseClient)
    } else if (action === 'seed_all') {
      // Seed all data
      const inventoryResult = await seedInventory(supabaseClient)
      const temperatureResult = await seedTemperatureLogs(supabaseClient)
      const qualityResult = await seedQualityIncidents(supabaseClient)
      const ordersResult = await seedOrders(supabaseClient)

      result = {
        inventory: inventoryResult,
        temperature: temperatureResult,
        quality: qualityResult,
        orders: ordersResult,
      }
    } else {
      throw new Error('Invalid action')
    }

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
      status: 400,
    })
  }
})

// Function to seed inventory items
async function seedInventory(supabase: any) {
  // Get warehouse locations
  const { data: locations, error: locationsError } = await supabase
    .from('warehouse_locations')
    .select('id, location_code, storage_type')

  if (locationsError) {
    throw locationsError
  }

  // Sample inventory items
  const inventoryItems = [
    {
      product_id: 'PROD-12345',
      product_name: 'Beef Quarters',
      category: 'Meat',
      quantity: 120,
      location_id: locations.find((loc: any) => loc.location_code === 'RACK-A1')?.id,
      lot_number: 'LOT-2023-06-15',
      received_date: '2023-06-15',
      expiration_date: '2023-07-15',
      status: 'in-stock',
    },
    {
      product_id: 'PROD-12346',
      product_name: 'Chicken Breasts',
      category: 'Poultry',
      quantity: 250,
      location_id: locations.find((loc: any) => loc.location_code === 'RACK-B3')?.id || locations[1]?.id,
      lot_number: 'LOT-2023-06-14',
      received_date: '2023-06-14',
      expiration_date: '2023-09-14',
      status: 'in-stock',
    },
    {
      product_id: 'PROD-12347',
      product_name: 'Pork Ribs',
      category: 'Meat',
      quantity: 180,
      location_id: locations.find((loc: any) => loc.location_code === 'RACK-C1')?.id,
      lot_number: 'LOT-2023-06-13',
      received_date: '2023-06-13',
      expiration_date: '2023-06-30',
      status: 'in-stock',
    },
    {
      product_id: 'PROD-12348',
      product_name: 'Fish Fillets',
      category: 'Seafood',
      quantity: 75,
      location_id: locations.find((loc: any) => loc.location_code === 'CHAMBER-1')?.id,
      lot_number: 'LOT-2023-06-12',
      received_date: '2023-06-12',
      expiration_date: '2023-06-18',
      status: 'low-stock',
    },
    {
      product_id: 'PROD-12349',
      product_name: 'Dairy Products',
      category: 'Dairy',
      quantity: 320,
      location_id: locations.find((loc: any) => loc.location_code === 'CHAMBER-2')?.id,
      lot_number: 'LOT-2023-06-11',
      received_date: '2023-06-11',
      expiration_date: '2023-07-05',
      status: 'in-stock',
    },
  ]

  // Insert inventory items
  const { data, error } = await supabase
    .from('inventory_items')
    .upsert(inventoryItems, { onConflict: 'product_id' })
    .select()

  if (error) {
    throw error
  }

  return { inserted: data.length }
}

// Function to seed temperature logs
async function seedTemperatureLogs(supabase: any) {
  // Sample temperature logs
  const now = new Date()
  const temperatureLogs = [
    {
      storage_area: 'Conservation Chamber 1',
      temperature: 2.5,
      status: 'normal',
      recorded_by: 'Quality Control',
      created_at: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
    },
    {
      storage_area: 'Frozen Chamber 2',
      temperature: -19.2,
      status: 'normal',
      recorded_by: 'Quality Control',
      created_at: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
    },
    {
      storage_area: 'Conservation Chamber 2',
      temperature: 5.1,
      status: 'warning',
      recorded_by: 'Quality Control',
      notes: 'Temperature slightly above range, maintenance notified',
      created_at: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
    },
    {
      storage_area: 'Frozen Chamber 1',
      temperature: -17.8,
      status: 'warning',
      recorded_by: 'Quality Control',
      notes: 'Temperature slightly above optimal range',
      created_at: new Date(now.getTime() - 10800000).toISOString(), // 3 hours ago
    },
    {
      storage_area: 'Conservation Chamber 1',
      temperature: 3.2,
      status: 'normal',
      recorded_by: 'Quality Control',
      created_at: new Date(now.getTime() - 14400000).toISOString(), // 4 hours ago
    },
  ]

  // Insert temperature logs
  const { data, error } = await supabase
    .from('temperature_logs')
    .insert(temperatureLogs)
    .select()

  if (error) {
    throw error
  }

  return { inserted: data.length }
}

// Function to seed quality incidents
async function seedQualityIncidents(supabase: any) {
  // Get inventory items
  const { data: items, error: itemsError } = await supabase
    .from('inventory_items')
    .select('id, product_id, product_name')

  if (itemsError) {
    throw itemsError
  }

  // Get warehouse locations
  const { data: locations, error: locationsError } = await supabase
    .from('warehouse_locations')
    .select('id, location_code')

  if (locationsError) {
    throw locationsError
  }

  // Sample quality incidents
  const now = new Date()
  const qualityIncidents = [
    {
      incident_type: 'Temperature Deviation',
      description: 'Zone B temperature is 8°C, exceeding the 5°C threshold for dairy products.',
      severity: 'critical',
      related_product_id: items.find((item: any) => item.product_id === 'PROD-12349')?.id,
      related_location_id: locations.find((loc: any) => loc.location_code === 'CHAMBER-2')?.id,
      reported_by: 'Quality Control',
      status: 'open',
      created_at: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
    },
    {
      incident_type: 'Packaging Damage',
      description: 'Multiple packages of Beef Quarters found with damaged packaging.',
      severity: 'medium',
      related_product_id: items.find((item: any) => item.product_id === 'PROD-12345')?.id,
      related_location_id: locations.find((loc: any) => loc.location_code === 'RACK-A1')?.id,
      reported_by: 'Warehouse Operator',
      status: 'investigating',
      created_at: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
    },
    {
      incident_type: 'Product Contamination',
      description: 'Possible cross-contamination detected in seafood section.',
      severity: 'high',
      related_product_id: items.find((item: any) => item.product_id === 'PROD-12348')?.id,
      related_location_id: locations.find((loc: any) => loc.location_code === 'CHAMBER-1')?.id,
      reported_by: 'Quality Control',
      status: 'resolved',
      resolution_notes: 'Products isolated and tested. No contamination confirmed.',
      created_at: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
      resolved_at: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
    },
  ]

  // Insert quality incidents
  const { data, error } = await supabase
    .from('quality_incidents')
    .insert(qualityIncidents)
    .select()

  if (error) {
    throw error
  }

  return { inserted: data.length }
}

// Function to seed orders
async function seedOrders(supabase: any) {
  // Sample orders
  const now = new Date()
  const orders = [
    {
      order_number: 'ORD-2023-1234',
      customer: 'Acme Corporation',
      status: 'pending',
      order_date: new Date(now.getTime() - 86400000).toISOString().split('T')[0], // 1 day ago
      total_items: 12,
    },
    {
      order_number: 'ORD-2023-1235',
      customer: 'TechSolutions Inc.',
      status: 'urgent',
      order_date: new Date(now.getTime() - 172800000).toISOString().split('T')[0], // 2 days ago
      total_items: 5,
    },
    {
      order_number: 'ORD-2023-1236',
      customer: 'Global Logistics',
      status: 'processing',
      order_date: new Date(now.getTime() - 259200000).toISOString().split('T')[0], // 3 days ago
      total_items: 8,
    },
