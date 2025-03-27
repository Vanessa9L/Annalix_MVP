"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Edit2 } from "lucide-react"

type LogEntry = {
  id: string
  timestamp: string
  operation: string
  type: "model" | "data" | "training" | "deployment" | "system"
  details: string
  status: "success" | "warning" | "error"
}

const sampleLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-02-25 14:30",
    operation: "模型训练",
    type: "training",
    details: "启动客服助手-v1模型训练",
    status: "success",
  },
  {
    id: "2",
    timestamp: "2024-02-25 13:15",
    operation: "数据上传",
    type: "data",
    details: "上传对话数据集(2.5GB)",
    status: "success",
  },
  {
    id: "3",
    timestamp: "2024-02-25 12:00",
    operation: "模型部署",
    type: "deployment",
    details: "部署法律顾问-v2到生产环境",
    status: "warning",
  },
  {
    id: "4",
    timestamp: "2024-02-25 11:30",
    operation: "系统配置",
    type: "system",
    details: "更新API密钥",
    status: "success",
  },
  {
    id: "5",
    timestamp: "2024-02-25 10:45",
    operation: "模型删除",
    type: "model",
    details: "删除测试模型",
    status: "error",
  },
]

export function OpLogsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [logs, setLogs] = useState<LogEntry[]>(sampleLogs)

  const filteredLogs = logs.filter(
    (log) =>
      log.operation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: LogEntry["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "model":
        return "bg-purple-100 text-purple-800"
      case "data":
        return "bg-blue-100 text-blue-800"
      case "training":
        return "bg-indigo-100 text-indigo-800"
      case "deployment":
        return "bg-green-100 text-green-800"
      case "system":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleEditLog = (log: LogEntry) => {
    // Here you would typically open a form to edit the log
    console.log("Editing log:", log)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>操作日志</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="搜索操作记录..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              按日期筛选
            </Button>
          </div>

          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.operation}</span>
                        <Badge variant="secondary" className={getTypeColor(log.type)}>
                          {log.type}
                        </Badge>
                        <Badge variant="secondary" className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{log.details}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">{log.timestamp}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleEditLog(log)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

