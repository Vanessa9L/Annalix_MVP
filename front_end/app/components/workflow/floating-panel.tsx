"use client"

import type { ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FloatingPanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  position?: "left" | "right"
  width?: string
}

export function FloatingPanel({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
  width = "400px",
}: FloatingPanelProps) {
  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-300 ease-in-out",
        position === "right" ? "right-0 top-0" : "left-0 top-0",
        isOpen
          ? "translate-x-0 opacity-100"
          : position === "right"
            ? "translate-x-full opacity-0"
            : "-translate-x-full opacity-0",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      style={{ width }}
    >
      <Card className="h-screen border-l rounded-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100vh-60px)] overflow-auto">{children}</CardContent>
      </Card>
    </div>
  )
}

