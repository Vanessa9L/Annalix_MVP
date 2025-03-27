import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Database,
  Fingerprint,
  MessageSquare,
  Cloud,
  Lightbulb,
  CreditCard,
  Info,
  Rocket,
  Zap,
  CheckCircle2,
  HelpCircle,
} from "lucide-react"

export default function DocumentationPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] bg-clip-text text-transparent">
          LLM Training Platform 文档
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          欢迎使用 LLM Training Platform，这是一个专为大语言模型训练和部署设计的一站式平台。
          本文档将帮助您了解平台的核心功能和使用方法。
        </p>
      </div>

      <Tabs defaultValue="intro" className="w-full">
        <TabsList className="grid grid-cols-6 w-full max-w-3xl">
          <TabsTrigger value="intro">平台介绍</TabsTrigger>
          <TabsTrigger value="features">核心功能</TabsTrigger>
          <TabsTrigger value="guide">使用指南</TabsTrigger>
          <TabsTrigger value="faq">常见问题</TabsTrigger>
          <TabsTrigger value="api">API 文档</TabsTrigger>
          <TabsTrigger value="roadmap">未来规划</TabsTrigger>
        </TabsList>

        <TabsContent value="intro" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[#a8b2d1]" />
                平台概述
              </CardTitle>
              <CardDescription>LLM Training Platform 是什么以及它能为您做什么</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                LLM Training Platform 是一个专为人工智能研究者、开发者和企业设计的大语言模型训练和部署平台。
                无论您是希望微调现有模型以适应特定领域，还是从头开始训练自己的模型，我们的平台都能提供端到端的解决方案。
              </p>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Rocket className="h-4 w-4 text-[#a8b2d1]" />
                      简化工作流程
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      从数据准备到模型部署，一站式解决方案简化了复杂的 LLM 训练流程。
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-4 w-4 text-[#d1a8c4]" />
                      高效训练
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      支持多种训练方法（LoRA、QLoRA、全量微调等），优化计算资源利用。
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-[#a8d1b2]" />
                      便捷部署
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">一键部署训练好的模型，支持多种部署方式和监控工具。</p>
                  </CardContent>
                </Card>
              </div>

              <Alert className="bg-[#f0f1f7] border-[#a8b2d1]">
                <Info className="h-4 w-4 text-[#a8b2d1]" />
                <AlertTitle>为什么选择我们的平台？</AlertTitle>
                <AlertDescription>
                  我们的平台专注于简化 LLM 训练流程，降低技术门槛，让更多人能够利用大语言模型的强大能力。 无论您是 AI
                  研究者、开发者还是企业用户，都能在这里找到适合自己的解决方案。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#a8d1b2]" />
                适用场景
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Badge className="bg-[#f0f1f7] text-[#8892b0] hover:bg-[#e8eaf3]">研究场景</Badge>
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>学术研究与实验</li>
                    <li>模型性能对比分析</li>
                    <li>新训练方法探索</li>
                    <li>特定领域知识注入</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Badge className="bg-[#f7f0f5] text-[#b092a6] hover:bg-[#f3e8f0]">企业应用</Badge>
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>客服智能助手训练</li>
                    <li>行业专用模型开发</li>
                    <li>内部知识库构建</li>
                    <li>多语言模型适配</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Badge className="bg-[#f0f7f2] text-[#90b096] hover:bg-[#e8f3ea]">开发者使用</Badge>
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>应用程序集成</li>
                    <li>API 服务构建</li>
                    <li>原型快速开发</li>
                    <li>个性化模型训练</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Badge className="bg-[#f7f5f0] text-[#b0a690] hover:bg-[#f3f0e8]">教育培训</Badge>
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>AI 教学演示</li>
                    <li>学生项目支持</li>
                    <li>课程辅助工具</li>
                    <li>研究生培训</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-[#a8b2d1]" />
                  数据库管理
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">高效管理和处理训练数据，支持多种数据源和格式。</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>支持本地上传（CSV、JSON、TXT等格式）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>远程数据源连接（API、数据库）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>AI辅助数据生成</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>数据可视化与质量分析</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>自动数据清理与标注</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-[#d1a8c4]" />
                  模型训练
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">灵活的模型训练选项，满足不同场景需求。</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>多种训练方法（Full-tuning、Freeze-tuning、LoRA、QLoRA）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>参数自定义与优化</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>训练进度实时监控</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>多种基础模型支持</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>训练资源优化</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#a8d1b2]" />
                  模型测试
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">全面评估模型性能，确保训练效果。</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>交互式对话测试</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>性能指标评估</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>批量测试与对比</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>错误分析与改进建议</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>测试结果导出</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-[#d1c4a8]" />
                  模型部署
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">便捷的模型部署与管理功能。</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>一键部署到生产环境</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>多种集成方式（API、SDK、插件）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>性能监控与告警</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>自动增量训练</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>版本管理与回滚</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-[#c4a8d1]" />
                  案例库
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">丰富的应用案例与最佳实践。</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>行业解决方案示例</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>完整训练流程演示</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>代码示例与部署指南</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>社区分享与交流</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#a8b2d1]" />
                  会员方案
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">灵活的会员方案，满足不同需求。</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>免费版：基础功能体验</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>专业版：高级功能与更多资源</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>企业版：定制化服务与无限资源</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>灵活的计费方式</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>快速入门指南</CardTitle>
              <CardDescription>从零开始使用 LLM Training Platform 的步骤</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-medium">注册账户</h4>
                    <p className="text-sm text-muted-foreground">
                      创建您的 LLM Training Platform 账户，选择适合您需求的会员方案。
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-medium">准备数据库</h4>
                    <p className="text-sm text-muted-foreground">
                      上传或创建训练数据库，可以使用本地文件、远程数据源或 AI 生成数据。
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-medium">配置训练参数</h4>
                    <p className="text-sm text-muted-foreground">
                      选择基础模型、训练方法和参数，根据您的需求进行自定义设置。
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                    <span className="text-sm font-medium">4</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-medium">开始训练</h4>
                    <p className="text-sm text-muted-foreground">启动训练流程，实时监控训练进度和性能指标。</p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-medium">测试与评估</h4>
                    <p className="text-sm text-muted-foreground">使用交互式测试工具评估模型性能，进行必要的调整。</p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-4 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                    <span className="text-sm font-medium">6</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-medium">部署模型</h4>
                    <p className="text-sm text-muted-foreground">一键部署模型到生产环境，选择适合您的集成方式。</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>最佳实践</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">数据库准备</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>确保数据质量和多样性</li>
                    <li>进行充分的数据清洗</li>
                    <li>合理划分训练集和验证集</li>
                    <li>考虑数据增强技术</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">训练策略</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>从小批量数据开始测试</li>
                    <li>逐步调整学习率和批次大小</li>
                    <li>使用早停策略避免过拟合</li>
                    <li>保存训练检查点</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">部署考虑</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>评估资源需求</li>
                    <li>设置监控和告警</li>
                    <li>制定回滚策略</li>
                    <li>考虑增量更新机制</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>常见工作流程</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>客服助手训练流程</AccordionTrigger>
                    <AccordionContent>
                      <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                        <li>收集客服对话历史数据</li>
                        <li>清洗和标准化对话数据</li>
                        <li>使用 LoRA 方法进行微调</li>
                        <li>通过模拟客户问题进行测试</li>
                        <li>部署为 API 服务</li>
                        <li>设置反馈收集机制</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>垂直领域知识模型</AccordionTrigger>
                    <AccordionContent>
                      <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                        <li>收集领域专业文献和资料</li>
                        <li>构建结构化知识库</li>
                        <li>使用 QLoRA 进行高效微调</li>
                        <li>通过专业问题测试准确性</li>
                        <li>部署为内部知识助手</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>多语言模型适配</AccordionTrigger>
                    <AccordionContent>
                      <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                        <li>收集多语言平行语料库</li>
                        <li>针对目标语言进行数据增强</li>
                        <li>使用 Full-tuning 方法训练</li>
                        <li>进行跨语言能力测试</li>
                        <li>部署为多语言服务</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#a8b2d1]" />
                常见问题解答
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>我需要多少数据才能有效训练模型？</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      数据量需求取决于您的具体任务和使用的训练方法。一般来说，使用 LoRA 或 QLoRA 等参数高效微调方法，
                      几百到几千条高质量数据就可以取得不错的效果。对于全量微调，可能需要更多数据。
                      关键是数据质量和相关性，而不仅仅是数量。我们建议从小数据集开始，逐步增加并评估效果。
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>平台支持哪些基础模型？</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      我们支持多种主流开源和商业基础模型，包括但不限于：LLaMA 系列、ChatGLM 系列、 Mistral 系列、OpenAI
                      模型（需要 API Key）、Claude 系列（需要 API Key）等。 我们会持续更新支持的模型列表，以跟进最新的
                      AI 研究进展。
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>训练需要多长时间？</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      训练时间取决于多个因素：数据库大小、选择的基础模型、训练方法、硬件资源等。 使用 LoRA
                      等参数高效方法，小型数据库的训练可能只需几小时；
                      而大型数据库的全量微调可能需要数天时间。我们的平台会自动优化资源分配，
                      并提供训练时间估计，帮助您规划工作流程。
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>如何选择合适的训练方法？</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">选择训练方法时，需要考虑以下因素：</p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                      <li>
                        <strong>Full-tuning</strong>：适合大规模数据库和需要深度定制的场景，但需要较多计算资源
                      </li>
                      <li>
                        <strong>Freeze-tuning</strong>：冻结部分层，平衡效果和资源消耗
                      </li>
                      <li>
                        <strong>LoRA</strong>：高效参数微调方法，适合大多数场景，资源需求低
                      </li>
                      <li>
                        <strong>QLoRA</strong>：在 LoRA 基础上进行量化，进一步降低显存需求，适合资源受限场景
                      </li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      我们建议从 LoRA 或 QLoRA 开始尝试，根据效果再决定是否需要更复杂的方法。
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>如何评估模型训练效果？</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">评估模型效果可以从多个维度进行：</p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                      <li>使用验证集计算准确率、损失等量化指标</li>
                      <li>通过交互式测试评估模型回答质量</li>
                      <li>针对特定任务设计评估标准（如问答准确性、生成文本流畅度等）</li>
                      <li>进行 A/B 测试，与基线模型对比</li>
                      <li>收集用户反馈</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      我们的平台提供全面的评估工具，帮助您从多角度了解模型性能。
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API 文档</CardTitle>
              <CardDescription>通过 API 集成 LLM Training Platform 的功能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">认证</h3>
                <p className="text-sm text-muted-foreground">所有 API 请求需要在 Header 中包含 API Key 进行认证：</p>
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {`Authorization: Bearer YOUR_API_KEY`}
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">数据库 API</h3>
                <p className="text-sm text-muted-foreground">管理训练数据库的 API 端点：</p>
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {`# 获取数据库列表
GET /api/datasets

# 创建新数据库
POST /api/datasets
{
  "name": "数据库名称",
  "description": "数据库描述",
  "data": [...]
}

# 获取特定数据库
GET /api/datasets/{dataset_id}

# 更新数据库
PUT /api/datasets/{dataset_id}

# 删除数据库
DELETE /api/datasets/{dataset_id}`}
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">模型训练 API</h3>
                <p className="text-sm text-muted-foreground">控制模型训练流程的 API 端点：</p>
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {`# 开始训练任务
POST /api/training
{
  "dataset_id": "数据库ID",
  "base_model": "基础模型名称",
  "method": "lora",
  "params": {
    "learning_rate": 0.0003,
    "batch_size": 32,
    "epochs": 5
  }
}

# 获取训练任务状态
GET /api/training/{task_id}

# 停止训练任务
POST /api/training/{task_id}/stop`}
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">模型推理 API</h3>
                <p className="text-sm text-muted-foreground">使用训练好的模型进行推理的 API 端点：</p>
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {`# 文本生成
POST /api/models/{model_id}/generate
{
  "prompt": "用户输入文本",
  "max_tokens": 1000,
  "temperature": 0.7
}

# 流式文本生成
POST /api/models/{model_id}/generate/stream
{
  "prompt": "用户输入文本",
  "max_tokens": 1000,
  "temperature": 0.7
}`}
                </pre>
              </div>

              <div className="mt-4">
                <Button variant="outline" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  查看完整 API 文档
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-[#d1a8c4]" />
                平台发展规划
              </CardTitle>
              <CardDescription>当前版本仅是MVP，我们有宏大的未来规划</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-[#f7f0f5] border-[#d1a8c4]">
                <Info className="h-4 w-4 text-[#d1a8c4]" />
                <AlertTitle>当前状态：MVP（最小可行产品）</AlertTitle>
                <AlertDescription>
                  当前版本提供了基础的LLM训练功能，未来我们将持续添加更多高级特性和优化现有功能。
                </AlertDescription>
              </Alert>

              <div className="py-6">
                <h3 className="font-medium text-lg mb-4">路线图时间表</h3>
                <div className="relative">
                  {/* Timeline */}
                  <div className="absolute left-0 ml-5 w-0.5 h-full bg-gradient-to-b from-[#a8b2d1] to-[#d1a8c4]"></div>

                  {/* Q2 2024 */}
                  <div className="relative pl-12 pb-8">
                    <div className="absolute left-0 w-10 h-10 rounded-full bg-[#a8b2d1] flex items-center justify-center text-white font-bold">
                      Q2
                    </div>
                    <div className="bg-white rounded-lg border p-4 shadow-sm">
                      <h4 className="font-medium text-[#2d3748] mb-2">2024年第二季度</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>支持更多开源LLM模型的微调（Mistral, Phi, DeepSeek等）</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>增强数据处理能力，支持更多数据格式和预处理方法</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>优化训练流程，提高资源利用效率</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Q3 2024 */}
                  <div className="relative pl-12 pb-8">
                    <div className="absolute left-0 w-10 h-10 rounded-full bg-[#b8a8cc] flex items-center justify-center text-white font-bold">
                      Q3
                    </div>
                    <div className="bg-white rounded-lg border p-4 shadow-sm">
                      <h4 className="font-medium text-[#2d3748] mb-2">2024年第三季度</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>工作流系统：多模型协作处理复杂任务</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>工具使用能力：为模型添加调用外部工具的能力</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>团队协作功能增强，支持多人同时开发</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Q4 2024 */}
                  <div className="relative pl-12 pb-8">
                    <div className="absolute left-0 w-10 h-10 rounded-full bg-[#c4a8c8] flex items-center justify-center text-white font-bold">
                      Q4
                    </div>
                    <div className="bg-white rounded-lg border p-4 shadow-sm">
                      <h4 className="font-medium text-[#2d3748] mb-2">2024年第四季度</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>多模态支持：图像、音频输入与处理能力</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>高级评估系统：自动基准测试和性能分析</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>行业特定解决方案模板库</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* 2025 */}
                  <div className="relative pl-12">
                    <div className="absolute left-0 w-10 h-10 rounded-full bg-[#d1a8c4] flex items-center justify-center text-white font-bold">
                      '25
                    </div>
                    <div className="bg-white rounded-lg border p-4 shadow-sm">
                      <h4 className="font-medium text-[#2d3748] mb-2">2025年展望</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>生成式AI应用构建器：无代码创建复杂AI应用</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>企业级加密知识库与模型训练集成解决方案</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>更先进的模型架构支持与自动架构搜索</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">核心发展方向</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Badge variant="outline" className="font-normal bg-[#f0f1f7] text-[#8892b0]">
                            训练数据加密
                          </Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          提供企业级数据加密方案，确保训练数据的安全性，满足各类合规要求。
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Badge variant="outline" className="font-normal bg-[#f7f0f5] text-[#b092a6]">
                            工作流与工具
                          </Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          建立复杂工作流系统，使多个专业模型能够协作完成任务，并具备调用外部工具和API的能力。
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Badge variant="outline" className="font-normal bg-[#f0f7f2] text-[#90b096]">
                            多模态支持
                          </Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          逐步增加对图像、音频、视频等多种模态的支持，打造全方位的AI训练平台。
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">参与未来规划</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      我们非常重视用户反馈，欢迎提供您对平台未来发展的建议和需求。
                    </p>

                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start gap-2 text-[#a8b2d1]">
                        <MessageSquare className="h-4 w-4" />
                        提交功能建议
                      </Button>

                      <Button variant="outline" className="w-full justify-start gap-2 text-[#d1a8c4]">
                        <Lightbulb className="h-4 w-4" />
                        加入beta测试计划
                      </Button>

                      <Button variant="outline" className="w-full justify-start gap-2 text-[#a8d1b2]">
                        <Rocket className="h-4 w-4" />
                        查看最新开发动态
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-muted/50 rounded-lg p-6 mt-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="space-y-2 flex-1">
            <h3 className="text-xl font-medium">需要更多帮助？</h3>
            <p className="text-muted-foreground">如果您有任何问题或需要技术支持，请随时联系我们的团队。</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              技术支持
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] hover:opacity-90">
              <MessageSquare className="h-4 w-4" />
              联系我们
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

