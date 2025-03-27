import ModelTraining from "../components/model-training"
import { ModelProvider } from "../components/model-provider"

export default function TrainingPage() {
  return (
    <div className="container mx-auto py-6">
      <ModelProvider>
        <ModelTraining />
      </ModelProvider>
    </div>
  )
}

