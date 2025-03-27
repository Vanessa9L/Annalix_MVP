"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import {
  Cpu,
  Zap,
  Download,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Info,
  AlertCircle,
  CheckCircle2,
  Bot,
  User,
  Send,
  Copy,
  Check,
  Database,
  Plus,
  Search,
  MoreHorizontal,
  Upload,
  X,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

// Sample data for charts
const trainingMetrics = [
  { step: 0, trainingLoss: 1.5, validationLoss: 1.6, trainingAccuracy: 50, validationAccuracy: 45 },
  { step: 100, trainingLoss: 1.3, validationLoss: 1.4, trainingAccuracy: 60, validationAccuracy: 55 },
  { step: 200, trainingLoss: 1.1, validationLoss: 1.2, trainingAccuracy: 70, validationAccuracy: 65 },
  { step: 300, trainingLoss: 0.9, validationLoss: 1.0, trainingAccuracy: 75, validationAccuracy: 70 },
  { step: 400, trainingLoss: 0.7, validationLoss: 0.8, trainingAccuracy: 80, validationAccuracy: 75 },
  { step: 500, trainingLoss: 0.6, validationLoss: 0.7, trainingAccuracy: 85, validationAccuracy: 80 },
]

const resourceUsage = [
  { time: 0, gpuMemory: 70, gpuUtilization: 80, cpuUtilization: 40, ramUsage: 60 },
  { time: 10, gpuMemory: 75, gpuUtilization: 85, cpuUtilization: 45, ramUsage: 65 },
  { time: 20, gpuMemory: 80, gpuUtilization: 90, cpuUtilization: 50, ramUsage: 70 },
  { time: 30, gpuMemory: 85, gpuUtilization: 95, cpuUtilization: 55, ramUsage: 75 },
  { time: 40, gpuMemory: 80, gpuUtilization: 90, cpuUtilization: 50, ramUsage: 70 },
  { time: 50, gpuMemory: 75, gpuUtilization: 85, cpuUtilization: 45, ramUsage: 65 },
]

const datasets = [
  { id: "dataset1", name: "对话数据集", samples: 1000, quality: 85 },
  { id: "dataset2", name: "指令数据集", samples: 800, quality: 90 },
  { id: "dataset3", name: "代码数据集", samples: 1200, quality: 80 },
]

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export default function FineTuningStudio() {
  const [modelName, setModelName] = useState("")
  const [baseModel, setBaseModel] = useState("")
  const [method, setMethod] = useState("qlora")
  const [dataset, setDataset] = useState("")
  const [rank, setRank] = useState(8)
  const [learningRate, setLearningRate] = useState(0.0003)
  const [batchSize, setBatchSize] = useState(32)
  const [epochs, setEpochs] = useState(3)
  const [progress, setProgress] = useState(0)
  const [isTraining, setIsTraining] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [activeTab, setActiveTab] = useState("config")
  const [isDatasetDialogOpen, setIsDatasetDialogOpen] = useState(false)
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)
  const [datasetSearchQuery, setDatasetSearchQuery] = useState("")

  // Chat interaction state
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const router = useRouter()

  const handleStartTraining = () => {
    if (isTraining && !isPaused) return

    if (isPaused) {
      setIsPaused(false)
      return
    }

    setIsTraining(true)
    setIsPaused(false)

    // Simulate training progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 300)
  }

  const handlePauseTraining = () => {
    setIsPaused(true)
  }

  const handleResetTraining = () => {
    setIsTraining(false)
    setIsPaused(false)
    setProgress(0)
  }

  const handleSendMessage = () => {
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

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content:
          "这是一个来自微调模型的回复示例。在实际应用中，这里会显示模型生成的回答。您可以继续提问来测试模型的表现。",
        timestamp: new Date().toLocaleTimeString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsGenerating(false)
    }, 1500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-[#2d3748]">微调工作室</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsDatasetDialogOpen(true)}>
            <Database className="h-4 w-4" />
            数据集
          </Button>
          {isTraining ? (
            <>
              {isPaused ? (
                <Button onClick={handleStartTraining} className="gap-2">
                  <Play className="h-4 w-4" />
                  继续训练
                </Button>
              ) : (
                <Button onClick={handlePauseTraining} variant="outline" className="gap-2">
                  <Pause className="h-4 w-4" />
                  暂停训练
                </Button>
              )}
              <Button
                onClick={handleResetTraining}
                variant="outline"
                className="gap-2 text-[#c4a59e] border-[#e8d8d4] hover:bg-[#f9f0ee] hover:text-[#b08e86]"
              >
                <RotateCcw className="h-4 w-4" />
                重置
              </Button>
            </>
          ) : (
            <Button
              onClick={handleStartTraining}
              className="bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] hover:opacity-90 gap-2"
              disabled={!modelName || !baseModel || !dataset}
            >
              <Zap className="h-4 w-4" />
              开始训练
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Training Configuration and Monitoring */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="config">配置</TabsTrigger>
              <TabsTrigger value="monitor">监控</TabsTrigger>
              <TabsTrigger value="results">结果</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>基本配置</CardTitle>
                  <CardDescription>设置模型和训练参数</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="model-name">新模型名称</Label>
                      <Input
                        id="model-name"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        placeholder="输入新模型名称"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="base-model">基础模型</Label>
                      <Select value={baseModel} onValueChange={setBaseModel}>
                        <SelectTrigger id="base-model">
                          <SelectValue placeholder="选择基础模型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="llama3">Llama 3</SelectItem>
                          <SelectItem value="mistral">Mistral</SelectItem>
                          <SelectItem value="phi3">Phi-3</SelectItem>
                          <SelectItem value="qwen2">Qwen2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="method">微调方法</Label>
                    <Select value={method} onValueChange={setMethod}>
                      <SelectTrigger id="method">
                        <SelectValue placeholder="选择微调方法" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="qlora">QLoRA (推荐)</SelectItem>
                        <SelectItem value="lora">LoRA</SelectItem>
                        <SelectItem value="full">全量微调</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      QLoRA 是一种量化版的 LoRA，可以在消费级 GPU 上高效微调大型模型
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataset">训练数据集</Label>
                    <Select value={dataset} onValueChange={setDataset}>
                      <SelectTrigger id="dataset">
                        <SelectValue placeholder="选择训练数据集" />
                      </SelectTrigger>
                      <SelectContent>
                        {datasets.map((ds) => (
                          <SelectItem key={ds.id} value={ds.id}>
                            {ds.name} ({ds.samples} 样本, 质量 {ds.quality}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">高级参数</h3>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="rank">LoRA 秩</Label>
                        <span className="text-sm text-muted-foreground">{rank}</span>
                      </div>
                      <Slider
                        id="rank"
                        min={1}
                        max={64}
                        step={1}
                        value={[rank]}
                        onValueChange={([value]) => setRank(value)}
                      />
                      <p className="text-xs text-muted-foreground">较高的秩可以提高模型表现，但会增加显存需求</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="learning-rate">学习率</Label>
                        <span className="text-sm text-muted-foreground">{learningRate}</span>
                      </div>
                      <Slider
                        id="learning-rate"
                        min={0.00001}
                        max={0.001}
                        step={0.00001}
                        value={[learningRate]}
                        onValueChange={([value]) => setLearningRate(value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="batch-size">批次大小</Label>
                        <span className="text-sm text-muted-foreground">{batchSize}</span>
                      </div>
                      <Slider
                        id="batch-size"
                        min={1}
                        max={64}
                        step={1}
                        value={[batchSize]}
                        onValueChange={([value]) => setBatchSize(value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="epochs">训练轮数</Label>
                        <span className="text-sm text-muted-foreground">{epochs}</span>
                      </div>
                      <Slider
                        id="epochs"
                        min={1}
                        max={10}
                        step={1}
                        value={[epochs]}
                        onValueChange={([value]) => setEpochs(value)}
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <div className="flex items-center gap-2 text-amber-700 font-medium">
                      <Info className="h-4 w-4" />
                      <span>资源需求估计</span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-amber-600">
                      <div className="flex justify-between">
                        <span>显存需求:</span>
                        <span>{method === "qlora" ? "4-8 GB" : method === "lora" ? "8-16 GB" : "16+ GB"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>训练时间估计:</span>
                        <span>{method === "qlora" ? "1-3 小时" : method === "lora" ? "2-5 小时" : "8+ 小时"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>推荐 GPU:</span>
                        <span>
                          {method === "qlora"
                            ? "RTX 3060 或更高"
                            : method === "lora"
                              ? "RTX 3080 或更高"
                              : "RTX 4090 或更高"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitor" className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>训练进度</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-[#8884d8]" />
                      训练指标
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trainingMetrics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="step" label={{ value: "步数", position: "insideBottomRight", offset: -10 }} />
                          <YAxis yAxisId="loss" label={{ value: "损失", angle: -90, position: "insideLeft" }} />
                          <YAxis
                            yAxisId="accuracy"
                            orientation="right"
                            label={{ value: "准确率 (%)", angle: 90, position: "insideRight" }}
                          />
                          <RechartsTooltip />
                          <Legend />
                          <Line
                            yAxisId="loss"
                            type="monotone"
                            dataKey="trainingLoss"
                            name="训练损失"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            yAxisId="loss"
                            type="monotone"
                            dataKey="validationLoss"
                            name="验证损失"
                            stroke="#8884d8"
                            strokeDasharray="5 5"
                          />
                          <Line
                            yAxisId="accuracy"
                            type="monotone"
                            dataKey="trainingAccuracy"
                            name="训练准确率"
                            stroke="#82ca9d"
                          />
                          <Line
                            yAxisId="accuracy"
                            type="monotone"
                            dataKey="validationAccuracy"
                            name="验证准确率"
                            stroke="#82ca9d"
                            strokeDasharray="5 5"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-[#82ca9d]" />
                      资源使用
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={resourceUsage} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="time"
                            label={{ value: "时间 (秒)", position: "insideBottomRight", offset: -10 }}
                          />
                          <YAxis
                            domain={[0, 100]}
                            label={{ value: "使用率 (%)", angle: -90, position: "insideLeft" }}
                          />
                          <RechartsTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="gpuMemory" name="GPU 显存" stroke="#8884d8" />
                          <Line type="monotone" dataKey="gpuUtilization" name="GPU 利用率" stroke="#82ca9d" />
                          <Line type="monotone" dataKey="cpuUtilization" name="CPU 利用率" stroke="#ffc658" />
                          <Line type="monotone" dataKey="ramUsage" name="内存使用率" stroke="#ff8042" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">训练日志</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <div className="space-y-1 font-mono text-xs">
                      {progress > 0 ? (
                        <>
                          <div className="text-blue-600">[INFO] 开始训练...</div>
                          {progress >= 10 && <div className="text-green-600">[SUCCESS] 已加载数据集</div>}
                          {progress >= 20 && <div>[INFO] 第 1 轮训练中，步数: 100, 损失: 1.3</div>}
                          {progress >= 30 && <div>[INFO] 第 1 轮训练中，步数: 200, 损失: 1.1</div>}
                          {progress >= 40 && <div className="text-green-600">[SUCCESS] 第 1 轮训练完成</div>}
                          {progress >= 50 && <div>[INFO] 第 2 轮训练中，步数: 100, 损失: 0.9</div>}
                          {progress >= 60 && <div>[INFO] 第 2 轮训练中，步数: 200, 损失: 0.7</div>}
                          {progress >= 70 && <div className="text-green-600">[SUCCESS] 第 2 轮训练完成</div>}
                          {progress >= 80 && <div>[INFO] 第 3 轮训练中，步数: 100, 损失: 0.6</div>}
                          {progress >= 90 && <div>[INFO] 第 3 轮训练中，步数: 200, 损失: 0.5</div>}
                          {progress >= 100 && <div className="text-green-600">[SUCCESS] 训练完成！</div>}
                        </>
                      ) : (
                        <div className="text-muted-foreground">训练尚未开始，日志将在训练过程中显示...</div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {progress === 100 ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>训练结果</CardTitle>
                      <CardDescription>模型训练已完成，以下是训练结果</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-muted/50 p-4 rounded-md">
                          <div className="text-sm text-muted-foreground">最终训练损失</div>
                          <div className="text-2xl font-semibold text-[#8884d8]">0.42</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-md">
                          <div className="text-sm text-muted-foreground">最终验证损失</div>
                          <div className="text-2xl font-semibold text-[#8884d8]">0.51</div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-md">
                          <div className="text-sm text-muted-foreground">准确率</div>
                          <div className="text-2xl font-semibold text-[#82ca9d]">87.5%</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">性能评估</h3>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { name: "基础模型", score: 65 },
                                { name: "微调模型", score: 87 },
                              ]}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis label={{ value: "评分", angle: -90, position: "insideLeft" }} />
                              <RechartsTooltip />
                              <Bar dataKey="score" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <div className="flex items-center gap-2 text-green-700 font-medium">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>训练成功</span>
                        </div>
                        <p className="mt-2 text-sm text-green-600">
                          模型训练已成功完成，您可以下载模型或直接部署使用。
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        下载模型
                      </Button>
                      <Button
                        className="gap-2 bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] hover:opacity-90"
                        onClick={() => router.push("/deployment")}
                      >
                        部署模型
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>模型评估</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium mb-2">优势</h3>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>在特定领域表现优于基础模型</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>响应更加符合指令要求</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>更好地理解特定领域术语</span>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-2">局限性</h3>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                                <span>在训练数据集之外的领域可能表现不佳</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                                <span>可能存在过拟合风险</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-sm font-medium mb-2">示例输出</h3>
                          <div className="space-y-2">
                            <div className="bg-muted/50 p-3 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">输入:</div>
                              <div>解释量子计算的基本原理</div>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">模型输出:</div>
                              <div>
                                量子计算利用量子力学原理，如叠加和纠缠，来处理信息。与经典计算机使用位（0或1）不同，量子计算机使用量子位，可以同时处理多种状态，理论上能够解决某些经典计算机难以解决的问题。
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-medium text-muted-foreground">训练尚未完成</h3>
                  <p className="text-muted-foreground mt-2">请完成训练过程以查看结果</p>
                  {progress > 0 && (
                    <div className="mt-4 w-full max-w-md">
                      <div className="flex justify-between text-sm">
                        <span>训练进度</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="mt-2" />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Chat Interaction Testing */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>模型交互测试</CardTitle>
              <CardDescription>
                {progress === 100 ? "与微调后的模型进行对话，测试其表现" : "完成模型训练后可在此进行交互测试"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-[500px] p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                      {progress === 100 ? (
                        <>
                          <Bot className="h-12 w-12 mb-4 opacity-20" />
                          <p className="text-lg font-medium">开始与模型对话</p>
                          <p className="text-sm">输入消息来测试微调后的模型</p>
                        </>
                      ) : (
                        <>
                          <FileText className="h-12 w-12 mb-4 opacity-20" />
                          <p className="text-lg font-medium">模型训练尚未完成</p>
                          <p className="text-sm">完成训练后可在此测试模型</p>
                        </>
                      )}
                    </div>
                  ) : (
                    messages.map((message, index) => (
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

                        <div className={`flex flex-col gap-1 max-w-[calc(100%-3rem)]`}>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.role === "assistant"
                                ? "bg-muted"
                                : "bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] text-white"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{message.timestamp}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 p-0 text-xs"
                              onClick={() => copyToClipboard(message.content)}
                            >
                              {isCopied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                              {isCopied ? "已复制" : "复制"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {isGenerating && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] flex items-center justify-center animate-pulse">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="rounded-lg px-4 py-2 bg-muted">
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
            <CardFooter className="p-4 pt-2">
              <div className="flex w-full gap-2">
                <Input
                  placeholder="输入消息..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isGenerating || progress !== 100}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!input.trim() || isGenerating || progress !== 100}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* 数据集管理对话框 */}
      <Dialog open={isDatasetDialogOpen} onOpenChange={setIsDatasetDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>数据集管理</DialogTitle>
            <DialogDescription>管理训练数据集，查看数据集内容或上传新数据集</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 搜索和添加按钮 */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索数据集..."
                  className="pl-8"
                  value={datasetSearchQuery}
                  onChange={(e) => setDatasetSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* 数据集列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {datasets
                .filter((ds) => ds.name.toLowerCase().includes(datasetSearchQuery.toLowerCase()))
                .map((ds) => (
                  <Card
                    key={ds.id}
                    className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedDataset === ds.id ? "border-primary" : ""}`}
                    onClick={() => setSelectedDataset(ds.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="font-medium">{ds.name}</div>
                          <div className="text-sm text-muted-foreground">{ds.samples} 个样本</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{ds.quality}% 质量</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>查看详情</DropdownMenuItem>
                              <DropdownMenuItem>导出数据</DropdownMenuItem>
                              <DropdownMenuItem className="text-[#c4a59e]">删除</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {/* 添加新数据集卡片 */}
              <Card className="border-dashed cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[100px] text-center">
                  <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                  <span className="text-muted-foreground">上传新数据集</span>
                </CardContent>
              </Card>
            </div>

            {/* 如果选择了数据集，显示数据集详情 */}
            {selectedDataset && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      数据集预览：{datasets.find((ds) => ds.id === selectedDataset)?.name}
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedDataset(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/50 rounded-md">
                        <div className="text-xs text-muted-foreground mb-1">样本 #1</div>
                        <div className="text-sm">
                          <div className="font-medium mb-1">输入:</div>
                          <div className="mb-2">如何提高英语口语水平？</div>
                          <div className="font-medium mb-1">输出:</div>
                          <div>
                            提高英语口语需要多练习，可以通过与外国人交流、看英语电影、参加英语角等方式。坚持每天说英语，不怕犯错，是进步的关键。
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-md">
                        <div className="text-xs text-muted-foreground mb-1">样本 #2</div>
                        <div className="text-sm">
                          <div className="font-medium mb-1">输入:</div>
                          <div className="mb-2">介绍一下人工智能的应用领域</div>
                          <div className="font-medium mb-1">输出:</div>
                          <div>
                            人工智能广泛应用于医疗诊断、自动驾驶、智能客服、金融风控、智能制造等领域。随着技术发展，AI应用将更加普及和深入各行各业。
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-md">
                        <div className="text-xs text-muted-foreground mb-1">样本 #3</div>
                        <div className="text-sm">
                          <div className="font-medium mb-1">输入:</div>
                          <div className="mb-2">如何做一道红烧肉？</div>
                          <div className="font-medium mb-1">输出:</div>
                          <div>
                            红烧肉的做法：1.五花肉切块焯水去腥；2.锅中放油，加入冰糖炒至焦糖色；3.放入肉块煸炒上色；4.加入酱油、料酒、八角等调料；5.加水没过肉，炖煮1小时至肉烂即可。
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  <div className="flex justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileText className="h-4 w-4" />
                        导出
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Plus className="h-4 w-4" />
                        添加样本
                      </Button>
                    </div>
                    <Button size="sm" className="gap-1 bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] hover:opacity-90">
                      <Upload className="h-4 w-4" />
                      使用此数据集
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

