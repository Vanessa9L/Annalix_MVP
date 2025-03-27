"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Settings,
  BookOpen,
  ChevronLeft,
  Sliders,
  Cpu,
  GitGraphIcon as GitFlow,
  Box,
  User,
  LogOut,
  HelpCircle,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SettingsDialog } from "./settings-dialog"
import { ProfileDialog } from "./profile-dialog"
import { MyModelsDialog } from "./my-models-dialog"
import { OpLogsDialog } from "./op-logs-dialog"
import { useSidebar } from "@/hooks/use-sidebar"
import { useWindowSize } from "@/hooks/use-window-size"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navigation = [
  {
    name: "微调工作室",
    href: "/fine-tuning",
    icon: Cpu,
    color: "text-[#a8b2d1] hover:text-[#8892b0]",
    bgColor: "hover:bg-[#f0f1f7]",
    description: "使用 QLoRA 等技术在消费者 GPU 上进行资源优化的微调",
  },
  {
    name: "工作流画布",
    href: "/workflow",
    icon: GitFlow,
    color: "text-[#d1a8c4] hover:text-[#b092a6]",
    bgColor: "hover:bg-[#f7f0f5]",
    description: "用于将 LLM 与外部工具连接起来的可视化拖放界面",
  },
  {
    name: "部署和打包",
    href: "/deployment",
    icon: Box,
    color: "text-[#a8d1b2] hover:text-[#90b096]",
    bgColor: "hover:bg-[#f0f7f2]",
    description: "跨平台一键式桌面部署",
  },
]

// Breakpoint for auto-collapsing sidebar
const COLLAPSE_BREAKPOINT = 1024 // lg breakpoint

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [selected, setSelected] = useState(pathname)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isModelsOpen, setIsModelsOpen] = useState(false)
  const [isOpLogsOpen, setIsOpLogsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { width } = useWindowSize()
  const { isExpanded, isAutoCollapsed, toggle, setExpanded, setAutoCollapsed } = useSidebar()

  // Handle responsive behavior
  useEffect(() => {
    if (width !== undefined) {
      const shouldCollapse = width < COLLAPSE_BREAKPOINT
      setAutoCollapsed(shouldCollapse)
      if (shouldCollapse !== isAutoCollapsed) {
        setExpanded(!shouldCollapse)
      }
    }
  }, [width, setAutoCollapsed, setExpanded, isAutoCollapsed])

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const effectivelyExpanded = isExpanded && !isAutoCollapsed

  return (
    <>
      <aside
        className={cn(
          "group/sidebar fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-[#f0f0f0] bg-white transition-all duration-300 ease-in-out",
          effectivelyExpanded ? "w-64" : "w-[70px]",
        )}
      >
        {/* Header with Logo */}
        <div
          className={cn(
            "flex h-16 items-center gap-3 border-b border-[#f0f0f0] px-4",
            effectivelyExpanded ? "justify-between" : "justify-center",
          )}
        >
          <button
            onClick={toggle}
            className="flex items-center gap-3 focus:outline-none"
            aria-label={effectivelyExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <div className="relative flex items-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/annalix-BcZhCRHbSZtpzgUKmfaSjpWUXwIjWp.svg"
                alt="Annalix Logo"
                width={32}
                height={32}
                className="size-8 transition-transform duration-300 ease-in-out hover:scale-105"
              />
              {effectivelyExpanded && (
                <span className="ml-2 text-lg font-semibold bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] bg-clip-text text-transparent">
                  Annalix
                </span>
              )}
            </div>
          </button>
          {effectivelyExpanded && !isAutoCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover/sidebar:opacity-100"
              onClick={toggle}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2 no-scrollbar">
          <TooltipProvider delayDuration={0}>
            {navigation.map((item) => (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <div
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 font-normal",
                        item.color,
                        item.bgColor,
                        selected === item.href ? "bg-gray-50" : "transparent",
                        !effectivelyExpanded && "justify-center px-2",
                      )}
                      onClick={() => {
                        setSelected(item.href)
                        router.push(item.href)
                      }}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {effectivelyExpanded && <span>{item.name}</span>}
                    </Button>
                    {effectivelyExpanded && hoveredItem === item.name && (
                      <div className="absolute left-full top-0 ml-2 w-48 rounded-md bg-white p-2 shadow-lg border border-gray-100 z-50">
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                {!effectivelyExpanded && (
                  <TooltipContent side="right" sideOffset={20} className="flex flex-col gap-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-[#f0f0f0] p-2">
          <TooltipProvider delayDuration={0}>
            <div className="space-y-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-[#b2a8d1] hover:text-[#968db0] hover:bg-[#f5f0f7]",
                      !effectivelyExpanded && "justify-center px-2",
                    )}
                    onClick={() => router.push("/documentation")}
                  >
                    <BookOpen className="h-5 w-5 shrink-0" />
                    {effectivelyExpanded && <span>文档</span>}
                  </Button>
                </TooltipTrigger>
                {!effectivelyExpanded && (
                  <TooltipContent side="right" sideOffset={20}>
                    文档
                  </TooltipContent>
                )}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-[#d1c4a8] hover:text-[#b0a690] hover:bg-[#f7f5f0]",
                      !effectivelyExpanded && "justify-center px-2",
                    )}
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    <Settings className="h-5 w-5 shrink-0" />
                    {effectivelyExpanded && <span>设置</span>}
                  </Button>
                </TooltipTrigger>
                {!effectivelyExpanded && (
                  <TooltipContent side="right" sideOffset={20}>
                    设置
                  </TooltipContent>
                )}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-[#a8c4d1] hover:text-[#90a6b0] hover:bg-[#f0f5f7]",
                      !effectivelyExpanded && "justify-center px-2",
                    )}
                    onClick={() => router.push("/help")}
                  >
                    <HelpCircle className="h-5 w-5 shrink-0" />
                    {effectivelyExpanded && <span>帮助</span>}
                  </Button>
                </TooltipTrigger>
                {!effectivelyExpanded && (
                  <TooltipContent side="right" sideOffset={20}>
                    帮助
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        {/* User Menu */}
        <div className="border-t border-[#f0f0f0] p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full gap-3 hover:bg-[#fafafa]",
                  effectivelyExpanded ? "justify-start" : "justify-center px-2",
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?text=ME" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                {effectivelyExpanded && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">用户名</span>
                    <span className="text-xs text-muted-foreground">user@example.com</span>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={effectivelyExpanded ? "end" : "center"} className="w-56">
              <DropdownMenuLabel>我的帐户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                <User className="h-4 w-4 mr-2" />
                个人信息
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsModelsOpen(true)}>
                <Sliders className="h-4 w-4 mr-2" />
                模型管理
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      <div
        className={cn("fixed inset-0 z-40 bg-black/80 lg:hidden", effectivelyExpanded ? "block" : "hidden")}
        onClick={() => setExpanded(false)}
      />

      {/* Dialogs */}
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
      <MyModelsDialog open={isModelsOpen} onOpenChange={setIsModelsOpen} />
      <OpLogsDialog open={isOpLogsOpen} onOpenChange={setIsOpLogsOpen} />
    </>
  )
}

