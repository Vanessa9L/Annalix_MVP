"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  Search,
  BookOpen,
  Video,
  MessageSquare,
  FileText,
  ChevronRight,
  ExternalLink,
  Play,
} from "lucide-react"

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("guides")

  // Sample guides
  const guides = [
    {
      id: "guide1",
      title: "微调工作室入门指南",
      description: "学习如何使用微调工作室训练自己的模型",
      category: "微调",
      difficulty: "初级",
    },
    {
      id: "guide2",
      title: "创建高效工作流",
      description: "学习如何创建和优化工作流",
      category: "工作流",
      difficulty: "中级",
    },
    {
      id: "guide3",
      title: "部署到桌面应用",
      description: "将您的模型和工作流部署为桌面应用",
      category: "部署",
      difficulty: "初级",
    },
    {
      id: "guide4",
      title: "高级工具集成",
      description: "学习如何创建和集成自定义工具",
      category: "工具",
      difficulty: "高级",
    },
    {
      id: "guide5",
      title: "性能优化技巧",
      description: "优化模型和工作流性能的技巧",
      category: "优化",
      difficulty: "中级",
    },
  ]

  // Sample videos
  const videos = [
    {
      id: "video1",
      title: "微调工作室视频教程",
      description: "完整演示如何使用微调工作室",
      duration: "15:24",
      thumbnail: "/placeholder.svg?height=120&width=200&text=微调工作室教程",
    },
    {
      id: "video2",
      title: "工作流画布基础",
      description: "学习工作流画布的基本操作",
      duration: "12:38",
      thumbnail: "/placeholder.svg?height=120&width=200&text=工作流画布基础",
    },
    {
      id: "video3",
      title: "部署和打包教程",
      description: "如何部署和打包您的应用",
      duration: "18:05",
      thumbnail: "/placeholder.svg?height=120&width=200&text=部署和打包教程",
    },
  ]

  // Sample FAQs
  const faqs = [
    {
      id: "faq1",
      question: "如何选择合适的微调方法？",
      answer: "选择微调方法取决于您的硬件资源和需求。QLoRA 适合消费级 GPU，而全量微调需要更多资源但可能有更好的效果。",
    },
    {
      id: "faq2",
      question: "如何在工作流中添加自定义工具？",
      answer:
        "在工作流画布中，您可以点击侧边栏中的“添加工具”按钮，然后选择“自定义工具”选项。您需要提供工具的名称、描述和参数定义。",
    },
    {
      id: "faq3",
      question: "支持哪些部署平台？",
      answer: "我们支持 Windows、macOS 和 Linux 桌面应用部署，以及 Web 应用和 API 服务部署。",
    },
    {
      id: "faq4",
      question: "如何优化模型性能？",
      answer:
        "您可以通过量化模型、调整批处理大小和使用缓存机制来优化模型性能。在部署页面的高级选项中可以找到这些设置。",
    },
    {
      id: "faq5",
      question: "如何导出和分享我的工作流？",
      answer:
        '在工作流画布页面，点击右上角的"保存"按钮，然后选择"导出工作流"。您可以将导出的 JSON 文件分享给其他用户。',
    },
  ]

  // Filter content based on search query
  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-[#2d3748]">帮助中心</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="搜索帮助内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            指南
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            视频教程
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            常见问题
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            支持
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGuides.length > 0 ? (
              filteredGuides.map((guide) => (
                <Card key={guide.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                    </div>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-[#f0f1f7] text-[#8892b0]">
                        {guide.category}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={
                          guide.difficulty === "初级"
                            ? "bg-[#f0f7f2] text-[#90b096]"
                            : guide.difficulty === "中级"
                              ? "bg-[#f7f0f5] text-[#b092a6]"
                              : "bg-[#f7f5f0] text-[#b0a690]"
                        }
                      >
                        {guide.difficulty}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-between">
                      阅读指南
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                <FileText className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">未找到相关指南</p>
                <p className="text-sm">尝试使用不同的搜索关键词</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-[150px] object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-2">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-between">
                      观看视频
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                <Video className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">未找到相关视频</p>
                <p className="text-sm">尝试使用不同的搜索关键词</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>常见问题解答</CardTitle>
              <CardDescription>关于平台使用的常见问题和解答</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => (
                      <div key={faq.id} className="space-y-2">
                        <h3 className="font-medium text-lg">{faq.question}</h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                        <Separator className="my-2" />
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
                      <HelpCircle className="h-12 w-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">未找到相关问题</p>
                      <p className="text-sm">尝试使用不同的搜索关键词</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>获取支持</CardTitle>
              <CardDescription>如果您需要更多帮助，请联系我们的支持团队</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-[#a8b2d1]" />
                      社区论坛
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">加入我们的社区论坛，与其他用户交流经验和解决问题</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      访问论坛
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-[#d1a8c4]" />
                      技术支持
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">联系我们的技术支持团队获取专业帮助</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      联系支持
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#a8d1b2]" />
                      文档中心
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">浏览我们的详细文档，了解平台的所有功能</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      查看文档
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">联系我们</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        姓名
                      </label>
                      <Input id="name" placeholder="输入您的姓名" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        邮箱
                      </label>
                      <Input id="email" type="email" placeholder="输入您的邮箱" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      主题
                    </label>
                    <Input id="subject" placeholder="输入主题" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      消息
                    </label>
                    <Input id="message" placeholder="输入您的消息" className="h-24" />
                  </div>
                  <Button className="bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] hover:opacity-90">发送消息</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

