import DeploymentPackaging from "../components/deployment-packaging"
import { ModelProvider } from "../components/model-provider"

export default function DeploymentPage() {
  return (
    <div className="container mx-auto py-6">
      <ModelProvider>
        <DeploymentPackaging />
      </ModelProvider>
    </div>
  )
}

