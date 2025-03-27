"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Database, Wand2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function CreateDatasetDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [datasetName, setDatasetName] = useState("")
  const [datasetDescription, setDatasetDescription] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [dataSourceUrl, setDataSourceUrl] = useState("")
  const [generationPrompt, setGenerationPrompt] = useState("")
  const [generatedSamples, setGeneratedSamples] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      setSelectedFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const simulateUpload = () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const simulateGeneration = () => {
    if (!generationPrompt) return

    setIsGenerating(true)
    setGeneratedSamples([])

    // Simulate API call to generate data
    setTimeout(() => {
      const samples = [
        "用户: 如何提高英语口语水平？\n助手: 提高英语口语需要多练习，可以通过与外国人交流、看英语电影、参加英语角等方式。坚持每天说英语，不怕犯错，是进步的关键。",
        "用户: 介绍一下人工智能的应用领域\n助手: 人工智能广泛应用于医疗诊断、自动驾驶、智能客服、金融风控、智能制造等领域。随着技术发展，AI应用将更加普及和深入各行各业。",
        "用户: 如何做一道红烧肉？\n助手: 红烧肉的做法：1.五花肉切块焯水去腥；2.锅中放油，加入冰糖炒至焦糖色；3.放入肉块煸炒上色；4.加入酱油、料酒、八角等调料；5.加水没过肉，炖煮1小时至肉烂即可。",
      ]
      setGeneratedSamples(samples)
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>新建数据库</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataset-name">数据库名称</Label>
              <Input
                id="dataset-name"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="输入数据库名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataset-description">数据库描述</Label>
              <Input
                id="dataset-description"
                value={datasetDescription}
                onChange={(e) => setDatasetDescription(e.target.value)}
                placeholder="简要描述数据库用途"
              />
            </div>
          </div>

          <Tabs defaultValue="upload">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                本地上传
              </TabsTrigger>
              <TabsTrigger value="remote" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                远程数据源
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                AI生成数据
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">拖拽文件到此处或点击上传</p>
                <p className="text-sm text-muted-foreground mt-1">支持 CSV, JSON, TXT 格式</p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  accept=".csv,.json,.txt"
                  onChange={handleFileChange}
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>已选择 {selectedFiles.length} 个文件</Label>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedFiles([])}>
                      清除
                    </Button>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Badge variant="outline">{(file.size / 1024).toFixed(1)} KB</Badge>
                      </div>
                    ))}
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>上传进度</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  <Button onClick={simulateUpload} disabled={isUploading}>
                    {isUploading ? "上传中..." : "开始上传"}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="remote" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-source-url">数据源URL</Label>
                <Input
                  id="data-source-url"
                  value={dataSourceUrl}
                  onChange={(e) => setDataSourceUrl(e.target.value)}
                  placeholder="https://example.com/api/data"
                />
                <p className="text-sm text-muted-foreground">支持REST API、数据库连接URL或公开数据集链接</p>
              </div>

              <div className="space-y-2">
                <Label>连接参数（可选）</Label>
                <Textarea placeholder="API密钥、查询参数或其他连接信息" className="h-20" />
              </div>

              <Button disabled={!dataSourceUrl}>连接数据源</Button>
            </TabsContent>

            <TabsContent value="generate" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="generation-prompt">数据生成提示</Label>
                <Textarea
                  id="generation-prompt"
                  value={generationPrompt}
                  onChange={(e) => setGenerationPrompt(e.target.value)}
                  placeholder="描述您需要的数据类型和格式，例如：'生成10条中文问答对，主题为人工智能技术'"
                  className="h-20"
                />
              </div>

              <Button onClick={simulateGeneration} disabled={isGenerating || !generationPrompt}>
                {isGenerating ? "生成中..." : "生成示例数据"}
              </Button>

              {generatedSamples.length > 0 && (
                <div className="space-y-2">
                  <Label>生成的示例数据</Label>
                  <Card>
                    <CardContent className="p-4 max-h-60 overflow-y-auto">
                      {generatedSamples.map((sample, index) => (
                        <div key={index} className="p-2 border-b last:border-0">
                          <pre className="text-sm whitespace-pre-wrap">{sample}</pre>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setGeneratedSamples([])}>
                      清除示例
                    </Button>
                    <Button>使用这些数据</Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button>创建数据库</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

