"use client"

import type { Node } from "reactflow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Trash2 } from "lucide-react"
import { useModel } from "@/app/components/model-provider"

interface NodePropertiesProps {
  node: Node
  updateNodeProperties: (newData: any) => void
  deleteNode: () => void
}

export function NodeProperties({ node, updateNodeProperties, deleteNode }: NodePropertiesProps) {
  const isLLMNode = node.type === "llmNode"
  const isToolNode = node.type === "toolNode"
  const { models } = useModel()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{node.data.label}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={deleteNode}
          className="text-[#c4a59e] hover:text-[#b08e86] hover:bg-[#f9f0ee] border-[#e8d8d4]"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          删除
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="node-label">节点名称</Label>
          <Input
            id="node-label"
            value={node.data.label}
            onChange={(e) => updateNodeProperties({ label: e.target.value })}
          />
        </div>

        {isLLMNode && (
          <>
            <div className="space-y-2">
              <Label htmlFor="model">模型</Label>
              <Select value={node.data.model} onValueChange={(value) => updateNodeProperties({ model: value })}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  {models.length > 0 ? (
                    models.map((model) => (
                      <SelectItem key={model.provider} value={model.provider}>
                        {model.provider}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-models" disabled>
                      没有可用的模型
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {models.length === 0 && <p className="text-xs text-amber-500">请先在"我的模型"中添加模型</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="temperature">温度</Label>
                <span className="text-sm text-muted-foreground">{node.data.temperature}</span>
              </div>
              <Slider
                id="temperature"
                min={0}
                max={2}
                step={0.1}
                value={[node.data.temperature]}
                onValueChange={([value]) => updateNodeProperties({ temperature: value })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="max-tokens">最大 Token</Label>
                <span className="text-sm text-muted-foreground">{node.data.maxTokens}</span>
              </div>
              <Slider
                id="max-tokens"
                min={1}
                max={8192}
                step={1}
                value={[node.data.maxTokens]}
                onValueChange={([value]) => updateNodeProperties({ maxTokens: value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="system-prompt">系统提示词</Label>
              <Textarea
                id="system-prompt"
                value={node.data.systemPrompt}
                onChange={(e) => updateNodeProperties({ systemPrompt: e.target.value })}
                rows={4}
              />
            </div>
          </>
        )}

        {isToolNode && (
          <>
            <div className="space-y-2">
              <Label htmlFor="tool-type">工具类型</Label>
              <Select value={node.data.toolType} onValueChange={(value) => updateNodeProperties({ toolType: value })}>
                <SelectTrigger id="tool-type">
                  <SelectValue placeholder="选择工具类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="search">网络搜索</SelectItem>
                  <SelectItem value="code">代码执行器</SelectItem>
                  <SelectItem value="calculator">计算器</SelectItem>
                  <SelectItem value="weather">天气查询</SelectItem>
                  <SelectItem value="calendar">日历</SelectItem>
                  <SelectItem value="data-analysis">数据分析</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tool-description">工具描述</Label>
              <Textarea
                id="tool-description"
                value={node.data.description}
                onChange={(e) => updateNodeProperties({ description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>参数</Label>
              {node.data.parameters &&
                node.data.parameters.map((param: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <Input
                      value={param.name}
                      onChange={(e) => {
                        const newParams = [...node.data.parameters]
                        newParams[index] = { ...param, name: e.target.value }
                        updateNodeProperties({ parameters: newParams })
                      }}
                      placeholder="参数名称"
                      className="flex-1"
                    />
                    <Select
                      value={param.type}
                      onValueChange={(value) => {
                        const newParams = [...node.data.parameters]
                        newParams[index] = { ...param, type: value }
                        updateNodeProperties({ parameters: newParams })
                      }}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">字符串</SelectItem>
                        <SelectItem value="number">数字</SelectItem>
                        <SelectItem value="boolean">布尔值</SelectItem>
                        <SelectItem value="object">对象</SelectItem>
                        <SelectItem value="array">数组</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        const newParams = node.data.parameters.filter((_: any, i: number) => i !== index)
                        updateNodeProperties({ parameters: newParams })
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  const newParams = [...(node.data.parameters || []), { name: "", type: "string", required: false }]
                  updateNodeProperties({ parameters: newParams })
                }}
              >
                添加参数
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

