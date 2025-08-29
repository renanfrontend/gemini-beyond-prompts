import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Brain, 
  Workflow,
  CheckCircle,
  Circle,
  Clock,
  Zap,
  Target
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  capabilities: string[];
  lastExecution?: Date;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  agents: string[];
  status: 'draft' | 'running' | 'completed';
  steps: WorkflowStep[];
  progress: number;
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  agent?: string;
  output?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assignedAgent?: string;
  createdAt: Date;
  completedAt?: Date;
}

const PersonalAssistant = () => {
  const { toast } = useToast();
  const [agents] = useState<Agent[]>([
    {
      id: 'research',
      name: 'Agente de Pesquisa',
      description: 'Especializado em buscar e analisar informações na web e documentos',
      status: 'idle',
      progress: 0,
      capabilities: ['Web Search', 'Document Analysis', 'Data Extraction'],
    },
    {
      id: 'planning',
      name: 'Agente de Planejamento',
      description: 'Cria planos detalhados e organiza tarefas complexas',
      status: 'idle',
      progress: 0,
      capabilities: ['Task Planning', 'Project Management', 'Resource Allocation'],
    },
    {
      id: 'execution',
      name: 'Agente de Execução',
      description: 'Executa tarefas automatizadas e integrações com sistemas',
      status: 'idle',
      progress: 0,
      capabilities: ['API Integration', 'Automation', 'Data Processing'],
    },
  ]);

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'market-research',
      name: 'Pesquisa de Mercado Completa',
      description: 'Análise abrangente de mercado com relatório final',
      agents: ['research', 'planning'],
      status: 'draft',
      progress: 0,
      steps: [
        {
          id: 'step1',
          name: 'Coleta de Dados',
          description: 'Buscar informações relevantes sobre o mercado',
          status: 'pending',
          agent: 'research',
        },
        {
          id: 'step2',
          name: 'Análise de Dados',
          description: 'Processar e analisar as informações coletadas',
          status: 'pending',
          agent: 'planning',
        },
        {
          id: 'step3',
          name: 'Geração de Relatório',
          description: 'Criar relatório final com insights e recomendações',
          status: 'pending',
          agent: 'execution',
        },
      ],
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task1',
      title: 'Analisar documentos de fornecedores',
      description: 'Revisar e extrair informações dos contratos de fornecedores',
      priority: 'high',
      status: 'pending',
      assignedAgent: 'research',
      createdAt: new Date(),
    },
    {
      id: 'task2',
      title: 'Criar cronograma de projeto',
      description: 'Desenvolver timeline detalhado para o novo projeto',
      priority: 'medium',
      status: 'pending',
      assignedAgent: 'planning',
      createdAt: new Date(),
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const executeWorkflow = async (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: 'running', progress: 0 }
        : w
    ));

    // Simular execução de workflow
    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      
      // Atualizar status do step atual
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId
          ? {
              ...w,
              steps: w.steps.map(s => 
                s.id === step.id 
                  ? { ...s, status: 'running' }
                  : s
              ),
              progress: ((i + 0.5) / workflow.steps.length) * 100
            }
          : w
      ));

      // Simular tempo de execução
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Completar step
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId
          ? {
              ...w,
              steps: w.steps.map(s => 
                s.id === step.id 
                  ? { 
                      ...s, 
                      status: 'completed',
                      output: `Resultado da execução: ${step.name} concluído com sucesso.`
                    }
                  : s
              ),
              progress: ((i + 1) / workflow.steps.length) * 100
            }
          : w
      ));
    }

    // Finalizar workflow
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: 'completed', progress: 100 }
        : w
    ));

    toast({
      title: "Workflow Concluído",
      description: `${workflow.name} foi executado com sucesso!`,
    });
  };

  const createTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      priority: newTaskPriority,
      status: 'pending',
      createdAt: new Date(),
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    
    toast({
      title: "Tarefa Criada",
      description: "Nova tarefa adicionada à lista de execução.",
    });
  };

  const executeTask = async (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, status: 'in_progress' }
        : t
    ));

    // Simular execução da tarefa
    await new Promise(resolve => setTimeout(resolve, 3000));

    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, status: 'completed', completedAt: new Date() }
        : t
    ));

    toast({
      title: "Tarefa Concluída",
      description: "A tarefa foi executada com sucesso pelos agentes.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running':
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">Agentes IA</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="create">Criar Novo</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {agent.description}
                      </p>
                    </div>
                    <Badge variant={agent.status === 'idle' ? 'secondary' : 'default'}>
                      {agent.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Capacidades:</Label>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.map((capability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {agent.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progresso</span>
                        <span>{agent.progress}%</span>
                      </div>
                      <Progress value={agent.progress} />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Configurar
                    </Button>
                    <Button 
                      size="sm"
                      className="flex-1 bg-[hsl(var(--ai-accent))] hover:bg-[hsl(var(--ai-accent))]/90"
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      Ativar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{workflow.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {workflow.description}
                    </p>
                  </div>
                  <Badge variant={workflow.status === 'draft' ? 'secondary' : 'default'}>
                    {workflow.status}
                  </Badge>
                </div>

                {workflow.progress > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progresso do Workflow</span>
                      <span>{Math.round(workflow.progress)}%</span>
                    </div>
                    <Progress value={workflow.progress} />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm">Etapas do Workflow:</Label>
                  <div className="space-y-2">
                    {workflow.steps.map((step) => (
                      <div key={step.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                        {getStatusIcon(step.status)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{step.name}</p>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                          {step.output && (
                            <p className="text-xs text-green-600 mt-1">{step.output}</p>
                          )}
                        </div>
                        {step.agent && (
                          <Badge variant="outline" className="text-xs">
                            {step.agent}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => executeWorkflow(workflow.id)}
                    disabled={workflow.status === 'running'}
                    className="bg-[hsl(var(--ai-primary))] hover:bg-[hsl(var(--ai-primary-dark))]"
                  >
                    {workflow.status === 'running' ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Executando...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Executar Workflow
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <Workflow className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Lista de Tarefas</h3>
                <Badge variant="outline">
                  {tasks.filter(t => t.status === 'pending').length} pendentes
                </Badge>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <Card key={task.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(task.status)}
                              <h4 className="font-medium">{task.title}</h4>
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Criada em: {task.createdAt.toLocaleDateString()}</span>
                              {task.assignedAgent && (
                                <Badge variant="outline" className="text-xs">
                                  {task.assignedAgent}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {task.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => executeTask(task.id)}
                            className="bg-[hsl(var(--ai-secondary))] hover:bg-[hsl(var(--ai-secondary))]/90"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Executar Tarefa
                          </Button>
                        )}

                        {task.status === 'completed' && task.completedAt && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Concluída em {task.completedAt.toLocaleString()}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Criar Nova Tarefa</h3>
                <p className="text-sm text-muted-foreground">
                  Defina uma nova tarefa para ser executada pelos agentes IA.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Título da Tarefa</Label>
                  <Input
                    id="task-title"
                    placeholder="Ex: Analisar relatórios de vendas"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-description">Descrição Detalhada</Label>
                  <Textarea
                    id="task-description"
                    placeholder="Descreva o que você quer que os agentes façam..."
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map((priority) => (
                      <Button
                        key={priority}
                        variant={newTaskPriority === priority ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewTaskPriority(priority)}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(priority)}`} />
                        {priority === 'low' ? 'Baixa' : priority === 'medium' ? 'Média' : 'Alta'}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={createTask}
                  disabled={!newTaskTitle.trim()}
                  className="w-full bg-[hsl(var(--ai-accent))] hover:bg-[hsl(var(--ai-accent))]/90"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Criar Tarefa
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalAssistant;