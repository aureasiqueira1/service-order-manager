# 🏢 Pipelore - Sistema de Gestão de Ordens de Serviço

Sistema completo de gestão de condomínios para administração de ordens de serviço de reparo, desenvolvido com Next.js 15, React 19 e TypeScript.

## 🚀 Stack Tecnológica

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS** - Estilização
- **Drizzle ORM** - ORM para MySQL
- **MySQL** - Banco de dados
- **Zod** - Validação de dados
- **Lucide React** - Ícones
- **Clean Architecture** - Arquitetura limpa

## 📋 Funcionalidades

### ✅ CRUD Completo de Ordens de Serviço
- ➕ **Criar nova ordem** - Formulário em 2 etapas com validação
- 📝 **Editar ordem existente** - Edição completa com dados pré-carregados
- 🗑️ **Deletar ordem** - Modal de confirmação antes de excluir
- 📋 **Listar todas as ordens** - Grid responsivo com cards modernos

### 🔍 Filtros e Busca Avançada
- 🔎 **Busca em tempo real** - Por título, descrição ou local
- 📊 **Filtro por status** - Aberto, Em Progresso, Concluído, Cancelado
- 🎯 **Ordenação múltipla**:
  - Por prioridade (Alta → Baixa ou Baixa → Alta)
  - Por prazo (Próximo → Distante ou Distante → Próximo)
- 🧹 **Limpar filtros** - Reset rápido de todos os filtros
- 📈 **Contador de resultados** - Exibe quantidade de ordens filtradas

### 🚨 Página de Ordens Atrasadas
- ⚠️ **Visualização dedicada** - Página exclusiva para ordens com prazo vencido
- 🔍 **Filtros específicos** - Busca e ordenação na página de atrasadas
- 📊 **Ordenação por atraso** - Mais atrasado ou menos atrasado primeiro
- ✏️ **Edição e exclusão** - Ações disponíveis diretamente na página

### 🎨 Interface Moderna e Responsiva
- 💎 **Cards com gradientes** - Design premium com efeitos visuais
- 🎯 **Badges coloridos** - Prioridade e status com cores distintas
- 🔄 **Animações suaves** - Transições e hover effects
- 📱 **Mobile-first** - Totalmente responsivo para todos os dispositivos
- 🎭 **Ícones contextuais** - Lucide icons com backgrounds coloridos
- ✨ **Altura consistente** - Cards alinhados perfeitamente

### 📝 Formulário Multi-etapas
- 1️⃣ **Etapa 1: Informações Básicas** - Título, descrição e local
- 2️⃣ **Etapa 2: Configurações** - Prioridade, status e prazo
- ✅ **Validação em tempo real** - Feedback imediato de erros
- 🔄 **Navegação entre etapas** - Botões Voltar e Próximo
- 💾 **Persistência de dados** - Valores mantidos entre etapas

### 🌐 API Externa
- **GET /api/repair-orders/late** - Retorna ordens atrasadas em JSON

## 📊 Modelo de Dados

```typescript
{
  id: string (UUID)
  title: string (máx. 255 caracteres)
  description: text
  location: string (ex: "Torre A - Apto 101")
  priority: enum (LOW, MEDIUM, HIGH, URGENT)
  status: enum (OPEN, IN_PROGRESS, COMPLETED, CANCELLED)
  dueDate: date
  completedAt: timestamp (nullable)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## 🛠️ Instalação e Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
DATABASE_URL=mysql://mysql:docker@localhost:3306/pipelore-db
```

**Nota:** Ajuste as credenciais conforme seu ambiente MySQL.

### 3. Gerar e Executar Migrations

```bash
# Gerar migrations
npm run db:generate

# Executar migrations
npm run db:push
```

### 4. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── actions/              # Server Actions (CRUD)
│   └── repair-orders.ts
├── app/                  # App Router (Next.js 15)
│   ├── api/
│   │   └── repair-orders/
│   │       └── late/
│   │           └── route.ts
│   ├── atrasadas/       # Página de ordens atrasadas
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx         # Página principal
│   └── globals.css
├── components/           # Componentes React
│   ├── ui/              # Componentes UI reutilizáveis
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── modal.tsx
│   │   └── toast.tsx
│   ├── repair-order-card.tsx
│   ├── repair-order-form.tsx
│   ├── repair-orders-list.tsx
│   ├── late-orders-list.tsx
│   ├── search-bar.tsx
│   └── delete-confirmation-modal.tsx
├── db/                   # Banco de dados
│   ├── index.ts         # Configuração Drizzle
│   └── schema.ts        # Schema do banco
├── domain/              # Camada de domínio
│   └── types.ts         # Types, enums e constantes
└── lib/                 # Utilitários
    ├── utils.ts         # Funções auxiliares (formatação de datas)
    └── validations.ts   # Schemas Zod
```

## 🎯 Melhorias de UX Implementadas

### 🎨 Design System
- **Cores consistentes** - Paleta de cores para prioridades e status
- **Tipografia hierárquica** - Tamanhos e pesos bem definidos
- **Espaçamento uniforme** - Grid system consistente
- **Bordas arredondadas** - Design moderno e suave

### 🔄 Feedback Visual
- **Loading states** - Indicadores de carregamento
- **Toast notifications** - Mensagens de sucesso/erro
- **Hover effects** - Feedback ao passar o mouse
- **Botões de ação ocultos** - Aparecem no hover do card

### 📅 Correção de Timezone
- **Datas corretas** - Fix para problema de timezone UTC
- **Formatação local** - Datas exibidas no formato brasileiro (dd/MM/yyyy)
- **Sem perda de dia** - Data selecionada = data exibida

### 🎭 Animações e Transições
- **Smooth transitions** - Transições suaves de 300ms
- **Scale on hover** - Botões crescem ao passar o mouse
- **Shadow elevation** - Elevação de cards no hover
- **Color transitions** - Mudanças de cor suaves

## 🎯 Arquitetura

### Clean Architecture

O projeto segue os princípios de Clean Architecture:

1. **Camada de Domínio** (`domain/`) - Entidades e tipos de negócio
2. **Camada de Aplicação** (`actions/`) - Casos de uso (Server Actions)
3. **Camada de Infraestrutura** (`db/`) - Acesso a dados
4. **Camada de Apresentação** (`components/`, `app/`) - UI

### Server Actions vs API Routes

- ✅ **Server Actions** - Usado para CRUD interno (create, read, update, delete)
- ✅ **API Route** - Usado apenas para endpoint externo (`/api/repair-orders/late`)
- ❌ **Sem fetch/axios** - Chamadas diretas via Server Actions

## 🗺️ Rotas da Aplicação

### Páginas
- **`/`** - Página principal com todas as ordens de serviço
- **`/atrasadas`** - Página dedicada para ordens com prazo vencido

### API
- **`GET /api/repair-orders/late`** - Endpoint externo para ordens atrasadas

## 🎨 Design e UX

### Interface Premium
- 💎 **Gradientes sutis** - Cards com gradiente from-white to-slate-50
- 🎨 **Cantos decorativos** - Elementos visuais em azul nos cards
- 🎯 **Badges com shadow** - Labels de prioridade e status com sombra
- 📐 **Layout consistente** - Altura mínima fixa no footer dos cards

### Responsividade
- 📱 **Mobile-first** - Design otimizado para dispositivos móveis
- 💻 **Desktop enhanced** - Recursos extras em telas grandes
- 🔄 **Grid adaptativo** - 1 coluna (mobile) → 2 (tablet) → 3 (desktop)
- 📏 **Breakpoints** - sm, md, lg para transições suaves

### Interatividade
- 🖱️ **Hover states** - Cards elevam e mudam borda ao passar mouse
- 👆 **Botões ocultos** - Editar/Deletar aparecem no hover
- ⚡ **Transições rápidas** - Animações de 200-300ms
- 🎭 **Scale effects** - Botões crescem 110% no hover

## 🔒 Validações

Todas as validações são feitas com **Zod**:

- Título: obrigatório, máx. 255 caracteres
- Descrição: obrigatória
- Local: obrigatório, máx. 255 caracteres
- Prioridade: enum validado
- Status: enum validado
- Data de conclusão: data válida

## 📝 Scripts Disponíveis

```bash
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Iniciar servidor de produção
npm run lint         # Executar ESLint
npm run test         # Executar testes unitários
npm run test:watch   # Executar testes em modo watch
npm run test:coverage # Executar testes com cobertura
npm run db:generate  # Gerar migrations
npm run db:push      # Executar migrations
npm run db:studio    # Abrir Drizzle Studio
```

## 🧪 Testes Automatizados

### 📊 Cobertura Robusta

O projeto implementa uma **suite completa de testes** com **Jest** e **React Testing Library**, garantindo qualidade e confiabilidade do código:

```
✅ 261 testes implementados
✅ 13 suites de teste
✅ 100% dos testes passando
✅ Execução rápida (~25 segundos)
```

### 🎯 Estratégia de Testes

#### Componentes UI Testados
- **Button** - Todas as variantes (primary, secondary, danger, ghost), tamanhos e estados
- **Input** - Validação de tipos, acessibilidade e estados de erro
- **Textarea** - Validação de caracteres, resize e feedback visual
- **Select** - Opções, onChange handlers e acessibilidade
- **Modal** - Abertura, fechamento, overlay e focus trap
- **Toast** - Sistema de notificações com auto-dismiss
- **Skeleton** - Estados de loading e variantes visuais

#### Componentes de Negócio Testados
- **RepairOrderCard** - Renderização completa, badges de prioridade/status e ações
- **SearchBar** - Busca em tempo real com debounce
- **Navigation** - Links ativos e navegação entre páginas
- **EmptyState** - Estados vazios e mensagens contextuais
- **StatsDashboard** - Cálculos de estatísticas e visualização de dados

#### Utilitários e Validações
- **utils.ts** - Formatação de datas (pt-BR), validação de atrasos e geração de IDs
- **validations.ts** - Schemas Zod para validação de formulários

### 🚀 Executar Testes

```bash
# Executar todos os testes
npm test

# Executar com relatório de cobertura
npm run test:coverage

# Modo watch para desenvolvimento
npm run test:watch

# Executar teste específico
npm test -- stats-dashboard.test.tsx
```

### 📁 Organização dos Testes

```
src/
├── lib/__tests__/
│   ├── utils.test.ts          # 115 testes - Funções utilitárias
│   └── validations.test.ts    # 18 testes - Schemas Zod
├── components/__tests__/
│   ├── repair-order-card.test.tsx  # 44 testes - Card de ordens
│   ├── search-bar.test.tsx         # 15 testes - Busca
│   ├── navigation.test.tsx         # 8 testes - Navegação
│   ├── empty-state.test.tsx        # 6 testes - Estado vazio
│   └── stats-dashboard.test.tsx    # 18 testes - Dashboard
└── components/ui/__tests__/
    ├── button.test.tsx         # 14 testes - Botões
    ├── input.test.tsx          # 11 testes - Inputs
    ├── textarea.test.tsx       # 9 testes - Textareas
    ├── select.test.tsx         # 9 testes - Selects
    ├── modal.test.tsx          # 8 testes - Modais
    ├── toast.test.tsx          # 7 testes - Notificações
    └── skeleton.test.tsx       # 9 testes - Loading states
```

### ✨ Boas Práticas Implementadas

#### Padrões de Código
- 🎯 **AAA Pattern** - Arrange, Act, Assert em todos os testes
- 🧹 **Clean Tests** - Testes isolados, independentes e sem side effects
- 📝 **Descritivos** - Nomenclatura clara seguindo padrão "should..."
- 🔄 **DRY** - Reutilização de mocks e helpers

#### Qualidade e Acessibilidade
- ♿ **Accessibility First** - Uso de queries acessíveis (getByRole, getByLabelText)
- 👤 **User-Centric** - Testes focados no comportamento do usuário final
- ⚡ **Performance** - Execução rápida com otimizações
- 🎨 **User Events** - Simulação realista de interações

#### Configuração Profissional
- 🔧 **Jest + SWC** - Transformação rápida de TypeScript/JSX
- 🌐 **jsdom** - Ambiente de navegador simulado
- 🎭 **Polyfills** - crypto.randomUUID, TextEncoder, TextDecoder
- 📊 **Coverage Thresholds** - Metas de cobertura configuradas

### 🏆 Destaques Técnicos

- **Compatibilidade React 19** - Testes atualizados para a versão mais recente
- **TypeScript Strict Mode** - Tipagem forte em todos os testes
- **Async Testing** - Tratamento correto de operações assíncronas com waitFor
- **Mock Strategies** - Isolamento eficiente de dependências externas
- **CI/CD Ready** - Testes preparados para integração contínua

## 🌐 Endpoint Externo

### GET /api/repair-orders/late

Retorna todas as ordens de serviço atrasadas (com `dueDate` ultrapassado e status diferente de COMPLETED ou CANCELLED).

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Reparo no elevador",
      "description": "Elevador com problema",
      "location": "Torre A",
      "priority": "URGENT",
      "status": "OPEN",
      "dueDate": "2024-01-01T00:00:00.000Z",
      "completedAt": null,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "count": 1
}
```
