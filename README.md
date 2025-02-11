# Columbus Test - Projeto de Logística Internacional

Este projeto foi desenvolvido como parte do teste técnico para a Columbus, empresa de logística internacional. O objetivo é demonstrar habilidades em desenvolvimento front-end com tecnologias modernas, como Vite com JSX, Tailwind, HeroUI, React Hook Form e Supabase.

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-Requisitos](#pré-requisitos)
- [Como Rodar o Projeto Localmente](#como-rodar-o-projeto-localmente)
- [Resumo tecnico](#resumo-tecnico)

## Sobre o Projeto

Este projeto possui as seguintes telas:

- **Tela de Login (Signin.jsx):**  
  - Campos: Email, Senha, Checkbox "Manter conectado", link "Esqueci minha senha", botões para logar e criar conta.

- **Tela de Cadastro (Signup.jsx):**  
  - Campos: Nome, Email, Senha, Confirmar Senha, botões para cadastrar e voltar para a tela de login.

- **Tela Dashboard (Dashboard.jsx):**  
  - Área reservada ao diferencial tecnico.

- **Tela Esqueci Minha Senha (ForgotPassword.jsx):**  
  - Permite solicitar o reset de senha via e-mail.

- **Tela Reset Password (ResetPassword.jsx):**  
  - Permite que o usuário redefina sua senha através do link enviado pelo Supabase.

A autenticação, cadastro e recuperação de senha são realizados via Supabase Authentication. Além disso, foram implementadas validações nos formulários utilizando o React Hook Form.

## Tecnologias Utilizadas

- **Vite:** Ferramenta de build e desenvolvimento super rápida para projetos React.
- **React:** Biblioteca para construção de interfaces de usuário.
- **TailwindCSS:** Framework CSS para estilização rápida e responsiva.
- **HeroUI:** Biblioteca de componentes UI com base em Tailwind.
- **React Hook Form:** Gerenciamento e validação de formulários.
- **Supabase:** Backend-as-a-Service para autenticação e banco de dados.
- **React Router:** Navegação entre as diferentes páginas da aplicação.

## Pré-Requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- **Node.js** (versão 16 ou superior)  
  *Verifique com:*  
  ```bash
  node -v
  ```

## Como Rodar o Projeto Localmente

- **node_modules** 
```bash
  npm install
```

- **RUN**

```bash
  npm run dev
```
# Resumo tecnico

#### Um breve resumo explicando a funcionalidade extra implementada na segunda tela

# Dashboard de Gerenciamento de Projetos

**Diferencial Técnico Principal**:  

## Funcionalidades Implementadas

### Core Features
- **Filtragem por Status** via Sidebar Stars (4 status diferentes)
- **Drag-and-Drop** intuitivo para reordenar projetos
- **CRUD Completo** de projetos e tarefas
- **Design Responsivo** (1-3 colunas conforme tamanho da tela)
- **Badges de Status** com cores contextualizadas
- **Sistema de Tarefas** com:
  - Adição/Edição/Exclusão
  - Marcagem de conclusão
  - Filtragem por categoria
  - Categorização dinâmica
