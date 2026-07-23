-- ============================================================
-- Nova tabela: visa_expenses (Despesas VISTO)
-- Rode no Supabase -> SQL Editor -> New query -> Run
-- ============================================================

create table if not exists visa_expenses (
  id uuid primary key default gen_random_uuid(),
  expense_type text not null,
  supplier text,
  amount numeric default 0,
  currency text default 'USD',
  expense_date date,
  justification text,
  created_at timestamptz default now()
);

alter table visa_expenses enable row level security;

-- Acesso publico (mesmo padrao das outras tabelas, sem exigir login por enquanto)
drop policy if exists "public full access" on visa_expenses;
create policy "public full access" on visa_expenses
  for all using (true) with check (true);
