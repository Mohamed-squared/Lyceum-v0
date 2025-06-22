"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Crown, Zap } from "lucide-react"

const membershipTiers = [
  {
    name: "Standard",
    price: "Free",
    icon: Star,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    features: ["Access to free courses", "Basic TestGen (5 tests/day)", "Community access", "Standard support"],
    current: true,
  },
  {
    name: "VIP",
    price: "$9.99/month",
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    features: [
      "Access to all courses",
      "Unlimited TestGen",
      "Priority support",
      "Advanced analytics",
      "Early access to features",
      "Custom study plans",
    ],
    popular: true,
  },
  {
    name: "Contributor",
    price: "$19.99/month",
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    features: [
      "All VIP features",
      "Course creation tools",
      "Revenue sharing",
      "Advanced course analytics",
      "Dedicated account manager",
      "White-label options",
    ],
  },
]

export default function MembershipPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600">Unlock the full potential of your learning journey</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {membershipTiers.map((tier) => {
          const Icon = tier.icon
          return (
            <Card key={tier.name} className={`relative ${tier.popular ? "border-purple-200 shadow-lg scale-105" : ""}`}>
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-8">
                <div className={`w-16 h-16 ${tier.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`h-8 w-8 ${tier.color}`} />
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="text-3xl font-bold text-gray-900 mt-2">{tier.price}</div>
                {tier.current && (
                  <Badge variant="outline" className="mt-2">
                    Current Plan
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    tier.current
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : tier.popular
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={tier.current}
                >
                  {tier.current ? "Current Plan" : "Upgrade Now"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. Your access will continue until the end of your
                billing period.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
