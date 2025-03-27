"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const settingsMenu = [
  {
    id: "notification",
    label: "通知设置",
    content: (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>训练完成通知</Label>
            <div className="text-sm text-muted-foreground">模型训练完成时发送通知</div>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>错误提醒</Label>
            <div className="text-sm text-muted-foreground">发生错误时发送通知</div>
          </div>
          <Switch />
        </div>
      </div>
    ),
  },
  {
    id: "theme",
    label: "主题设置",
    content: (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>主题模式</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="选择主题模式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">浅色</SelectItem>
              <SelectItem value="dark">深色</SelectItem>
              <SelectItem value="system">跟随系统</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>主题色</Label>
          <div className="grid grid-cols-5 gap-2">
            {["#a8b2d1", "#d1a8c4", "#a8d1b2", "#d1c4a8", "#c4a8d1"].map((color) => (
              <div
                key={color}
                className="h-8 rounded-md cursor-pointer ring-offset-background transition-all hover:scale-105 hover:ring-2 hover:ring-ring hover:ring-offset-2"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "language",
    label: "语言设置",
    content: (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>界面语言</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="选择语言" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    ),
  },
]

export function SettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedSetting, setSelectedSetting] = useState(settingsMenu[0])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0">
        <div className="grid grid-cols-[200px_1fr]">
          <ScrollArea className="h-[500px] border-r">
            <div className="p-4 space-y-2">
              {settingsMenu.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn("w-full justify-start", selectedSetting.id === item.id && "bg-muted")}
                  onClick={() => setSelectedSetting(item)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </ScrollArea>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">{selectedSetting.label}</h2>
            {selectedSetting.content}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

