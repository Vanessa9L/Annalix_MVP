"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const examples = [
  {
    id: 1,
    title: "医疗诊断助手",
    description: "基于病历数据训练的智能诊断模型",
    category: "医疗",
    difficulty: "进阶",
    stars: 128,
    image: "/placeholder.svg?height=200&width=400&text=🏥",
    pipeline: {
      data: "- 病历文本数据\n- 诊断报告\n- 医学术语库",
      preprocessing: "- 医学术语标准化\n- 隐私信息脱敏\n- 结构化转换",
      training: "- 使用LoRA微调\n- 医学知识注入\n- 多轮对话训练",
      deployment: "- 私有化部署\n- 接口安全加密\n- 实时响应优化",
    },
  },
  {
    id: 2,
    title: "法律顾问机器人",
    description: "专注于合同审查和法律咨询的智能助手",
    category: "法律",
    difficulty: "高级",
    stars: 156,
    image: "/placeholder.svg?height=200&width=400&text=⚖️",
    pipeline: {
      data: "- 法律文书数据\n- 判例数据库\n- 法规政策文本",
      preprocessing: "- 法律术语提取\n- 案例结构化\n- 关键信息标注",
      training: "- 全量微调\n- 法律知识图谱集成\n- 推理能力增强",
      deployment: "- 安全审计系统\n- 多语言支持\n- 版本控制",
    },
  },
  {
    id: 3,
    title: "电商客服机器人",
    description: "处理订单查询和商品推荐的智能客服系统",
    category: "电商",
    difficulty: "入门",
    stars: 245,
    image: "/placeholder.svg?height=200&width=400&text=🛍️",
    pipeline: {
      data: "- 客服对话记录\n- 商品信息\n- 用户反馈",
      preprocessing: "- 对话清洗\n- 意图分类\n- 情感标注",
      training: "- QLoRA微调\n- 多任务学习\n- 个性化适配",
      deployment: "- 多渠道集成\n- 负载均衡\n- A/B测试",
    },
  },
  {
    id: 4,
    title: "金融风控助手",
    description: "用于风险评估和信用分析的智能模型",
    category: "金融",
    difficulty: "高级",
    stars: 189,
    image: "/placeholder.svg?height=200&width=400&text=💰",
    pipeline: {
      data: "- 交易数据\n- 用户画像\n- 风险事件库",
      preprocessing: "- 数据脱敏\n- 特征工程\n- 时序处理",
      training: "- Freeze-tuning\n- 风控规则注入\n- 异常检测强化",
      deployment: "- 实时监控\n- 风险预警\n- 审计日志",
    },
  },
  {
    id: 5,
    title: "教育辅导助手",
    description: "个性化学习和答疑的智能教育系统",
    category: "教育",
    difficulty: "进阶",
    stars: 167,
    image: "/placeholder.svg?height=200&width=400&text=📚",
    pipeline: {
      data: "- 教材内容\n- 试题库\n- 学习行为数据",
      preprocessing: "- 知识点提取\n- 难度分级\n- 答案对齐",
      training: "- LoRA微调\n- 知识图谱集成\n- 个性化推荐",
      deployment: "- 课程集成\n- 学习追踪\n- 反馈分析",
    },
  },
]

export default function ExamplesGallery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExample, setSelectedExample] = useState<(typeof examples)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeStep, setActiveStep] = useState("")

  const filteredExamples = examples.filter(
    (example) =>
      example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleExampleClick = (example: (typeof examples)[0]) => {
    setSelectedExample(example)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-[#2d3748]">案例库</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="搜索案例..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64 bg-white border-[#f0f0f0]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExamples.map((example) => (
          <Card
            key={example.id}
            className="group cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => handleExampleClick(example)}
          >
            <div className="h-40 overflow-hidden">
              <img
                src={example.image || "/placeholder.svg"}
                alt={example.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-[#2d3748]">{example.title}</CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </div>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-sm">{example.stars}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="bg-[#f0f1f7] text-[#8892b0]">
                  {example.category}
                </Badge>
                <Badge variant="secondary" className="bg-[#f7f0f5] text-[#b092a6]">
                  {example.difficulty}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedExample?.title}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="pipeline" className="w-full">
            <TabsList>
              <TabsTrigger value="pipeline">完整流程</TabsTrigger>
              <TabsTrigger value="code">示例代码</TabsTrigger>
              <TabsTrigger value="deploy">部署指南</TabsTrigger>
            </TabsList>

            <TabsContent value="pipeline">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">数据准备</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm">{selectedExample?.pipeline.data}</pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">数据预处理</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm">{selectedExample?.pipeline.preprocessing}</pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">模型训练</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm">{selectedExample?.pipeline.training}</pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">部署优化</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm">{selectedExample?.pipeline.deployment}</pre>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="code">
              <Card>
                <CardContent className="p-4">
                  <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto">
                    {`# 示例代码
from llm_training import DataProcessor, ModelTrainer, Deployer

# 1. 数据处理
processor = DataProcessor()
data = processor.load_data("path/to/data")
processed_data = processor.preprocess(
    data,
    steps=[
        "standardize",
        "anonymize",
        "structure"
    ]
)

# 2. 模型训练
trainer = ModelTrainer(
    model="llama2-7b",
    method="lora",
    params={
        "learning_rate": 3e-4,
        "batch_size": 32,
        "epochs": 5
    }
)
model = trainer.train(processed_data)

# 3. 模型部署
deployer = Deployer(
    model=model,
    config={
        "endpoint_type": "api",
        "scaling": "auto",
        "monitoring": True
    }
)
endpoint = deployer.deploy()
print(f"Model deployed at: {endpoint}")
`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deploy">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">部署步骤</h3>
                    <ol className="list-decimal list-inside space-y-4">
                      <li className="text-sm">
                        <div className="inline text-muted-foreground">准备环境</div>
                        <Button variant="link" className="h-auto p-0 ml-2" onClick={() => setActiveStep("environment")}>
                          查看详情 <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                        <Dialog open={activeStep === "environment"} onOpenChange={() => setActiveStep("")}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>环境准备指南</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h4 className="font-medium">系统要求</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                  <li>Linux/Unix 操作系统（推荐 Ubuntu 20.04+）</li>
                                  <li>Python 3.8+ 运行环境</li>
                                  <li>CUDA 11.7+ （用于 GPU 训练）</li>
                                  <li>至少 16GB 系统内存</li>
                                </ul>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-medium">依赖安装</h4>
                                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg text-sm">
                                  {`pip install -r requirements.txt
pip install torch torchvision`}
                                </pre>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </li>
                      <li className="text-sm">
                        <div className="inline text-muted-foreground">配置模型服务</div>
                        <Button variant="link" className="h-auto p-0 ml-2" onClick={() => setActiveStep("config")}>
                          查看详情 <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                        <Dialog open={activeStep === "config"} onOpenChange={() => setActiveStep("")}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>模型服务配置指南</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h4 className="font-medium">配置文件设置</h4>
                                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg text-sm">
                                  {`# config.yaml
model:
  name: "your-model-name"
  version: "v1"
  device: "cuda"  # 或 "cpu"
server:
  host: "0.0.0.0"
  port: 8000
  workers: 4
inference:
  batch_size: 32
  max_length: 2048`}
                                </pre>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-medium">启动命令</h4>
                                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg text-sm">
                                  {`python -m model_server --config config.yaml`}
                                </pre>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </li>
                      <li className="text-sm">
                        <div className="inline text-muted-foreground">设置监控告警</div>
                        <Button variant="link" className="h-auto p-0 ml-2" onClick={() => setActiveStep("monitoring")}>
                          查看详情 <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                        <Dialog open={activeStep === "monitoring"} onOpenChange={() => setActiveStep("")}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>监控告警配置指南</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h4 className="font-medium">监控指标</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                  <li>API 响应时间</li>
                                  <li>请求成功率</li>
                                  <li>GPU 显存使用率</li>
                                  <li>系统资源使用率</li>
                                </ul>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-medium">告警配置</h4>
                                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg text-sm">
                                  {`# alerts.yaml
rules:
  - name: high_latency
    condition: "response_time_p95 > 500ms"
    duration: "5m"
    severity: warning
  - name: error_rate
    condition: "error_rate > 0.01"
    duration: "1m"
    severity: critical`}
                                </pre>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </li>
                      <li className="text-sm">
                        <div className="inline text-muted-foreground">性能优化</div>
                        <Button
                          variant="link"
                          className="h-auto p-0 ml-2"
                          onClick={() => setActiveStep("optimization")}
                        >
                          查看详情 <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                        <Dialog open={activeStep === "optimization"} onOpenChange={() => setActiveStep("")}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>性能优化指南</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h4 className="font-medium">优化策略</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                  <li>模型量化（INT8/FP16）</li>
                                  <li>批处理请求优化</li>
                                  <li>缓存机制优化</li>
                                  <li>负载均衡配置</li>
                                </ul>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-medium">示例配置</h4>
                                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg text-sm">
                                  {`# optimization.yaml
quantization:
  enabled: true
  type: "int8"
batching:
  max_batch_size: 32
  max_latency: 100ms
caching:
  enabled: true
  max_size: 1000
  ttl: 3600`}
                                </pre>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </li>
                    </ol>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">注意事项</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li className="text-sm text-muted-foreground">确保数据安全和隐私保护</li>
                      <li className="text-sm text-muted-foreground">设置适当的资源限制和扩展策略</li>
                      <li className="text-sm text-muted-foreground">实施版本控制和回滚机制</li>
                      <li className="text-sm text-muted-foreground">建立完整的监控和告警体系</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

