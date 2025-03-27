import { MembershipPlans } from "../components/membership-plans"
import { ModelProvider } from "../components/model-provider"

export default function MembershipPage() {
  return (
    <div className="container mx-auto py-6">
      <ModelProvider>
        <MembershipPlans />
      </ModelProvider>
    </div>
  )
}

