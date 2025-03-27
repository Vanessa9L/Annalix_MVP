import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Bot, MessageSquare, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export const LLMNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={cn(
        "px-4 py-3 rounded-xl border bg-white shadow-sm w-[240px] transition-all duration-200",
        "hover:shadow-md hover:border-primary/40 hover:translate-y-[-2px]",
        selected ? "border-primary ring-2 ring-primary ring-opacity-20" : "border-border",
      )}
    >
      {/* Top handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary/80 hover:bg-primary hover:w-4 hover:h-4 transition-all"
        style={{ top: -6, borderRadius: "6px" }}
        isConnectable={true}
        id="top"
      />

      {/* Left handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary/80 hover:bg-primary hover:w-4 hover:h-4 transition-all"
        style={{ left: -6, borderRadius: "6px" }}
        isConnectable={true}
        id="left"
      />

      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#a8c4d1] to-[#90b0c0] flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="font-medium truncate flex-1">{data.label}</div>
        <Badge variant="outline" className="bg-[#f0f5f7] text-[#90a6b0] text-xs font-medium">
          LLM
        </Badge>
      </div>

      <div className="space-y-2 mb-3 bg-slate-50 p-2 rounded-lg">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            模型
          </span>
          <span className="font-medium">{data.model}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">温度</span>
          <span className="font-medium">{data.temperature}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">最大 Token</span>
          <span className="font-medium">{data.maxTokens}</span>
        </div>
      </div>

      {data.systemPrompt && (
        <div className="text-xs text-muted-foreground mt-2 border-t pt-2">
          <div className="flex items-center gap-1 mb-1">
            <MessageSquare className="h-3 w-3" />
            <span>系统提示词</span>
          </div>
          <div className="truncate max-w-full text-slate-600">{data.systemPrompt}</div>
        </div>
      )}

      {/* Right handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary/80 hover:bg-primary hover:w-4 hover:h-4 transition-all"
        style={{ right: -6, borderRadius: "6px" }}
        isConnectable={true}
        id="right"
      />

      {/* Bottom handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary/80 hover:bg-primary hover:w-4 hover:h-4 transition-all"
        style={{ bottom: -6, borderRadius: "6px" }}
        isConnectable={true}
        id="bottom"
      />
    </div>
  )
})

LLMNode.displayName = "LLMNode"

