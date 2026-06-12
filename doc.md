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
│   │   │   ├── dashboard/      # KPIs, gráficos, últimas movimentações (real)
│   │   │   ├── orcamento/      # Orçamento mensal (parcial)
│   │   │   ├── movimentacoes/  # Transações CRUD
│   │   │   ├── investimentos/  # 3 abas (Financeiro, Apostas, Hobbies - reais)
│   │   │   ├── reinvestimentos/# Reinvestimentos (CRUD completo)
│   │   │   ├── metas/          # Metas financeiras
│   │   │   ├── patrimonio/     # Evolução patrimonial (parcial)
│   │   │   ├── historico/      # Histórico completo
│   │   │   ├── notificacoes/   # Central de notificações (backend OK, frontend pendente)
│   │   │   └── configuracoes/  # Perfil/senha/preferências (parcial)
│   │   ├── auth/          # Login/Cadastro
│   │   └── api/           # 23 API routes (16 famílias de endpoints)
│   ├── components/        # UI (shadcn), layout, shared, charts
│   ├── hooks/             # 13 data hooks
│   ├── lib/               # utils, api-utils, supabase client/server/middleware
│   └── types/             # Database types
├── supabase/schema.sql
└── .env.local (Supabase creds)
```

## Estado Atual das Páginas
| Página | Status | Problema |
|--------|--------|----------|
| Dashboard | Real | KPIs + gráficos via API (evolution, income-vs-expense). Fallback mock se API falhar |
| Orçamento | Parcial | Orçamento salva/recupera via API. Categorias e savings são mock constants |
| Movimentações | Funcional | CRUD OK, sem paginação, sem filtros avançados |
| Investimentos | Real | 3 abas (Financeiro, Apostas, Hobbies) com dados reais via API. 2 KPIs mock |
| Reinvestimentos | Funcional | CRUD completo via API, gráfico usa dados reais |
| Metas | Funcional | CRUD OK, upload imagem fake, sem detail page |
| Patrimônio | Parcial | Gráfico de evolução real. KPIs com fallback mock |
| Histórico | Funcional | Export buttons não funcionam |
| Notificações | Parcial | Backend completo (PATCH mark-read e mark-all). Hook sem funções mark, botão sem onClick |
| Configurações | Parcial | Update de nome OK. Senha/logout/avatar/preferências são placeholders |

## API Routes Existentes (23 routes, 16 famílias)
| Rota | Métodos | Status |
|------|---------|--------|
| /api/dashboard | GET | OK |
| /api/dashboard/evolution | GET | OK (Nova) |
| /api/dashboard/income-vs-expense | GET | OK (Nova) |
| /api/transactions | GET, POST | OK |
| /api/transactions/[id] | GET, PUT, DELETE | OK |
| /api/goals | GET, POST | OK |
| /api/goals/[id] | GET, PUT, DELETE | OK |
| /api/investments | GET, POST | OK |
| /api/investments/[id] | GET, PUT, DELETE | OK |
| /api/reinvestments | GET, POST | OK |
| /api/reinvestments/[id] | GET, PUT, DELETE | OK |
| /api/budgets | GET, POST | OK |
| /api/categories | GET | OK |
| /api/notifications | GET | OK |
| /api/notifications/[id] | PATCH | OK (mark read) |
| /api/notifications/mark-all | PATCH | OK (mark all read) |
| /api/profile | GET, PUT | OK |
| /api/accounts | GET, POST | OK (Nova) |
| /api/accounts/[id] | GET, PUT, DELETE | OK (Nova) |
| /api/betting-investments | GET, POST | OK (Nova) |
| /api/betting-investments/[id] | GET, PUT, DELETE | OK (Nova) |
| /api/hobby-investments | GET, POST | OK (Nova) |
| /api/hobby-investments/[id] | GET, PUT, DELETE | OK (Nova) |

## API Routes Faltando
Nenhuma. Todas as rotas planejadas foram implementadas na Fase 2.

## Hooks Existentes (13 hooks - 11 com useState/useEffect, 2 com React Query)
useDashboard, useDashboardEvolution, useDashboardIncomeExpense, useTransactions, useGoals, useInvestments, useBettingInvestments (RQ), useHobbyInvestments (RQ), useReinvestments, useBudget, useCategories, useProfile, useNotifications, useAuth

## Plano de Implementação (6 Fases)
### Fase 1 (CONCLUÍDA): Fundação
- TanStack Query + QueryProvider
- api-client.ts wrapper unificado
- Zod validation nas API routes
- Novas API routes: accounts, betting-investments, hobby-investments, reinvestments/[id], notifications PATCH, dashboard/evolution, dashboard/income-vs-expense
### Fase 2 (CONCLUÍDA): Dados Reais
- Dashboard gráficos reais + filtros de período
- Orçamento com dados reais (parcial: categorias mock)
- Patrimônio com dados reais
- Investimentos Apostas/Hobbies reais
### Fase 3 (ATUAL): Funcionalidades Quebradas
- Botões não funcionais (editar, novo investimento, ajustar limite, etc.)
- Upload de imagens (avatar + metas)
- Sign out, alterar senha
- Wire up mark-read nas notificações (backend pronto, frontend pendente)
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
