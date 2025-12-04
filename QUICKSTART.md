# Guia de Inicio Rapido - Pipelore

## Passos para Rodar o Projeto

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Banco de Dados

Crie um arquivo `.env` na raiz do projeto com sua URL do MySQL:

```env
DATABASE_URL=mysql://user:password@host:port/database
```

### 3. Criar Tabelas no Banco

Execute o comando para criar as tabelas automaticamente:

```bash
npm run db:push
```

### 4. Iniciar o Servidor

```bash
npm run dev
```

Acesse: http://localhost:3000

## Testando a Aplicacao

### Criar uma Ordem de Servico

1. Clique no botao "Nova Ordem"
2. Preencha o formulario
3. Clique em "Criar"

### Filtrar Ordens

Use o dropdown de filtro para visualizar ordens por status.

### Editar uma Ordem

1. Clique no icone de lapis no card da ordem
2. Modifique os campos desejados
3. Clique em "Atualizar"

### Deletar uma Ordem

1. Clique no icone de lixeira no card da ordem
2. Confirme a exclusao no modal

## Testando o Endpoint Externo

GET /api/repair-orders/late

Teste no navegador:
http://localhost:3000/api/repair-orders/late

## Comandos Uteis

```bash
npm run dev              # Iniciar servidor de desenvolvimento
npm run build            # Criar build de producao
npm run start            # Iniciar servidor de producao
npm run db:push          # Aplicar schema no banco
npm run db:studio        # Abrir Drizzle Studio
npm run lint             # Executar ESLint
```

## Prioridades Disponiveis

- LOW - Baixa
- MEDIUM - Media
- HIGH - Alta
- URGENT - Urgente

## Status Disponiveis

- OPEN - Aberto
- IN_PROGRESS - Em Progresso
- COMPLETED - Concluido
- CANCELLED - Cancelado
