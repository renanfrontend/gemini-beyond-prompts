import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Bot, FileText, User, Brain, Upload, MessageCircle } from 'lucide-react';
import ChatInterface from './ChatInterface';
import DocumentAnalysis from './DocumentAnalysis';
import PersonalAssistant from './PersonalAssistant';

const Layout = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-[hsl(var(--ai-primary))] to-[hsl(var(--ai-accent))]">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--ai-primary))] to-[hsl(var(--ai-accent))] bg-clip-text text-transparent">
                Sistema IA Avançado
              </h1>
              <p className="text-sm text-muted-foreground">Gemini • RAG • LangGraph</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px] mx-auto">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat Especializado
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Análise de Documentos
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Assistente Pessoal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="h-5 w-5 text-[hsl(var(--ai-primary))]" />
                <h2 className="text-xl font-semibold">Chat Inteligente com Gemini</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Converse com um assistente IA especializado que mantém contexto e aprende com suas interações.
              </p>
              <ChatInterface />
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Upload className="h-5 w-5 text-[hsl(var(--ai-secondary))]" />
                <h2 className="text-xl font-semibold">Análise de Documentos RAG</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Faça upload de documentos (PDF, Word, Excel) e obtenha insights inteligentes com busca semântica.
              </p>
              <DocumentAnalysis />
            </Card>
          </TabsContent>

          <TabsContent value="assistant" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-5 w-5 text-[hsl(var(--ai-accent))]" />
                <h2 className="text-xl font-semibold">Assistente Pessoal LangGraph</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Agentes autônomos que executam workflows complexos e tomam decisões inteligentes.
              </p>
              <PersonalAssistant />
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Layout;