import ExamplesGallery from "../components/examples-gallery"
import { ModelProvider } from "../components/model-provider"

export default function ExamplesPage() {
  return (
    <div className="container mx-auto py-6">
      <ModelProvider>
        <ExamplesGallery />
      </ModelProvider>
    </div>
  )
}

