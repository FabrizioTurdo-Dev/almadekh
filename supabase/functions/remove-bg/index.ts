import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const ALLOWED_ORIGINS = [
  "https://almadekh.com",
  "https://almadekh-tan.vercel.app",
]

const ALLOWED_FOLDERS = ["menu", "events"]

const BRAND_BG = "f0e4d4"

function getCorsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  }
}

serve(async (req) => {
  const origin = req.headers.get("Origin")
  const CORS = getCorsHeaders(origin)

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS })
  }

  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No autorizado" }),
        { status: 401, headers: { ...CORS, "Content-Type": "application/json" } }
      )
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!
    const supabase = createClient(supabaseUrl, anonKey)

    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token)

    if (authErr || !user) {
      return new Response(
        JSON.stringify({ error: "No autorizado" }),
        { status: 401, headers: { ...CORS, "Content-Type": "application/json" } }
      )
    }

    const { imageUrl, folder = "menu" } = await req.json()

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "imageUrl es requerido" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      )
    }

    if (!ALLOWED_FOLDERS.includes(folder)) {
      return new Response(
        JSON.stringify({ error: "Carpeta no válida" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      )
    }

    const removeBgKey = Deno.env.get("REMOVE_BG_API_KEY")
    if (!removeBgKey) {
      return new Response(
        JSON.stringify({ error: "Servicio no disponible" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      )
    }

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": removeBgKey,
      },
      body: new URLSearchParams({
        image_url: imageUrl,
        size: "preview",
        type: "product",
        format: "png",
        bg_color: BRAND_BG,
        shadow_type: "product",
        shadow_opacity: "50",
      }),
    })

    if (!response.ok) {
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos agotados este mes" }),
          { status: 402, headers: { ...CORS, "Content-Type": "application/json" } }
        )
      }

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas peticiones. Intentá en unos segundos" }),
          { status: 429, headers: { ...CORS, "Content-Type": "application/json" } }
        )
      }

      throw new Error("Error al procesar la imagen")
    }

    const imageBuffer = await response.arrayBuffer()
    const fileName = `${folder}/${Date.now()}_processed.png`

    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const adminClient = createClient(supabaseUrl, serviceKey)

    const { error: uploadErr } = await adminClient.storage
      .from("almadekh")
      .upload(fileName, imageBuffer, {
        contentType: "image/png",
        cacheControl: "3600",
      })

    if (uploadErr) throw uploadErr

    const { data: urlData } = adminClient.storage
      .from("almadekh")
      .getPublicUrl(fileName)

    return new Response(
      JSON.stringify({ url: urlData.publicUrl }),
      { headers: { ...CORS, "Content-Type": "application/json" } }
    )
  } catch {
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    )
  }
})
