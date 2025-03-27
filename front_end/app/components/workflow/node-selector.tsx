"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface NodeItem {
  id: string
  label: string
  description: string
  icon: LucideIcon
  data: any
}

interface NodeTypeCategory {
  type: string
  category: string
  items: NodeItem[]
}

interface NodeSelectorProps {
  nodeTypes: NodeTypeCategory[]
  onAddNode: (nodeType: string, nodeData: any) => void
  className?: string
}

export function NodeSelector({ nodeTypes, onAddNode, className }: NodeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNodeTypes = nodeTypes
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0)

  return (
    <div className={cn("space-y-6 pb-4", className)}>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索节点..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <Accordion type="multiple" defaultValue={nodeTypes.map((type) => type.category)}>
        {filteredNodeTypes.map((category) => (
          <AccordionItem key={category.category} value={category.category}>
            <AccordionTrigger className="text-sm">{category.category}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                {category.items.map((item) => (
                  <div key={item.id} className="overflow-hidden">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => onAddNode(category.type, item.data)}
                    >
                      <div className="flex items-start gap-2">
                        <item.icon className="h-5 w-5 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

