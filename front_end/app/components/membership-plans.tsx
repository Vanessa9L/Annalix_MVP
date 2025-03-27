"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, Crown, Shield, Zap } from "lucide-react"
import { membershipTiers } from "@/lib/membership"
import { cn } from "@/lib/utils"

export function MembershipPlans() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")

  const getYearlyPrice = (monthlyPrice: number) => {
    return Math.floor(monthlyPrice * 10) // 10 months for annual billing
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">会员方案</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          选择适合您需求的会员方案，开启AI模型训练之旅。所有方案均可随时升级或降级。
        </p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Label htmlFor="billing-period">按月付费</Label>
        <Switch
          id="billing-period"
          checked={billingPeriod === "yearly"}
          onCheckedChange={(checked) => setBillingPeriod(checked ? "yearly" : "monthly")}
        />
        <Label htmlFor="billing-period" className="flex items-center gap-2">
          按年付费
          <Badge variant="secondary" className="font-normal">
            省17%
          </Badge>
        </Label>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {membershipTiers.map((tier) => (
          <Card
            key={tier.id}
            className={cn("relative", tier.id === "pro" && "border-blue-200 shadow-blue-100/50 shadow-lg")}
          >
            {tier.id === "pro" && (
              <Badge
                className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600"
                variant="default"
              >
                最受欢迎
              </Badge>
            )}
            <CardHeader>
              <div className="flex items-center gap-2">
                {tier.id === "free" && <Shield className="h-5 w-5 text-gray-500" />}
                {tier.id === "pro" && <Zap className="h-5 w-5 text-blue-500" />}
                {tier.id === "enterprise" && <Crown className="h-5 w-5 text-purple-500" />}
                <CardTitle>{tier.name}</CardTitle>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  ¥{billingPeriod === "yearly" ? getYearlyPrice(tier.price) : tier.price}
                </span>
                {tier.price > 0 && (
                  <span className="text-muted-foreground">/{billingPeriod === "yearly" ? "年" : "月"}</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">可训练模型数</span>
                  <span>{tier.limits.modelsCount === -1 ? "无限制" : tier.limits.modelsCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">单数据集大小</span>
                  <span>{tier.limits.datasetSize === -1 ? "无限制" : `${tier.limits.datasetSize}MB`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">每月API调用次数</span>
                  <span>{tier.limits.apiCalls === -1 ? "无限制" : tier.limits.apiCalls}</span>
                </div>
                {tier.limits.teamMembers !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">团队成员数</span>
                    <span>{tier.limits.teamMembers === -1 ? "无限制" : tier.limits.teamMembers}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className={cn(
                  "w-full",
                  tier.id === "pro" &&
                    "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                )}
                variant={tier.id === "enterprise" ? "outline" : "default"}
              >
                {tier.id === "free" ? "开始使用" : tier.id === "enterprise" ? "联系销售" : "立即升级"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        所有价格均以人民币结算。升级或降级会员方案时，我们将按比例计算费用。
      </div>
    </div>
  )
}

