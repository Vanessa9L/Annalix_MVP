import { memo } from "react"
import { type EdgeProps, getSmoothStepPath, BaseEdge } from "reactflow"

export const CustomEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    markerEnd,
    selected,
  }: EdgeProps) => {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 16,
    })

    return (
      <>
        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd={markerEnd}
          style={{
            ...style,
            strokeWidth: selected ? 3 : 2,
            stroke: selected ? "url(#edge-gradient-selected)" : "url(#edge-gradient)",
            strokeDasharray: data?.dashed ? "5,5" : undefined,
            animation: data?.animated ? "flow 30s linear infinite" : undefined,
            cursor: "pointer",
          }}
          className="react-flow__edge-path transition-all duration-300 hover:stroke-[3px]"
        />
        {data?.label && (
          <foreignObject
            width={100}
            height={24}
            x={labelX - 50}
            y={labelY - 12}
            className="overflow-visible flex items-center justify-center"
          >
            <div
              className={`bg-white text-xs px-2 py-1 rounded-md border shadow-sm text-center ${
                selected ? "border-primary ring-2 ring-primary ring-opacity-20" : ""
              }`}
            >
              {data.label}
            </div>
          </foreignObject>
        )}
      </>
    )
  },
)

CustomEdge.displayName = "CustomEdge"

