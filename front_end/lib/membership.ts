export type MembershipTier = {
  id: string
  name: string
  price: number
  period: "monthly" | "yearly"
  features: string[]
  limits: {
    modelsCount: number
    datasetSize: number
    apiCalls: number
    teamMembers?: number
  }
  color: string
}

export const membershipTiers: MembershipTier[] = [
  {
    id: "free",
    name: "免费版",
    price: 0,
    period: "monthly",
    features: ["基础模型训练功能", "最多3个数据库", "社区支持", "基础API访问"],
    limits: {
      modelsCount: 2,
      datasetSize: 100, // MB
      apiCalls: 1000,
    },
    color: "bg-gray-100",
  },
  {
    id: "pro",
    name: "专业版",
    price: 199,
    period: "monthly",
    features: [
      "高级模型训练功能",
      "无限数据库",
      "优先技术支持",
      "高级API访问",
      "自定义模型部署",
      "团队协作（最多5人）",
    ],
    limits: {
      modelsCount: 10,
      datasetSize: 1000, // MB
      apiCalls: 10000,
      teamMembers: 5,
    },
    color: "bg-blue-100",
  },
  {
    id: "enterprise",
    name: "企业版",
    price: 999,
    period: "monthly",
    features: ["全部高级功能", "无限制使用", "24/7专属支持", "企业级API", "私有化部署", "无限团队成员", "定制化服务"],
    limits: {
      modelsCount: -1, // unlimited
      datasetSize: -1, // unlimited
      apiCalls: -1, // unlimited
      teamMembers: -1, // unlimited
    },
    color: "bg-purple-100",
  },
]

