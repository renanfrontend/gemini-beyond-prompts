
# Sistema de IA Avançado com Gemini, RAG e LangGraph

![Interface do Sistema de IA Avançado] https://gemini-beyond-prompts.vercel.app/

Este projeto é uma demonstração poderosa e completa de um sistema de Inteligência Artificial multifuncional, construído com tecnologias de ponta. Ele integra o poder do **Google Gemini** para conversação inteligente, a técnica **RAG (Retrieval-Augmented Generation)** para análise profunda de documentos e o **LangGraph** para orquestração de agentes autônomos que executam tarefas complexas.

A interface moderna e intuitiva, desenvolvida em Next.js e TypeScript, oferece uma experiência de usuário fluida e centraliza três módulos principais em um único local.

---

## ✨ Funcionalidades Principais

O sistema é dividido em três áreas principais, cada uma com funcionalidades avançadas:

### 🤖 1. Chat Especializado (com Gemini)
- **Conversação com Memória:** Interaja com um assistente de IA que mantém o contexto de suas conversas anteriores para fornecer respostas mais precisas e relevantes.
- **Configuração Segura:** Sua chave de API do Google Gemini é gerenciada de forma segura no lado do cliente, garantindo que ela nunca seja exposta.
- **Interface Intuitiva:** Um layout de chat familiar com indicadores de digitação, timestamps e gerenciamento de histórico.

### 📄 2. Análise de Documentos (com RAG)
- **Upload Flexível:** Carregue múltiplos documentos de diversos formatos, como PDF, Word (.docx), Excel (.xlsx) e texto.
- **Busca Semântica:** Vá além da busca por palavras-chave. Pergunte em linguagem natural e encontre os trechos mais relevantes dentro de sua base de conhecimento, com base no significado e contexto.
- **Biblioteca Inteligente:** Todos os documentos são processados, indexados e organizados em uma biblioteca, com resumos gerados automaticamente.

### 🎯 3. Assistente Pessoal (com LangGraph)
- **Agentes Autônomos:** Utilize agentes de IA pré-configurados (Pesquisa, Planejamento, Execução) que possuem capacidades específicas para resolver problemas.
- **Workflows Complexos:** Crie e execute fluxos de trabalho que combinam as habilidades de múltiplos agentes para realizar tarefas complexas, como uma pesquisa de mercado completa.
- **Gerenciamento de Tarefas:** Atribua tarefas individuais aos agentes, defina prioridades e acompanhe o status de execução em tempo real.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [Next.js](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **IA Generativa:** [Google Gemini 1.5 Pro](https://deepmind.google/technologies/gemini/)
- **Embeddings:** `embedding-001` (Google AI)
- **Orquestração de Agentes:** Conceitos de [LangGraph](https://langchain-ai.github.io/langgraph/)
- **Técnica de Busca:** [RAG (Retrieval-Augmented Generation)](https://research.ibm.com/blog/retrieval-augmented-generation)
- **UI/Componentes:** [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para clonar e rodar o projeto em seu ambiente local.

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Git](https://git-scm.com/)
- Uma **chave de API do Google Gemini**. Você pode obter uma no [Google AI Studio](https://aistudio.google.com/app/apikey).

### 1. Clonar o Repositório
Abra seu terminal e clone o projeto usando o seguinte comando:
```bash
git clone [https://github.com/renanfrontend/gemini-beyond-prompts.git](https://github.com/renanfrontend/gemini-beyond-prompts.git)

2. Navegar para o Diretório
Entre na pasta do projeto que você acabou de clonar:
cd gemini-beyond-prompts

3. Instalar as Dependências
Instale todas as dependências necessárias com o npm (ou seu gerenciador de pacotes preferido):
npm install

4. Executar o Projeto
Inicie o servidor de desenvolvimento:
npm run dev

5. Abrir no Navegador
Abra seu navegador e acesse http://localhost:3000.
🔧 Configuração Inicial
Ao iniciar o aplicativo pela primeira vez, você precisará configurar sua chave de API do Google Gemini para ativar as funcionalidades de IA.
 * Acesse a aba "Chat Especializado".
 * Insira sua chave de API do Google Gemini no campo solicitado.
 * Clique no botão "Configurar Gemini".
Uma vez configurado, o sistema estará pronto para uso! Você pode começar a conversar com o assistente, fazer upload de documentos e explorar os workflows dos agentes.
Aproveite o poder da IA generativa e dos sistemas autônomos! 🎉

