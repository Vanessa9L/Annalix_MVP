"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import type { MembershipTier } from "@/lib/membership"
import { membershipTiers } from "@/lib/membership"

type UserContextType = {
  user: {
    id: string
    name: string
    email: string
    avatar: string
    membershipTier: MembershipTier
  } | null
  setUser: (user: UserContextType["user"]) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserContextType["user"]>({
    id: "1",
    name: "测试用户",
    email: "test@example.com",
    avatar: "/placeholder.svg?text=ME",
    membershipTier: membershipTiers[0], // Free tier by default
  })

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

