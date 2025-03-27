"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import {
  Download,
  Send,
  Settings2,
  MessageSquare,
  Bot,
  User,
  BarChart2,
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  ImageIcon,
  Mic,
  Video,
  Paperclip,
  Save,
  Upload,
  FileUp,
  Trash2,
  RefreshCw,
  Code,
  Sliders,
  FileIcon as FilePdf,
  Check,
  Edit2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useModel } from "./model-provider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define types for evaluation metrics and results
type EvaluationMetric = {
  name: string
  value: number
  baseline?: number
  description: string
  higherIsBetter: boolean
}

type SampleEvaluation = {
  id: string
  userInput: string
  modelOutput: string
  baselineOutput?: string
  metrics: {
    relevance: number
    accuracy: number
    fluency: number
    safety: number
    overall: number
  }
  annotations: string
  errorCategory?: string
}

// Now, let's update the Message type to include evaluation data
type Message = {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  attachments?: {
    type: "image" | "audio" | "video" | "file"
    url: string
    name: string
    size?: number
  }[]
  metrics?: {
    responseTime: number
    tokens: {
      prompt: number
      completion: number
      total: number
    }
  }
  evaluation?: {
    relevance: number
    accuracy: number
    fluency: number
    safety: number
    overall: number
  }
  renderMarkdown?: boolean
}

export default function ModelTesting() {
  const { selectedModel, setSelectedModel } = useModel()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [maxLength, setMaxLength] = useState(4096)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [baselineModel, setBaselineModel] = useState<string | null>(null)
  const [evaluationMetrics, setEvaluationMetrics] = useState<EvaluationMetric[]>([])
  const [sampleEvaluations, setSampleEvaluations] = useState<SampleEvaluation[]>([])
  const [selectedSample, setSelectedSample] = useState<string | null>(null)
  const [annotationText, setAnnotationText] = useState("")
  const [errorCategory, setErrorCategory] = useState<string>("none")
  const [isEvaluationDialogOpen, setIsEvaluationDialogOpen] = useState(false)
  const [currentEvaluationMessage, setCurrentEvaluationMessage] = useState<Message | null>(null)
  const [savedChats, setSavedChats] = useState<{ id: string; name: string; date: string; messages: Message[] }[]>([])
  const [isSaveChatDialogOpen, setIsSaveChatDialogOpen] = useState(false)
  const [isLoadChatDialogOpen, setIsLoadChatDialogOpen] = useState(false)
  const [chatName, setChatName] = useState("")
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

  // Add these state variables to the component
  const [systemPrompt, setSystemPrompt] = useState<string>("You are a helpful AI assistant.")
  const [topP, setTopP] = useState<number>(0.9)
  const [frequencyPenalty, setFrequencyPenalty] = useState<number>(0)
  const [presencePenalty, setPresencePenalty] = useState<number>(0)
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<any[]>([])
  const [isParameterPanelOpen, setIsParameterPanelOpen] = useState<boolean>(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState<boolean>(false)
  const [exportFormat, setExportFormat] = useState<"markdown" | "pdf">("markdown")
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [toolDefinitions, setToolDefinitions] = useState<string>(`[
  {
    "type": "function",
    "function": {
      "name": "get_weather",
      "description": "Get the current weather in a given location",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "The city and state, e.g. San Francisco, CA"
          },
          "unit": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"],
            "description": "The temperature unit to use"
          }
        },
        "required": ["location"]
      }
    }
  }
]`)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sample evaluation metrics data
  const sampleMetrics: EvaluationMetric[] = [
    {
      name: "相关性",
      value: 0.85,
      baseline: 0.78,
      description: "回复与查询的相关程度",
      higherIsBetter: true,
    },
    {
      name: "准确性",
      value: 0.92,
      baseline: 0.85,
      description: "回复的事实准确性",
      higherIsBetter: true,
    },
    {
      name: "流畅度",
      value: 0.95,
      baseline: 0.9,
      description: "语法和语言质量",
      higherIsBetter: true,
    },
    {
      name: "安全性",
      value: 0.98,
      baseline: 0.95,
      description: "避免有害或不适当内容",
      higherIsBetter: true,
    },
    {
      name: "响应时间",
      value: 1.2,
      baseline: 1.8,
      description: "生成回复所需时间（秒）",
      higherIsBetter: false,
    },
    {
      name: "综合评分",
      value: 0.89,
      baseline: 0.82,
      description: "综合性能评分",
      higherIsBetter: true,
    },
  ]

  // Sample evaluation data
  const sampleEvaluationData: SampleEvaluation[] = [
    {
      id: "1",
      userInput: "解释一下量子计算的基本原理",
      modelOutput:
        "量子计算利用量子力学原理，如叠加和纠缠，来处理信息。与经典计算机使用位（0或1）不同，量子计算机使用量子位，可以同时处理多种状态，理论上能够解决某些经典计算机难以解决的问题。",
      baselineOutput: "量子计算是一种利用量子力学特性进行计算的技术，它使用量子比特代替传统的二进制位。",
      metrics: {
        relevance: 0.95,
        accuracy: 0.92,
        fluency: 0.98,
        safety: 1.0,
        overall: 0.96,
      },
      annotations: "回答全面且准确，解释了量子计算的核心概念。",
      errorCategory: "",
    },
    {
      id: "2",
      userInput: "人工智能会取代人类工作吗？",
      modelOutput:
        "人工智能确实会自动化某些任务，但也会创造新的工作机会。历史表明，技术变革通常会改变而非完全消除就业。AI更可能与人类合作，增强人类能力，而非完全取代。",
      baselineOutput: "是的，人工智能将取代大多数人类工作，导致大规模失业。",
      metrics: {
        relevance: 0.9,
        accuracy: 0.85,
        fluency: 0.95,
        safety: 0.92,
        overall: 0.9,
      },
      annotations: "回答平衡且有洞察力，避免了极端观点。",
      errorCategory: "",
    },
    {
      id: "3",
      userInput: "2023年世界杯冠军是哪个国家？",
      modelOutput:
        "2023年没有举办足球世界杯。最近的世界杯是2022年在卡塔尔举办的，阿根廷队获得冠军，在决赛中击败了法国队。",
      baselineOutput: "2023年世界杯冠军是巴西队。",
      metrics: {
        relevance: 1.0,
        accuracy: 1.0,
        fluency: 0.95,
        safety: 1.0,
        overall: 0.99,
      },
      annotations: "正确指出了问题中的事实错误，并提供了准确信息。",
      errorCategory: "",
    },
  ]

  // Initialize evaluation data
  React.useEffect(() => {
    setEvaluationMetrics(sampleMetrics)
    setSampleEvaluations(sampleEvaluationData)
  }, [])

  // Add these functions to the component

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newAttachments = Array.from(files).map((file) => ({
      type: file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("audio/")
          ? "audio"
          : file.type.startsWith("video/")
            ? "video"
            : "file",
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }))

    setAttachments([...attachments, ...newAttachments])
    setIsAttachmentDialogOpen(false)

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments]
    URL.revokeObjectURL(newAttachments[index].url)
    newAttachments.splice(index, 1)
    setAttachments(newAttachments)
  }

  const handleSendWithAttachments = async () => {
    if ((!input.trim() && attachments.length === 0) || isGenerating) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setAttachments([])
    setIsGenerating(true)

    // 模拟API调用延迟
    const startTime = Date.now()
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const assistantMessage: Message = {
      role: "assistant",
      content:
        "This is a sample response that includes **Markdown** formatting.\n\n```python\ndef hello_world():\n    print('Hello, world!')\n```\n\nI can respond to your queries and process any attachments you've shared.",
      timestamp: new Date().toLocaleTimeString(),
      renderMarkdown: true,
      metrics: {
        responseTime: Date.now() - startTime,
        tokens: {
          prompt: 32,
          completion: 64,
          total: 96,
        },
      },
      evaluation: {
        relevance: 0.85,
        accuracy: 0.92,
        fluency: 0.95,
        safety: 0.98,
        overall: 0.89,
      },
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsGenerating(false)

    // Add to sample evaluations for later analysis
    const newSample: SampleEvaluation = {
      id: Date.now().toString(),
      userInput: userMessage.content,
      modelOutput: assistantMessage.content,
      metrics: assistantMessage.evaluation!,
      annotations: "",
      errorCategory: "",
    }

    setSampleEvaluations((prev) => [...prev, newSample])
  }

  const exportChatHistory = () => {
    let content = ""

    if (exportFormat === "markdown") {
      content = messages
        .map((msg) => {
          const role = msg.role === "user" ? "User" : "Assistant"
          let content = `## ${role} (${msg.timestamp})\n\n${msg.content}\n\n`

          if (msg.attachments && msg.attachments.length > 0) {
            content += "### Attachments\n\n"
            msg.attachments.forEach((attachment) => {
              content += `- ${attachment.name} (${attachment.type})\n`
            })
            content += "\n"
          }

          return content
        })
        .join("---\n\n")

      // Create and trigger download
      const blob = new Blob([content], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `chat-history-${new Date().toISOString().slice(0, 10)}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      // For PDF, we'd typically use a library like jsPDF
      // This is a placeholder for the actual implementation
      alert("PDF export functionality would be implemented here with a library like jsPDF")
    }

    setIsExportDialogOpen(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  const clearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      setMessages([])
    }
  }

  // Load saved chats from localStorage on component mount
  useEffect(() => {
    const loadSavedChats = () => {
      try {
        const savedChatsJson = localStorage.getItem("savedChats")
        if (savedChatsJson) {
          const parsedChats = JSON.parse(savedChatsJson)
          setSavedChats(parsedChats)
        }
      } catch (error) {
        console.error("Failed to load saved chats", error)
      }
    }

    loadSavedChats()
  }, [])

  // Save chat with a name
  const saveChat = () => {
    if (!chatName.trim()) return

    const chatId = selectedChatId || `chat-${Date.now()}`
    const newChat = {
      id: chatId,
      name: chatName,
      date: new Date().toISOString(),
      messages: messages,
    }

    // If updating existing chat, replace it; otherwise add new
    const updatedChats = selectedChatId
      ? savedChats.map((chat) => (chat.id === selectedChatId ? newChat : chat))
      : [...savedChats, newChat]

    setSavedChats(updatedChats)
    localStorage.setItem("savedChats", JSON.stringify(updatedChats))

    setIsSaveChatDialogOpen(false)
    setChatName("")
    setSelectedChatId(null)
  }

  // Load a specific chat
  const loadChat = (chatId: string) => {
    const chat = savedChats.find((c) => c.id === chatId)
    if (chat) {
      setMessages(chat.messages)
      setIsLoadChatDialogOpen(false)
    }
  }

  // Delete a saved chat
  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("确定要删除这个对话记录吗？")) {
      const updatedChats = savedChats.filter((chat) => chat.id !== chatId)
      setSavedChats(updatedChats)
      localStorage.setItem("savedChats", JSON.stringify(updatedChats))
    }
  }

  // Open save dialog with chat selected for updating
  const openSaveDialog = (chatId?: string) => {
    if (chatId) {
      const chat = savedChats.find((c) => c.id === chatId)
      if (chat) {
        setChatName(chat.name)
        setSelectedChatId(chat.id)
      }
    } else {
      setChatName(`对话 ${new Date().toLocaleDateString()}`)
      setSelectedChatId(null)
    }
    setIsSaveChatDialogOpen(true)
  }

  // Replace the existing handleSend function with this one
  const handleSend = handleSendWithAttachments

  const handleExport = (format: "csv" | "json") => {
    let data
    let filename
    let contentType

    if (format === "json") {
      data = JSON.stringify(
        {
          model: selectedModel?.provider,
          baseline: baselineModel,
          metrics: evaluationMetrics,
          samples: sampleEvaluations,
          messages: messages,
        },
        null,
        2,
      )
      filename = `evaluation-results-${new Date().toISOString().slice(0, 10)}.json`
      contentType = "application/json"
    } else {
      // Create CSV content
      const headers = [
        "Sample ID",
        "User Input",
        "Model Output",
        "Relevance",
        "Accuracy",
        "Fluency",
        "Safety",
        "Overall",
        "Annotations",
        "Error Category",
      ]
      const rows = sampleEvaluations.map((sample) => [
        sample.id,
        `"${sample.userInput.replace(/"/g, '""')}"`,
        `"${sample.modelOutput.replace(/"/g, '""')}"`,
        sample.metrics.relevance,
        sample.metrics.accuracy,
        sample.metrics.fluency,
        sample.metrics.safety,
        sample.metrics.overall,
        `"${sample.annotations.replace(/"/g, '""')}"`,
        sample.errorCategory,
      ])

      data = [headers, ...rows].map((row) => row.join(",")).join("\n")
      filename = `evaluation-results-${new Date().toISOString().slice(0, 10)}.csv`
      contentType = "text/csv"
    }

    const blob = new Blob([data], { type: contentType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleEvaluateMessage = (message: Message) => {
    setCurrentEvaluationMessage(message)
    setIsEvaluationDialogOpen(true)
  }

  const saveAnnotation = () => {
    if (!selectedSample) return

    setSampleEvaluations((prev) =>
      prev.map((sample) =>
        sample.id === selectedSample
          ? { ...sample, annotations: annotationText, errorCategory: errorCategory === "none" ? "" : errorCategory }
          : sample,
      ),
    )
  }

  const getMetricColor = (metric: EvaluationMetric) => {
    if (!metric.baseline) return "text-gray-600"

    const improvement = metric.value - metric.baseline
    const isImprovement = metric.higherIsBetter ? improvement > 0 : improvement < 0

    return isImprovement ? "text-green-600" : "text-red-600"
  }

  const getMetricIcon = (metric: EvaluationMetric) => {
    if (!metric.baseline) return null

    const improvement = metric.value - metric.baseline
    const isImprovement = metric.higherIsBetter ? improvement > 0 : improvement < 0

    return isImprovement ? (
      <ChevronUp className="h-4 w-4 text-green-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-red-600" />
    )
  }

  const getMetricChange = (metric: EvaluationMetric) => {
    if (!metric.baseline) return null

    const improvement = metric.value - metric.baseline
    const percentChange = ((improvement / metric.baseline) * 100).toFixed(1)
    const isImprovement = metric.higherIsBetter ? improvement > 0 : improvement < 0

    return (
      <span className={isImprovement ? "text-green-600" : "text-red-600"}>
        {isImprovement ? "+" : ""}
        {percentChange}%
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-[#2d3748]">对话测试</h2>
        <div className="flex items-center gap-4">
          <Select
            value={selectedModel?.provider}
            onValueChange={(value) => {
              const model = { provider: value, apiKey: "", baseUrl: "" }
              setSelectedModel(model)
            }}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="选择测试模型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="llama3">
                <div className="flex items-center justify-between gap-4">
                  <span>Llama3</span>
                  <Badge variant="secondary" className="bg-[#f7f0f5] text-[#b092a6] hover:bg-[#f3e8f0]">
                    本地模型
                  </Badge>
                </div>
              </SelectItem>

              <SelectItem value="customer-assistant-v1">
                <div className="flex items-center justify-between gap-4">
                  <span>客服助手-v1</span>
                  <Badge variant="secondary" className="bg-[#f0f1f7] text-[#8892b0] hover:bg-[#e8eaf3]">
                    微调模型
                  </Badge>
                </div>
              </SelectItem>

              <SelectItem value="legal-advisor-v2">
                <div className="flex items-center justify-between gap-4">
                  <span>法律顾问-v2</span>
                  <Badge variant="secondary" className="bg-[#f0f1f7] text-[#8892b0] hover:bg-[#e8eaf3]">
                    微调模型
                  </Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>对话配置</DialogTitle>
                <DialogDescription>调整模型参数以获得不同的对话效果</DialogDescription>
              </DialogHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>采样温度</Label>
                    <span className="text-sm text-muted-foreground">{temperature}</span>
                  </div>
                  <Slider
                    value={[temperature]}
                    onValueChange={([value]) => setTemperature(value)}
                    min={0}
                    max={2}
                    step={0.1}
                  />
                  <p className="text-xs text-muted-foreground">
                    较高的值会使输出更加随机，较低的值会使输出更加集中和确定
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>最大 Token 数</Label>
                    <span className="text-sm text-muted-foreground">{maxTokens}</span>
                  </div>
                  <Slider
                    value={[maxTokens]}
                    onValueChange={([value]) => setMaxTokens(value)}
                    min={256}
                    max={4096}
                    step={256}
                  />
                  <p className="text-xs text-muted-foreground">限制单次回复生成的最大 Token 数量</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>最大上下文长度</Label>
                    <span className="text-sm text-muted-foreground">{maxLength}</span>
                  </div>
                  <Slider
                    value={[maxLength]}
                    onValueChange={([value]) => setMaxLength(value)}
                    min={1024}
                    max={8192}
                    step={1024}
                  />
                  <p className="text-xs text-muted-foreground">设置对话历史的最大长度限制</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="icon" onClick={() => handleExport("json")}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            对话测试
          </TabsTrigger>
          <TabsTrigger value="evaluation" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            评估结果
          </TabsTrigger>
        </TabsList>

        {/* Replace the existing chat interface in the TabsContent with value="chat" */}
        <TabsContent value="chat" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                对话测试
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsParameterPanelOpen(true)} className="h-8">
                  <Sliders className="h-4 w-4 mr-1" />
                  参数设置
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <FileText className="h-4 w-4 mr-1" />
                      操作
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsExportDialogOpen(true)}>
                      <Download className="h-4 w-4 mr-2" />
                      导出对话
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openSaveDialog()}>
                      <Save className="h-4 w-4 mr-2" />
                      保存对话
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsLoadChatDialogOpen(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      加载对话
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={clearChat} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      清空对话
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">开始与模型对话</p>
                      <p className="text-sm">您可以发送文本、图片、音频或视频</p>
                    </div>
                  )}

                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${message.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          message.role === "assistant"
                            ? "bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4]"
                            : "bg-gradient-to-r from-[#d1a8c4] to-[#a8b2d1]"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <Bot className="h-5 w-5 text-white" />
                        ) : (
                          <User className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div
                        className={`flex flex-col gap-2 ${message.role === "assistant" ? "items-start" : "items-end"}`}
                      >
                        <div
                          className={`rounded-lg px-4 py-2 w-fit max-w-[600px] ${
                            message.role === "assistant"
                              ? "bg-muted"
                              : "bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] text-white"
                          }`}
                        >
                          {message.renderMarkdown ? (
                            <ReactMarkdown
                              className="text-sm prose dark:prose-invert max-w-none"
                              components={{
                                code({ node, inline, className, children, ...props }) {
                                  const match = /language-(\w+)/.exec(className || "")
                                  return !inline && match ? (
                                    <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                                      {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                  ) : (
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  )
                                },
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          )}

                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, idx) => (
                                <div key={idx} className="rounded-md overflow-hidden border">
                                  {attachment.type === "image" && (
                                    <img
                                      src={attachment.url || "/placeholder.svg"}
                                      alt={attachment.name}
                                      className="max-h-[200px] object-contain"
                                    />
                                  )}
                                  {attachment.type === "audio" && (
                                    <audio src={attachment.url} controls className="w-full" />
                                  )}
                                  {attachment.type === "video" && (
                                    <video src={attachment.url} controls className="max-h-[200px] w-full" />
                                  )}
                                  {attachment.type === "file" && (
                                    <div className="p-2 flex items-center gap-2">
                                      <FileText className="h-5 w-5" />
                                      <span className="text-sm">{attachment.name}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>{message.timestamp}</span>
                          {message.metrics && (
                            <>
                              <Separator orientation="vertical" className="h-4" />
                              <span>{(message.metrics.responseTime / 1000).toFixed(2)}s</span>
                              <Separator orientation="vertical" className="h-4" />
                              <span>
                                {message.metrics.tokens.total} tokens (
                                {`${message.metrics.tokens.prompt}+${message.metrics.tokens.completion}`})
                              </span>
                            </>
                          )}
                          {message.role === "assistant" && message.evaluation && (
                            <>
                              <Separator orientation="vertical" className="h-4" />
                              <Button
                                variant="link"
                                size="sm"
                                className="h-4 p-0 text-xs text-blue-500"
                                onClick={() => handleEvaluateMessage(message)}
                              >
                                查看评估 ({message.evaluation.overall.toFixed(2)})
                              </Button>
                            </>
                          )}
                          <Separator orientation="vertical" className="h-4" />
                          <Button
                            variant="link"
                            size="sm"
                            className="h-4 p-0 text-xs text-blue-500"
                            onClick={() => copyToClipboard(message.content)}
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                已复制
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                复制
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] flex items-center justify-center animate-pulse">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <Badge variant="secondary" className="animate-pulse">
                        正在生成回复...
                      </Badge>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="relative group">
                      <div className="w-16 h-16 border rounded-md flex items-center justify-center overflow-hidden">
                        {attachment.type === "image" && (
                          <img
                            src={attachment.url || "/placeholder.svg"}
                            alt={attachment.name}
                            className="object-cover w-full h-full"
                          />
                        )}
                        {attachment.type === "audio" && <Mic className="h-8 w-8 text-muted-foreground" />}
                        {attachment.type === "video" && <Video className="h-8 w-8 text-muted-foreground" />}
                        {attachment.type === "file" && <FileText className="h-8 w-8 text-muted-foreground" />}
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-5 w-5 absolute -top-2 -right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeAttachment(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsAttachmentDialogOpen(true)}
                    className="shrink-0"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                  />
                </div>
                <Input
                  placeholder="输入消息..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  disabled={isGenerating}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={isGenerating || (!input.trim() && attachments.length === 0)}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add the evaluation TabsContent */}
        <TabsContent value="evaluation" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                评估结果
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExport("csv")} className="h-8">
                  <Download className="h-4 w-4 mr-1" />
                  导出 CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport("json")} className="h-8">
                  <Download className="h-4 w-4 mr-1" />
                  导出 JSON
                </Button>
                <Select value={baselineModel || ""} onValueChange={(value) => setBaselineModel(value || null)}>
                  <SelectTrigger className="w-[200px] h-8">
                    <SelectValue placeholder="选择基准模型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无基准对比</SelectItem>
                    <SelectItem value="llama2">Llama2</SelectItem>
                    <SelectItem value="chatglm">ChatGLM</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {evaluationMetrics.map((metric) => (
                  <Card key={metric.name}>
                    <CardContent className="p-4">
                      <div className="flex flex-col justify-center h-full">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium">
                              {metric.name === "Relevance"
                                ? "相关性"
                                : metric.name === "Accuracy"
                                  ? "准确性"
                                  : metric.name === "Fluency"
                                    ? "流畅度"
                                    : metric.name === "Safety"
                                      ? "安全性"
                                      : metric.name === "Response Time"
                                        ? "响应时间"
                                        : metric.name === "Overall Score"
                                          ? "综合评分"
                                          : metric.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {metric.description === "How relevant the response is to the query"
                                ? "回复与查询的相关程度"
                                : metric.description === "Factual correctness of the response"
                                  ? "回复的事实准确性"
                                  : metric.description === "Grammatical and linguistic quality"
                                    ? "语法和语言质量"
                                    : metric.description === "Avoidance of harmful or inappropriate content"
                                      ? "避免有害或不适当内容"
                                      : metric.description === "Time to generate response (seconds)"
                                        ? "生成回复所需时间（秒）"
                                        : metric.description === "Aggregate performance score"
                                          ? "综合性能评分"
                                          : metric.description}
                            </div>
                          </div>
                          <div className="text-2xl font-bold">{metric.value.toFixed(2)}</div>
                        </div>
                        {metric.baseline && (
                          <div className="flex items-center justify-between text-xs">
                            <span>基准: {metric.baseline.toFixed(2)}</span>
                            <div className={`flex items-center gap-1 ${getMetricColor(metric)}`}>
                              {getMetricIcon(metric)}
                              {getMetricChange(metric)}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">样本评估</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-4">
                        {sampleEvaluations.map((sample) => (
                          <div
                            key={sample.id}
                            className={cn(
                              "p-4 border rounded-lg cursor-pointer transition-colors",
                              selectedSample === sample.id ? "border-primary bg-muted/50" : "hover:bg-muted/30",
                            )}
                            onClick={() => setSelectedSample(sample.id)}
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="font-medium">样本 #{sample.id}</div>
                                <Badge
                                  variant={
                                    sample.metrics.overall > 0.9
                                      ? "success"
                                      : sample.metrics.overall > 0.7
                                        ? "default"
                                        : "destructive"
                                  }
                                >
                                  {(sample.metrics.overall * 100).toFixed(0)}%
                                </Badge>
                              </div>
                              <div className="text-sm">
                                <div className="text-muted-foreground">输入:</div>
                                <div className="truncate">{sample.userInput}</div>
                              </div>
                              <div className="text-sm">
                                <div className="text-muted-foreground">输出:</div>
                                <div className="truncate">{sample.modelOutput}</div>
                              </div>
                              {sample.errorCategory && (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  错误类型: {sample.errorCategory}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">详细评估</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedSample ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-md bg-muted/30">
                          <div className="mb-2 font-medium">用户输入:</div>
                          <div className="mb-4 text-sm">
                            {sampleEvaluations.find((s) => s.id === selectedSample)?.userInput}
                          </div>
                          <div className="mb-2 font-medium">模型输出:</div>
                          <div className="text-sm">
                            {sampleEvaluations.find((s) => s.id === selectedSample)?.modelOutput}
                          </div>
                          {baselineModel && sampleEvaluations.find((s) => s.id === selectedSample)?.baselineOutput && (
                            <>
                              <div className="mt-4 mb-2 font-medium">基准模型输出:</div>
                              <div className="text-sm">
                                {sampleEvaluations.find((s) => s.id === selectedSample)?.baselineOutput}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>相关性评分</Label>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={
                                    sampleEvaluations.find((s) => s.id === selectedSample)?.metrics.relevance! * 100
                                  }
                                  className="h-2"
                                />
                                <span className="text-sm font-medium">
                                  {(
                                    sampleEvaluations.find((s) => s.id === selectedSample)?.metrics.relevance! * 100
                                  ).toFixed(0)}
                                  %
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>准确性评分</Label>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={
                                    sampleEvaluations.find((s) => s.id === selectedSample)?.metrics.accuracy! * 100
                                  }
                                  className="h-2"
                                />
                                <span className="text-sm font-medium">
                                  {(
                                    sampleEvaluations.find((s) => s.id === selectedSample)?.metrics.accuracy! * 100
                                  ).toFixed(0)}
                                  %
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>流畅度评分</Label>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={sampleEvaluations.find((s) => s.id === selectedSample)?.metrics.fluency! * 100}
                                  className="h-2"
                                />
                                <span className="text-sm font-medium">
                                  {(
                                    sampleEvaluations.find((s) => s.id === selectedSample)?.metrics.fluency! * 100
                                  ).toFixed(0)}
                                  %
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>安全性评分</Label>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={sampleEvaluations.find((s) => s.id === selectedSample)?.metrics.safety! * 100}
                                  className="h-2"
                                />
                                <span className="text-sm font-medium">
                                  {(
                                    sampleEvaluations.find((s) => s.id === selectedSample)?.metrics.safety! * 100
                                  ).toFixed(0)}
                                  %
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 space-y-4">
                            <div className="space-y-2">
                              <Label>评估注释</Label>
                              <Textarea
                                value={
                                  annotationText ||
                                  sampleEvaluations.find((s) => s.id === selectedSample)?.annotations ||
                                  ""
                                }
                                onChange={(e) => setAnnotationText(e.target.value)}
                                placeholder="添加评估注释..."
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>错误类别 (如适用)</Label>
                              <Select value={errorCategory} onValueChange={setErrorCategory}>
                                <SelectTrigger>
                                  <SelectValue placeholder="选择错误类别" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">无错误</SelectItem>
                                  <SelectItem value="factual">事实错误</SelectItem>
                                  <SelectItem value="coherence">连贯性问题</SelectItem>
                                  <SelectItem value="relevance">相关性偏差</SelectItem>
                                  <SelectItem value="safety">安全问题</SelectItem>
                                  <SelectItem value="format">格式错误</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <Button onClick={saveAnnotation}>保存评估</Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[500px] text-center text-muted-foreground">
                        <div>
                          <BarChart2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                          <p>从左侧选择样本以查看详细评估</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Message Evaluation Dialog */}
        <Dialog open={isAttachmentDialogOpen} onOpenChange={setIsAttachmentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>添加附件</DialogTitle>
              <DialogDescription>上传图片、音频、视频或文档文件</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "image/*"
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <span>图片</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "audio/*"
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <Mic className="h-8 w-8 text-muted-foreground" />
                  <span>音频</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "video/*"
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <Video className="h-8 w-8 text-muted-foreground" />
                  <span>视频</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = ".pdf,.doc,.docx,.txt"
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <span>文档</span>
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  浏览文件
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Parameter Panel Dialog */}
        <Dialog open={isParameterPanelOpen} onOpenChange={setIsParameterPanelOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>模型参数设置</DialogTitle>
              <DialogDescription>调整模型生成参数和系统提示词</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">基础参数</TabsTrigger>
                <TabsTrigger value="system">系统提示词</TabsTrigger>
                <TabsTrigger value="tools">工具定义</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="temperature">采样温度</Label>
                      <span className="text-sm text-muted-foreground">{temperature}</span>
                    </div>
                    <Slider
                      id="temperature"
                      min={0}
                      max={2}
                      step={0.1}
                      value={[temperature]}
                      onValueChange={([value]) => setTemperature(value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      较高的值会使输出更加随机，较低的值会使输出更加集中和确定
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="top-p">Top-P</Label>
                      <span className="text-sm text-muted-foreground">{topP}</span>
                    </div>
                    <Slider
                      id="top-p"
                      min={0.1}
                      max={1}
                      step={0.05}
                      value={[topP]}
                      onValueChange={([value]) => setTopP(value)}
                    />
                    <p className="text-xs text-muted-foreground">核采样，控制模型生成文本的多样性</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="max-tokens">最大 Token 数</Label>
                      <span className="text-sm text-muted-foreground">{maxTokens}</span>
                    </div>
                    <Slider
                      id="max-tokens"
                      min={256}
                      max={4096}
                      step={256}
                      value={[maxTokens]}
                      onValueChange={([value]) => setMaxTokens(value)}
                    />
                    <p className="text-xs text-muted-foreground">限制单次回复生成的最大 Token 数量</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="frequency-penalty">频率惩罚</Label>
                      <span className="text-sm text-muted-foreground">{frequencyPenalty}</span>
                    </div>
                    <Slider
                      id="frequency-penalty"
                      min={-2}
                      max={2}
                      step={0.1}
                      value={[frequencyPenalty]}
                      onValueChange={([value]) => setFrequencyPenalty(value)}
                    />
                    <p className="text-xs text-muted-foreground">减少模型重复使用相同词语的倾向</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="presence-penalty">存在惩罚</Label>
                      <span className="text-sm text-muted-foreground">{presencePenalty}</span>
                    </div>
                    <Slider
                      id="presence-penalty"
                      min={-2}
                      max={2}
                      step={0.1}
                      value={[presencePenalty]}
                      onValueChange={([value]) => setPresencePenalty(value)}
                    />
                    <p className="text-xs text-muted-foreground">减少模型讨论新主题的倾向</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="system" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="system-prompt">系统提示词</Label>
                  <Textarea
                    id="system-prompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                    placeholder="输入系统提示词..."
                  />
                  <p className="text-xs text-muted-foreground">
                    系统提示词用于设置模型的行为和角色，会影响模型的整体输出风格
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSystemPrompt("You are a helpful AI assistant.")}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重置为默认
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSystemPrompt(
                        "You are an expert in AI and machine learning, specializing in natural language processing.",
                      )
                    }
                  >
                    AI 专家
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSystemPrompt(
                        "You are a creative writing assistant, skilled in storytelling and narrative development.",
                      )
                    }
                  >
                    创意写作
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="tool-definitions">工具定义 (JSON 格式)</Label>
                  <Textarea
                    id="tool-definitions"
                    value={toolDefinitions}
                    onChange={(e) => setToolDefinitions(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                    placeholder="输入工具定义..."
                  />
                  <p className="text-xs text-muted-foreground">工具定义允许模型调用外部函数，格式必须是有效的 JSON</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(toolDefinitions)
                        setToolDefinitions(JSON.stringify(parsed, null, 2))
                      } catch (e) {
                        alert("JSON 格式无效，请检查您的输入")
                      }
                    }}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    格式化 JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setToolDefinitions(`[
  {
    "type": "function",
    "function": {
      "name": "get_weather",
      "description": "Get the current weather in a given location",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "The city and state, e.g. San Francisco, CA"
          },
          "unit": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"],
            "description": "The temperature unit to use"
          }
        },
        "required": ["location"]
      }
    }
  }
]`)
                    }
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重置为默认
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsParameterPanelOpen(false)}>
                取消
              </Button>
              <Button onClick={() => setIsParameterPanelOpen(false)}>应用设置</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>导出对话历史</DialogTitle>
              <DialogDescription>选择导出格式并下载对话历史</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <RadioGroup
                value={exportFormat}
                onValueChange={(value) => setExportFormat(value as "markdown" | "pdf")}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="markdown" id="markdown" className="peer sr-only" />
                  <Label
                    htmlFor="markdown"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <FileText className="h-8 w-8 mb-2" />
                    <span>Markdown</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="pdf" id="pdf" className="peer sr-only" />
                  <Label
                    htmlFor="pdf"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <FilePdf className="h-8 w-8 mb-2" />
                    <span>PDF</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={exportChatHistory}>导出</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Tabs>

      {/* Message Evaluation Dialog */}
      <Dialog open={isEvaluationDialogOpen} onOpenChange={setIsEvaluationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>回复评估详情</DialogTitle>
            <DialogDescription>查看此回复的详细评估指标</DialogDescription>
          </DialogHeader>

          {currentEvaluationMessage && (
            <div className="space-y-4 py-4">
              <div className="p-3 rounded-md bg-muted/30 text-sm">{currentEvaluationMessage.content}</div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>相关性评分</Label>
                    <div className="flex items-center gap-2">
                      <Progress value={currentEvaluationMessage.evaluation?.relevance! * 100} className="h-2" />
                      <span className="text-sm font-medium">
                        {(currentEvaluationMessage.evaluation?.relevance! * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>准确性评分</Label>
                    <div className="flex items-center gap-2">
                      <Progress value={currentEvaluationMessage.evaluation?.accuracy! * 100} className="h-2" />
                      <span className="text-sm font-medium">
                        {(currentEvaluationMessage.evaluation?.accuracy! * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>流畅度评分</Label>
                    <div className="flex items-center gap-2">
                      <Progress value={currentEvaluationMessage.evaluation?.fluency! * 100} className="h-2" />
                      <span className="text-sm font-medium">
                        {(currentEvaluationMessage.evaluation?.fluency! * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>安全性评分</Label>
                    <div className="flex items-center gap-2">
                      <Progress value={currentEvaluationMessage.evaluation?.safety! * 100} className="h-2" />
                      <span className="text-sm font-medium">
                        {(currentEvaluationMessage.evaluation?.safety! * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>总体评分</Label>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={currentEvaluationMessage.evaluation?.overall! * 100}
                        className={cn(
                          "h-2",
                          currentEvaluationMessage.evaluation?.overall! > 0.9
                            ? "bg-green-500"
                            : currentEvaluationMessage.evaluation?.overall! > 0.7
                              ? "bg-blue-500"
                              : "bg-red-500",
                        )}
                      />
                      <span className="text-sm font-medium">
                        {(currentEvaluationMessage.evaluation?.overall! * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">响应时间:</span>
                      <span className="font-medium">
                        {(currentEvaluationMessage.metrics?.responseTime! / 1000).toFixed(2)}s
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Token 数量:</span>
                      <span className="font-medium">{currentEvaluationMessage.metrics?.tokens.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEvaluationDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Chat Dialog */}
      <Dialog open={isSaveChatDialogOpen} onOpenChange={setIsSaveChatDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedChatId ? "更新对话" : "保存对话"}</DialogTitle>
            <DialogDescription>{selectedChatId ? "更新已有对话记录" : "为当前对话记录命名并保存"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chat-name">对话名称</Label>
              <Input
                id="chat-name"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                placeholder="输入对话名称"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              共 {messages.length} 条消息，{messages.filter((m) => m.role === "user").length} 个问题
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveChatDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={saveChat} disabled={!chatName.trim()}>
              {selectedChatId ? "更新" : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Chat Dialog */}
      <Dialog open={isLoadChatDialogOpen} onOpenChange={setIsLoadChatDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>加载对话</DialogTitle>
            <DialogDescription>选择想要加载的对话记录</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {savedChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Save className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">没有保存的对话</p>
                <p className="text-sm">在对话测试页面保存对话后会显示在这里</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {savedChats
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((chat) => (
                      <div
                        key={chat.id}
                        className="p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => loadChat(chat.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{chat.name}</div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                openSaveDialog(chat.id)
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500"
                              onClick={(e) => deleteChat(chat.id, e)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{new Date(chat.date).toLocaleString()}</span>
                          <span>{chat.messages.length} 条消息</span>
                        </div>
                        {chat.messages.length > 0 && (
                          <div className="mt-2 text-sm truncate text-muted-foreground">
                            "{chat.messages[chat.messages.length - 1].content.slice(0, 50)}
                            {chat.messages[chat.messages.length - 1].content.length > 50 ? "..." : ""}"
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLoadChatDialogOpen(false)}>
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

