-- ============================================================
-- Tabela: processes — o "coracao" do sistema de documentos
-- Rode no Supabase -> SQL Editor -> New query -> Run
-- ============================================================

create table if not exists processes (
  id uuid primary key default gen_random_uuid(),
  process_ref text not null,
  mode text default 'aereo',                 -- aereo | maritimo
  process_type text default 'direto',        -- direto | com_house

  master_number text,
  house_number text,

  -- Dados reais (sempre a verdade comercial)
  real_shipper_name text,
  real_shipper_address text,
  real_consignee_name text,
  real_consignee_address text,
  consignee_tax_id text,

  -- Só preenchido quando process_type = 'com_house'
  destination_agent_name text,
  destination_agent_address text,

  carrier_name text,
  origin text,
  destination text,
  port_of_lading text,
  port_of_unloading text,
  flight_or_vessel text,
  transport_date date,

  pieces numeric,
  gross_weight numeric,
  chargeable_weight numeric,
  rate numeric,
  currency text default 'USD',
  freight_total numeric,
  origin_charges numeric default 0,
  destination_charges numeric default 0,
  inland_freight numeric default 0,

  goods_description text,
  itn_number text,

  status text default 'rascunho',            -- rascunho | docs_emitidos | em_transito | entregue

  created_at timestamptz default now()
);

alter table processes enable row level security;

drop policy if exists "public full access" on processes;
create policy "public full access" on processes
  for all using (true) with check (true);
