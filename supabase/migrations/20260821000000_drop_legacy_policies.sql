-- ============================================================================
--  Limpieza de policies heredadas
--  ---------------------------------------------------------------------------
--  La migracion 20260820120000 agrego las policies nuevas, pero su lista de
--  `drop policy if exists` adivinaba nombres que no existian en la base real
--  (orders_insert_public, "Enable insert for all users", etc). Resultado: las
--  policies viejas quedaron vivas.
--
--  Como las policies de Postgres son PERMISIVAS y se combinan con OR, alcanza
--  con que una permita para que permita. Las viejas anulaban el apriete de las
--  nuevas. Las dos criticas eran:
--
--    menu_items / "Anon write menu_items"  -> {anon}   ALL
--        cualquiera con la anon key (publica, viaja en el bundle) podia
--        escribir o borrar el menu.
--
--    orders / "Public insert orders"       -> {public} INSERT
--        permitia insertar pedidos directo, salteando create-order y su
--        calculo de total desde menu_items.
--
--  Estas bajas no restan acceso legitimo: las policies de 20260820120000 ya
--  cubren lectura publica y escritura autenticada en cada tabla.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- menu_items
-- ---------------------------------------------------------------------------
drop policy if exists "Anon write menu_items"  on public.menu_items;
drop policy if exists "Auth write menu_items"  on public.menu_items;
drop policy if exists "Public read menu_items" on public.menu_items;

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
drop policy if exists "Auth write categories"  on public.categories;
drop policy if exists "Public read categories" on public.categories;

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
drop policy if exists "Auth write events"  on public.events;
drop policy if exists "Public read events" on public.events;

-- ---------------------------------------------------------------------------
-- settings
-- ---------------------------------------------------------------------------
drop policy if exists "Auth write settings"  on public.settings;
drop policy if exists "Public read settings" on public.settings;

-- ---------------------------------------------------------------------------
-- orders
--
--  Se va tambien "Public insert orders": los pedidos entran unicamente por la
--  Edge Function create-order, que usa la service_role key y por lo tanto
--  ignora RLS. Correr esta baja ANTES de desplegar la funcion deja el checkout
--  sin ninguna via de alta.
-- ---------------------------------------------------------------------------
drop policy if exists "Public insert orders" on public.orders;
drop policy if exists "Auth select orders"   on public.orders;
drop policy if exists "Auth update orders"   on public.orders;
drop policy if exists "Auth delete orders"   on public.orders;

-- Recarga la cache del esquema de PostgREST
select pg_notify('pgrst', 'reload schema');

-- ---------------------------------------------------------------------------
-- storage.objects: restos del bucket `almadekh`
--
--  Las tres son heredadas y quedaron con rol {public}, que en Postgres es
--  TODOS los roles, no "anonimo". La grave es "Public Upload": permitia subir
--  archivos con la anon key.
--
--  Los nombres de las dos u8i3a5_* los genero la UI del dashboard y no dicen
--  lo que hacen: "Solo authenticated upload" aplica a {public}, y
--  " authenticated delete" es en realidad un SELECT.
--
--  OJO: " authenticated delete u8i3a5_1" empieza con un ESPACIO. Sin ese
--  espacio el drop no encuentra nada y falla en silencio.
--
--  Bajarlas no saca acceso legitimo: el unico bucket que usa el codigo es
--  `almadekh` (src/lib/upload.ts y supabase/functions/remove-bg), y las
--  subidas salen solo de EventEditor y MenuEditor, detras de ProtectedRoute.
-- ---------------------------------------------------------------------------
drop policy if exists "Public Upload"                      on storage.objects;
drop policy if exists "Solo authenticated upload u8i3a5_0" on storage.objects;
drop policy if exists " authenticated delete u8i3a5_1"     on storage.objects;

select pg_notify('pgrst', 'reload schema');
