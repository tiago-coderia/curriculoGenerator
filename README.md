# CurriculoGenerator (AutoResume ATS)

O **CurriculoGenerator** é uma aplicação web moderna e inteligente desenvolvida em **Next.js 15**, focada na gestão de perfis profissionais, análise detalhada de vagas de emprego e geração automatizada de currículos sob medida (tailored) otimizados para sistemas de triagem **ATS (Applicant Tracking System)**.

A plataforma utiliza inteligência artificial para mapear experiências, habilidades e conquistas do candidato, alinhando-as com as exigências específicas de cada vaga e permitindo exportação direta em formatos **PDF** e **DOCX**.

---

## 🚀 Funcionalidades Principais

- 👤 **Perfil Completo do Candidato:** Cadastro de dados pessoais, resumo, histórico profissional, formação acadêmica, habilidades categorizadas, projetos e certificações.
- 💡 **Base de Conhecimento (Knowledge Items):** Mapeamento granular de arquiteturas, metodologias, conquistas e conhecimentos técnicos do candidato para refinamento pela IA.
- 🎯 **Análise Inteligente de Vagas:** Extração automatizada de palavras-chave, hard/soft skills necessárias, responsabilidades, nível de senioridade e recomendações para aprovação em ATS.
- 🤖 **Geração de Currículos com IA:** Criação de currículos adaptados para vagas específicas, com cálculo de pontuação ATS e verificação factual de informações.
- 📄 **Exportação Multiformato:** Download do currículo finalizado em formato **PDF** elegante (com layout limpo) ou em arquivo **DOCX** editável.
- 🔌 **Suporte Multi-Provedor de IA:** Compatibilidade nativa com **Azure OpenAI (gpt-5.2)**, **OpenAI** e **Google Gemini**.
- 🔒 **Proteção de Acesso Simples:** Autenticação leve configurada via e-mail autorizado e senha.

---

## 🛠️ Tecnologias Utilizadas

- **Framework Web:** [Next.js 15](https://nextjs.org/) (App Router & React 19)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + Lucide React (Ícones)
- **Banco de Dados & ORM:** SQLite com [Prisma ORM](https://www.prisma.io/)
- **Integrações de IA:** `@google/generative-ai`, `openai`, Azure OpenAI Service
- **Exportação de Documentos:** `@react-pdf/renderer` (PDF) e `docx` (Word)
- **Testes & Ferramentas:** Vitest, TSX
- **Containerização:** Docker e Docker Compose

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- **Node.js** (versão 18.x ou superior)
- **npm** (incluso com Node.js)
- **Docker** e **Docker Compose** *(opcional, para execução via containers)*

---

## ⚙️ Variáveis de Ambiente (`.env`)

Crie um arquivo `.env` na raiz do projeto copiando a estrutura de `.env.example`:

```bash
cp .env.example .env
```

Configure as variáveis de ambiente conforme necessário. **Nunca compartilhe ou envie suas chaves reais para o repositório.**

Exemplo de configuração (`.env`):

```env
# Banco de Dados (SQLite Local)
DATABASE_URL="file:./dev.db"

# Provedor de IA Utilizado
# Opções válidas: "azure", "openai", "gemini"
AI_PROVIDER="azure"

# Azure OpenAI / Azure Foundry Config (gpt-5.2)
AZURE_OPENAI_ENDPOINT="https://seu-endpoint-azure.openai.azure.com/"
AZURE_OPENAI_API_KEY="sua_chave_api_azure_aqui"

# OpenAI Config (opcional se usar AI_PROVIDER="openai")
OPENAI_API_KEY="sua_chave_api_openai_aqui"

# Google Gemini Config (opcional se usar AI_PROVIDER="gemini")
GEMINI_API_KEY="sua_chave_api_gemini_aqui"

# Configurações de Autenticação e Acesso
AUTHORIZED_EMAIL="seu-email@exemplo.com"
AUTH_SECRET="sua_chave_secreta_de_sessao_aqui"
```

---

## 🚀 Como Executar o Projeto

### Opção 1: Desenvolvimento Local (Node.js)

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Execute as migrações do banco de dados (Prisma):**
   ```bash
   npx prisma db push
   ```

3. **(Opcional) Popule o banco com dados de teste:**
   ```bash
   npm run db:seed
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. Acesse no navegador: [http://localhost:3000](http://localhost:3000)

---

### Opção 2: Execução com Docker Compose

Você pode subir toda a aplicação usando Docker Compose de forma simples:

1. Certifique-se de que o arquivo `.env` está configurado na raiz.
2. Execute o comando de build e subida do container:
   ```bash
   docker-compose up -d --build
   ```
3. A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts Disponíveis

No arquivo `package.json`, você encontrará os seguintes scripts:

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o ambiente de desenvolvimento Next.js. |
| `npm run build` | Compila o projeto para produção. |
| `npm run start` | Inicia o servidor de produção compilado. |
| `npm run lint` | Executa a verificação estática do código (ESLint). |
| `npm run db:push` | Atualiza o esquema do banco SQLite com o Prisma. |
| `npm run db:seed` | Popula o banco de dados com a seed padrão. |
| `npm run db:studio` | Abre a interface visual do Prisma Studio para inspecionar o banco. |
| `npm run test` | Executa os testes unitários utilizando Vitest. |

---

## 📁 Estrutura do Projeto

```text
curriculoGenerator/
├── app/                  # Rotas, páginas e APIs (Next.js App Router)
├── components/           # Componentes de interface (UI, Forms, Modais, Layouts)
├── lib/                  # Utilitários, provedores de IA, clientes e configs
├── prisma/               # Schema do banco de dados, migrações e seed
├── prompts/              # Prompts estruturados para extração e geração por IA
├── services/             # Lógica de negócios (análise de vagas, PDF/DOCX, ATS)
├── types/                # Definições de tipos TypeScript
├── Dockerfile            # Arquivo de build de imagem Docker
├── docker-compose.yml    # Configuração de containers Docker
└── package.json          # Dependências e scripts do projeto
```

---

## 🛡️ Segurança

- O arquivo `.env` já se encontra listado no `.gitignore` para evitar envio acidental de chaves de API ou segredos.
- Para ambiente de produção, certifique-se de utilizar chaves fortes para `AUTH_SECRET` e restrições de acesso adequadas.

---

## 📄 Licença

Este projeto é de uso privado / desenvolvimento.
