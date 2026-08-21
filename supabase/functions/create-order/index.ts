import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Crea pedidos calculando el total SIEMPRE desde la base de datos.
// El cliente solo manda que plato y que cantidad; los precios nunca se aceptan
// desde el navegador (antes se podian editar desde las devtools).

const ALLOWED_ORIGINS = [
  "https://almadekh.com",
  "https://almadekh-tan.vercel.app",
  "http://localhost:5173",
]

const ALLOWED_DELIVERY_TYPES = ["Delivery", "Para llevar", "Comer en el local"]

const MAX_NAME_LENGTH = 100
const MAX_NOTES_LENGTH = 500
const MAX_LINES = 50
const MAX_QTY_PER_LINE = 99

function getCorsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  }
}

function json(body: unknown, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  })
}

interface RequestLine {
  id: unknown
  qty: unknown
}

serve(async (req) => {
  const CORS = getCorsHeaders(req.headers.get("Origin"))

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS })
  }

  if (req.method !== "POST") {
    return json({ error: "Metodo no permitido" }, 405, CORS)
  }

  try {
    let payload: Record<string, unknown>
    try {
      payload = await req.json()
    } catch {
      return json({ error: "Cuerpo invalido" }, 400, CORS)
    }

    // ---- Validacion de los datos del cliente ----
    const customerName = typeof payload.customer_name === "string" ? payload.customer_name.trim() : ""
    if (!customerName || customerName.length > MAX_NAME_LENGTH) {
      return json({ error: "Nombre invalido" }, 400, CORS)
    }

    const deliveryType = typeof payload.delivery_type === "string" ? payload.delivery_type : ""
    if (!ALLOWED_DELIVERY_TYPES.includes(deliveryType)) {
      return json({ error: "Modalidad de entrega invalida" }, 400, CORS)
    }

    const rawNotes = typeof payload.notes === "string" ? payload.notes.trim() : ""
    if (rawNotes.length > MAX_NOTES_LENGTH) {
      return json({ error: "Las notas son demasiado largas" }, 400, CORS)
    }
    const notes = rawNotes || null

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return json({ error: "El pedido esta vacio" }, 400, CORS)
    }
    if (payload.items.length > MAX_LINES) {
      return json({ error: "Demasiados items en el pedido" }, 400, CORS)
    }

    // Consolida cantidades por id y descarta cualquier precio que venga del cliente
    const requested = new Map<string, number>()
    for (const raw of payload.items as RequestLine[]) {
      if (!raw || typeof raw !== "object") {
        return json({ error: "Item invalido" }, 400, CORS)
      }
      const id = typeof raw.id === "string" ? raw.id : ""
      const qty = typeof raw.qty === "number" ? raw.qty : NaN
      if (!id || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_LINE) {
        return json({ error: "Item invalido" }, 400, CORS)
      }
      const total = (requested.get(id) || 0) + qty
      if (total > MAX_QTY_PER_LINE) {
        return json({ error: "Cantidad excesiva para un mismo plato" }, 400, CORS)
      }
      requested.set(id, total)
    }

    // ---- Precios reales desde la base ----
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const admin = createClient(supabaseUrl, serviceKey)

    const ids = [...requested.keys()]
    const { data: menuItems, error: menuErr } = await admin
      .from("menu_items")
      .select("id, name, price, is_available")
      .in("id", ids)

    if (menuErr) {
      console.error("create-order: menu query error", menuErr.message)
      return json({ error: "No se pudo validar el pedido" }, 500, CORS)
    }

    const byId = new Map((menuItems || []).map((item) => [item.id as string, item]))

    const lines: { name: string; qty: number; price: number }[] = []
    let total = 0

    for (const [id, qty] of requested) {
      const item = byId.get(id)
      if (!item) {
        return json({ error: "Uno de los platos ya no esta disponible" }, 409, CORS)
      }
      if (item.is_available === false) {
        return json({ error: `"${item.name}" no esta disponible en este momento` }, 409, CORS)
      }
      const price = Number(item.price)
      if (!Number.isFinite(price) || price < 0) {
        console.error("create-order: precio invalido en la base", id, item.price)
        return json({ error: "No se pudo validar el pedido" }, 500, CORS)
      }
      lines.push({ name: item.name as string, qty, price })
      total += price * qty
    }

    // ---- Alta del pedido (el total nunca viene del cliente) ----
    const { data: order, error: insertErr } = await admin
      .from("orders")
      .insert({
        customer_name: customerName,
        items: lines,
        total,
        delivery_type: deliveryType,
        notes,
        status: "pending",
      })
      .select("id, total, created_at")
      .single()

    if (insertErr) {
      console.error("create-order: insert error", insertErr.message)
      return json({ error: "No se pudo registrar el pedido" }, 500, CORS)
    }

    // Devuelve las lineas canonicas para que el mensaje de WhatsApp
    // coincida exactamente con lo que quedo guardado.
    return json({ id: order.id, total: order.total, lines }, 200, CORS)
  } catch (e) {
    console.error("create-order: error inesperado", e)
    return json({ error: "Error interno del servidor" }, 500, CORS)
  }
})
