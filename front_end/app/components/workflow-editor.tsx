"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  type Connection,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  type Node,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Save,
  Upload,
  Settings,
  Bot,
  Search,
  Code,
  Calculator,
  Globe,
  Calendar,
  BarChart,
  Zap,
  X,
  Sliders,
  Plus,
  PlayCircle,
  Maximize2,
  Minimize2,
  Send,
  User,
  Copy,
  Check,
  MessageSquare,
  Wrench,
  Info,
  Clock,
  Trash2,
  Tag,
  Pencil,
} from "lucide-react"
import { LLMNode } from "./workflow/llm-node"
import { ToolNode } from "./workflow/tool-node"
import { CustomEdge } from "./workflow/custom-edge"
import { NodeSelector } from "./workflow/node-selector"
import { NodeProperties } from "./workflow/node-properties"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Resizable } from "re-resizable"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

// Define custom node types
const nodeTypes: NodeTypes = {
  llmNode: LLMNode,
  toolNode: ToolNode,
}

// Define custom edge types
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: "1",
    type: "llmNode",
    position: { x: 250, y: 100 },
    data: {
      label: "GPT-4",
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: "You are a helpful assistant.",
    },
  },
  {
    id: "2",
    type: "toolNode",
    position: { x: 250, y: 300 },
    data: {
      label: "Web Search",
      toolType: "search",
      description: "Search the web for information",
      parameters: [{ name: "query", type: "string", required: true }],
    },
  },
]

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "custom",
    animated: true,
  },
]

type Message = {
  role: "user" | "assistant" | "system" | "tool"
  content: string
  timestamp: string
  toolName?: string
  executionTime?: number
}

export default function WorkflowEditor() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [workflowName, setWorkflowName] = useState<string>("新工作流")
  const [workflowDescription, setWorkflowDescription] = useState<string>("")
  const router = useRouter()

  // State for panels
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState<boolean>(false)
  const [isComponentPanelOpen, setIsComponentPanelOpen] = useState<boolean>(false)
  const [sidebarTab, setSidebarTab] = useState<string>("nodes")

  // State for interaction panel
  const [isInteractionPanelOpen, setIsInteractionPanelOpen] = useState<boolean>(false)
  const [isInteractionPanelMaximized, setIsInteractionPanelMaximized] = useState<boolean>(false)
  const [interactionPanelWidth, setInteractionPanelWidth] = useState<number>(400)
  const [interactionPanelHeight, setInteractionPanelHeight] = useState<number>(500)

  // Chat interaction state
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // State for preview mode
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false)

  // 添加选中边的状态和处理函数:
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)

  // 添加边标签编辑状态
  const [isEditingEdgeLabel, setIsEditingEdgeLabel] = useState(false)
  const [edgeLabelValue, setEdgeLabelValue] = useState("")

  // 添加边点击位置状态，用于定位下拉菜单
  const [edgeClickPosition, setEdgeClickPosition] = useState({ x: 0, y: 0 })

  // 添加边下拉菜单状态
  const [isEdgeMenuOpen, setIsEdgeMenuOpen] = useState(false)

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: "custom", animated: true }, eds)),
    [setEdges],
  )

  // Handle node selection
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node)
      setIsComponentPanelOpen(true)
      setSidebarTab("properties")
      setSelectedEdge(null)
      setIsEdgeMenuOpen(false)
    },
    [setSelectedNode],
  )

  // 添加边的选择处理函数:
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation()
    setSelectedEdge(edge)
    setSelectedNode(null)
    setEdgeLabelValue(edge.data?.label || "")

    // 记录点击位置，用于定位下拉菜单
    setEdgeClickPosition({ x: event.clientX, y: event.clientY })
    setIsEdgeMenuOpen(true)
  }, [])

  // 处理画布点击取消选择
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
    setIsEdgeMenuOpen(false)
    setIsEditingEdgeLabel(false)
  }, [])

  // Add a new node to the canvas
  const addNode = useCallback(
    (nodeType: string, nodeData: any) => {
      if (!reactFlowInstance) return

      const position = reactFlowInstance.project({
        x: Math.random() * 400 + 50,
        y: Math.random() * 400 + 50,
      })

      const newNode: Node = {
        id: `node_${Date.now()}`,
        type: nodeType,
        position,
        data: nodeData,
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes],
  )

  // Update node properties
  const updateNodeProperties = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            }
          }
          return node
        }),
      )
    },
    [setNodes],
  )

  // Delete selected node
  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id))
      setSelectedNode(null)
    }
  }, [selectedNode, setNodes, setEdges])

  // 删除选中的边
  const deleteSelectedEdge = useCallback(() => {
    if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id))
      setSelectedEdge(null)
      setIsEdgeMenuOpen(false)
    }
  }, [selectedEdge, setEdges])

  // 更新边的标签
  const updateEdgeLabel = useCallback(
    (label: string) => {
      if (selectedEdge) {
        setEdges((eds) =>
          eds.map((edge) => {
            if (edge.id === selectedEdge.id) {
              return {
                ...edge,
                data: { ...edge.data, label },
              }
            }
            return edge
          }),
        )
      }
    },
    [selectedEdge, setEdges],
  )

  // 切换边的动画效果
  const toggleEdgeAnimation = useCallback(
    (animated: boolean) => {
      if (selectedEdge) {
        setEdges((eds) =>
          eds.map((edge) => {
            if (edge.id === selectedEdge.id) {
              return {
                ...edge,
                animated,
              }
            }
            return edge
          }),
        )
      }
    },
    [selectedEdge, setEdges],
  )

  // 切换边的虚线样式
  const toggleEdgeDashed = useCallback(
    (dashed: boolean) => {
      if (selectedEdge) {
        setEdges((eds) =>
          eds.map((edge) => {
            if (edge.id === selectedEdge.id) {
              return {
                ...edge,
                data: { ...edge.data, dashed },
              }
            }
            return edge
          }),
        )
      }
    },
    [selectedEdge, setEdges],
  )

  // Save workflow
  const saveWorkflow = useCallback(() => {
    if (!workflowName) return

    const workflow = {
      name: workflowName,
      description: workflowDescription,
      nodes,
      edges,
    }

    // In a real app, you would save this to a database or file
    const workflowJson = JSON.stringify(workflow)
    const blob = new Blob([workflowJson], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${workflowName.replace(/\s+/g, "_")}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [workflowName, workflowDescription, nodes, edges])

  // Load workflow
  const loadWorkflow = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileReader = new FileReader()
      if (event.target.files && event.target.files.length > 0) {
        fileReader.readAsText(event.target.files[0], "UTF-8")
        fileReader.onload = (e) => {
          if (e.target?.result) {
            const workflow = JSON.parse(e.target.result as string)
            setWorkflowName(workflow.name || "新工作流")
            setWorkflowDescription(workflow.description || "")
            setNodes(workflow.nodes || [])
            setEdges(workflow.edges || [])
          }
        }
      }
    },
    [setNodes, setEdges],
  )

  // Toggle sidebar
  const toggleComponentPanel = useCallback(() => {
    setIsComponentPanelOpen((prev) => !prev)
  }, [])

  // Run workflow
  const runWorkflow = useCallback(() => {
    // 显示预览模式，居中浮动
    setIsPreviewMode(true)

    // Add system message
    const systemMessage: Message = {
      role: "system",
      content: "工作流已启动，正在处理您的请求...",
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages([systemMessage])
  }, [])

  // Handle sending message in interaction panel
  const handleSendMessage = useCallback(() => {
    if (!input.trim() || isGenerating) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsGenerating(true)

    // Simulate tool execution
    setTimeout(() => {
      const toolMessage: Message = {
        role: "tool",
        content: "正在搜索相关信息...",
        timestamp: new Date().toLocaleTimeString(),
        toolName: "Web Search",
        executionTime: 1.2,
      }

      setMessages((prev) => [...prev, toolMessage])

      // Simulate assistant response after tool call
      setTimeout(() => {
        const assistantMessage: Message = {
          role: "assistant",
          content:
            "根据我搜索到的信息，我可以回答您的问题。这是一个示例回复，在实际工作流中，这里会显示基于工具调用结果生成的回答。",
          timestamp: new Date().toLocaleTimeString(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsGenerating(false)
      }, 1500)
    }, 1000)
  }, [input, isGenerating])

  // Copy to clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }, [])

  // Toggle interaction panel size
  const toggleInteractionPanelSize = useCallback(() => {
    setIsInteractionPanelMaximized((prev) => !prev)
  }, [])

  // 添加键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Delete" || event.key === "Backspace") && !event.target) {
        if (selectedNode) {
          deleteSelectedNode()
        } else if (selectedEdge) {
          deleteSelectedEdge()
        }
      }

      // 按ESC键关闭边的下拉菜单
      if (event.key === "Escape") {
        setIsEdgeMenuOpen(false)
        setIsEditingEdgeLabel(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedNode, selectedEdge, deleteSelectedNode, deleteSelectedEdge])

  return (
    <div className="h-full">
      {/* Main workflow area */}
      <div className="relative h-[calc(100vh-40px)] border rounded-md overflow-hidden">
        <div className="w-full h-full" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onInit={setReactFlowInstance}
              defaultViewport={{ x: 0, y: 0, zoom: 0.2 }}
              fitView
              fitViewOptions={{ padding: 0.8, minZoom: 0.2, maxZoom: 1 }}
              deleteKeyCode={["Backspace", "Delete"]}
              selectionKeyCode={["Control", "Meta"]}
              multiSelectionKeyCode={["Shift"]}
              attributionPosition="bottom-right"
              edgesFocusable={true}
              elementsSelectable={true}
            >
              <svg style={{ width: 0, height: 0 }}>
                <defs>
                  <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a8c4d1" />
                    <stop offset="100%" stopColor="#d1a8c4" />
                  </linearGradient>
                  <linearGradient id="edge-gradient-selected" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8aa6b3" />
                    <stop offset="100%" stopColor="#b38aa6" />
                  </linearGradient>
                  <marker
                    id="edge-circle"
                    viewBox="-5 -5 10 10"
                    refX="0"
                    refY="0"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto"
                  >
                    <circle r="2" fill="#d1a8c4" />
                  </marker>
                </defs>
              </svg>
              <Controls />
              <MiniMap />
              <Background gap={12} size={1} />

              {/* Top-right control panel */}
              <Panel position="top-right" className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white shadow-sm"
                  onClick={() => setIsSettingsPanelOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  工作流设置
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white shadow-sm hover:bg-gray-100 transition-colors"
                  onClick={toggleComponentPanel}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  添加组件
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white shadow-sm"
                  onClick={() => {
                    if (reactFlowInstance) {
                      reactFlowInstance.fitView()
                    }
                  }}
                >
                  <Zap className="h-4 w-4 mr-1" />
                  适应视图
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all px-4"
                  onClick={runWorkflow}
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  运行工作流
                </Button>
              </Panel>

              {/* 边的下拉菜单 */}
              {isEdgeMenuOpen && selectedEdge && (
                <div
                  className="absolute z-10 bg-white rounded-lg shadow-lg border p-3 min-w-[220px]"
                  style={{
                    left: edgeClickPosition.x,
                    top: edgeClickPosition.y,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">连接线设置</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => setIsEdgeMenuOpen(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <Separator className="my-2" />

                  {isEditingEdgeLabel ? (
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        value={edgeLabelValue}
                        onChange={(e) => setEdgeLabelValue(e.target.value)}
                        placeholder="输入标签"
                        className="h-8 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateEdgeLabel(edgeLabelValue)
                            setIsEditingEdgeLabel(false)
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => {
                          updateEdgeLabel(edgeLabelValue)
                          setIsEditingEdgeLabel(false)
                        }}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-between mb-2 cursor-pointer hover:bg-slate-50 p-1 rounded"
                      onClick={() => setIsEditingEdgeLabel(true)}
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {selectedEdge.data?.label ? `标签: ${selectedEdge.data.label}` : "添加标签"}
                        </span>
                      </div>
                      <Pencil className="h-3 w-3 text-muted-foreground" />
                    </div>
                  )}

                  <div className="space-y-2">{/* 连接线设置选项已移除 */}</div>

                  <Separator className="my-2" />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteSelectedEdge}
                    className="w-full text-[#c4a59e] hover:text-[#b08e86] hover:bg-[#f9f0ee] border-[#e8d8d4]"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    删除连接线
                  </Button>
                </div>
              )}
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* Floating settings panel */}
        {isSettingsPanelOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300">
            <div className="bg-white rounded-xl border shadow-xl w-[600px] max-w-[95vw] max-h-[95vh] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-slate-50 to-white flex-shrink-0">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  工作流设置
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-slate-100"
                  onClick={() => setIsSettingsPanelOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-grow overflow-auto">
                <div className="space-y-6 p-4 sm:p-6">
                  <div className="space-y-3">
                    <Label htmlFor="workflow-name" className="text-base">
                      工作流名称
                    </Label>
                    <Input
                      id="workflow-name"
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                      placeholder="输入工作流名称"
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="workflow-description" className="text-base">
                      工作流描述
                    </Label>
                    <Textarea
                      id="workflow-description"
                      value={workflowDescription}
                      onChange={(e) => setWorkflowDescription(e.target.value)}
                      placeholder="简要描述工作流用途"
                      rows={4}
                      className="text-base"
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-base font-medium">执行设置</h3>
                    <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <span className="font-medium">并行执行</span>
                          <p className="text-sm text-muted-foreground">允许多个节点同时执行</p>
                        </div>
                        <Switch />
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <span className="font-medium">错误时继续</span>
                          <p className="text-sm text-muted-foreground">节点执行失败时继续执行工作流</p>
                        </div>
                        <Switch />
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <span className="font-medium">记录执行历史</span>
                          <p className="text-sm text-muted-foreground">保存工作流执行的详细日志</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-base font-medium">工作流统计</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-[#f0f5f7] to-white p-4 rounded-lg border border-[#e0eef5]">
                        <div className="text-sm text-muted-foreground">节点数量</div>
                        <div className="text-2xl font-semibold text-[#90a6b0]">{nodes.length}</div>
                      </div>
                      <div className="bg-gradient-to-br from-[#f7f5f0] to-white p-4 rounded-lg border border-[#f5eee0]">
                        <div className="text-sm text-muted-foreground">连接数量</div>
                        <div className="text-2xl font-semibold text-[#b0a690]">{edges.length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="flex flex-wrap justify-end gap-3 p-4 sm:p-6 border-t bg-gradient-to-r from-white to-slate-50">
                <Button variant="outline" className="gap-2 rounded-lg">
                  <label htmlFor="load-workflow" className="cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>上传</span>
                    <input id="load-workflow" type="file" className="hidden" accept=".json" onChange={loadWorkflow} />
                  </label>
                </Button>
                <Button onClick={saveWorkflow} variant="outline" className="gap-2 rounded-lg">
                  <Save className="h-4 w-4" />
                  保存
                </Button>
                <Button
                  onClick={() => setIsSettingsPanelOpen(false)}
                  className="rounded-lg bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] text-white hover:opacity-90"
                >
                  完成
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Component Panel */}
        {isComponentPanelOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300">
            <div className="bg-white rounded-xl border shadow-xl w-[500px] max-w-[95vw] max-h-[95vh] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-slate-50 to-white flex-shrink-0">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {sidebarTab === "nodes" ? (
                    <>
                      <Plus className="h-5 w-5" />
                      工作流组件
                    </>
                  ) : (
                    <>
                      <Sliders className="h-5 w-5" />
                      节点属性
                    </>
                  )}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-slate-100"
                  onClick={() => setIsComponentPanelOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="flex-1 flex flex-col">
                <TabsList className="w-full rounded-none bg-gradient-to-r from-white to-slate-50 p-1 border-b flex-shrink-0">
                  <TabsTrigger
                    value="nodes"
                    className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    节点
                  </TabsTrigger>
                  <TabsTrigger
                    value="properties"
                    className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
                  >
                    <Sliders className="h-4 w-4 mr-2" />
                    属性
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="nodes" className="m-0 h-full overflow-hidden">
                    <ScrollArea className="h-[calc(95vh-120px)] sm:h-[calc(95vh-140px)]">
                      <div className="p-4">
                        <NodeSelector
                          onAddNode={addNode}
                          className="space-y-6"
                          categoryClassName="bg-gradient-to-r from-slate-50 to-white px-4 py-3 rounded-lg font-medium text-base border border-slate-100"
                          nodeTypes={[
                            {
                              type: "llmNode",
                              category: "LLM 模型",
                              items: [
                                {
                                  id: "gpt-4",
                                  label: "GPT-4",
                                  description: "OpenAI 的 GPT-4 大语言模型",
                                  icon: Bot,
                                  data: {
                                    label: "GPT-4",
                                    model: "gpt-4",
                                    temperature: 0.7,
                                    maxTokens: 2048,
                                    systemPrompt: "You are a helpful assistant.",
                                  },
                                },
                                {
                                  id: "llama3",
                                  label: "Llama 3",
                                  description: "Meta 的 Llama 3 开源大语言模型",
                                  icon: Bot,
                                  data: {
                                    label: "Llama 3",
                                    model: "llama3",
                                    temperature: 0.7,
                                    maxTokens: 2048,
                                    systemPrompt: "You are a helpful assistant.",
                                  },
                                },
                                {
                                  id: "custom-model",
                                  label: "自定义模型",
                                  description: "使用您自己训练的模型",
                                  icon: Bot,
                                  data: {
                                    label: "自定义模型",
                                    model: "custom",
                                    temperature: 0.7,
                                    maxTokens: 2048,
                                    systemPrompt: "You are a helpful assistant.",
                                  },
                                },
                              ],
                            },
                            {
                              type: "toolNode",
                              category: "工具",
                              items: [
                                {
                                  id: "web-search",
                                  label: "网络搜索",
                                  description: "搜索互联网获取信息",
                                  icon: Search,
                                  data: {
                                    label: "网络搜索",
                                    toolType: "search",
                                    description: "搜索互联网获取信息",
                                    parameters: [{ name: "query", type: "string", required: true }],
                                  },
                                },
                                {
                                  id: "code-executor",
                                  label: "代码执行器",
                                  description: "执行 Python 代码",
                                  icon: Code,
                                  data: {
                                    label: "代码执行器",
                                    toolType: "code",
                                    description: "执行 Python 代码",
                                    parameters: [{ name: "code", type: "string", required: true }],
                                  },
                                },
                                {
                                  id: "calculator",
                                  label: "计算器",
                                  description: "执行数学计算",
                                  icon: Calculator,
                                  data: {
                                    label: "计算器",
                                    toolType: "calculator",
                                    description: "执行数学计算",
                                    parameters: [{ name: "expression", type: "string", required: true }],
                                  },
                                },
                                {
                                  id: "weather",
                                  label: "天气查询",
                                  description: "获取指定位置的天气信息",
                                  icon: Globe,
                                  data: {
                                    label: "天气查询",
                                    toolType: "weather",
                                    description: "获取指定位置的天气信息",
                                    parameters: [
                                      { name: "location", type: "string", required: true },
                                      { name: "unit", type: "string", required: false },
                                    ],
                                  },
                                },
                                {
                                  id: "calendar",
                                  label: "日历",
                                  description: "查询和管理日历事件",
                                  icon: Calendar,
                                  data: {
                                    label: "日历",
                                    toolType: "calendar",
                                    description: "查询和管理日历事件",
                                    parameters: [
                                      { name: "action", type: "string", required: true },
                                      { name: "date", type: "string", required: false },
                                      { name: "event", type: "string", required: false },
                                    ],
                                  },
                                },
                                {
                                  id: "data-analysis",
                                  label: "数据分析",
                                  description: "分析数据并生成图表",
                                  icon: BarChart,
                                  data: {
                                    label: "数据分析",
                                    toolType: "data-analysis",
                                    description: "分析数据并生成图表",
                                    parameters: [
                                      { name: "data", type: "string", required: true },
                                      { name: "chart_type", type: "string", required: false },
                                    ],
                                  },
                                },
                              ],
                            },
                          ]}
                        />
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="properties" className="m-0 h-full overflow-hidden">
                    <ScrollArea className="h-[calc(95vh-120px)] sm:h-[calc(95vh-140px)]">
                      <div className="p-4">
                        {selectedNode ? (
                          <NodeProperties
                            node={selectedNode}
                            updateNodeProperties={(newData) => updateNodeProperties(selectedNode.id, newData)}
                            deleteNode={deleteSelectedNode}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-60 text-center text-muted-foreground">
                            <Sliders className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg">选择一个节点以查看和编辑其属性</p>
                            <p className="text-sm mt-2">点击画布中的节点来编辑其属性</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        )}

        {/* Interaction Panel */}
        {isInteractionPanelOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300">
            <Resizable
              className={cn(
                "bg-white border shadow-xl rounded-xl overflow-hidden transition-all duration-300 ease-in-out",
                isInteractionPanelMaximized ? "w-[90%] h-[90%]" : "",
              )}
              size={{
                width: isInteractionPanelMaximized ? "90%" : interactionPanelWidth,
                height: isInteractionPanelMaximized ? "90%" : interactionPanelHeight,
              }}
              onResizeStop={(e, direction, ref, d) => {
                if (!isInteractionPanelMaximized) {
                  setInteractionPanelWidth(interactionPanelWidth + d.width)
                  setInteractionPanelHeight(interactionPanelHeight + d.height)
                }
              }}
              enable={{
                top: !isInteractionPanelMaximized,
                right: !isInteractionPanelMaximized,
                bottom: !isInteractionPanelMaximized,
                left: !isInteractionPanelMaximized,
                topRight: !isInteractionPanelMaximized,
                bottomRight: !isInteractionPanelMaximized,
                bottomLeft: !isInteractionPanelMaximized,
                topLeft: !isInteractionPanelMaximized,
              }}
              minWidth={400}
              minHeight={500}
              maxWidth="90%"
              maxHeight="90%"
            >
              <Card className="h-full flex flex-col border-0 shadow-none">
                <CardHeader className="px-6 py-4 border-b flex-shrink-0 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </div>
                      工作流交互测试
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-slate-100"
                        onClick={toggleInteractionPanelSize}
                      >
                        {isInteractionPanelMaximized ? (
                          <Minimize2 className="h-4 w-4" />
                        ) : (
                          <Maximize2 className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-slate-100"
                        onClick={() => setIsInteractionPanelOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-base mt-1">与工作流进行交互，测试其功能和表现</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full p-6">
                    <div className="space-y-6">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                              message.role === "assistant"
                                ? "bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4]"
                                : message.role === "user"
                                  ? "bg-gradient-to-r from-[#d1a8c4] to-[#a8b2d1]"
                                  : message.role === "tool"
                                    ? "bg-gradient-to-r from-[#a8d1b2] to-[#90b096]"
                                    : "bg-gray-200"
                            }`}
                          >
                            {message.role === "assistant" ? (
                              <Bot className="h-5 w-5 text-white" />
                            ) : message.role === "user" ? (
                              <User className="h-5 w-5 text-white" />
                            ) : message.role === "tool" ? (
                              <Wrench className="h-5 w-5 text-white" />
                            ) : (
                              <Info className="h-5 w-5 text-gray-600" />
                            )}
                          </div>

                          <div className={`flex flex-col gap-2 max-w-[calc(100%-4rem)]`}>
                            <div
                              className={`rounded-xl px-5 py-3 ${
                                message.role === "assistant"
                                  ? "bg-slate-50 border border-slate-100"
                                  : message.role === "user"
                                    ? "bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] text-white"
                                    : message.role === "tool"
                                      ? "bg-[#f0f7f2] border border-[#e0f0e5]"
                                      : "bg-gray-100"
                              }`}
                            >
                              {message.role === "tool" && message.toolName && (
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="bg-[#f0f7f2] text-[#90b096] border-[#a8d1b2]">
                                    {message.toolName}
                                  </Badge>
                                  {message.executionTime && (
                                    <span className="text-xs flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {message.executionTime}s
                                    </span>
                                  )}
                                </div>
                              )}
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{message.timestamp}</span>
                              {message.role !== "system" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs rounded-full"
                                  onClick={() => copyToClipboard(message.content)}
                                >
                                  {isCopied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                                  {isCopied ? "已复制" : "复制"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isGenerating && (
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] flex items-center justify-center animate-pulse">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                          <div className="rounded-xl px-5 py-3 bg-slate-50 border border-slate-100 min-w-[120px]">
                            <div className="flex space-x-2">
                              <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"></div>
                              <div
                                className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                              <div
                                className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                <CardFooter className="p-6 pt-4 border-t bg-gradient-to-r from-white to-slate-50">
                  <div className="flex w-full gap-3">
                    <Input
                      placeholder="输入消息..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      disabled={isGenerating}
                      className="flex-1 rounded-full px-4 border-slate-200 focus-visible:ring-primary/50"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isGenerating}
                      className="rounded-full bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] text-white hover:opacity-90"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      发送
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Resizable>
          </div>
        )}

        {/* Lightweight Preview Window */}
        {isPreviewMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="bg-black/10 backdrop-blur-sm absolute inset-0"
              onClick={() => setIsPreviewMode(false)}
            ></div>
            <Card className="border shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300 w-[400px] max-w-[90vw] relative">
              <CardHeader className="p-4 bg-gradient-to-r from-slate-50 to-white border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] flex items-center justify-center">
                      <MessageSquare className="h-3.5 w-3.5 text-white" />
                    </div>
                    工作流预览
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 rounded-full text-xs bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] text-white border-none hover:opacity-90"
                      onClick={() => {
                        setIsPreviewMode(false)
                        router.push("/deployment")
                      }}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      部署
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-slate-100"
                      onClick={() => {
                        setIsPreviewMode(false)
                        setIsInteractionPanelOpen(true)
                      }}
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-slate-100"
                      onClick={() => setIsPreviewMode(false)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 max-h-[300px] overflow-auto">
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <div key={index} className="flex gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          message.role === "assistant"
                            ? "bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4]"
                            : message.role === "user"
                              ? "bg-gradient-to-r from-[#d1a8c4] to-[#a8b2d1]"
                              : message.role === "tool"
                                ? "bg-gradient-to-r from-[#a8d1b2] to-[#90b096]"
                                : "bg-gray-200"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <Bot className="h-3.5 w-3.5 text-white" />
                        ) : message.role === "user" ? (
                          <User className="h-3.5 w-3.5 text-white" />
                        ) : message.role === "tool" ? (
                          <Wrench className="h-3.5 w-3.5 text-white" />
                        ) : (
                          <Info className="h-3.5 w-3.5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`text-sm rounded-lg px-3 py-2 ${
                            message.role === "assistant"
                              ? "bg-slate-50 border border-slate-100"
                              : message.role === "user"
                                ? "bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] text-white"
                                : message.role === "tool"
                                  ? "bg-[#f0f7f2] border border-[#e0f0e5]"
                                  : "bg-gray-100"
                          }`}
                        >
                          {message.role === "tool" && message.toolName && (
                            <div className="flex items-center gap-1 mb-1">
                              <Badge
                                variant="outline"
                                className="text-xs py-0 h-5 bg-[#f0f7f2] text-[#90b096] border-[#a8d1b2]"
                              >
                                {message.toolName}
                              </Badge>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] flex items-center justify-center animate-pulse">
                        <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="rounded-lg px-3 py-2 bg-slate-50 border border-slate-100 min-w-[80px]">
                        <div className="flex space-x-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-bounce"></div>
                          <div
                            className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t bg-gradient-to-r from-white to-slate-50">
                <div className="flex w-full gap-2">
                  <Input
                    placeholder="输入消息..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isGenerating}
                    className="flex-1 h-8 text-sm rounded-full px-3 border-slate-200 focus-visible:ring-primary/50"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isGenerating}
                    className="h-8 rounded-full bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] text-white hover:opacity-90"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

