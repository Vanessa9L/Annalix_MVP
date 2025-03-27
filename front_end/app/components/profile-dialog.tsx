"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"

type ProfileData = {
  name: string
  email: string
  avatar: string
  title: string
  bio: string
}

export function ProfileDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [profile, setProfile] = useState<ProfileData>({
    name: "用户名",
    email: "user@example.com",
    avatar: "/placeholder.svg?text=ME",
    title: "AI 研究员",
    bio: "专注于大语言模型训练与优化",
  })

  const handleSave = () => {
    // Here you would typically save the profile data to your backend
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>个人信息</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 rounded-full bg-primary p-2 text-primary-foreground shadow-sm cursor-pointer hover:bg-primary/90"
              >
                <Camera className="h-4 w-4" />
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" />
              </label>
            </div>
            <div className="flex-1 space-y-2">
              <div className="space-y-1">
                <Label>用户名</Label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>邮箱</Label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label>职位</Label>
            <Input value={profile.title} onChange={(e) => setProfile((prev) => ({ ...prev, title: e.target.value }))} />
          </div>

          <div className="space-y-1">
            <Label>个人简介</Label>
            <Input value={profile.bio} onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))} />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

