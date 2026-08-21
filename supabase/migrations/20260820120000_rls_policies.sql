-- ============================================================================
--  RLS: quien puede leer y escribir cada tabla
--  ---------------------------------------------------------------------------
--  REVISAR ANTES DE APLICAR. Sin estas politicas la anon key (que viaja en el
--  bundle y es publica) permite que cualquiera escriba en el menu, los eventos,
--  los ajustes y los pedidos.
--
--  Criterio general:
--    - anon (visitante)   -> solo SELECT de lo que la web necesita mostrar
--    - authenticated (vos)-> escritura completa
--    - service_role       -> ignora RLS; lo usan las Edge Functions
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Menu: lectura publica, escritura solo autenticada
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;

drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "categories_write_authenticated" on public.categories;
create policy "categories_write_authenticated"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);


alter table public.menu_items enable row level security;

drop policy if exists "menu_items_select_public" on public.menu_items;
create policy "menu_items_select_public"
  on public.menu_items for select
  to anon, authenticated
  using (true);

drop policy if exists "menu_items_write_authenticated" on public.menu_items;
create policy "menu_items_write_authenticated"
  on public.menu_items for all
  to authenticated
  using (true)
  with check (true);


-- ---------------------------------------------------------------------------
-- Eventos: lectura publica, escritura solo autenticada
-- ---------------------------------------------------------------------------
alter table public.events enable row level security;

drop policy if exists "events_select_public" on public.events;
create policy "events_select_public"
  on public.events for select
  to anon, authenticated
  using (true);

drop policy if exists "events_write_authenticated" on public.events;
create policy "events_write_authenticated"
  on public.events for all
  to authenticated
  using (true)
  with check (true);


-- ---------------------------------------------------------------------------
-- Ajustes: lectura publica, escritura solo autenticada
--
--  Importante: `settings` guarda el numero de WhatsApp del local. Sin politica
--  de escritura, cualquiera podia cambiarlo y desviarse todos los pedidos.
-- ---------------------------------------------------------------------------
alter table public.settings enable row level security;

drop policy if exists "settings_select_public" on public.settings;
create policy "settings_select_public"
  on public.settings for select
  to anon, authenticated
  using (true);

drop policy if exists "settings_write_authenticated" on public.settings;
create policy "settings_write_authenticated"
  on public.settings for all
  to authenticated
  using (true)
  with check (true);


-- ---------------------------------------------------------------------------
-- Pedidos: el visitante NO escribe ni lee directo
--
--  Los pedidos entran unicamente por la Edge Function `create-order`, que usa
--  la service_role key (ignora RLS) y calcula el total desde `menu_items`.
--  Por eso aca no hay ninguna policy para `anon`: ni INSERT ni SELECT.
--  Leer tampoco: `orders` tiene nombres y direcciones de clientes.
-- ---------------------------------------------------------------------------
alter table public.orders enable row level security;

-- Limpia cualquier policy permisiva previa
drop policy if exists "orders_insert_public" on public.orders;
drop policy if exists "orders_select_public" on public.orders;
drop policy if exists "Enable insert for all users" on public.orders;
drop policy if exists "Enable read access for all users" on public.orders;

drop policy if exists "orders_read_authenticated" on public.orders;
create policy "orders_read_authenticated"
  on public.orders for select
  to authenticated
  using (true);

drop policy if exists "orders_update_authenticated" on public.orders;
create policy "orders_update_authenticated"
  on public.orders for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "orders_delete_authenticated" on public.orders;
create policy "orders_delete_authenticated"
  on public.orders for delete
  to authenticated
  using (true);


-- ---------------------------------------------------------------------------
-- Storage: bucket `almadekh`
--  Lectura publica (las fotos se muestran en la web), escritura autenticada.
-- ---------------------------------------------------------------------------
drop policy if exists "almadekh_read_public" on storage.objects;
create policy "almadekh_read_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'almadekh');

drop policy if exists "almadekh_insert_authenticated" on storage.objects;
create policy "almadekh_insert_authenticated"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'almadekh');

drop policy if exists "almadekh_update_authenticated" on storage.objects;
create policy "almadekh_update_authenticated"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'almadekh')
  with check (bucket_id = 'almadekh');

drop policy if exists "almadekh_delete_authenticated" on storage.objects;
create policy "almadekh_delete_authenticated"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'almadekh');


-- Recarga la cache del esquema de PostgREST
select pg_notify('pgrst', 'reload schema');
