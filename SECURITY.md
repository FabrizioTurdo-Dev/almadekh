# Security - Estado actual

## Modelo de amenaza en una línea

La `anon key` viaja en el bundle de JavaScript: **es pública**. Todo lo que se
pueda hacer con ella lo puede hacer cualquiera desde la consola del navegador.
Por eso ninguna regla que viva solo en el cliente cuenta como protección: lo que
protege de verdad son las RLS policies y las Edge Functions.

## Implementado (código)

### Pedidos
- ✅ Los pedidos se crean **solo** vía la Edge Function `create-order`.
  El navegador manda únicamente `{id, qty}` por plato; los precios y el total
  los calcula el servidor leyendo `menu_items` con la service_role key.
  Antes el cliente mandaba `price` y `total` y se guardaban tal cual, así que
  se podía pedir cualquier cosa a cualquier precio desde las devtools.
- ✅ La función valida nombre (≤100), modalidad (lista cerrada), notas (≤500),
  cantidad de líneas (≤50) y cantidad por línea (≤99), y rechaza platos
  inexistentes o marcados como no disponibles.
- ✅ Si el alta falla, **no** se abre WhatsApp ni se vacía el carrito: el cliente
  ve el error. Antes el error se tragaba con un `console.error` y el pedido se
  mandaba igual sin haber quedado registrado.

### Autenticación
- ✅ Supabase Auth (email + contraseña), sin contraseñas hardcodeadas.
- ✅ `ProtectedRoute` es un gate real: los children **no se montan** sin sesión.
  Importa porque `AdminPage` abre una suscripción realtime a `orders` en un
  `useEffect`, y los hooks corren antes de cualquier chequeo interno; sin el
  gate, un visitante anónimo en `/admin` abría ese canal igual.
- ✅ Bloqueo tras 5 intentos fallidos, persistido en localStorage.
  ⚠️ Es una barrera de conveniencia: se puede limpiar el storage. El límite real
  lo aplica Supabase Auth del lado del servidor.

### Uploads e IA
- ✅ Validación de MIME (jpeg/png/webp/gif/avif), extensión y tamaño (5 MB;
  10 MB para HEIC antes de convertir).
- ✅ `remove-bg` exige sesión y **solo acepta URLs de nuestro propio bucket**
  (`/storage/v1/object/public/almadekh/`). Antes tomaba cualquier URL, así que
  se podía usar nuestra API key de remove.bg contra recursos de terceros y
  quemar los créditos del mes.

### Cabeceras
- ✅ CSP definida en **un solo lugar**: el header HTTP de `vercel.json`.
  El `<meta http-equiv>` de `index.html` se eliminó. Cuando existían las dos, el
  navegador aplicaba ambas y ganaba la más restrictiva — por eso el widget de
  reseñas quedaba bloqueado en producción.
- ✅ HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `frame-ancestors 'none'`.
- ✅ Se quitó `X-XSS-Protection`: está deprecado y en navegadores viejos podía
  introducir vulnerabilidades. La CSP cubre ese caso.

### Varios
- ✅ `.env` en `.gitignore`.
- ✅ `window.open` con `noopener,noreferrer`.
- ✅ Validación de entrada en MenuEditor (precio ≥ 0, nombre ≤100, desc ≤300) y
  EventEditor (título ≤150, desc ≤500).

## Pendiente — requiere aplicarse en Supabase

> Sin esto, buena parte de lo de arriba no sirve: la anon key sigue pudiendo
> escribir directo en las tablas, salteándose las Edge Functions.

- [ ] **Aplicar `supabase/migrations/20260820120000_rls_policies.sql`.**
      Habilita RLS y define: lectura pública + escritura autenticada en
      `categories`, `menu_items`, `events` y `settings`; y en `orders`
      **ninguna** policy para `anon` (ni INSERT ni SELECT), porque las altas
      entran por la Edge Function con service_role y la tabla tiene nombres y
      direcciones de clientes.
      ⚠️ Ojo con `settings`: guarda el número de WhatsApp del local. Sin policy
      de escritura, cualquiera lo cambia y se desvía todos los pedidos.
- [ ] Desplegar las Edge Functions:
      `supabase functions deploy create-order`
      `supabase functions deploy remove-bg`
      El `verify_jwt` de cada una ya está declarado en `supabase/config.toml`
      (`create-order` público, `remove-bg` con sesión).
- [ ] Verificar que `SUPABASE_SERVICE_ROLE_KEY` y `REMOVE_BG_API_KEY` estén
      cargadas como secrets de las funciones.
- [ ] Auth Provider: Email habilitado, "Confirm email" desactivado.
- [ ] Considerar rate limiting sobre `create-order` (hoy no tiene): alguien
      puede spamear pedidos falsos. Se puede resolver con un contador por IP en
      una tabla, o con el rate limiting del gateway.

## Arquitectura

```
Visitante (anon key, pública)
  │
  ├─ SELECT menú/eventos/ajustes ──► RLS: lectura pública ✔
  │
  └─ Crear pedido ──► Edge Function `create-order`
                        │  valida entrada
                        │  lee precios reales de menu_items
                        │  calcula el total
                        └─► INSERT con service_role (ignora RLS)

Admin (JWT de Supabase Auth)
  │
  ├─ ProtectedRoute (no monta el panel sin sesión)
  │
  └─ Escritura en menú/eventos/ajustes ──► RLS: solo authenticated ✔
```
