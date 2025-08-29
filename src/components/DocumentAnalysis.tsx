import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Search, 
  Download, 
  Trash2, 
  Eye,
  Brain,
  Database
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  content: string;
  embedding?: number[];
  summary?: string;
}

interface SearchResult {
  document: Document;
  relevanceScore: number;
  matchingChunks: string[];
}

const DocumentAnalysis = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress((i / files.length) * 100);

        // Simular processamento do arquivo
        const content = await extractTextFromFile(file);
        
        // Criar documento
        const newDocument: Document = {
          id: Date.now().toString() + i,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date(),
          content,
          summary: generateSummary(content),
        };

        // Simular geração de embeddings
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDocuments(prev => [...prev, newDocument]);
        
        toast({
          title: "Documento processado",
          description: `${file.name} foi analisado e indexado com sucesso.`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Falha ao processar um ou mais documentos.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [toast]);

  const extractTextFromFile = async (file: File): Promise<string> => {
    // Simulação de extração de texto
    // Em produção, usaria pdf-parse, mammoth, etc.
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        // Simular extração de texto baseada no tipo
        if (file.type.includes('pdf')) {
          resolve(`[PDF Content] ${file.name}\n\nConteúdo extraído do PDF: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`);
        } else if (file.type.includes('word')) {
          resolve(`[Word Document] ${file.name}\n\nConteúdo do documento Word: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`);
        } else {
          resolve(content || `Conteúdo do arquivo ${file.name}`);
        }
      };
      reader.readAsText(file);
    });
  };

  const generateSummary = (content: string): string => {
    // Simulação de resumo
    const words = content.split(' ').slice(0, 50).join(' ');
    return words + '...';
  };

  const performSemanticSearch = async () => {
    if (!searchQuery.trim() || documents.length === 0) return;

    setIsSearching(true);
    
    try {
      // Simular busca semântica
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const results: SearchResult[] = documents
        .map(doc => ({
          document: doc,
          relevanceScore: Math.random() * 0.5 + 0.5, // Score entre 0.5 e 1
          matchingChunks: [
            doc.content.substring(0, 200) + '...',
            // Simular chunks relevantes
          ]
        }))
        .filter(result => 
          result.document.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.document.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "Nenhum resultado",
          description: "Não foram encontrados documentos relevantes para sua busca.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Falha ao realizar busca semântica.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Documento removido",
      description: "O documento foi removido da base de conhecimento.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload & Análise</TabsTrigger>
          <TabsTrigger value="search">Busca Semântica</TabsTrigger>
          <TabsTrigger value="library">Biblioteca</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload" className="text-base font-medium">
                  Upload de Documentos
                </Label>
                <p className="text-sm text-muted-foreground">
                  Suporte para PDF, Word, Excel, PowerPoint e arquivos de texto.
                </p>
              </div>
              
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-[hsl(var(--ai-secondary))] transition-colors">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Arraste arquivos aqui ou clique para selecionar</p>
                  <p className="text-sm text-muted-foreground">
                    Formatos suportados: PDF, DOCX, XLSX, PPTX, TXT
                  </p>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <Button
                    asChild
                    disabled={isUploading}
                    className="bg-[hsl(var(--ai-secondary))] hover:bg-[hsl(var(--ai-secondary))]/90"
                  >
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Selecionar Arquivos
                    </label>
                  </Button>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Processando documentos...</span>
                    <span className="text-sm">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Busca Semântica Inteligente</Label>
                <p className="text-sm text-muted-foreground">
                  Encontre informações relevantes usando busca baseada em significado.
                </p>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="O que você está procurando? (ex: contratos de fornecedores, relatórios financeiros)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && performSemanticSearch()}
                />
                <Button 
                  onClick={performSemanticSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-[hsl(var(--ai-primary))] hover:bg-[hsl(var(--ai-primary-dark))]"
                >
                  {isSearching ? (
                    <Brain className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span className="font-medium">
                      {searchResults.length} resultado(s) encontrado(s)
                    </span>
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {searchResults.map((result, index) => (
                        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-[hsl(var(--ai-secondary))]" />
                                <span className="font-medium">{result.document.name}</span>
                              </div>
                              <Badge variant="secondary">
                                {Math.round(result.relevanceScore * 100)}% relevante
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-muted-foreground">
                              {result.matchingChunks[0]}
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDocument(result.document)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Ver documento completo
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Biblioteca de Documentos</h3>
                  <p className="text-sm text-muted-foreground">
                    {documents.length} documento(s) indexado(s)
                  </p>
                </div>
              </div>

              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Nenhum documento carregado ainda. Faça upload de alguns arquivos para começar!
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <Card key={doc.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-[hsl(var(--ai-secondary))]" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(doc.size / 1024).toFixed(1)} KB • {doc.uploadedAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedDocument(doc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteDocument(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {doc.summary && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            <strong>Resumo:</strong> {doc.summary}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para visualizar documento */}
      {selectedDocument && (
        <Card className="fixed inset-4 z-50 bg-background border shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">{selectedDocument.name}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDocument(null)}
            >
              ✕
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <pre className="whitespace-pre-wrap text-sm">{selectedDocument.content}</pre>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

export default DocumentAnalysis;