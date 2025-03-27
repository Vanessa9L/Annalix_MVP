"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Share2, MoreVertical, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddProviderDialog } from "./add-provider-dialog"
import { useRouter } from "next/navigation"

type Provider = {
  id: string
  name: string
  apiKey: string
  baseUrl?: string
  status: "active" | "inactive"
  models: string[]
}

type FineTunedModel = {
  id: string
  name: string
  baseModel: string
  method: string
  trainedAt: string
  status: "ready" | "training" | "failed"
  performance: {
    accuracy: number
    loss: number
  }
}

const sampleProviders: Provider[] = [
  {
    id: "1",
    name: "Ollama",
    apiKey: "not-required",
    status: "active",
    models: ["llama3", "mistral", "codellama", "deepseek"],
  },
]

const sampleModels: FineTunedModel[] = [
  {
    id: "1",
    name: "客服助手-v1",
    baseModel: "LLaMA-7B",
    method: "LoRA",
    trainedAt: "2024-02-25",
    status: "ready",
    performance: {
      accuracy: 0.92,
      loss: 0.08,
    },
  },
  {
    id: "2",
    name: "法律顾问-v2",
    baseModel: "ChatGLM-6B",
    method: "QLoRA",
    trainedAt: "2024-02-24",
    status: "ready",
    performance: {
      accuracy: 0.89,
      loss: 0.11,
    },
  },
]

export function MyModelsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [providers, setProviders] = useState<Provider[]>(sampleProviders)
  const [models, setModels] = useState<FineTunedModel[]>(sampleModels)
  const [editingModel, setEditingModel] = useState<FineTunedModel | null>(null)
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false)
  const router = useRouter()

  const handleEditName = (model: FineTunedModel, newName: string) => {
    setModels(models.map((m) => (m.id === model.id ? { ...m, name: newName } : m)))
  }

  const handleDeleteModel = (modelId: string) => {
    setModels(models.filter((m) => m.id !== modelId))
  }

  const handleDeleteProvider = (providerId: string) => {
    setProviders(providers.filter((p) => p.id !== providerId))
  }

  const getStatusColor = (status: FineTunedModel["status"] | Provider["status"]) => {
    switch (status) {
      case "ready":
      case "active":
        return "bg-green-100 text-green-800"
      case "training":
        return "bg-blue-100 text-blue-800"
      case "failed":
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>模型管理</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="providers">
          <TabsList>
            <TabsTrigger value="providers">模型供应商</TabsTrigger>
            <TabsTrigger value="finetuned">微调模型</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-4">
            <div className="flex justify-between items-center">
              <Input placeholder="搜索供应商..." className="max-w-sm" />
              <Button onClick={() => setIsAddProviderOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                添加供应商
              </Button>
            </div>

            <div className="grid gap-4">
              {providers.map((provider) => (
                <Card key={provider.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">{provider.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={getStatusColor(provider.status)}>
                        {provider.status === "active" ? "已连接" : "未连接"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit2 className="h-4 w-4 mr-2" />
                            编辑配置
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteProvider(provider.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">可用模型：</div>
                      <div className="flex flex-wrap gap-2">
                        {provider.models.map((model) => (
                          <Badge key={model} variant="outline">
                            {model}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="finetuned" className="space-y-4">
            <div className="flex justify-between items-center">
              <Input placeholder="搜索模型..." className="max-w-sm" />
              <Button onClick={() => router.push("/training")}>
                <Plus className="h-4 w-4 mr-2" />
                新建模型
              </Button>
            </div>

            <div className="grid gap-4">
              {models.map((model) => (
                <Card key={model.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      {editingModel?.id === model.id ? (
                        <Input
                          value={editingModel.name}
                          onChange={(e) => setEditingModel({ ...editingModel, name: e.target.value })}
                          onBlur={() => {
                            handleEditName(model, editingModel.name)
                            setEditingModel(null)
                          }}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleEditName(model, editingModel.name)
                              setEditingModel(null)
                            }
                          }}
                          className="max-w-[200px]"
                        />
                      ) : (
                        model.name
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={getStatusColor(model.status)}>
                        {model.status === "ready" && "已就绪"}
                        {model.status === "training" && "训练中"}
                        {model.status === "failed" && "失败"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingModel(model)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            重命名
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            分享
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteModel(model.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">基础模型</Label>
                        <div>{model.baseModel}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">训练方法</Label>
                        <div>{model.method}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">训练时间</Label>
                        <div>{model.trainedAt}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">模型性能</Label>
                        <div className="flex gap-4">
                          <span>准确率: {(model.performance.accuracy * 100).toFixed(1)}%</span>
                          <span>损失: {model.performance.loss.toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>

      <AddProviderDialog open={isAddProviderOpen} onOpenChange={setIsAddProviderOpen} />
    </Dialog>
  )
}

