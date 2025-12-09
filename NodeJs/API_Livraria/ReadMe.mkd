# 📚 Introdução

Este é um projeto desenvolvido durante as aulas da matéria de **Desenvolvimento Web I** do curso de **Bacharelado em Ciência da Computação**, fornecido pelo **Instituto Federal Catarinense – Campus Videira** e ministrada pelo **prof. Fabricio Bizoto**.

O projeto final consiste em um sistema de gerenciamento de livraria utilizando uma **API RESTful**. Como desafio para o projeto final foram fornecidas **5 opções de tarefas** para expandir o sistema, das quais **3 deveriam ser implementadas**.

Dentro das funcionalidades escolhidas para serem adicionadas estão:

- ✔️ Criação de uma nova tabela (**Reviews**)  
- ✔️ Upload de imagem de capa do livro  
- ✔️ Sistema de **Favoritos**  
- ✔️ Sistema de **Tema Claro/Escuro** no frontend  

---

## 🛠️ Tecnologias Utilizadas

### 🔧 Backend
- **Node.js**
- **Express**
- **SQLite** (better-sqlite3 e sqlite3)
- **Multer**
- **Express-session**
- **Bcrypt**
- **Morgan**
- **Dotenv**

### 🎨 Frontend
- **React**
- **React Router DOM**
- **Vite**
- **Axios**

---

## ⚙️ Preparação do Ambiente

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão recomendada: 18+)  
- **NPM** (vem junto com o Node)  
- **Git** (opcional, mas recomendado)  

---

## 📦 Instalando o Backend

1. **Acesse a pasta do backend:**
   ```bash
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

### 📘 Dependências principais registradas:

```json
{
  "axios": "^1.13.2",
  "bcrypt": "^6.0.0",
  "better-sqlite3": "^12.4.1",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.1.0",
  "express-session": "^1.18.2",
  "morgan": "^1.10.1",
  "multer": "^2.0.2",
  "react": "^19.2.0",
  "react-router-dom": "^6.30.2",
  "sqlite3": "^5.1.7"
}
```

---

## 💻 Instalando o Frontend

1. **Acesse a pasta do frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

### 📘 Dependências principais registradas:

```json
{
  "axios": "^1.13.2",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^6.30.2"
}
```

---

## 🚀 Como Rodar o Projeto

### ▶️ Executando o Backend

Na pasta **backend**, execute:

```bash
npm run dev
```

Isso iniciará o servidor **Express** com **nodemon** em modo de desenvolvimento.

---

### ▶️ Executando o Frontend

Na pasta **frontend**, execute:

```bash
npm run dev
```

O **Vite** iniciará o servidor de desenvolvimento em:

👉 **http://localhost:3000**

---
