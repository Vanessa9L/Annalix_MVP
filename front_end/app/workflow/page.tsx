import WorkflowEditor from "../components/workflow-editor"
import { ModelProvider } from "../components/model-provider"

export default function WorkflowPage() {
  return (
    <div className="h-screen w-full">
      <ModelProvider>
        <WorkflowEditor />
      </ModelProvider>
    </div>
  )
}

