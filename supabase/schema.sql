-- ============================================================
-- 2M Freight ERP — schema inicial
-- Rode este arquivo em Supabase → SQL Editor → New query → Run
-- ============================================================

create extension if not exists "pgcrypto";

-- 1) Embarques / Containers
create table if not exists shipments (
  id uuid primary key default gen_random_uuid(),
  reference text not null,
  origin text,
  destination text,
  container_type text,
  bl_number text,
  carrier text,
  status text default 'pendente',
  etd date,
  eta date,
  created_at timestamptz default now()
);

-- 2) Cotações de frete
create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null,
  client_name text,
  route text,
  cargo_description text,
  amount numeric default 0,
  currency text default 'USD',
  status text default 'rascunho',
  valid_until date,
  created_at timestamptz default now()
);

-- 3) Financeiro (contas a pagar/receber)
create table if not exists financial_entries (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  counterparty text,
  type text check (type in ('receivable', 'payable')) default 'receivable',
  amount numeric default 0,
  currency text default 'USD',
  status text default 'aberto',
  due_date date,
  created_at timestamptz default now()
);

-- 4) CRM — clientes, agentes, armadores
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text default 'cliente',
  country text,
  contact_name text,
  email text,
  phone text,
  status text default 'ativo',
  notes text,
  created_at timestamptz default now()
);

-- 5) Documentação (metadados; arquivos no Storage)
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  doc_type text default 'outro',
  reference text,
  file_path text,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security — apenas usuários autenticados (equipe 2M)
-- acessam os dados. Ajuste conforme necessário.
-- ============================================================
alter table shipments enable row level security;
alter table quotes enable row level security;
alter table financial_entries enable row level security;
alter table contacts enable row level security;
alter table documents enable row level security;

create policy "authenticated full access" on shipments
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on quotes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on financial_entries
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on contacts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on documents
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket para documentos (packing list, invoice, BL, certificados)
-- Depois de rodar isto, confira em Storage se o bucket "documents" apareceu.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "authenticated read documents" on storage.objects
  for select using (bucket_id = 'documents' and auth.role() = 'authenticated');
create policy "authenticated upload documents" on storage.objects
  for insert with check (bucket_id = 'documents' and auth.role() = 'authenticated');
create policy "authenticated delete documents" on storage.objects
  for delete using (bucket_id = 'documents' and auth.role() = 'authenticated');
