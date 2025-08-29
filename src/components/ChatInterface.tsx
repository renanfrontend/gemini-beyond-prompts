import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { getGeminiModel, initializeGemini } from '@/lib/gemini';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string[];
}

const ChatInterface = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const configureGemini = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira sua chave de API do Google Gemini",
        variant: "destructive",
      });
      return;
    }
    
    try {
      initializeGemini(apiKey);
      setIsConfigured(true);
      toast({
        title: "Sucesso",
        description: "Google Gemini configurado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao configurar o Gemini. Verifique sua chave de API.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !isConfigured) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const model = getGeminiModel();
      
      // Construir contexto da conversa
      const contextPrompt = conversationContext.length > 0 
        ? `Contexto da conversa anterior: ${conversationContext.join(' ')}\n\n`
        : '';
      
      const systemPrompt = `Você é um assistente IA especializado e inteligente. Responda de forma útil, precisa e contextualizada. 
      ${contextPrompt}Pergunta do usuário: ${input}`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
        context: [...conversationContext.slice(-5)], // Manter últimas 5 interações
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Atualizar contexto da conversa
      setConversationContext(prev => [
        ...prev.slice(-8), // Manter últimas 8 mensagens
        `User: ${input}`,
        `Assistant: ${text.substring(0, 200)}...` // Resumo da resposta
      ]);

    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar resposta. Verifique sua conexão e chave de API.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isConfigured) {
    return (
      <div className="space-y-6">
        <Card className="p-6 border-2 border-dashed border-[hsl(var(--ai-primary))] bg-gradient-to-r from-[hsl(var(--ai-primary)/0.05)] to-[hsl(var(--ai-accent)/0.05)]">
          <div className="text-center space-y-4">
            <div className="p-3 rounded-full bg-[hsl(var(--ai-primary))] w-fit mx-auto">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Configure o Google Gemini</h3>
            <p className="text-muted-foreground">
              Para começar, você precisa configurar sua chave de API do Google Gemini.
            </p>
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Chave de API do Google Gemini</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Insira sua chave de API..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <Button 
                onClick={configureGemini}
                className="w-full bg-[hsl(var(--ai-primary))] hover:bg-[hsl(var(--ai-primary-dark))]"
              >
                Configurar Gemini
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-[hsl(var(--ai-primary)/0.1)] text-[hsl(var(--ai-primary))]">
            ✓ Gemini Configurado
          </Badge>
          <Badge variant="outline">
            {messages.length} mensagens
          </Badge>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurações do Chat</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-api-key">Atualizar Chave de API</Label>
                <Input
                  id="new-api-key"
                  type="password"
                  placeholder="Nova chave de API..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <Button onClick={configureGemini} className="w-full">
                Atualizar Configuração
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="h-[500px] flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Comece uma conversa com seu assistente IA!</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[hsl(var(--ai-primary))] text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-[hsl(var(--ai-primary))] text-white'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[hsl(var(--ai-primary))] text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !input.trim()}
              className="bg-[hsl(var(--ai-primary))] hover:bg-[hsl(var(--ai-primary-dark))]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;