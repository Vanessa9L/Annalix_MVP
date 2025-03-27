"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useModel } from "./model-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Zap,
  Save,
  FolderOpen,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Download,
  Trash,
  Info,
  AlertCircle,
  CheckCircle2,
  Database,
  LineChart,
  Cpu,
  HardDrive,
  Layers,
  Bookmark,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// 训练方法定义
const trainingMethods = [
  {
    id: "full-tuning",
    name: "Full-tuning",
    description: "完整模型微调，需要较大的计算资源",
    defaultParams: {
      learningRate: 0.0001,
      batchSize: 8,
      epochs: 3,
      warmupSteps: 100,
      weightDecay: 0.01,
      optimizerType: "adamw",
      schedulerType: "linear",
      maxGradNorm: 1.0,
      evalSteps: 500,
      saveSteps: 1000,
    },
    recommendedParams: {
      learningRate: [0.00005, 0.0002],
      batchSize: [4, 16],
      epochs: [2, 5],
      warmupSteps: [50, 200],
      weightDecay: [0.005, 0.02],
    },
  },
  {
    id: "freeze-tuning",
    name: "Freeze-tuning",
    description: "冻结部分层进行微调，节省计算资源",
    defaultParams: {
      learningRate: 0.0002,
      batchSize: 16,
      epochs: 5,
      frozenLayers: 6,
      warmupSteps: 50,
      weightDecay: 0.01,
      optimizerType: "adamw",
      schedulerType: "linear",
      maxGradNorm: 1.0,
      evalSteps: 500,
      saveSteps: 1000,
    },
    recommendedParams: {
      learningRate: [0.0001, 0.0005],
      batchSize: [8, 32],
      epochs: [3, 8],
      frozenLayers: [4, 8],
      warmupSteps: [30, 100],
      weightDecay: [0.005, 0.02],
    },
  },
  {
    id: "lora",
    name: "LoRA",
    description: "低秩适应微调，高效且节省显存",
    defaultParams: {
      learningRate: 0.0003,
      batchSize: 32,
      epochs: 5,
      rank: 8,
      alpha: 16,
      warmupSteps: 50,
      weightDecay: 0.01,
      optimizerType: "adamw",
      schedulerType: "linear",
      maxGradNorm: 1.0,
      evalSteps: 500,
      saveSteps: 1000,
      targetModules: "q_proj,v_proj",
    },
    recommendedParams: {
      learningRate: [0.0001, 0.001],
      batchSize: [16, 64],
      epochs: [3, 10],
      rank: [4, 32],
      alpha: [8, 32],
      warmupSteps: [30, 100],
      weightDecay: [0.005, 0.02],
    },
  },
  {
    id: "qlora",
    name: "QLoRA",
    description: "量化版LoRA，进一步降低显存需求",
    defaultParams: {
      learningRate: 0.0003,
      batchSize: 32,
      epochs: 5,
      rank: 8,
      alpha: 16,
      bits: 4,
      warmupSteps: 50,
      weightDecay: 0.01,
      optimizerType: "adamw",
      schedulerType: "linear",
      maxGradNorm: 1.0,
      evalSteps: 500,
      saveSteps: 1000,
      targetModules: "q_proj,v_proj",
    },
    recommendedParams: {
      learningRate: [0.0001, 0.001],
      batchSize: [16, 64],
      epochs: [3, 10],
      rank: [4, 32],
      alpha: [8, 32],
      bits: [2, 8],
      warmupSteps: [30, 100],
      weightDecay: [0.005, 0.02],
    },
  },
]

// 参数预设
const paramPresets = [
  {
    id: "preset1",
    name: "高效训练预设",
    description: "适合快速迭代的参数配置",
    method: "lora",
    params: {
      learningRate: 0.0005,
      batchSize: 32,
      epochs: 3,
      rank: 16,
      alpha: 32,
      warmupSteps: 30,
      weightDecay: 0.01,
      optimizerType: "adamw",
      schedulerType: "linear",
      maxGradNorm: 1.0,
      evalSteps: 200,
      saveSteps: 500,
      targetModules: "q_proj,v_proj",
    },
  },
  {
    id: "preset2",
    name: "高质量训练预设",
    description: "适合追求高质量结果的参数配置",
    method: "lora",
    params: {
      learningRate: 0.0002,
      batchSize: 16,
      epochs: 8,
      rank: 32,
      alpha: 64,
      warmupSteps: 100,
      weightDecay: 0.02,
      optimizerType: "adamw",
      schedulerType: "cosine",
      maxGradNorm: 1.0,
      evalSteps: 500,
      saveSteps: 1000,
      targetModules: "q_proj,k_proj,v_proj,o_proj",
    },
  },
  {
    id: "preset3",
    name: "低资源预设",
    description: "适合显存受限的训练环境",
    method: "qlora",
    params: {
      learningRate: 0.0003,
      batchSize: 8,
      epochs: 5,
      rank: 4,
      alpha: 8,
      bits: 4,
      warmupSteps: 50,
      weightDecay: 0.01,
      optimizerType: "adamw8bit",
      schedulerType: "linear",
      maxGradNorm: 1.0,
      evalSteps: 300,
      saveSteps: 600,
      targetModules: "q_proj,v_proj",
    },
  },
]

// 示例数据库
const sampleDatasets = [
  {
    id: "dataset1",
    name: "大型语言模型训练数据库",
    samples: 100,
    quality: 85,
    format: "jsonl",
    size: "25MB",
    lastUpdated: "2024-03-15",
    description: "用于LLM训练的高质量对话数据集",
    preview: [
      { input: "请介绍一下人工智能的发展历程", output: "人工智能的发展可以追溯到20世纪50年代..." },
      { input: "什么是深度学习？", output: "深度学习是机器学习的一个分支，它使用多层神经网络来模拟人脑的学习过程..." },
    ],
  },
  {
    id: "dataset2",
    name: "情感分析数据库",
    samples: 80,
    quality: 92,
    format: "csv",
    size: "18MB",
    lastUpdated: "2024-03-10",
    description: "中文社交媒体评论情感标注数据集",
    preview: [
      { input: "这家餐厅的服务态度非常好，菜品也很美味", output: "正面" },
      { input: "产品质量太差了，完全不值这个价格", output: "负面" },
    ],
  },
  {
    id: "dataset3",
    name: "问答系统数据库",
    samples: 120,
    quality: 78,
    format: "jsonl",
    size: "32MB",
    lastUpdated: "2024-03-05",
    description: "通用领域问答对数据集",
    preview: [
      { input: "地球距离太阳多远？", output: "地球到太阳的平均距离约为1.496亿公里，也称为一个天文单位（AU）。" },
      { input: "水的化学式是什么？", output: "水的化学式是H₂O，表示由两个氢原子和一个氧原子组成。" },
    ],
  },
  {
    id: "dataset4",
    name: "代码生成数据库",
    samples: 95,
    quality: 88,
    format: "jsonl",
    size: "40MB",
    lastUpdated: "2024-03-20",
    description: "编程语言代码生成训练数据集",
    preview: [
      {
        input: "写一个计算斐波那契数列的Python函数",
        output: "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)",
      },
      {
        input: "创建一个简单的React组件",
        output: "function Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}",
      },
    ],
  },
]

// 模拟训练日志
const generateTrainingLogs = (progress: number) => {
  if (progress === 0) return []

  const logs = []
  const steps = Math.floor(progress / 10) * 100

  for (let i = 0; i <= steps; i += 10) {
    if (i === 0) {
      logs.push({
        time: "00:00:00",
        message: "开始训练...",
        type: "info",
      })
      continue
    }

    const minutes = Math.floor(i / 60)
    const seconds = i % 60
    const time = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`

    const loss = (1.5 - i / 1000).toFixed(4)
    const accuracy = (50 + i / 2).toFixed(2)

    logs.push({
      time,
      message: `Step ${i}: loss=${loss}, accuracy=${accuracy}%`,
      type: "step",
    })

    if (i % 100 === 0 && i > 0) {
      logs.push({
        time,
        message: `Evaluation at step ${i}: validation loss=${(Number.parseFloat(loss) + 0.1).toFixed(4)}, validation accuracy=${(Number.parseFloat(accuracy) - 5).toFixed(2)}%`,
        type: "eval",
      })
    }

    if (i % 200 === 0 && i > 0) {
      logs.push({
        time,
        message: `Saved checkpoint at step ${i}`,
        type: "checkpoint",
      })
    }
  }

  return logs
}

// 模拟训练指标数据
const generateTrainingMetrics = (progress: number) => {
  if (progress === 0) return []

  const metrics = []
  const steps = Math.floor(progress / 10) * 100

  for (let i = 0; i <= steps; i += 10) {
    const trainingLoss = 1.5 - i / 1000 + (Math.random() * 0.1 - 0.05)
    const validationLoss = trainingLoss + 0.1 + (Math.random() * 0.1 - 0.05)
    const trainingAccuracy = 50 + i / 2 + (Math.random() * 2 - 1)
    const validationAccuracy = trainingAccuracy - 5 + (Math.random() * 2 - 1)
    const learningRate = 0.0003 * (1 - i / 1000)

    metrics.push({
      step: i,
      trainingLoss: Number.parseFloat(trainingLoss.toFixed(4)),
      validationLoss: Number.parseFloat(validationLoss.toFixed(4)),
      trainingAccuracy: Number.parseFloat(trainingAccuracy.toFixed(2)),
      validationAccuracy: Number.parseFloat(validationAccuracy.toFixed(2)),
      learningRate: Number.parseFloat(learningRate.toFixed(6)),
    })
  }

  return metrics
}

// 模拟资源使用数据
const generateResourceUsage = (progress: number) => {
  if (progress === 0) return []

  const usage = []
  const steps = Math.floor(progress / 5) * 50

  for (let i = 0; i <= steps; i += 10) {
    const gpuMemory = 70 + (Math.random() * 20 - 10)
    const gpuUtilization = 80 + (Math.random() * 15 - 7.5)
    const cpuUtilization = 40 + (Math.random() * 10 - 5)
    const ramUsage = 60 + (Math.random() * 10 - 5)

    usage.push({
      time: i,
      gpuMemory: Number.parseFloat(gpuMemory.toFixed(1)),
      gpuUtilization: Number.parseFloat(gpuUtilization.toFixed(1)),
      cpuUtilization: Number.parseFloat(cpuUtilization.toFixed(1)),
      ramUsage: Number.parseFloat(ramUsage.toFixed(1)),
    })
  }

  return usage
}

// 参数验证函数
const validateParams = (params: any, method: any) => {
  const issues = []
  const warnings = []

  if (method.recommendedParams.learningRate) {
    const [min, max] = method.recommendedParams.learningRate
    if (params.learningRate < min) {
      warnings.push(`学习率 ${params.learningRate} 低于推荐最小值 ${min}，可能导致训练缓慢`)
    } else if (params.learningRate > max) {
      warnings.push(`学习率 ${params.learningRate} 高于推荐最大值 ${max}，可能导致训练不稳定`)
    }
  }

  if (method.recommendedParams.batchSize) {
    const [min, max] = method.recommendedParams.batchSize
    if (params.batchSize < min) {
      warnings.push(`批次大小 ${params.batchSize} 低于推荐最小值 ${min}，可能影响训练效果`)
    } else if (params.batchSize > max) {
      warnings.push(`批次大小 ${params.batchSize} 高于推荐最大值 ${max}，可能导致显存不足`)
    }
  }

  if (method.id === "lora" || method.id === "qlora") {
    if (!params.targetModules) {
      issues.push("LoRA 目标模块不能为空")
    }

    if (method.recommendedParams.rank) {
      const [min, max] = method.recommendedParams.rank
      if (params.rank < min) {
        warnings.push(`LoRA 秩 ${params.rank} 低于推荐最小值 ${min}，可能影响模型表现`)
      } else if (params.rank > max) {
        warnings.push(`LoRA 秩 ${params.rank} 高于推荐最大值 ${max}，可能导致过拟合或显存不足`)
      }
    }
  }

  return { issues, warnings }
}

export default function ModelTraining() {
  const { models, selectedModel, setSelectedModel } = useModel()
  const [progress, setProgress] = useState(0)
  const [modelName, setModelName] = useState("")
  const [selectedMethod, setSelectedMethod] = useState(trainingMethods[0])
  const [trainingParams, setTrainingParams] = useState(trainingMethods[0].defaultParams)
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([])
  const [isTraining, setIsTraining] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [trainingLogs, setTrainingLogs] = useState<any[]>([])
  const [trainingMetrics, setTrainingMetrics] = useState<any[]>([])
  const [resourceUsage, setResourceUsage] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("basic")
  const [activeMonitorTab, setActiveMonitorTab] = useState("progress")
  const [activeResultTab, setActiveResultTab] = useState("loss")
  const [showValidation, setShowValidation] = useState(true)
  const [modelPath, setModelPath] = useState("")
  const [presetName, setPresetName] = useState("")
  const [presetDescription, setPresetDescription] = useState("")
  const [isSavePresetOpen, setIsSavePresetOpen] = useState(false)
  const [customPresets, setCustomPresets] = useState<any[]>([])
  const [selectedPreset, setSelectedPreset] = useState<string>("")
  const [paramValidation, setParamValidation] = useState<{ issues: string[]; warnings: string[] }>({
    issues: [],
    warnings: [],
  })
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDatasetDialogOpen, setIsDatasetDialogOpen] = useState(false)
  const [previewDataset, setPreviewDataset] = useState<any>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)
  const trainingInterval = useRef<NodeJS.Timeout | null>(null)

  // 当选择训练方法时更新默认参数
  const handleMethodChange = (methodId: string) => {
    const method = trainingMethods.find((m) => m.id === methodId)
    if (method) {
      setSelectedMethod(method)
      setTrainingParams(method.defaultParams)
      setSelectedPreset("")
    }
  }

  // 参数更新处理
  const handleParamChange = (param: string, value: any) => {
    setTrainingParams((prev) => ({
      ...prev,
      [param]: value,
    }))
    setSelectedPreset("")
  }

  // 加载参数预设
  const loadPreset = (presetId: string) => {
    const allPresets = [...paramPresets, ...customPresets]
    const preset = allPresets.find((p) => p.id === presetId)
    if (preset) {
      const method = trainingMethods.find((m) => m.id === preset.method)
      if (method) {
        setSelectedMethod(method)
        setTrainingParams(preset.params)
        setSelectedPreset(presetId)
      }
    }
  }

  // 保存自定义预设
  const saveCustomPreset = () => {
    if (!presetName) return

    const newPreset = {
      id: `custom-${Date.now()}`,
      name: presetName,
      description: presetDescription || "自定义参数预设",
      method: selectedMethod.id,
      params: { ...trainingParams },
    }

    setCustomPresets((prev) => [...prev, newPreset])
    setIsSavePresetOpen(false)
    setPresetName("")
    setPresetDescription("")
    setSelectedPreset(newPreset.id)
  }

  // 开始训练
  const handleStartTraining = () => {
    if (isTraining && !isPaused) return

    if (isPaused) {
      setIsPaused(false)
      return
    }

    setIsTraining(true)
    setIsPaused(false)

    if (progress === 100) {
      setProgress(0)
      setTrainingLogs([])
      setTrainingMetrics([])
      setResourceUsage([])
    }

    trainingInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (trainingInterval.current) {
            clearInterval(trainingInterval.current)
            trainingInterval.current = null
          }
          return 100
        }
        return prev + 1
      })
    }, 500)
  }

  // 暂停训练
  const handlePauseTraining = () => {
    if (!isTraining || isPaused) return

    setIsPaused(true)
    if (trainingInterval.current) {
      clearInterval(trainingInterval.current)
      trainingInterval.current = null
    }
  }

  // 停止训练
  const handleStopTraining = () => {
    setIsTraining(false)
    setIsPaused(false)

    if (trainingInterval.current) {
      clearInterval(trainingInterval.current)
      trainingInterval.current = null
    }
  }

  // 重置训练
  const handleResetTraining = () => {
    handleStopTraining()
    setProgress(0)
    setTrainingLogs([])
    setTrainingMetrics([])
    setResourceUsage([])
  }

  // 打开数据集预览
  const handlePreviewDataset = (datasetId: string) => {
    const dataset = sampleDatasets.find((d) => d.id === datasetId)
    if (dataset) {
      setPreviewDataset(dataset)
      setIsPreviewOpen(true)
    }
  }

  // 添加或移除数据集
  const toggleDataset = (datasetId: string) => {
    setSelectedDatasets((prev) => {
      if (prev.includes(datasetId)) {
        return prev.filter((id) => id !== datasetId)
      } else {
        return [...prev, datasetId]
      }
    })
  }

  // 更新训练日志和指标
  useEffect(() => {
    if (isTraining && !isPaused) {
      setTrainingLogs(generateTrainingLogs(progress))
      setTrainingMetrics(generateTrainingMetrics(progress))
      setResourceUsage(generateResourceUsage(progress))
    }
  }, [progress, isTraining, isPaused])

  // 自动滚动日志到底部
  useEffect(() => {
    if (logsEndRef.current && activeMonitorTab === "logs") {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [trainingLogs, activeMonitorTab])

  // 参数验证
  useEffect(() => {
    const { issues, warnings } = validateParams(trainingParams, selectedMethod)
    setParamValidation({ issues, warnings })
  }, [trainingParams, selectedMethod])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (trainingInterval.current) {
        clearInterval(trainingInterval.current)
      }
    }
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-[#2d3748]">模型训练</h2>
        <div className="flex items-center gap-2">
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
              <Button onClick={handleStopTraining} variant="destructive" className="gap-2">
                <Trash className="h-4 w-4" />
                停止训练
              </Button>
            </>
          ) : (
            <Button
              onClick={handleStartTraining}
              disabled={
                !selectedModel || !modelName || selectedDatasets.length === 0 || paramValidation.issues.length > 0
              }
              className="bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] hover:opacity-90 gap-2"
            >
              <Zap className="h-4 w-4" />
              开始训练
            </Button>
          )}
        </div>
      </div>

      {/* 训练配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>训练配置</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsDatasetDialogOpen(true)} className="mr-2">
                <Database className="h-4 w-4 mr-2" />
                数据选择
                {selectedDatasets.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedDatasets.length}
                  </Badge>
                )}
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setIsSavePresetOpen(true)}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>保存当前参数为预设</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>加载参数预设</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {paramPresets.map((preset) => (
                    <DropdownMenuItem
                      key={preset.id}
                      onClick={() => loadPreset(preset.id)}
                      className="flex flex-col items-start"
                    >
                      <span className="font-medium">{preset.name}</span>
                      <span className="text-xs text-muted-foreground">{preset.description}</span>
                    </DropdownMenuItem>
                  ))}
                  {customPresets.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>自定义预设</DropdownMenuLabel>
                      {customPresets.map((preset) => (
                        <DropdownMenuItem
                          key={preset.id}
                          onClick={() => loadPreset(preset.id)}
                          className="flex flex-col items-start"
                        >
                          <span className="font-medium">{preset.name}</span>
                          <span className="text-xs text-muted-foreground">{preset.description}</span>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="basic">基础配置</TabsTrigger>
              <TabsTrigger value="advanced">高级配置</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>新模型名称</Label>
                  <Input
                    placeholder="输入新模型名称"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>选择基础模型</Label>
                  <Select
                    value={selectedModel?.provider}
                    onValueChange={(value) => {
                      const model = models.find((m) => m.provider === value)
                      setSelectedModel(model || null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择模型" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.provider} value={model.provider}>
                          {model.provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>模型路径</Label>
                <Input
                  placeholder="输入模型路径（可选）"
                  value={modelPath}
                  onChange={(e) => setModelPath(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">如果使用本地模型，请指定模型路径</p>
              </div>

              <div className="space-y-2">
                <Label>训练方法</Label>
                <Select value={selectedMethod.id} onValueChange={handleMethodChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择训练方法" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainingMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex flex-col">
                          <span>{method.name}</span>
                          <span className="text-xs text-muted-foreground">{method.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>学习率</Label>
                    <span className="text-sm text-muted-foreground">{trainingParams.learningRate}</span>
                  </div>
                  <Slider
                    value={[trainingParams.learningRate]}
                    onValueChange={([value]) => handleParamChange("learningRate", value)}
                    min={0.00001}
                    max={0.001}
                    step={0.00001}
                  />
                  {selectedMethod.recommendedParams.learningRate && (
                    <p className="text-xs text-muted-foreground">
                      推荐范围: {selectedMethod.recommendedParams.learningRate[0]} -{" "}
                      {selectedMethod.recommendedParams.learningRate[1]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Batch Size</Label>
                    <span className="text-sm text-muted-foreground">{trainingParams.batchSize}</span>
                  </div>
                  <Slider
                    value={[trainingParams.batchSize]}
                    onValueChange={([value]) => handleParamChange("batchSize", value)}
                    min={1}
                    max={64}
                    step={1}
                  />
                  {selectedMethod.recommendedParams.batchSize && (
                    <p className="text-xs text-muted-foreground">
                      推荐范围: {selectedMethod.recommendedParams.batchSize[0]} -{" "}
                      {selectedMethod.recommendedParams.batchSize[1]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>训练轮数</Label>
                    <span className="text-sm text-muted-foreground">{trainingParams.epochs}</span>
                  </div>
                  <Slider
                    value={[trainingParams.epochs]}
                    onValueChange={([value]) => handleParamChange("epochs", value)}
                    min={1}
                    max={10}
                    step={1}
                  />
                  {selectedMethod.recommendedParams.epochs && (
                    <p className="text-xs text-muted-foreground">
                      推荐范围: {selectedMethod.recommendedParams.epochs[0]} -{" "}
                      {selectedMethod.recommendedParams.epochs[1]}
                    </p>
                  )}
                </div>

                {(selectedMethod.id === "lora" || selectedMethod.id === "qlora") && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>LoRA Rank</Label>
                      <span className="text-sm text-muted-foreground">{trainingParams.rank}</span>
                    </div>
                    <Slider
                      value={[trainingParams.rank]}
                      onValueChange={([value]) => handleParamChange("rank", value)}
                      min={1}
                      max={64}
                      step={1}
                    />
                    {selectedMethod.recommendedParams.rank && (
                      <p className="text-xs text-muted-foreground">
                        推荐范围: {selectedMethod.recommendedParams.rank[0]} -{" "}
                        {selectedMethod.recommendedParams.rank[1]}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {(selectedMethod.id === "lora" || selectedMethod.id === "qlora") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>LoRA Alpha</Label>
                      <span className="text-sm text-muted-foreground">{trainingParams.alpha}</span>
                    </div>
                    <Slider
                      value={[trainingParams.alpha]}
                      onValueChange={([value]) => handleParamChange("alpha", value)}
                      min={1}
                      max={128}
                      step={1}
                    />
                    {selectedMethod.recommendedParams.alpha && (
                      <p className="text-xs text-muted-foreground">
                        推荐范围: {selectedMethod.recommendedParams.alpha[0]} -{" "}
                        {selectedMethod.recommendedParams.alpha[1]}
                      </p>
                    )}
                  </div>

                  {selectedMethod.id === "qlora" && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>量化位数</Label>
                        <span className="text-sm text-muted-foreground">{trainingParams.bits}</span>
                      </div>
                      <Slider
                        value={[trainingParams.bits]}
                        onValueChange={([value]) => handleParamChange("bits", value)}
                        min={2}
                        max={8}
                        step={1}
                      />
                      {selectedMethod.recommendedParams.bits && (
                        <p className="text-xs text-muted-foreground">
                          推荐范围: {selectedMethod.recommendedParams.bits[0]} -{" "}
                          {selectedMethod.recommendedParams.bits[1]}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>优化器类型</Label>
                <Select
                  value={trainingParams.optimizerType}
                  onValueChange={(value) => handleParamChange("optimizerType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择优化器" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adamw">AdamW</SelectItem>
                    <SelectItem value="adamw8bit">AdamW 8-bit</SelectItem>
                    <SelectItem value="sgd">SGD</SelectItem>
                    <SelectItem value="adafactor">Adafactor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>学习率调度器</Label>
                <Select
                  value={trainingParams.schedulerType}
                  onValueChange={(value) => handleParamChange("schedulerType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择调度器" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="cosine">Cosine</SelectItem>
                    <SelectItem value="cosine_with_restarts">Cosine with Restarts</SelectItem>
                    <SelectItem value="polynomial">Polynomial</SelectItem>
                    <SelectItem value="constant">Constant</SelectItem>
                    <SelectItem value="constant_with_warmup">Constant with Warmup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Warmup Steps</Label>
                  <span className="text-sm text-muted-foreground">{trainingParams.warmupSteps}</span>
                </div>
                <Slider
                  value={[trainingParams.warmupSteps]}
                  onValueChange={([value]) => handleParamChange("warmupSteps", value)}
                  min={0}
                  max={500}
                  step={10}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Weight Decay</Label>
                  <span className="text-sm text-muted-foreground">{trainingParams.weightDecay}</span>
                </div>
                <Slider
                  value={[trainingParams.weightDecay]}
                  onValueChange={([value]) => handleParamChange("weightDecay", value)}
                  min={0}
                  max={0.1}
                  step={0.001}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Max Gradient Norm</Label>
                  <span className="text-sm text-muted-foreground">{trainingParams.maxGradNorm}</span>
                </div>
                <Slider
                  value={[trainingParams.maxGradNorm]}
                  onValueChange={([value]) => handleParamChange("maxGradNorm", value)}
                  min={0.1}
                  max={5}
                  step={0.1}
                />
              </div>

              {selectedMethod.id === "freeze-tuning" && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>冻结层数</Label>
                    <span className="text-sm text-muted-foreground">{trainingParams.frozenLayers}</span>
                  </div>
                  <Slider
                    value={[trainingParams.frozenLayers]}
                    onValueChange={([value]) => handleParamChange("frozenLayers", value)}
                    min={1}
                    max={12}
                    step={1}
                  />
                </div>
              )}

              {(selectedMethod.id === "lora" || selectedMethod.id === "qlora") && (
                <div className="space-y-2">
                  <Label>LoRA 目标模块</Label>
                  <Input
                    placeholder="例如: q_proj,v_proj"
                    value={trainingParams.targetModules}
                    onChange={(e) => handleParamChange("targetModules", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">指定要应用 LoRA 的模块，用逗号分隔</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>评估步数</Label>
                  <span className="text-sm text-muted-foreground">{trainingParams.evalSteps}</span>
                </div>
                <Slider
                  value={[trainingParams.evalSteps]}
                  onValueChange={([value]) => handleParamChange("evalSteps", value)}
                  min={100}
                  max={2000}
                  step={100}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>保存步数</Label>
                  <span className="text-sm text-muted-foreground">{trainingParams.saveSteps}</span>
                </div>
                <Slider
                  value={[trainingParams.saveSteps]}
                  onValueChange={([value]) => handleParamChange("saveSteps", value)}
                  min={100}
                  max={2000}
                  step={100}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* 参数验证结果 */}
          {(paramValidation.issues.length > 0 || paramValidation.warnings.length > 0) && (
            <div className="space-y-2 mt-4">
              {paramValidation.issues.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center gap-2 text-red-700 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    <span>参数错误</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-red-600">
                    {paramValidation.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {paramValidation.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex items-center gap-2 text-yellow-700 font-medium">
                    <Info className="h-4 w-4" />
                    <span>参数警告</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-yellow-600">
                    {paramValidation.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 当前预设信息 */}
          {selectedPreset && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
              <Bookmark className="h-4 w-4" />
              <span>
                当前使用预设: {[...paramPresets, ...customPresets].find((p) => p.id === selectedPreset)?.name}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 训练监控 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>训练监控</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeMonitorTab} onValueChange={setActiveMonitorTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="progress">训练进度</TabsTrigger>
              <TabsTrigger value="logs">训练日志</TabsTrigger>
              <TabsTrigger value="resources">资源监控</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>训练进度</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>

              {trainingMetrics.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">训练指标</h4>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn("h-7 text-xs", showValidation ? "bg-muted/80" : "")}
                        onClick={() => setShowValidation(!showValidation)}
                      >
                        {showValidation ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                        验证集
                      </Button>
                    </div>
                  </div>

                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={trainingMetrics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                        {showValidation && (
                          <Line
                            yAxisId="loss"
                            type="monotone"
                            dataKey="validationLoss"
                            name="验证损失"
                            stroke="#8884d8"
                            strokeDasharray="5 5"
                          />
                        )}
                        <Line
                          yAxisId="accuracy"
                          type="monotone"
                          dataKey="trainingAccuracy"
                          name="训练准确率"
                          stroke="#82ca9d"
                        />
                        {showValidation && (
                          <Line
                            yAxisId="accuracy"
                            type="monotone"
                            dataKey="validationAccuracy"
                            name="验证准确率"
                            stroke="#82ca9d"
                            strokeDasharray="5 5"
                          />
                        )}
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>

                  {trainingMetrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">当前训练损失</div>
                        <div className="text-2xl font-bold text-[#8884d8]">
                          {trainingMetrics[trainingMetrics.length - 1].trainingLoss}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-medium">当前训练准确率</div>
                        <div className="text-2xl font-bold text-[#82ca9d]">
                          {trainingMetrics[trainingMetrics.length - 1].trainingAccuracy}%
                        </div>
                      </div>

                      {showValidation && (
                        <>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">当前验证损失</div>
                            <div className="text-2xl font-bold text-[#8884d8]/70">
                              {trainingMetrics[trainingMetrics.length - 1].validationLoss}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm font-medium">当前验证准确率</div>
                            <div className="text-2xl font-bold text-[#82ca9d]/70">
                              {trainingMetrics[trainingMetrics.length - 1].validationAccuracy}%
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
              <div className="border rounded-md">
                <div className="bg-muted/50 p-2 border-b flex items-center justify-between">
                  <span className="text-sm font-medium">训练日志</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7"
                    onClick={handleResetTraining}
                    disabled={!isTraining && progress === 0}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    清除
                  </Button>
                </div>
                <ScrollArea className="h-[400px] p-2">
                  <div className="space-y-1 font-mono text-xs">
                    {trainingLogs.length === 0 ? (
                      <div className="text-muted-foreground p-2">训练尚未开始，日志将在训练过程中显示...</div>
                    ) : (
                      trainingLogs.map((log, index) => (
                        <div
                          key={index}
                          className={cn(
                            "py-0.5 px-1 rounded",
                            log.type === "info" && "text-blue-600",
                            log.type === "eval" && "text-purple-600",
                            log.type === "checkpoint" && "text-green-600",
                          )}
                        >
                          <span className="text-muted-foreground mr-2">[{log.time}]</span>
                          {log.message}
                        </div>
                      ))
                    )}
                    <div ref={logsEndRef} />
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-[#8884d8]" />
                      GPU 利用率
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={resourceUsage} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="time" tick={false} />
                          <YAxis domain={[0, 100]} />
                          <RechartsTooltip
                            formatter={(value: any) => [`${value}%`, "GPU 利用率"]}
                            labelFormatter={(label) => `时间: ${label}s`}
                          />
                          <Line
                            type="monotone"
                            dataKey="gpuUtilization"
                            stroke="#8884d8"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="p-4 pt-0">
                      <div className="text-2xl font-bold text-[#8884d8]">
                        {resourceUsage.length > 0 ? `${resourceUsage[resourceUsage.length - 1].gpuUtilization}%` : "0%"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-[#82ca9d]" />
                      GPU 显存
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={resourceUsage} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="time" tick={false} />
                          <YAxis domain={[0, 100]} />
                          <RechartsTooltip
                            formatter={(value: any) => [`${value}%`, "GPU 显存"]}
                            labelFormatter={(label) => `时间: ${label}s`}
                          />
                          <Line
                            type="monotone"
                            dataKey="gpuMemory"
                            stroke="#82ca9d"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="p-4 pt-0">
                      <div className="text-2xl font-bold text-[#82ca9d]">
                        {resourceUsage.length > 0 ? `${resourceUsage[resourceUsage.length - 1].gpuMemory}%` : "0%"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-[#ffc658]" />
                      CPU 利用率
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={resourceUsage} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="time" tick={false} />
                          <YAxis domain={[0, 100]} />
                          <RechartsTooltip
                            formatter={(value: any) => [`${value}%`, "CPU 利用率"]}
                            labelFormatter={(label) => `时间: ${label}s`}
                          />
                          <Line
                            type="monotone"
                            dataKey="cpuUtilization"
                            stroke="#ffc658"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="p-4 pt-0">
                      <div className="text-2xl font-bold text-[#ffc658]">
                        {resourceUsage.length > 0 ? `${resourceUsage[resourceUsage.length - 1].cpuUtilization}%` : "0%"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-[#ff8042]" />
                      内存使用率
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={resourceUsage} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="time" tick={false} />
                          <YAxis domain={[0, 100]} />
                          <RechartsTooltip
                            formatter={(value: any) => [`${value}%`, "内存使用率"]}
                            labelFormatter={(label) => `时间: ${label}s`}
                          />
                          <Line
                            type="monotone"
                            dataKey="ramUsage"
                            stroke="#ff8042"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="p-4 pt-0">
                      <div className="text-2xl font-bold text-[#ff8042]">
                        {resourceUsage.length > 0 ? `${resourceUsage[resourceUsage.length - 1].ramUsage}%` : "0%"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 训练结果 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>训练结果</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeResultTab} onValueChange={setActiveResultTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="loss">损失曲线</TabsTrigger>
              <TabsTrigger value="lr">学习率曲线</TabsTrigger>
              <TabsTrigger value="samples">样本可视化</TabsTrigger>
            </TabsList>

            <TabsContent value="loss" className="space-y-4 mt-4">
              {trainingMetrics.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={trainingMetrics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="step" label={{ value: "步数", position: "insideBottomRight", offset: -10 }} />
                      <YAxis label={{ value: "损失", angle: -90, position: "insideLeft" }} />
                      <RechartsTooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="trainingLoss"
                        name="训练损失"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="validationLoss" name="验证损失" stroke="#82ca9d" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] border rounded-md bg-muted/20">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p>训练尚未开始，损失曲线将在训练过程中显示</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="lr" className="space-y-4 mt-4">
              {trainingMetrics.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={trainingMetrics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="step" label={{ value: "步数", position: "insideBottomRight", offset: -10 }} />
                      <YAxis label={{ value: "学习率", angle: -90, position: "insideLeft" }} />
                      <RechartsTooltip />
                      <Line
                        type="monotone"
                        dataKey="learningRate"
                        name="学习率"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] border rounded-md bg-muted/20">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p>训练尚未开始，学习率曲线将在训练过程中显示</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="samples" className="space-y-4 mt-4">
              {selectedDatasets.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">训练样本预览</h4>
                    <Select
                      value={selectedDatasets[0]}
                      onValueChange={(value) => {
                        if (!selectedDatasets.includes(value)) {
                          toggleDataset(value)
                        }
                      }}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="选择数据库" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleDatasets
                          .filter((d) => selectedDatasets.includes(d.id))
                          .map((dataset) => (
                            <SelectItem key={dataset.id} value={dataset.id}>
                              {dataset.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">序号</TableHead>
                          <TableHead>输入</TableHead>
                          <TableHead>输出</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleDatasets
                          .find((d) => d.id === selectedDatasets[0])
                          ?.preview.map((sample, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{index + 1}</TableCell>
                              <TableCell className="max-w-[300px] truncate">{sample.input}</TableCell>
                              <TableCell className="max-w-[300px] truncate">{sample.output}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => handlePreviewDataset(selectedDatasets[0])}>
                      <Eye className="h-4 w-4 mr-2" />
                      查看完整数据库
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] border rounded-md bg-muted/20">
                  <div className="text-center text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p>请先选择训练数据库</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {progress === 100 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>训练已完成</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {progress === 100 && (
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                导出模型
              </Button>
            )}
            {progress === 100 && (
              <Button className="gap-2 bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] hover:opacity-90">
                <Layers className="h-4 w-4" />
                部署模型
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* 保存预设对话框 */}
      <Dialog open={isSavePresetOpen} onOpenChange={setIsSavePresetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>保存参数预设</DialogTitle>
            <DialogDescription>保存当前训练参数配置为预设，方便下次使用</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">预设名称</Label>
              <Input
                id="preset-name"
                placeholder="输入预设名称"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preset-description">预设描述（可选）</Label>
              <Textarea
                id="preset-description"
                placeholder="输入预设描述"
                value={presetDescription}
                onChange={(e) => setPresetDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSavePresetOpen(false)}>
              取消
            </Button>
            <Button onClick={saveCustomPreset} disabled={!presetName}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 数据集预览对话框 */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewDataset?.name} - 数据库预览</DialogTitle>
            <DialogDescription>{previewDataset?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">样本数量</Label>
                <div>{previewDataset?.samples}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">质量评分</Label>
                <div>{previewDataset?.quality}%</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">文件格式</Label>
                <div>{previewDataset?.format}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">文件大小</Label>
                <div>{previewDataset?.size}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">最后更新</Label>
                <div>{previewDataset?.lastUpdated}</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>数据样本</Label>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">序号</TableHead>
                      <TableHead>输入</TableHead>
                      <TableHead>输出</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewDataset?.preview.map((sample, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{sample.input}</TableCell>
                        <TableCell>{sample.output}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (previewDataset && !selectedDatasets.includes(previewDataset.id)) {
                  toggleDataset(previewDataset.id)
                }
                setIsPreviewOpen(false)
              }}
            >
              {selectedDatasets.includes(previewDataset?.id || "") ? "已选择" : "选择此数据库"}
            </Button>
            <Button onClick={() => setIsPreviewOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 数据库选择对话框 */}
      <Dialog open={isDatasetDialogOpen} onOpenChange={setIsDatasetDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>选择训练数据库</DialogTitle>
            <DialogDescription>选择一个或多个数据库用于模型训练</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">可用数据库</span>
              <Badge variant="outline">已选择 {selectedDatasets.length} 个数据库</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
              {sampleDatasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-md border transition-colors",
                    selectedDatasets.includes(dataset.id)
                      ? "border-[#d1a8c4] bg-[#f7f0f5]/30"
                      : "border-border hover:bg-muted/50",
                  )}
                >
                  <Checkbox
                    checked={selectedDatasets.includes(dataset.id)}
                    onCheckedChange={() => toggleDataset(dataset.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{dataset.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handlePreviewDataset(dataset.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">{dataset.description}</div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>样本数: {dataset.samples}</span>
                      <span>质量评分: {dataset.quality}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDatasetDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsDatasetDialogOpen(false)}>确认选择 ({selectedDatasets.length})</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

