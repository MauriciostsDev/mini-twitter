# Mini Twitter Clone

Um clone simplificado do Twitter demonstrando boas práticas de engenharia de software no Frontend, utilizando os conceitos de **Clean Architecture** aplicados ao ecossistema React.

## 🏗️ Arquitetura do Projeto

O Frontend foi desenvolvido utilizando uma variação da **Clean Architecture**, o que garante uma separação clara de responsabilidades, facilitando a escalabilidade, manutenção e a testabilidade da aplicação. A estrutura de pastas dentro de `src/` está dividida em 3 camadas principais:

### 1. Domain Layer (`src/domain/`)
A camada mais interna, que contém as regras de negócios da aplicação e não possui nenhuma dependência de bibliotecas externas de UI ou comunicação.
- **`models/`**: Interfaces e tipos de TypeScript representando as entidades principais (ex: `Post`, `User`).
- **`schemas/`**: Esquemas de validação de dados utilizando Zod, garantindo consistência dos formulários e dados manipulados (ex: `authSchema`, `postSchema`).

### 2. Data Layer (`src/data/`)
A camada responsável pela comunicação externa e persistência de dados. Implementa protocolos definidos informalmente pelo domínio.
- **`api/`**: Configuração do cliente Axios, interceptores de requisições, tratamento de headers e tokens de autenticação.
- **`repositories/`**: Classes/Objetos que encapsulam as chamadas diretas às rotas da API (`authRepository`, `postRepository`). Esta abstração impede que a interface gráfica saiba de onde ou como os dados são obtidos.

### 3. Presentation Layer (`src/presentation/`)
A camada mais externa, responsável por renderizar a interface gráfica e gerenciar o estado global ou local da visualização. Essa camada utiliza o padrão arquitetural **MVVM (Model-View-ViewModel)** na prática:
- **`components/` e `pages/` (View)**: Responsáveis puramente por exibir os dados na tela e reagir às ações do usuário.
- **`viewmodels/` (ViewModel)**: Os Hooks customizados (ex: `useFeedViewModel`) que agem como intermediários entre a View e os Repositórios (Data). Eles conectam a UI aos dados utilizando `React Query`, concentrando toda a lógica de estado de telas, buscas (queries), mutações (mutations) e atualizações otimistas da UI. Formam o "cérebro" da View.
- **`store/`**: Gerenciamento de estado global síncrono da aplicação com **Zustand** (tema claro/escuro, token e status de usuário atual, barra de pesquisa).

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **Vite** (Build Tool super rápida)
- **TypeScript**
- **Tailwind CSS v4** (Estilização via utilitários)
- **Zustand** (Gerenciador de Estado Global Síncrono)
- **TanStack React Query v5** (Gerenciamento de Estado Assíncrono / Data Fetching)
- **React Hook Form + Zod** (Gerenciamento e validação de formulários)
- **Lucide React** (Ícones SVG)

---

## 🚀 Como Rodar o Projeto Localmente

O projeto consiste em duas partes: um Backend (Elysia + Bun) localizado na pasta `mini-twitter-backend-main` e o próprio Frontend em React + Vite. Siga as instruções para rodar os dois:

### Pré-requisitos
- Ter o [Node.js](https://nodejs.org/) instalado.
- Ter o [Bun](https://bun.sh/) instalado globalmente para o Backend (você pode instalá-lo usando `npm i -g bun`).

### 1. Rodando o Backend
O backend roda com Bun e Elysia na porta padrão `3000`.

1. Acesse o diretório do backend na raiz do projeto:
   ```bash
   cd mini-twitter-backend-main
   ```
2. Instale as dependências com o Bun (se ainda não fez):
   ```bash
   bun install
   ```
3. Inicie o servidor em modo de desenvolvimento:
   ```bash
   bun run dev
   ```

### 2. Rodando o Frontend
O frontend roda com Vite na porta padrão `5173`.

1. Em um terminal separado, acesse a pasta raiz do projeto (`mini-twitter`).
2. Instale as dependências usando NPM:
   ```bash
   npm install
   ```
3. Inicie a aplicação Vite:
   ```bash
   npm run dev
   ```

A aplicação estará disponível em [http://localhost:5173](http://localhost:5173).
