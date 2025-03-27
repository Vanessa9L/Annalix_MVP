"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useModel } from "./model-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Share2,
  Terminal,
  FileCode,
  Table,
  Activity,
  RefreshCw,
  Download,
  Code,
  Cpu,
  Layers,
  Zap,
  GitMerge,
  FileJson,
  Server,
  Gauge,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Update the performanceData to include more metrics
const performanceData = [
  { time: "00:00", latency: 150, errorRate: 0.2, throughput: 120 },
  { time: "04:00", latency: 180, errorRate: 0.1, throughput: 110 },
  { time: "08:00", latency: 250, errorRate: 0.3, throughput: 90 },
  { time: "12:00", latency: 200, errorRate: 0.15, throughput: 100 },
  { time: "16:00", latency: 170, errorRate: 0.25, throughput: 115 },
  { time: "20:00", latency: 160, errorRate: 0.18, throughput: 125 },
]

// Now, let's update the ModelDeployment component
export default function ModelDeployment() {
  const { toast } = useToast()
  const { models, selectedModel, setSelectedModel } = useModel()
  const [autoTraining, setAutoTraining] = useState(false)
  const [endpoint, setEndpoint] = useState("")
  const [isDeployed, setIsDeployed] = useState(false)

  // 添加新的状态变量用于错误处理和通知
  const [deploymentError, setDeploymentError] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [taskInProgress, setTaskInProgress] = useState<string | null>(null)

  // Add new state variables for model export and deployment configuration
  const [exportFormat, setExportFormat] = useState<"onnx" | "torchscript" | "pytorch">("pytorch")
  const [quantizationBits, setQuantizationBits] = useState<number>(8)
  const [isQuantized, setIsQuantized] = useState<boolean>(false)
  const [mergeLoRA, setMergeLoRA] = useState<boolean>(false)
  const [selectedLoRAModel, setSelectedLoRAModel] = useState<string>("")
  const [inferenceFramework, setInferenceFramework] = useState<string>("onnx-runtime")
  const [optimizationLevel, setOptimizationLevel] = useState<number>(1)
  const [batchSize, setBatchSize] = useState<number>(1)
  const [dynamicShape, setDynamicShape] = useState<boolean>(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState<boolean>(false)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState<boolean>(false)
  const [deploymentConfig, setDeploymentConfig] = useState<string>(`{
  "model": {
    "name": "model-name",
    "format": "pytorch",
    "quantized": false
  },
  "server": {
    "framework": "onnx-runtime",
    "batch_size": 1,
    "optimization_level": 1
  },
  "scaling": {
    "min_replicas": 1,
    "max_replicas": 5,
    "target_cpu_utilization": 80
  }
}`)
  const [generatedConfigType, setGeneratedConfigType] = useState<"json" | "yaml" | "toml">("json")
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [exportProgress, setExportProgress] = useState<number>(0)
  const [exportedModelPath, setExportedModelPath] = useState<string>("")

  // 修改handleDeploy函数，添加通知和错误处理
  const handleDeploy = () => {
    if (!selectedModel) {
      setDeploymentError("请先选择要部署的模型")
      toast({
        title: "部署失败",
        description: "请先选择要部署的模型",
        variant: "destructive",
      })
      return
    }

    setTaskInProgress("deploying")
    setDeploymentError(null)

    // 模拟部署过程
    setTimeout(() => {
      try {
        setIsDeployed(true)
        setEndpoint("https://api.example.com/v1/predict")
        setTaskInProgress(null)
        setShowSuccessAlert(true)

        toast({
          title: "部署成功",
          description: "模型已成功部署到生产环境",
          variant: "default",
        })

        // 5秒后自动隐藏成功提示
        setTimeout(() => setShowSuccessAlert(false), 5000)
      } catch (error) {
        setDeploymentError("部署过程中发生错误，请检查网络连接或服务器状态")
        setTaskInProgress(null)

        toast({
          title: "部署失败",
          description: "部署过程中发生错误，请检查网络连接或服务器状态",
          variant: "destructive",
        })
      }
    }, 3000)
  }

  // 修改handleExportModel函数，添加通知和错误处理
  const handleExportModel = () => {
    if (!selectedModel) {
      setExportError("请先选择要导出的模型")
      toast({
        title: "导出失败",
        description: "请先选择要导出的模型",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)
    setExportProgress(0)
    setExportError(null)
    setTaskInProgress("exporting")

    // 模拟导出过程
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          setExportedModelPath(
            `/models/${selectedModel?.provider}-${exportFormat}${isQuantized ? `-${quantizationBits}bit` : ""}.${exportFormat}`,
          )
          setTaskInProgress(null)

          toast({
            title: "导出成功",
            description: "模型已成功导出，可以下载或直接使用",
            variant: "default",
          })

          return 100
        }

        // 模拟随机错误（5%概率）
        if (Math.random() < 0.05 && prev > 10 && prev < 90) {
          clearInterval(interval)
          setIsExporting(false)
          setExportError("导出过程中发生错误，可能是内存不足或磁盘空间不足")
          setTaskInProgress(null)

          toast({
            title: "导出失败",
            description: "导出过程中发生错误，请查看详细信息",
            variant: "destructive",
          })

          return prev
        }

        return prev + 5
      })
    }, 200)
  }

  // 添加一个清除错误的函数
  const clearErrors = () => {
    setDeploymentError(null)
    setExportError(null)
  }

  // Add new function to handle model export
  // 添加一个函数来获取任务进度提示
  const getTaskProgressMessage = () => {
    switch (taskInProgress) {
      case "deploying":
        return "正在部署模型，请稍候..."
      case "exporting":
        return "正在导出模型，请稍候..."
      case "configuring":
        return "正在生成配置文件，请稍候..."
      default:
        return null
    }
  }

  // 修改generateDeploymentConfig函数，添加通知
  const generateDeploymentConfig = () => {
    if (!selectedModel) {
      toast({
        title: "生成配置失败",
        description: "请先选择要配置的模型",
        variant: "destructive",
      })
      return
    }

    setTaskInProgress("configuring")

    // 模拟配置生成过程
    setTimeout(() => {
      const config = {
        model: {
          name: selectedModel?.provider || "model-name",
          format: exportFormat,
          quantized: isQuantized,
          quantization_bits: isQuantized ? quantizationBits : null,
          merged_lora: mergeLoRA,
          lora_model: mergeLoRA ? selectedLoRAModel : null,
        },
        server: {
          framework: inferenceFramework,
          batch_size: batchSize,
          optimization_level: optimizationLevel,
          dynamic_shape: dynamicShape,
        },
        scaling: {
          min_replicas: 1,
          max_replicas: 5,
          target_cpu_utilization: 80,
        },
        api: {
          endpoint: "/v1/predict",
          authentication: "api_key",
          rate_limit: 100,
        },
      }

      let configStr = ""
      if (generatedConfigType === "json") {
        configStr = JSON.stringify(config, null, 2)
      } else if (generatedConfigType === "yaml") {
        // Simple YAML conversion (in a real app, use a proper YAML library)
        configStr = JSON.stringify(config, null, 2)
          .replace(/{/g, "")
          .replace(/}/g, "")
          .replace(/"/g, "")
          .replace(/,/g, "")
          .replace(/:/g, ": ")
      } else {
        // Simple TOML conversion (in a real app, use a proper TOML library)
        configStr = `[model]
name = "${config.model.name}"
format = "${config.model.format}"
quantized = ${config.model.quantized}
quantization_bits = ${config.model.quantized ? config.model.quantization_bits : "null"}
merged_lora = ${config.model.merged_lora}
lora_model = ${config.model.merged_lora ? `"${config.model.lora_model}"` : "null"}

[server]
framework = "${config.server.framework}"
batch_size = ${config.server.batch_size}
optimization_level = ${config.server.optimization_level}
dynamic_shape = ${config.server.dynamic_shape}

[scaling]
min_replicas = ${config.scaling.min_replicas}
max_replicas = ${config.scaling.max_replicas}
target_cpu_utilization = ${config.scaling.target_cpu_utilization}

[api]
endpoint = "${config.api.endpoint}"
authentication = "${config.api.authentication}"
rate_limit = ${config.api.rate_limit}
`
      }

      setDeploymentConfig(configStr)
      setIsConfigDialogOpen(true)
      setTaskInProgress(null)

      toast({
        title: "配置生成成功",
        description: "部署配置文件已生成，可以下载或复制使用",
        variant: "default",
      })
    }, 1500)
  }

  // 修改downloadConfigFile函数，添加通知
  const downloadConfigFile = () => {
    const extension = generatedConfigType === "json" ? "json" : generatedConfigType === "yaml" ? "yaml" : "toml"
    const blob = new Blob([deploymentConfig], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `deployment-config.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "下载成功",
      description: `配置文件已下载为 deployment-config.${extension}`,
      variant: "default",
    })
  }

  // 在return语句前添加useEffect来监听任务状态变化
  useEffect(() => {
    if (taskInProgress) {
      const message = getTaskProgressMessage()
      if (message) {
        toast({
          title: "任务进行中",
          description: message,
        })
      }
    }
  }, [taskInProgress])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-[#2d3748]">模型部署</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsExportDialogOpen(true)}
            className="bg-gradient-to-r from-[#a8d1b2] to-[#90b096] hover:opacity-90"
          >
            <Download className="h-4 w-4 mr-2" />
            导出模型
          </Button>
          <Button
            onClick={handleDeploy}
            className="bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] hover:opacity-90"
            disabled={isDeployed || taskInProgress === "deploying"}
          >
            <Share2 className="h-4 w-4 mr-2" />
            {isDeployed ? "已部署" : taskInProgress === "deploying" ? "部署中..." : "部署模型"}
          </Button>
        </div>
      </div>

      {/* 添加全局任务进度指示器 */}
      {taskInProgress && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>{getTaskProgressMessage()}</span>
            <span>{taskInProgress === "exporting" ? `${exportProgress}%` : ""}</span>
          </div>
          <Progress value={taskInProgress === "exporting" ? exportProgress : 100} className="h-2" />
        </div>
      )}

      {/* 添加成功提示 */}
      {showSuccessAlert && (
        <Alert className="bg-green-50 border-green-200 mb-4">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">部署成功</AlertTitle>
          <AlertDescription className="text-green-700">
            模型已成功部署到生产环境，您可以通过API端点访问模型服务。
          </AlertDescription>
        </Alert>
      )}

      {/* 添加部署错误提示 */}
      {deploymentError && (
        <Alert variant="destructive" className="mb-4">
          <XCircle className="h-4 w-4" />
          <AlertTitle>部署失败</AlertTitle>
          <AlertDescription className="flex justify-between items-start">
            <div>
              <p>{deploymentError}</p>
              <p className="text-sm mt-1">建议：检查网络连接，确保服务器正常运行，并验证模型文件完整性。</p>
            </div>
            <Button variant="outline" size="sm" onClick={clearErrors} className="ml-2 shrink-0">
              关闭
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>部署配置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>选择模型</Label>
              <Select
                value={selectedModel?.provider}
                onValueChange={(value) => {
                  const model = models.find((m) => m.provider === value)
                  setSelectedModel(model || null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择要部署的模型" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.provider} value={model.provider}>
                      {model.provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!selectedModel && (
                <p className="text-sm text-amber-600 flex items-center mt-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  请选择一个模型以继续
                </p>
              )}
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1">
                <Label>自动增量训练</Label>
                <div className="text-sm text-muted-foreground">当新数据积累超过1000条时自动触发训练</div>
              </div>
              <Switch checked={autoTraining} onCheckedChange={setAutoTraining} />
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={generateDeploymentConfig}
                disabled={!selectedModel || taskInProgress === "configuring"}
              >
                <FileJson className="h-4 w-4 mr-2" />
                {taskInProgress === "configuring" ? "生成中..." : "生成部署配置文件"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>监控面板</CardTitle>
            <CardDescription>实时监控API调用情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="latency" stroke="#8884d8" name="响应延迟(ms)" />
                  <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#82ca9d" name="错误率" />
                  <Line yAxisId="left" type="monotone" dataKey="throughput" stroke="#ffc658" name="吞吐量(请求/分钟)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>集成方式</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="api" className="w-full">
            <TabsList>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                API 端点
              </TabsTrigger>
              <TabsTrigger value="sdk" className="flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                Python SDK
              </TabsTrigger>
              <TabsTrigger value="excel" className="flex items-center gap-2">
                <Table className="h-4 w-4" />
                Excel 插件
              </TabsTrigger>
              <TabsTrigger value="monitor" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                监控与迭代
              </TabsTrigger>
            </TabsList>

            <TabsContent value="api" className="space-y-4">
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>API 端点</Label>
                  <div className="flex gap-2">
                    <Input value={endpoint} readOnly className="font-mono" />
                    <Button variant="outline" onClick={() => navigator.clipboard.writeText(endpoint)}>
                      复制
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>示例代码</Label>
                  <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto">
                    {`curl -X POST ${endpoint} \\
-H "Content-Type: application/json" \\
-d '{"text": "你的输入文本"}'`}
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sdk" className="space-y-4">
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>安装</Label>
                  <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg">pip install your-model-sdk</pre>
                </div>
                <div className="space-y-2">
                  <Label>示例代码</Label>
                  <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg">
                    {`from your_model_sdk import Model

model = Model()
response = model.predict("你的输入文本")
print(response)`}
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="excel" className="space-y-4">
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Excel 函数</Label>
                  <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg">{`=MODELPREDICT(A1)`}</pre>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">使用说明</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>下载并安装 Excel 插件</li>
                    <li>在 Excel 中启用插件</li>
                    <li>使用 MODELPREDICT 函数调用模型</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monitor" className="space-y-4">
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">性能指标</CardTitle>
                      <Badge variant="outline" className="font-normal">
                        实时
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">平均响应时间</span>
                        <span>180ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">错误率</span>
                        <span>0.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">API 调用次数</span>
                        <span>12,345</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">增量训练</CardTitle>
                      <Badge variant="outline" className="font-normal">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        自动
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">新增数据量</span>
                        <span>786条</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">下次训练触发</span>
                        <span>还需214条</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">最近训练时间</span>
                        <span>2024-02-25</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 修改Model Export Dialog，添加错误提示 */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>导出模型</DialogTitle>
            <DialogDescription>选择导出格式和优化选项</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* 添加导出错误提示 */}
            {exportError && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>导出失败</AlertTitle>
                <AlertDescription className="flex justify-between items-start">
                  <div>
                    <p>{exportError}</p>
                    <p className="text-sm mt-1">
                      建议：检查系统资源，确保有足够的内存和磁盘空间。如果问题持续，尝试减小批处理大小或降低优化级别。
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearErrors} className="ml-2 shrink-0">
                    关闭
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>导出格式</Label>
                <RadioGroup
                  value={exportFormat}
                  onValueChange={(value) => setExportFormat(value as "onnx" | "torchscript" | "pytorch")}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="onnx" id="onnx" className="peer sr-only" />
                    <Label
                      htmlFor="onnx"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Code className="h-6 w-6 mb-2" />
                      <span>ONNX</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="torchscript" id="torchscript" className="peer sr-only" />
                    <Label
                      htmlFor="torchscript"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Layers className="h-6 w-6 mb-2" />
                      <span>TorchScript</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="pytorch" id="pytorch" className="peer sr-only" />
                    <Label
                      htmlFor="pytorch"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Zap className="h-6 w-6 mb-2" />
                      <span>PyTorch</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="quantization">
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      <span>量化选项</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="quantize"
                          checked={isQuantized}
                          onCheckedChange={(checked) => setIsQuantized(!!checked)}
                        />
                        <Label htmlFor="quantize">启用模型量化</Label>
                      </div>

                      {isQuantized && (
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between">
                            <Label>量化位数</Label>
                            <span className="text-sm text-muted-foreground">{quantizationBits} 位</span>
                          </div>
                          <Slider
                            value={[quantizationBits]}
                            onValueChange={([value]) => setQuantizationBits(value)}
                            min={2}
                            max={16}
                            step={2}
                            disabled={!isQuantized}
                          />
                          <p className="text-xs text-muted-foreground">较低的位数可以减小模型大小，但可能会影响精度</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="lora-merge">
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center gap-2">
                      <GitMerge className="h-4 w-4" />
                      <span>LoRA 合并</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="merge-lora"
                          checked={mergeLoRA}
                          onCheckedChange={(checked) => setMergeLoRA(!!checked)}
                        />
                        <Label htmlFor="merge-lora">将 LoRA 权重合并到基础模型</Label>
                      </div>

                      {mergeLoRA && (
                        <div className="space-y-2 pt-2">
                          <Label>选择 LoRA 模型</Label>
                          <Select value={selectedLoRAModel} onValueChange={setSelectedLoRAModel} disabled={!mergeLoRA}>
                            <SelectTrigger>
                              <SelectValue placeholder="选择 LoRA 模型" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer-service-lora">客服助手 LoRA</SelectItem>
                              <SelectItem value="legal-advisor-lora">法律顾问 LoRA</SelectItem>
                              <SelectItem value="medical-assistant-lora">医疗助手 LoRA</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="inference">
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      <span>推理框架选项</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label>推理框架</Label>
                        <Select value={inferenceFramework} onValueChange={setInferenceFramework}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择推理框架" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="onnx-runtime">ONNX Runtime</SelectItem>
                            <SelectItem value="tensorrt">TensorRT</SelectItem>
                            <SelectItem value="pytorch">PyTorch</SelectItem>
                            <SelectItem value="triton">Triton Inference Server</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>批处理大小</Label>
                          <span className="text-sm text-muted-foreground">{batchSize}</span>
                        </div>
                        <Slider
                          value={[batchSize]}
                          onValueChange={([value]) => setBatchSize(value)}
                          min={1}
                          max={64}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>优化级别</Label>
                          <span className="text-sm text-muted-foreground">{optimizationLevel}</span>
                        </div>
                        <Slider
                          value={[optimizationLevel]}
                          onValueChange={([value]) => setOptimizationLevel(value)}
                          min={0}
                          max={3}
                          step={1}
                        />
                        <p className="text-xs text-muted-foreground">
                          较高的优化级别可能会增加编译时间，但可以提高运行时性能
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="dynamic-shape"
                          checked={dynamicShape}
                          onCheckedChange={(checked) => setDynamicShape(!!checked)}
                        />
                        <Label htmlFor="dynamic-shape">启用动态形状支持</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {isExporting ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>导出进度</span>
                  <span>{exportProgress}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-200 ease-in-out"
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {exportProgress < 100 ? "正在导出模型，请稍候..." : "导出完成！"}
                </p>
                {exportProgress === 100 && exportedModelPath && (
                  <div className="pt-2">
                    <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <span className="text-sm font-mono">{exportedModelPath}</span>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={handleExportModel}
                className="w-full"
                disabled={!selectedModel || taskInProgress === "exporting"}
              >
                <Download className="h-4 w-4 mr-2" />
                {taskInProgress === "exporting" ? "导出中..." : "导出模型"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 添加格式兼容性提示到Deployment Configuration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>部署配置文件</DialogTitle>
            <DialogDescription>生成的部署配置可用于自动化部署流程</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* 添加格式兼容性提示 */}
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">格式兼容性提示</AlertTitle>
              <AlertDescription className="text-blue-700">
                {inferenceFramework === "tensorrt" &&
                  exportFormat !== "onnx" &&
                  "TensorRT 最佳支持 ONNX 格式模型，建议将导出格式更改为 ONNX 以获得最佳性能。"}
                {inferenceFramework === "onnx-runtime" &&
                  exportFormat !== "onnx" &&
                  "ONNX Runtime 需要 ONNX 格式模型，请确保导出格式为 ONNX。"}
                {inferenceFramework === "triton" &&
                  "Triton Inference Server 支持多种模型格式，但不同格式的性能可能有所差异。"}
                {inferenceFramework === "pytorch" &&
                  exportFormat !== "pytorch" &&
                  exportFormat !== "torchscript" &&
                  "PyTorch 推理框架最佳支持 PyTorch 或 TorchScript 格式。"}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>配置格式</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={generatedConfigType === "json" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGeneratedConfigType("json")}
                    className="h-8"
                  >
                    JSON
                  </Button>
                  <Button
                    variant={generatedConfigType === "yaml" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGeneratedConfigType("yaml")}
                    className="h-8"
                  >
                    YAML
                  </Button>
                  <Button
                    variant={generatedConfigType === "toml" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGeneratedConfigType("toml")}
                    className="h-8"
                  >
                    TOML
                  </Button>
                </div>
              </div>

              <Textarea value={deploymentConfig} className="font-mono text-sm h-[300px]" readOnly />
            </div>

            <div className="space-y-2">
              <Label>配置说明</Label>
              <div className="text-sm text-muted-foreground space-y-2 p-3 bg-muted rounded-md">
                <p>此配置文件包含模型部署所需的所有参数，可用于：</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>容器化部署（Docker, Kubernetes）</li>
                  <li>云服务提供商（AWS, Azure, GCP）</li>
                  <li>边缘设备部署</li>
                  <li>CI/CD 自动化流程</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(deploymentConfig)
                toast({
                  title: "已复制",
                  description: "配置已复制到剪贴板",
                })
              }}
            >
              复制配置
            </Button>
            <Button onClick={downloadConfigFile}>
              <Download className="h-4 w-4 mr-2" />
              下载配置文件
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Performance Optimization Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4">
            <Gauge className="h-4 w-4 mr-2" />
            性能优化建议
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>模型性能优化建议</DialogTitle>
            <DialogDescription>根据您的部署环境和模型特点，我们提供以下优化建议</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="quantization">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    <span>模型量化</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p>将模型量化至 8 位或 4 位精度可以显著减小模型大小并提高推理速度，同时保持较高的准确率。</p>
                    <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <span>推荐量化位数：8位（INT8）</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        速度提升 ~3x
                      </Badge>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="batching">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    <span>批处理优化</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p>增加批处理大小可以提高 GPU 利用率和总体吞吐量，特别适合高并发场景。</p>
                    <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <span>推荐批处理大小：16</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        吞吐量提升 ~4x
                      </Badge>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="kv-cache">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>KV 缓存优化</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p>启用 KV 缓存可以避免在自回归生成过程中重复计算先前的 token，显著提高生成速度。</p>
                    <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <span>推荐：启用 KV 缓存</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        生成速度提升 ~2x
                      </Badge>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="frameworks">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    <span>推理框架选择</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p>不同的推理框架在不同硬件和模型上有各自的优势。</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <span>NVIDIA GPU：TensorRT</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          最佳性能
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <span>CPU 或多种硬件：ONNX Runtime</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          良好兼容性
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <span>大规模部署：Triton Inference Server</span>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          高可扩展性
                        </Badge>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <DialogFooter>
            <Button>应用推荐优化</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

