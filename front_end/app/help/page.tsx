import HelpCenter from "../components/help-center"
import { ModelProvider } from "../components/model-provider"

export default function HelpPage() {
  return (
    <div className="container mx-auto py-6">
      <ModelProvider>
        <HelpCenter />
      </ModelProvider>
    </div>
  )
}

