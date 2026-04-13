-- ============================================================
-- Dongi: Trip Photos
-- ============================================================

-- 1. Table for photo metadata
create table dongi.trip_photos (
  id         uuid primary key default gen_random_uuid(),
  trip_id    uuid not null references dongi.trips(id) on delete cascade,
  user_id    uuid not null references dongi.profiles(id),
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index idx_dongi_trip_photos_trip on dongi.trip_photos(trip_id);

-- 2. RLS
alter table dongi.trip_photos enable row level security;

create policy "trip_photos_select"
  on dongi.trip_photos for select
  to authenticated
  using (dongi.is_trip_member(trip_id));

create policy "trip_photos_insert"
  on dongi.trip_photos for insert
  to authenticated
  with check (dongi.is_trip_member(trip_id) and user_id = auth.uid());

create policy "trip_photos_delete"
  on dongi.trip_photos for delete
  to authenticated
  using (
    dongi.is_trip_admin(trip_id)
    or user_id = auth.uid()
  );

-- 3. Storage bucket
insert into storage.buckets (id, name, public)
values ('trip-photos', 'trip-photos', true)
on conflict (id) do nothing;

-- 4. Storage RLS policies
create policy "trip_photos_storage_select"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'trip-photos');

create policy "trip_photos_storage_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'trip-photos');

create policy "trip_photos_storage_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'trip-photos');
