import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Wrench, Settings, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export const ToolNode = memo(({ data, selected }: NodeProps) => {
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
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#d1c4a8] to-[#c0b090] flex items-center justify-center">
          <Wrench className="h-4 w-4 text-white" />
        </div>
        <div className="font-medium truncate flex-1">{data.label}</div>
        <Badge variant="outline" className="bg-[#f7f5f0] text-[#b0a690] text-xs font-medium">
          工具
        </Badge>
      </div>

      <div className="text-xs text-slate-600 mb-3 bg-amber-50 p-2 rounded-lg">
        <div className="flex items-center gap-1 mb-1">
          <Sparkles className="h-3 w-3 text-amber-500" />
          <span className="font-medium">描述</span>
        </div>
        {data.description}
      </div>

      {data.parameters && data.parameters.length > 0 && (
        <div className="space-y-1 border-t pt-2">
          <div className="flex items-center gap-1 mb-1 text-xs">
            <Settings className="h-3 w-3" />
            <span className="font-medium">参数</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg">
            {data.parameters.map((param: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-xs mb-1 last:mb-0">
                <span className="text-muted-foreground">{param.name}</span>
                <Badge variant="outline" className="text-xs h-5 bg-white">
                  {param.type}
                  {param.required && "*"}
                </Badge>
              </div>
            ))}
          </div>
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

ToolNode.displayName = "ToolNode"

