"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Box,
  Download,
  Server,
  Cpu,
  HardDrive,
  Settings,
  FileCode,
  Globe,
  Laptop,
  Monitor,
  Package,
  CheckCircle2,
  Info,
  Copy,
  Check,
  GitGraphIcon as GitFlow,
  Network,
  Cloud,
  Lock,
  Database,
  Code,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DeploymentPackaging() {
  const [selectedModel, setSelectedModel] = useState("")
  const [appName, setAppName] = useState("")
  const [deploymentTarget, setDeploymentTarget] = useState("api")
  const [isPackaging, setIsPackaging] = useState(false)
  const [packagingProgress, setPackagingProgress] = useState(0)
  const [isPackagingComplete, setIsPackagingComplete] = useState(false)
  const [activeTab, setActiveTab] = useState("config")
  const [isCopied, setIsCopied] = useState(false)
  const [deploymentType, setDeploymentType] = useState<"model" | "workflow">("model")
  const [selectedWorkflow, setSelectedWorkflow] = useState("")
  const [logMessages, setLogMessages] = useState<{ text: string; type: "info" | "success" | "error" | "warning" }[]>([])
  const { toast } = useToast()

  // Sample models
  const models = [
    { id: "model1", name: "客服助手-v1", type: "微调模型", size: "1.2 GB" },
    { id: "model2", name: "数据分析助手", type: "微调模型", size: "1.5 GB" },
    { id: "model3", name: "Llama 3", type: "基础模型", size: "4.8 GB" },
  ]

  // 示例工作流
  const workflows = [
    { id: "workflow1", name: "客服对话流程", type: "对话工作流", complexity: "中等" },
    { id: "workflow2", name: "数据分析流程", type: "分析工作流", complexity: "复杂" },
    { id: "workflow3", name: "内容生成流程", type: "创作工作流", complexity: "简单" },
  ]

  const handleStartPackaging = () => {
    if (deploymentType === "model" && (!selectedModel || !appName)) return
    if (deploymentType === "workflow" && (!selectedWorkflow || !appName)) return

    setIsPackaging(true)
    setPackagingProgress(0)
    setIsPackagingComplete(false)
    setLogMessages([])

    // 根据部署目标和类型生成不同的日志
    generatePackagingLogs()
  }

  const generatePackagingLogs = () => {
    // 基础日志，所有部署类型和目标都会有
    const baseMessages = [
      { text: "开始打包流程...", type: "info" as const },
      { text: `打包类型: ${deploymentType === "model" ? "模型部署" : "工作流部署"}`, type: "info" as const },
      {
        text: `目标平台: ${
          deploymentTarget === "desktop"
            ? "桌面应用 (Windows, macOS, Linux)"
            : deploymentTarget === "web"
              ? "Web 应用"
              : "API 服务"
        }`,
        type: "info" as const,
      },
    ]

    setLogMessages(baseMessages)

    // 模拟打包进度
    let progress = 0
    const interval = setInterval(() => {
      progress += 2
      setPackagingProgress(progress)

      // 根据进度添加不同的日志
      if (progress === 10) {
        addLogMessage(`正在准备${deploymentType === "model" ? "模型" : "工作流"}文件...`, "info")
      }

      if (progress === 20) {
        if (deploymentType === "model") {
          addLogMessage("正在量化模型...", "info")
        } else {
          addLogMessage("正在优化工作流结构...", "info")
        }
      }

      if (progress === 30) {
        addLogMessage(`${deploymentType === "model" ? "模型" : "工作流"}处理完成`, "success")
      }

      // 根据部署目标添加特定日志
      if (progress === 40) {
        if (deploymentTarget === "desktop") {
          addLogMessage("正在准备跨平台打包环境...", "info")
        } else if (deploymentTarget === "web") {
          addLogMessage("正在优化前端资源...", "info")
        } else {
          addLogMessage("正在配置API服务...", "info")
        }
      }

      if (progress === 50) {
        if (deploymentType === "workflow" && progress === 45) {
          addLogMessage("正在打包依赖模型...", "info")
        }

        if (deploymentTarget === "desktop") {
          addLogMessage("正在生成桌面应用框架...", "info")
        } else if (deploymentTarget === "web") {
          addLogMessage("正在构建Web应用...", "info")
        } else {
          addLogMessage(`正在配置${deploymentType === "model" ? "推理服务" : "执行引擎"}...`, "info")
        }
      }

      if (progress === 60) {
        addLogMessage("工具集成完成", "success")
      }

      if (progress === 70) {
        if (deploymentTarget === "desktop") {
          addLogMessage("正在为Windows平台构建...", "info")
        } else if (deploymentTarget === "web") {
          addLogMessage("正在优化Web资源...", "info")
        } else {
          addLogMessage("正在构建Docker镜像...", "info")
        }
      }

      if (progress === 75 && deploymentTarget === "desktop") {
        addLogMessage("正在为macOS平台构建...", "info")
      }

      if (progress === 80) {
        if (deploymentTarget === "desktop") {
          addLogMessage("正在为Linux平台构建...", "info")
        } else if (deploymentTarget === "web") {
          addLogMessage("正在配置CDN分发...", "info")
        } else {
          addLogMessage("正在优化容器性能...", "info")
        }
      }

      if (progress === 90) {
        if (deploymentTarget === "desktop") {
          addLogMessage("正在生成安装程序...", "info")
        } else if (deploymentTarget === "web") {
          addLogMessage("正在准备部署包...", "info")
        } else {
          addLogMessage("正在配置API文档...", "info")
        }
      }

      if (progress >= 100) {
        addLogMessage("打包完成！", "success")
        setIsPackagingComplete(true)
        clearInterval(interval)
      }
    }, 200)
  }

  const addLogMessage = (text: string, type: "info" | "success" | "error" | "warning") => {
    setLogMessages((prev) => [...prev, { text, type }])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleDeploymentTargetClick = (target: string) => {
    if (target === "api") {
      setDeploymentTarget(target)
    } else {
      toast({
        title: "敬请期待",
        description: `${target === "desktop" ? "桌面应用" : "Web 应用"}部署功能即将推出，敬请期待！`,
        variant: "default",
      })
    }
  }

  // 根据部署目标和类型获取资源需求
  const getResourceRequirements = () => {
    if (deploymentType === "model") {
      if (!selectedModel) return { disk: "未知", memory: "未知", cpu: "未知" }

      if (deploymentTarget === "desktop") {
        return { disk: "2.5 GB", memory: "8 GB", cpu: "4核 或更高" }
      } else if (deploymentTarget === "web") {
        return { disk: "1.8 GB", memory: "8 GB", cpu: "4核 或更高" }
      } else {
        return { disk: "2.0 GB", memory: "8 GB", cpu: "4核 或更高" }
      }
    } else {
      if (!selectedWorkflow) return { disk: "未知", memory: "未知", cpu: "未知" }

      if (deploymentTarget === "desktop") {
        return { disk: "3.2 GB", memory: "12 GB", cpu: "6核 或更高" }
      } else if (deploymentTarget === "web") {
        return { disk: "2.4 GB", memory: "12 GB", cpu: "6核 或更高" }
      } else {
        return { disk: "2.8 GB", memory: "12 GB", cpu: "6核 或更高" }
      }
    }
  }

  const resources = getResourceRequirements()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-[#2d3748]">部署和打包</h2>
        <div className="flex items-center gap-2">
          {isPackaging ? (
            <Button disabled className="gap-2">
              <Package className="h-4 w-4 animate-pulse" />
              正在打包...
            </Button>
          ) : (
            <Button
              onClick={handleStartPackaging}
              className="bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] hover:opacity-90 gap-2"
              disabled={
                (deploymentType === "model" && (!selectedModel || !appName)) ||
                (deploymentType === "workflow" && (!selectedWorkflow || !appName))
              }
            >
              <Box className="h-4 w-4" />
              开始打包
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="config">配置</TabsTrigger>
          <TabsTrigger value="progress">打包进度</TabsTrigger>
          <TabsTrigger value="download">下载和部署</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本配置</CardTitle>
              <CardDescription>配置应用打包和部署选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div
                  className={`border rounded-md p-4 cursor-pointer transition-all ${
                    deploymentType === "model"
                      ? "border-[#d1a8c4] bg-[#f7f0f5]/30"
                      : "hover:border-[#d1a8c4] hover:bg-[#f7f0f5]/10"
                  }`}
                  onClick={() => setDeploymentType("model")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="h-5 w-5 text-[#d1a8c4]" />
                    <span className="font-medium">模型部署</span>
                  </div>
                  <p className="text-xs text-muted-foreground">打包和部署训练好的模型，提供推理服务</p>
                </div>

                <div
                  className={`border rounded-md p-4 cursor-pointer transition-all ${
                    deploymentType === "workflow"
                      ? "border-[#a8b2d1] bg-[#f0f1f7]/30"
                      : "hover:border-[#a8b2d1] hover:bg-[#f0f1f7]/10"
                  }`}
                  onClick={() => setDeploymentType("workflow")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <GitFlow className="h-5 w-5 text-[#a8b2d1]" />
                    <span className="font-medium">工作流部署</span>
                  </div>
                  <p className="text-xs text-muted-foreground">打包和部署完整工作流，包含多个组件和处理步骤</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="app-name">应用名称</Label>
                  <Input
                    id="app-name"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="输入应用名称"
                  />
                </div>

                {deploymentType === "model" ? (
                  <div className="space-y-2">
                    <Label htmlFor="model">选择模型</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger id="model">
                        <SelectValue placeholder="选择要部署的模型" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{model.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {model.type}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="workflow">选择工作流</Label>
                    <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
                      <SelectTrigger id="workflow">
                        <SelectValue placeholder="选择要部署的工作流" />
                      </SelectTrigger>
                      <SelectContent>
                        {workflows.map((workflow) => (
                          <SelectItem key={workflow.id} value={workflow.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{workflow.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {workflow.type}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>部署目标</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div
                    className={`border rounded-md p-4 cursor-pointer transition-all ${
                      deploymentTarget === "desktop"
                        ? "border-[#d1a8c4] bg-[#f7f0f5]/30"
                        : "hover:border-[#d1a8c4] hover:bg-[#f7f0f5]/10"
                    }`}
                    onClick={() => handleDeploymentTargetClick("desktop")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Laptop className="h-5 w-5 text-[#d1a8c4]" />
                      <span className="font-medium">桌面应用</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        即将推出
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">打包为跨平台桌面应用，支持 Windows、macOS 和 Linux</p>
                  </div>

                  <div
                    className={`border rounded-md p-4 cursor-pointer transition-all ${
                      deploymentTarget === "web"
                        ? "border-[#a8b2d1] bg-[#f0f1f7]/30"
                        : "hover:border-[#a8b2d1] hover:bg-[#f0f1f7]/10"
                    }`}
                    onClick={() => handleDeploymentTargetClick("web")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-5 w-5 text-[#a8b2d1]" />
                      <span className="font-medium">Web 应用</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        即将推出
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">部署为 Web 应用，可通过浏览器访问</p>
                  </div>

                  <div
                    className={`border rounded-md p-4 cursor-pointer transition-all ${
                      deploymentTarget === "api"
                        ? "border-[#a8d1b2] bg-[#f0f7f2]/30"
                        : "hover:border-[#a8d1b2] hover:bg-[#f0f7f2]/10"
                    }`}
                    onClick={() => handleDeploymentTargetClick("api")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Server className="h-5 w-5 text-[#a8d1b2]" />
                      <span className="font-medium">API 服务</span>
                    </div>
                    <p className="text-xs text-muted-foreground">部署为 API 服务，可通过 HTTP 请求调用</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">高级选项</h3>

                {deploymentType === "model" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>模型量化</Label>
                        <div className="text-xs text-muted-foreground">将模型量化为 INT8 以减小体积</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                )}

                {deploymentType === "workflow" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>包含所有依赖模型</Label>
                        <div className="text-xs text-muted-foreground">将工作流中使用的所有模型一起打包</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>本地优先</Label>
                      <div className="text-xs text-muted-foreground">所有数据和处理在本地完成，不依赖云服务</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                {deploymentType === "workflow" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>保留编辑能力</Label>
                        <div className="text-xs text-muted-foreground">允许用户在部署后编辑工作流</div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{deploymentType === "model" ? "包含工作流" : "包含可视化界面"}</Label>
                      <div className="text-xs text-muted-foreground">
                        {deploymentType === "model"
                          ? "将工作流定义打包到应用中"
                          : "包含用于监控和管理工作流的可视化界面"}
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>包含工具</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tool-search" defaultChecked />
                      <label htmlFor="tool-search" className="text-sm">
                        知识库搜索
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tool-data" defaultChecked />
                      <label htmlFor="tool-data" className="text-sm">
                        数据处理
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tool-viz" defaultChecked />
                      <label htmlFor="tool-viz" className="text-sm">
                        数据可视化
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tool-code" />
                      <label htmlFor="tool-code" className="text-sm">
                        代码执行
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <div className="flex items-center gap-2 text-amber-700 font-medium">
                  <Info className="h-4 w-4" />
                  <span>资源需求估计</span>
                </div>
                <div className="mt-2 space-y-1 text-sm text-amber-600">
                  <div className="flex justify-between">
                    <span>磁盘空间:</span>
                    <span>{resources.disk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>最小内存:</span>
                    <span>{resources.memory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>推荐 CPU:</span>
                    <span>{resources.cpu}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>打包进度</CardTitle>
              <CardDescription>
                {deploymentType === "model" ? "模型" : "工作流"}打包为
                {deploymentTarget === "desktop" ? "桌面应用" : deploymentTarget === "web" ? "Web应用" : "API服务"}的进度
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>总体进度</span>
                  <span>{packagingProgress}%</span>
                </div>
                <Progress value={packagingProgress} />
              </div>

              <div className="space-y-4">
                {/* 根据部署目标显示不同的进度条 */}
                {deploymentTarget === "desktop" && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{deploymentType === "model" ? "模型" : "工作流"}处理</span>
                        <span>{Math.min(100, packagingProgress * 2)}%</span>
                      </div>
                      <Progress value={Math.min(100, packagingProgress * 2)} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>跨平台构建</span>
                        <span>{Math.max(0, Math.min(100, (packagingProgress - 30) * 1.5))}%</span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, (packagingProgress - 30) * 1.5))} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>安装程序生成</span>
                        <span>{Math.max(0, Math.min(100, (packagingProgress - 70) * 3.3))}%</span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, (packagingProgress - 70) * 3.3))} className="h-2" />
                    </div>
                  </>
                )}

                {deploymentTarget === "web" && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{deploymentType === "model" ? "模型" : "工作流"}处理</span>
                        <span>{Math.min(100, packagingProgress * 2)}%</span>
                      </div>
                      <Progress value={Math.min(100, packagingProgress * 2)} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Web资源优化</span>
                        <span>{Math.max(0, Math.min(100, (packagingProgress - 30) * 1.5))}%</span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, (packagingProgress - 30) * 1.5))} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>部署包准备</span>
                        <span>{Math.max(0, Math.min(100, (packagingProgress - 70) * 3.3))}%</span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, (packagingProgress - 70) * 3.3))} className="h-2" />
                    </div>
                  </>
                )}

                {deploymentTarget === "api" && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{deploymentType === "model" ? "模型" : "工作流"}处理</span>
                        <span>{Math.min(100, packagingProgress * 2)}%</span>
                      </div>
                      <Progress value={Math.min(100, packagingProgress * 2)} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>API服务配置</span>
                        <span>{Math.max(0, Math.min(100, (packagingProgress - 30) * 1.5))}%</span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, (packagingProgress - 30) * 1.5))} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Docker镜像构建</span>
                        <span>{Math.max(0, Math.min(100, (packagingProgress - 70) * 3.3))}%</span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, (packagingProgress - 70) * 3.3))} className="h-2" />
                    </div>
                  </>
                )}
              </div>

              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <div className="space-y-1 font-mono text-xs">
                  {logMessages.map((log, index) => (
                    <div
                      key={index}
                      className={
                        log.type === "info"
                          ? "text-blue-600"
                          : log.type === "success"
                            ? "text-green-600"
                            : log.type === "error"
                              ? "text-red-600"
                              : "text-amber-600"
                      }
                    >
                      {log.type === "info" && "[INFO] "}
                      {log.type === "success" && "[SUCCESS] "}
                      {log.type === "error" && "[ERROR] "}
                      {log.type === "warning" && "[WARNING] "}
                      {log.text}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {isPackagingComplete && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex items-center gap-2 text-green-700 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>打包成功</span>
                  </div>
                  <p className="mt-2 text-sm text-green-600">
                    {deploymentType === "model" ? "模型" : "工作流"}打包为
                    {deploymentTarget === "desktop" ? "桌面应用" : deploymentTarget === "web" ? "Web应用" : "API服务"}
                    已成功完成，您可以在"下载和部署"标签页下载并安装应用。
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="download" className="space-y-6">
          {isPackagingComplete ? (
            <Card>
              <CardHeader>
                <CardTitle>下载和部署</CardTitle>
                <CardDescription>
                  下载打包好的{deploymentType === "model" ? "模型" : "工作流"}
                  {deploymentTarget === "desktop" ? "桌面应用" : deploymentTarget === "web" ? "Web应用" : "API服务"}
                  并部署
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 根据部署目标显示不同的下载选项 */}
                {deploymentTarget === "desktop" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Monitor className="h-5 w-5 text-[#a8b2d1]" />
                        <span className="font-medium">Windows</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">Windows 10/11 64位安装包</p>
                      <Button className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        下载 .exe
                      </Button>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Monitor className="h-5 w-5 text-[#d1a8c4]" />
                        <span className="font-medium">macOS</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">macOS 11+ Intel/Apple Silicon</p>
                      <Button className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        下载 .dmg
                      </Button>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Monitor className="h-5 w-5 text-[#a8d1b2]" />
                        <span className="font-medium">Linux</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">Ubuntu 20.04+ 或其他 Linux 发行版</p>
                      <Button className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        下载 .AppImage
                      </Button>
                    </div>
                  </div>
                )}

                {deploymentTarget === "web" && (
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-5 w-5 text-[#a8b2d1]" />
                        <span className="font-medium">Web 部署包</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">可部署到任何支持静态网站的服务器</p>
                      <div className="flex gap-2">
                        <Button className="gap-2">
                          <Download className="h-4 w-4" />
                          下载 Web 部署包
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <FileCode className="h-4 w-4" />
                          查看部署指南
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Cloud className="h-5 w-5 text-[#a8b2d1]" />
                        <span className="font-medium">云服务部署</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">一键部署到云服务提供商</p>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" className="gap-1">
                          <img src="/placeholder.svg?height=16&width=16" alt="Vercel" className="h-4 w-4" />
                          Vercel
                        </Button>
                        <Button variant="outline" className="gap-1">
                          <img src="/placeholder.svg?height=16&width=16" alt="Netlify" className="h-4 w-4" />
                          Netlify
                        </Button>
                        <Button variant="outline" className="gap-1">
                          <img src="/placeholder.svg?height=16&width=16" alt="AWS" className="h-4 w-4" />
                          AWS
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {deploymentTarget === "api" && (
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Server className="h-5 w-5 text-[#a8d1b2]" />
                        <span className="font-medium">API 服务包</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">可部署到任何支持 Docker 的服务器</p>
                      <div className="flex gap-2">
                        <Button className="gap-2">
                          <Download className="h-4 w-4" />
                          下载 Docker 镜像
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <FileCode className="h-4 w-4" />
                          查看部署指南
                        </Button>
                      </div>
                    </div>

                    {deploymentType === "model" ? (
                      <div className="border rounded-md p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Code className="h-5 w-5 text-[#a8b2d1]" />
                          <span className="font-medium">API 调用示例</span>
                        </div>
                        <div className="bg-slate-950 text-slate-50 p-3 rounded-md font-mono text-sm mb-3">
                          <div className="flex items-center justify-between">
                            <div>POST /api/v1/predict</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-slate-400 hover:text-slate-100"
                              onClick={() => copyToClipboard(`POST /api/v1/predict`)}
                            >
                              {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                        <div className="bg-slate-950 text-slate-50 p-3 rounded-md font-mono text-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              {`{
  "prompt": "你好，请问...",
  "max_tokens": 1024,
  "temperature": 0.7
}`}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-slate-400 hover:text-slate-100"
                              onClick={() =>
                                copyToClipboard(`{
  "prompt": "你好，请问...",
  "max_tokens": 1024,
  "temperature": 0.7
}`)
                              }
                            >
                              {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border rounded-md p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Code className="h-5 w-5 text-[#a8b2d1]" />
                          <span className="font-medium">工作流 API 调用示例</span>
                        </div>
                        <div className="bg-slate-950 text-slate-50 p-3 rounded-md font-mono text-sm mb-3">
                          <div className="flex items-center justify-between">
                            <div>POST /api/workflow/execute</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-slate-400 hover:text-slate-100"
                              onClick={() => copyToClipboard(`POST /api/workflow/execute`)}
                            >
                              {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                        <div className="bg-slate-950 text-slate-50 p-3 rounded-md font-mono text-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              {`{
  "workflowId": "${selectedWorkflow || "workflow-id"}",
  "input": "用户输入",
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 1024
  }
}`}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-slate-400 hover:text-slate-100"
                              onClick={() =>
                                copyToClipboard(`{
  "workflowId": "${selectedWorkflow || "workflow-id"}",
  "input": "用户输入",
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 1024
  }
}`)
                              }
                            >
                              {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="h-5 w-5 text-[#a8b2d1]" />
                        <span className="font-medium">云服务部署选项</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">一键部署到云服务提供商</p>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" className="gap-1">
                          <img src="/placeholder.svg?height=16&width=16" alt="AWS" className="h-4 w-4" />
                          AWS Lambda
                        </Button>
                        <Button variant="outline" className="gap-1">
                          <img src="/placeholder.svg?height=16&width=16" alt="GCP" className="h-4 w-4" />
                          Google Cloud
                        </Button>
                        <Button variant="outline" className="gap-1">
                          <img src="/placeholder.svg?height=16&width=16" alt="Azure" className="h-4 w-4" />
                          Azure
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">部署说明</h3>

                  {deploymentTarget === "desktop" && (
                    <div className="space-y-2">
                      <p className="text-sm">下载适合您操作系统的安装包，然后按照以下步骤安装：</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                            1
                          </div>
                          <div>
                            <p className="font-medium">运行安装程序</p>
                            <p className="text-xs text-muted-foreground">双击下载的安装文件开始安装</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                            2
                          </div>
                          <div>
                            <p className="font-medium">按照安装向导操作</p>
                            <p className="text-xs text-muted-foreground">选择安装位置并完成安装</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                            3
                          </div>
                          <div>
                            <p className="font-medium">启动应用</p>
                            <p className="text-xs text-muted-foreground">安装完成后，启动应用并开始使用</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {deploymentTarget === "web" && (
                    <div className="space-y-2">
                      <p className="text-sm">部署Web应用到您的服务器：</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                            1
                          </div>
                          <div>
                            <p className="font-medium">下载Web部署包</p>
                            <p className="text-xs text-muted-foreground">获取打包好的Web应用文件</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                            2
                          </div>
                          <div>
                            <p className="font-medium">上传到Web服务器</p>
                            <p className="text-xs text-muted-foreground">将文件上传到您的Web服务器或静态托管服务</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                            3
                          </div>
                          <div>
                            <p className="font-medium">配置服务器</p>
                            <p className="text-xs text-muted-foreground">确保服务器配置正确，支持SPA应用路由</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {deploymentTarget === "api" && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        使用以下 Docker 命令部署{deploymentType === "model" ? "模型" : "工作流"} API 服务：
                      </p>
                      <div className="bg-slate-950 text-slate-50 p-3 rounded-md font-mono text-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            docker run -p 3000:3000 {appName || "your-app-name"}-{deploymentType}-api:latest
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-400 hover:text-slate-100"
                            onClick={() =>
                              copyToClipboard(
                                `docker run -p 3000:3000 ${appName || "your-app-name"}-${deploymentType}-api:latest`,
                              )
                            }
                          >
                            {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">API 服务将在 http://localhost:3000 上运行</p>

                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">API 安全配置：</p>
                        <div className="flex items-start gap-2">
                          <Lock className="h-4 w-4 mt-0.5 text-amber-600" />
                          <div>
                            <p className="text-sm">
                              默认情况下，API 服务需要 API 密钥进行身份验证。您可以在启动容器时通过环境变量设置 API
                              密钥：
                            </p>
                            <div className="bg-slate-950 text-slate-50 p-2 rounded-md font-mono text-xs mt-2">
                              docker run -p 3000:3000 -e API_KEY=your_secret_key {appName || "your-app-name"}-
                              {deploymentType}-api:latest
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex items-center gap-2 text-blue-700 font-medium">
                    <Info className="h-4 w-4" />
                    <span>系统要求</span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-blue-600">
                    <div className="flex items-start gap-2">
                      <Cpu className="h-4 w-4 mt-0.5" />
                      <span>CPU: {deploymentType === "model" ? "4核" : "6核"}或更高，支持 AVX2 指令集</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <HardDrive className="h-4 w-4 mt-0.5" />
                      <span>
                        内存: 最低 {deploymentType === "model" ? "8GB" : "12GB"}，推荐{" "}
                        {deploymentType === "model" ? "16GB" : "24GB"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <HardDrive className="h-4 w-4 mt-0.5" />
                      <span>存储: 至少 {deploymentType === "model" ? "5GB" : "8GB"} 可用空间</span>
                    </div>
                    {deploymentType === "workflow" && (
                      <div className="flex items-start gap-2">
                        <Network className="h-4 w-4 mt-0.5" />
                        <span>网络: 稳定的网络连接（如果工作流包含外部API调用）</span>
                      </div>
                    )}
                  </div>
                </div>

                {deploymentTarget !== "api" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <div className="flex items-center gap-2 text-amber-700 font-medium">
                      <AlertTriangle className="h-4 w-4" />
                      <span>敬请期待</span>
                    </div>
                    <p className="mt-2 text-sm text-amber-600">
                      {deploymentTarget === "desktop" ? "桌面应用" : "Web应用"}
                      部署功能正在开发中，即将推出。目前仅支持API服务部署。
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <Box className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium text-muted-foreground">尚未完成打包</h3>
              <p className="text-muted-foreground mt-2">请先完成应用打包流程</p>
              <Button className="mt-4 gap-2" onClick={() => setActiveTab("config")}>
                <Settings className="h-4 w-4" />
                返回配置
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

