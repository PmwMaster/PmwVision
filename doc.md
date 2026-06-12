# PMW Vision - Memória do Projeto

## Contexto

PMW Vision é uma plataforma SaaS de gestão financeira pessoal com Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn/UI e Supabase.

## Stack
- **Frontend:** Next.js 15 App Router, React 19, Tailwind CSS, Shadcn/UI, Recharts, Lucide Icons, React Hook Form, Zod
- **Backend:** Supabase (Auth, Database, Storage), PostgreSQL com RLS
- **Design:** Obsidian Wealth Strategy (dark premium, glassmorphism, 49 tokens de cor)
- **Deploy:** Vercel (pmwvisionapp.vercel.app), GitHub (github.com/PmwMaster/PmwVision)

## Supabase
- **URL:** https://dtuhyweldtfapchzmudz.supabase.co
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dWh5d2VsZHRmYXBjaHptdWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMTY2NjMsImV4cCI6MjA5Njc5MjY2M30.tOSf93-F5LK2zvOj1v2wgRLmKFEgFuFgcLZiUjqmyCM
- **Schema:** `supabase/schema.sql` - 12 tabelas + RLS + triggers + storage buckets

## Estrutura do Projeto
```
pmw_vision_app/
├── src/
│   ├── app/
│   │   ├── (dashboard)/   # Layout autenticado (Sidebar + TopBar)
│   │   │   ├── dashboard/      # KPIs, gráficos, últimas movimentações
│   │   │   ├── orcamento/      # Orçamento mensal (MOCK - precisa conectar)
│   │   │   ├── movimentacoes/  # Transações CRUD
│   │   │   ├── investimentos/  # 3 abas (Financeiros OK, Apostas/Hobbies MOCK)
│   │   │   ├── reinvestimentos/# Reinvestimentos
│   │   │   ├── metas/          # Metas financeiras
│   │   │   ├── patrimonio/     # Evolução patrimonial (100% MOCK)
│   │   │   ├── historico/      # Histórico completo
│   │   │   ├── notificacoes/   # Central de notificações
│   │   │   └── configuracoes/  # Perfil/senha/preferências
│   │   ├── auth/          # Login/Cadastro
│   │   └── api/           # 12 API routes existentes
│   ├── components/        # UI (shadcn), layout, shared, charts
│   ├── hooks/             # 10 data hooks
│   ├── lib/               # utils, api-utils, supabase client/server/middleware
│   └── types/             # Database types
├── supabase/schema.sql
└── .env.local (Supabase creds)
```

## Estado Atual das Páginas
| Página | Status | Problema |
|--------|--------|----------|
| Dashboard | Parcial | KPIs via API, gráficos 100% mock, filtros de período não funcionam |
| Orçamento | 100% Mock | useBudget hook existe mas não é usado |
| Movimentações | Funcional | CRUD OK, edição sem handler, sem paginação |
| Investimentos | Parcial | Aba Financeiro OK, Apostas e Hobbies 100% mock |
| Reinvestimentos | Parcial | Sem [id] route (PUT/DELETE), gráfico mock |
| Metas | Funcional | CRUD OK, upload imagem fake, sem detail page |
| Patrimônio | 100% Mock | Sem data fetching |
| Histórico | Funcional | Export buttons não funcionam |
| Notificações | Parcial | GET OK, mark read não funciona |
| Configurações | Parcial | Senha/logout/avatar/preferências não funcionam |

## API Routes Existentes
| Rota | Métodos | Status |
|------|---------|--------|
| /api/dashboard | GET | OK |
| /api/transactions | GET, POST | OK (sem Zod) |
| /api/transactions/[id] | GET, PUT, DELETE | OK |
| /api/goals | GET, POST | OK |
| /api/goals/[id] | PUT, DELETE | OK |
| /api/investments | GET, POST | OK |
| /api/investments/[id] | PUT, DELETE | OK |
| /api/reinvestments | GET, POST | OK (falta [id]) |
| /api/budgets | GET, POST | OK |
| /api/categories | GET, POST | OK |
| /api/notifications | GET | OK (falta PATCH) |
| /api/profile | GET, PUT | OK |

## API Routes Faltando
- /api/accounts (tabela existe)
- /api/betting-investments (tabela existe)
- /api/hobby-investments (tabela existe)
- /api/reinvestments/[id] (PUT/DELETE)
- /api/notifications/[id] (PATCH mark read)
- /api/notifications/mark-all (PATCH)

## Hooks Existentes (todos via window.fetch, sem React Query)
useDashboard, useTransactions, useGoals, useInvestments, useReinvestments, useBudget, useCategories, useProfile, useNotifications, useAuth

## Plano de Implementação (6 Fases)
### Fase 1 (ATUAL): Fundação
- TanStack Query + QueryProvider
- api-client.ts wrapper unificado
- Zod validation nas API routes
- Novas API routes: accounts, betting-investments, hobby-investments, reinvestments/[id], notifications PATCH
### Fase 2: Dados Reais
- Dashboard gráficos reais + filtros de período
- Orçamento com dados reais
- Patrimônio com dados reais
- Investimentos Apostas/Hobbies reais
### Fase 3: Funcionalidades Quebradas
- Botões não funcionais (editar, novo investimento, ajustar limite, etc.)
- Upload de imagens (avatar + metas)
- Sign out, alterar senha
### Fase 4: Qualidade
- Paginação, filtros, export CSV, optimistic updates
### Fase 5: Automação
- Triggers SQL (notificações automáticas, atualização de saldo)
### Fase 6: Auth
- Recuperação de senha, confirmação de email, middleware refactor

## Ambiente
- **Local:** http://localhost:3000 (não funciona, usa Vercel)
- **Produção:** https://pmwvisionapp.vercel.app
- **GitHub:** https://github.com/PmwMaster/PmwVision (branch main)
