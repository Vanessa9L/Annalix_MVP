import FineTuningStudio from "../components/fine-tuning-studio"
import { ModelProvider } from "../components/model-provider"

export default function FineTuningPage() {
  return (
    <div className="container mx-auto py-6">
      <ModelProvider>
        <FineTuningStudio />
      </ModelProvider>
    </div>
  )
}

