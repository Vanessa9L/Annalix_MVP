"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

type Provider = {
  id: string
  name: string
  modelName: string
  baseUrl: string
  modelType: "chat" | "completion" | "embedding"
  contextLength: number
  maxTokens: number
  supportsVision: boolean
  supportsFunctionCalling: boolean
}

const providers: Provider[] = [
  {
    id: "ollama",
    name: "Ollama",
    modelName: "",
    baseUrl: "http://localhost:11434",
    modelType: "chat",
    contextLength: 4096,
    maxTokens: 2048,
    supportsVision: false,
    supportsFunctionCalling: false,
  },
]

export function AddProviderDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [modelName, setModelName] = useState("")
  const [baseUrl, setBaseUrl] = useState("http://localhost:11434")
  const [modelType, setModelType] = useState<"chat" | "completion" | "embedding">("chat")
  const [contextLength, setContextLength] = useState(4096)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [supportsVision, setSupportsVision] = useState(false)
  const [supportsFunctionCalling, setSupportsFunctionCalling] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 这里添加供应商的逻辑
    onOpenChange(false)
    // 重置表单
    setModelName("")
    setBaseUrl("http://localhost:11434")
    setModelType("chat")
    setContextLength(4096)
    setMaxTokens(2048)
    setSupportsVision(false)
    setSupportsFunctionCalling(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加 Ollama</DialogTitle>
          <DialogDescription>目前仅支持 Ollama 集成。更多 LLM 供应商支持将在后续版本中添加。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>模型名称</Label>
            <Input
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="例如: llama2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>基础 URL</Label>
            <Input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="http://localhost:11434"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>模型类型</Label>
            <Select value={modelType} onValueChange={setModelType} required>
              <SelectTrigger>
                <SelectValue placeholder="选择模型类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chat">对话模型</SelectItem>
                <SelectItem value="completion">补全模型</SelectItem>
                <SelectItem value="embedding">嵌入模型</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>上下文长度</Label>
            <Input
              type="number"
              value={contextLength}
              onChange={(e) => setContextLength(Number(e.target.value))}
              placeholder="4096"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>最大 Token 上限</Label>
            <Input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              placeholder="2048"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="vision" checked={supportsVision} onCheckedChange={setSupportsVision} />
            <Label htmlFor="vision">支持视觉能力</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="function-calling"
              checked={supportsFunctionCalling}
              onCheckedChange={setSupportsFunctionCalling}
            />
            <Label htmlFor="function-calling">支持函数调用</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">添加</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

