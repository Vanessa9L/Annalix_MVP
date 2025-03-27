"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type ModelConfig = {
  provider: string
  apiKey: string
  baseUrl?: string
  modelName?: string
}

type ModelContextType = {
  models: ModelConfig[]
  addModel: (model: ModelConfig) => void
  selectedModel: ModelConfig | null
  setSelectedModel: (model: ModelConfig | null) => void
}

const ModelContext = createContext<ModelContextType | undefined>(undefined)

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [models, setModels] = useState<ModelConfig[]>([])
  const [selectedModel, setSelectedModel] = useState<ModelConfig | null>(null)

  const addModel = (model: ModelConfig) => {
    setModels((prev) => [...prev, model])
  }

  return (
    <ModelContext.Provider value={{ models, addModel, selectedModel, setSelectedModel }}>
      {children}
    </ModelContext.Provider>
  )
}

export function useModel() {
  const context = useContext(ModelContext)
  if (!context) {
    throw new Error("useModel must be used within a ModelProvider")
  }
  return context
}

