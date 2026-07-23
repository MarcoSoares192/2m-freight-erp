# 2M Freight ERP

Sistema de gestao para operacoes logisticas da 2M Freight and Logistics:
embarques/containers, cotacoes de frete, financeiro, CRM de clientes/agentes e documentacao.

Stack: React + Vite + Tailwind CSS + Supabase (banco + autenticacao + storage), hospedado na Vercel.

---

## 1. Subir o codigo para o GitHub

No repositorio vazio que voce ja criou (2m-freight-erp):

    cd 2m-freight-erp
    git init
    git add .
    git commit -m "ERP inicial 2M Freight"
    git branch -M main
    git remote add origin https://github.com/SEU-USUARIO/2m-freight-erp.git
    git push -u origin main

Se preferir sem terminal: baixe este projeto como .zip, extraia, e faca upload dos arquivos
direto pela interface do GitHub (Add file -> Upload files) dentro do repositorio vazio.

## 2. Configurar o banco no Supabase

1. No painel do projeto Supabase, va em SQL Editor -> New query.
2. Cole todo o conteudo do arquivo supabase/schema.sql e clique em Run.
   Isso cria as 5 tabelas (shipments, quotes, financial_entries, contacts, documents),
   ativa seguranca por linha (RLS) e cria o bucket documents no Storage.
3. Va em Authentication -> Users -> Add user e crie o(s) usuario(s) da equipe (e-mail + senha).
   Esse e o login usado na tela de entrada do ERP -- nao ha cadastro publico.
4. Em Project Settings -> API, copie Project URL e anon public key.

## 3. Variaveis de ambiente

Copie .env.example para .env localmente (para testar) e preencha:

    VITE_SUPABASE_URL=...
    VITE_SUPABASE_ANON_KEY=...

Nunca commite o .env (ja esta no .gitignore).

## 4. Deploy na Vercel

1. Add New -> Project -> importe 2m-freight-erp do GitHub.
2. Em Environment Variables, adicione as mesmas duas chaves do passo 3.
3. Framework preset: Vite (a Vercel detecta automaticamente). Deploy.
4. Todo git push na branch main gera um novo deploy automatico.

## 5. Rodar localmente (opcional)

    npm install
    npm run dev

---

## Estrutura

    src/
      components/     Sidebar, Layout, componentes de UI (tabela, modal, badges)
      lib/             cliente Supabase, contexto de autenticacao, hook de CRUD generico
      pages/           Login, Dashboard, Embarques, Cotacoes, Financeiro, CRM, Documentos
    supabase/
      schema.sql       tabelas + RLS + bucket de storage
    public/assets/
      logo-2m.png      logo da 2M Freight and Logistics

## Proximos passos sugeridos

- Adicionar filtros e busca nas tabelas de cada modulo
- Vincular documentos diretamente a um embarque especifico (chave estrangeira)
- Relatorios exportaveis (PDF/Excel) por periodo
- Permissoes por papel (ex.: financeiro so ve modulo financeiro)
