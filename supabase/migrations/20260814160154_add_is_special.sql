-- Añade la columna is_special a categories (marcar categorías como especiales ⭐)
alter table public.categories
  add column if not exists is_special boolean default false not null;

-- Recarga la caché del esquema de PostgREST
select pg_notify('pgrst', 'reload schema');
