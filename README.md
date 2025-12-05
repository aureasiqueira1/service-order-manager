# 🏢 Pipelore - Sistema de Gestão de Ordens de Serviço

Sistema completo de gestão de condomínios para administração de ordens de serviço de reparo, desenvolvido com Next.js 15, React 19 e TypeScript.

![Pipelore Dashboard](./src/images/pipelore1.png)
![Pipelore Ordens Atrasadas](./src/images/pipelore2.png)

## 🚀 Tecnologias

- **Next.js 15** | **React 19** | **TypeScript**
- **TailwindCSS** | **Drizzle ORM** | **MySQL**
- **Zod** | **Lucide React** | **Jest**

## ✨ Funcionalidades Principais

### CRUD Completo
- Criar, editar, deletar e listar ordens de serviço
- Formulário multi-etapas com validação em tempo real
- Modal de confirmação para exclusões

### Filtros e Busca
- Busca em tempo real por título, descrição ou local
- Filtros por status (Aberto, Em Progresso, Concluído, Cancelado)
- Ordenação por prioridade e prazo
- Contador de resultados filtrados

### Ordens Atrasadas
- Página dedicada para ordens com prazo vencido
- Ordenação por tempo de atraso
- Ações de edição e exclusão integradas

### Interface Moderna
- Design responsivo mobile-first
- Cards com gradientes e animações suaves
- Badges coloridos para prioridade e status
- Ícones contextuais e hover effects

## 📊 Modelo de Dados

```typescript
{
  id: string              // UUID
  title: string           // Máx. 255 caracteres
  description: text
  location: string        // Ex: "Torre A - Apto 101"
  priority: enum          // LOW, MEDIUM, HIGH, URGENT
  status: enum            // OPEN, IN_PROGRESS, COMPLETED, CANCELLED
  dueDate: date
  completedAt: timestamp  // Nullable
  createdAt: timestamp
  updatedAt: timestamp
}
```

## 🛠️ Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
# Crie um arquivo .env na raiz do projeto:
DATABASE_URL=mysql://mysql:docker@localhost:3306/pipelore-db

# 3. Executar migrations
npm run db:generate
npm run db:push

# 4. Iniciar servidor
npm run dev
```

Acesse em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── actions/           # Server Actions (CRUD)
├── app/               # App Router (Next.js 15)
│   ├── api/           # API Routes
│   ├── atrasadas/     # Página de ordens atrasadas
│   └── page.tsx       # Página principal
├── components/        # Componentes React
│   └── ui/            # Componentes UI reutilizáveis
├── db/                # Drizzle ORM + Schema
├── domain/            # Types e enums
└── lib/               # Utilitários e validações
```

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com separação clara de responsabilidades:

- **Domain** (`domain/`) - Entidades e tipos de negócio
- **Application** (`actions/`) - Casos de uso via Server Actions
- **Infrastructure** (`db/`) - Acesso a dados com Drizzle ORM
- **Presentation** (`components/`, `app/`) - Interface do usuário

### Rotas

- **`/`** - Dashboard principal
- **`/atrasadas`** - Ordens com prazo vencido
- **`GET /api/repair-orders/late`** - API externa para ordens atrasadas

## 📝 Scripts

```bash
npm run dev            # Servidor de desenvolvimento
npm run build          # Build para produção
npm run test           # Executar testes
npm run test:coverage  # Testes com cobertura
npm run db:generate    # Gerar migrations
npm run db:push        # Executar migrations
npm run db:studio      # Abrir Drizzle Studio
```

## 🧪 Testes

Suite completa com **Jest** e **React Testing Library**:

- ✅ **261 testes** em 13 suites
- ✅ **100% de sucesso**
- ✅ Componentes UI (Button, Input, Modal, Toast, etc.)
- ✅ Componentes de negócio (RepairOrderCard, SearchBar, etc.)
- ✅ Utilitários e validações (formatação de datas, schemas Zod)

### Executar

```bash
npm test                # Todos os testes
npm run test:coverage   # Com cobertura
npm run test:watch      # Modo watch
```

## 🌐 API

### GET /api/repair-orders/late

Retorna ordens atrasadas (prazo vencido e status ≠ COMPLETED/CANCELLED).

**Exemplo de resposta:**
```json
{
  "success": true,
  "data": [{
    "id": "uuid",
    "title": "Reparo no elevador",
    "priority": "URGENT",
    "status": "OPEN",
    "dueDate": "2024-01-01T00:00:00.000Z",
    ...
  }],
  "count": 1
}
```

## 🔄 CI/CD

O projeto possui pipelines automatizados configurados com **GitHub Actions**:

### Continuous Integration (CI)

**Arquivo:** `.github/workflows/ci.yml`

Pipeline executado em **pull requests** e **pushes na branch master**:

- ✅ **Checkout** do código
- ✅ **Setup Node.js 20** com cache npm
- ✅ **Instalação** de dependências
- ✅ **ESLint** - Verificação de qualidade de código
- ✅ **Testes** - Execução da suite completa de testes
- ✅ **Build** - Compilação do projeto Next.js

### Continuous Deployment (CD)

**Arquivo:** `.github/workflows/deploy.yml`

Pipeline de deploy automático executado em **pushes na branch master**:

- 🚀 **Checkout** do código
- 🚀 **Instalação** de dependências
- 🚀 **Build** do projeto
- 🚀 **Deploy para Vercel** usando `vercel-action`

**Secrets necessários:**
- `VERCEL_TOKEN` - Token de autenticação da Vercel
- `VERCEL_ORG_ID` - ID da organização na Vercel
- `VERCEL_PROJECT_ID` - ID do projeto na Vercel

### Fluxo de Trabalho

1. Desenvolver feature em branch separada
2. Abrir Pull Request → **CI executa automaticamente**
3. Após aprovação e merge na `master` → **Deploy automático para produção**


---
