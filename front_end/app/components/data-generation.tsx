"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts"
import { Search, Plus, Filter, Download, MoreHorizontal, Check, LineChartIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateDatasetDialog } from "./create-dataset-dialog"
import { DataEvaluationDialog } from "./data-evaluation-dialog"

const getRandomImage = () => {
  const colors = ["FF5733", "33FF57", "3357FF", "FF33F5", "F5FF33"]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  return `/placeholder.svg?height=200&width=400&text=数据库&bgcolor=${randomColor}`
}

const sampleDatasets = [
  {
    id: 1,
    title: "大型语言模型训练数据集",
    description: "用于LLM训练的高质量对话数据集",
    samples: 100, // 从1000改为100
    quality: 85,
    image: "/placeholder.svg?height=200&width=400&text=📚",
  },
  {
    id: 2,
    title: "情感分析数据集",
    description: "中文社交媒体评论情感标注数据集",
    samples: 80, // 从800改为80
    quality: 92,
    image: "/placeholder.svg?height=200&width=400&text=📚",
  },
  {
    id: 3,
    title: "问答系统数据集",
    description: "通用领域问答对数据集",
    samples: 120, // 从1200改为120
    quality: 78,
    image: "/placeholder.svg?height=200&width=400&text=📚",
  },
]

const qualityMetrics = [
  { name: "完整性", value: 85 },
  { name: "准确性", value: 92 },
  { name: "一致性", value: 78 },
  { name: "相关性", value: 88 },
]

export default function DataGeneration() {
  const [selectedDataset, setSelectedDataset] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [customImages, setCustomImages] = useState<Record<number, string>>({})
  const [previewData, setPreviewData] = useState(`示例数据1
示例数据2
示例数据3`)
  const [isCreateDatasetOpen, setIsCreateDatasetOpen] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<number[]>([])
  const [isDataEvaluationOpen, setIsDataEvaluationOpen] = useState(false)

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>, datasetId: number) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCustomImages((prev) => ({
          ...prev,
          [datasetId]: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDatasetClick = (dataset) => {
    setSelectedDataset(dataset)
    setIsDialogOpen(true)
  }

  const handleToggleSelection = (datasetId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedDatasetIds((prev) =>
      prev.includes(datasetId) ? prev.filter((id) => id !== datasetId) : [...prev, datasetId],
    )
  }

  const handleBatchDownload = () => {
    const datasetsToDownload = sampleDatasets.filter((dataset) => selectedDatasetIds.includes(dataset.id))
    console.log("Downloading datasets:", datasetsToDownload)
    // Here you would implement the actual download logic
    alert(`已选择下载 ${datasetsToDownload.length} 个数据库`)
    setIsSelectionMode(false)
    setSelectedDatasetIds([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-[#2d3748]">数据库</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="搜索数据库..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-white border-[#f0f0f0]"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-[#f0f0f0] text-[#a8b2d1] hover:text-[#8892b0] hover:bg-[#f0f1f7]"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-[#f0f0f0] text-[#d1a8c4] hover:text-[#b092a6] hover:bg-[#f7f0f5]"
            onClick={() => setIsSelectionMode(!isSelectionMode)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="border-[#f0f0f0] text-[#a8d1b2] hover:text-[#90b096] hover:bg-[#f0f7f2]"
            onClick={() => setIsDataEvaluationOpen(true)}
          >
            <LineChartIcon className="h-4 w-4 mr-2" />
            数据评估
          </Button>
          <Button
            className="bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] hover:opacity-90"
            onClick={() => setIsCreateDatasetOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            新建数据库
          </Button>
          {isSelectionMode && (
            <Button
              variant="outline"
              className="border-[#f0f0f0] text-[#d1a8c4] hover:text-[#b092a6] hover:bg-[#f7f0f5]"
              onClick={handleBatchDownload}
              disabled={selectedDatasetIds.length === 0}
            >
              下载已选 ({selectedDatasetIds.length})
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleDatasets.map((dataset) => (
          <Card
            key={dataset.id}
            className="group relative overflow-hidden bg-white border-[#f0f0f0] hover:shadow-lg transition-all duration-300"
          >
            {isSelectionMode && (
              <div
                className="absolute top-3 left-3 z-10 bg-white rounded-full p-1 shadow-md"
                onClick={(e) => handleToggleSelection(dataset.id, e)}
              >
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    selectedDatasetIds.includes(dataset.id) ? "border-[#d1a8c4] bg-[#d1a8c4]" : "border-gray-300"
                  }`}
                >
                  {selectedDatasetIds.includes(dataset.id) && <Check className="h-3 w-3 text-white" />}
                </div>
              </div>
            )}
            <div className="absolute top-3 right-3 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white opacity-0 group-hover:opacity-100 hover:bg-white/20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <label className="cursor-pointer w-full">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, dataset.id)}
                      />
                      更换封面图片
                    </label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>编辑数据库</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">删除数据库</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div
              className="h-40 overflow-hidden cursor-pointer group relative"
              onClick={() => handleDatasetClick(dataset)}
            >
              <img
                src={customImages[dataset.id] || dataset.image || "/placeholder.svg?text=📚"}
                alt={dataset.title}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:blur-[2px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  点击查看详情
                </span>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-lg text-[#2d3748]">{dataset.title}</CardTitle>
              <p className="text-sm text-[#718096]">{dataset.description}</p>
            </CardHeader>

            <CardContent>
              <div className="flex justify-between text-sm">
                <span className="text-[#a8b2d1]">样本数: {dataset.samples}</span>
                <span className="text-[#d1a8c4]">质量评分: {dataset.quality}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 数据集详情对话框保持不变 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedDataset?.title}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList>
              <TabsTrigger value="preview">数据库预览</TabsTrigger>
              <TabsTrigger value="visualize">数据库可视化</TabsTrigger>
              <TabsTrigger value="clean">数据库清理</TabsTrigger>
            </TabsList>

            <TabsContent value="preview">
              <Card>
                <CardContent className="p-4">
                  <Textarea
                    value={previewData}
                    onChange={(e) => setPreviewData(e.target.value)}
                    className="min-h-[300px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visualize">
              <Card>
                <CardContent className="p-4 space-y-6">
                  <div className="h-[200px]">
                    <BarChart width={600} height={200} data={qualityMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </div>
                  <div className="h-[200px]">
                    <LineChart width={600} height={200} data={sampleDatasets}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="quality" stroke="#8884d8" />
                    </LineChart>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clean">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">数据库清理工具</h3>
                    <div className="flex gap-2">
                      <Button variant="outline">删除重复数据库</Button>
                      <Button variant="outline">填充缺失值</Button>
                      <Button variant="outline">标准化</Button>
                      <Button variant="outline">异常值检测</Button>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">清理日志将在这里显示...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* 新建数据集对话框 */}
      <CreateDatasetDialog open={isCreateDatasetOpen} onOpenChange={setIsCreateDatasetOpen} />
      <DataEvaluationDialog open={isDataEvaluationOpen} onOpenChange={setIsDataEvaluationOpen} />
    </div>
  )
}

