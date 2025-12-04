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
- ➕ Criar nova ordem de serviço
- 📝 Editar ordem existente
- 🗑️ Deletar ordem (com confirmação)
- 📋 Listar todas as ordens

### 🔍 Filtros e Visualização
- Filtrar ordens por status (Aberto, Em Progresso, Concluído, Cancelado)
- Cards visuais com informações detalhadas
- Indicadores de prioridade (Baixa, Média, Alta, Urgente)
- Alerta visual para ordens atrasadas

### 🌐 API Externa
- **GET /api/repair-orders/late** - Retorna ordens atrasadas

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

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=mysql://user:password@host:port/database
```

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
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/           # Componentes React
│   ├── ui/              # Componentes UI reutilizáveis
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   └── modal.tsx
│   ├── repair-order-card.tsx
│   ├── repair-order-form.tsx
│   ├── repair-orders-list.tsx
│   └── delete-confirmation-modal.tsx
├── db/                   # Banco de dados
│   ├── index.ts         # Configuração Drizzle
│   └── schema.ts        # Schema do banco
├── domain/              # Camada de domínio
│   └── types.ts         # Types e constantes
└── lib/                 # Utilitários
    ├── utils.ts         # Funções auxiliares
    └── validations.ts   # Schemas Zod
```

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

## 🎨 Design e UX

- Interface limpa e moderna
- Design responsivo (mobile-first)
- Feedback visual para ações do usuário
- Modais para formulários e confirmações
- Indicadores visuais de status e prioridade
- Alertas para ordens atrasadas

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
npm run db:generate  # Gerar migrations
npm run db:push      # Executar migrations
npm run db:studio    # Abrir Drizzle Studio
```

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

## 🚀 Deploy

O projeto está pronto para deploy em plataformas como:

- Vercel (recomendado para Next.js)
- Netlify
- AWS
- Google Cloud

Certifique-se de configurar a variável de ambiente `DATABASE_URL` na plataforma de deploy.

## 📄 Licença

Este projeto foi desenvolvido como parte do sistema Pipelore.

---

Desenvolvido com ❤️ usando Next.js 15 e React 19
