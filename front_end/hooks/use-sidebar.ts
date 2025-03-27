import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SidebarState {
  isExpanded: boolean
  isAutoCollapsed: boolean
  toggle: () => void
  setExpanded: (expanded: boolean) => void
  setAutoCollapsed: (collapsed: boolean) => void
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      isExpanded: true,
      isAutoCollapsed: false,
      toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
      setExpanded: (expanded) => set({ isExpanded: expanded }),
      setAutoCollapsed: (collapsed) => set({ isAutoCollapsed: collapsed }),
    }),
    {
      name: "sidebar-state",
    },
  ),
)

