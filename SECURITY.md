# Security - Estado actual

## Implementado
- ✅ Supabase Auth (email + contraseña) — sin passwords hardcodeados
- ✅ ProtectedRoute redirige a `/` si no hay usuario autenticado
- ✅ Link Admin oculto en navbar si no estás logueado
- ✅ Rate limiting: 5 intentos fallidos → bloqueo 15 minutos
- ✅ Upload: validación MIME (jpeg/png/webp/gif/avif), extensión, tamaño máximo 5MB
- ✅ CSP completo en index.html (script-src, style-src, img-src, connect-src, frame-ancestors)
- ✅ Input validation: MenuEditor (precio ≥ 0, nombre ≤100, descripción ≤300), EventEditor (título ≤150, descripción ≤500)
- ✅ .env en .gitignore
- ✅ window.open con noopener,noreferrer
- ✅ FloatingNotes memoizado (no regenera posiciones en cada render)
- ✅ Cart persiste en localStorage via Zustand persist

## Pendiente (configurar en Supabase Dashboard)
- [ ] RLS policies en tablas (categories, menu_items, events): anon solo SELECT, authenticated INSERT/UPDATE/DELETE
- [ ] Storage bucket `almadekh` policies: público SELECT, solo authenticated INSERT/DELETE
- [ ] Auth Provider: Email habilitado, "Confirm email" desactivado
- [ ] Crear usuario admin en Authentication → Users

## Arquitectura de seguridad
```
Cliente → ProtectedRoute (verifica sesión) → AdminPage (verifica user)
  ↓
Supabase Auth (JWT) → RLS policies (server-side) → Datos protegidos
```
