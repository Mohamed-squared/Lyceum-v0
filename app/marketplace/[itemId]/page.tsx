"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Coins, ShoppingCart, Palette, Trophy, Crown, Sparkles } from "lucide-react"
import Link from "next/link"
import { EnhancedThemePreview } from "./components/EnhancedThemePreview"
import { ThemeApplyButton } from "../components/ThemeApplyButton"

interface MarketplaceItem {
  id: string
  name: string
  description: string
  price: number
  category: "themes" | "badges" | "decorations"
  image: string
  rarity: "common" | "rare" | "epic" | "legendary"
  owned?: boolean
  cssVariables?: Record<string, string>
  decorationUrl?: string
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common":
      return "bg-gray-500"
    case "rare":
      return "bg-blue-500"
    case "epic":
      return "bg-purple-500"
    case "legendary":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "themes":
      return <Palette className="w-5 h-5" />
    case "badges":
      return <Trophy className="w-5 h-5" />
    case "decorations":
      return <Crown className="w-5 h-5" />
    default:
      return <ShoppingCart className="w-5 h-5" />
  }
}

function ThemePreview({ cssVariables, themeName }: { cssVariables: Record<string, string>; themeName: string }) {
  return <EnhancedThemePreview cssVariables={cssVariables} themeName={themeName} />
}

function DecorationPreview({ decorationUrl }: { decorationUrl: string }) {
  return (
    <div className="p-6 rounded-lg border space-y-4">
      <h3 className="text-lg font-semibold">Decoration Preview</h3>
      <div className="flex items-center justify-center">
        <Avatar className="w-24 h-24" decorationUrl={decorationUrl}>
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>YU</AvatarFallback>
        </Avatar>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        This is how your profile picture will look with this decoration.
      </p>
    </div>
  )
}

export default function MarketplaceItemPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<MarketplaceItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const userCredits = 2450 // Mock user credits

  useEffect(() => {
    async function fetchItem() {
      try {
        setLoading(true)
        const response = await fetch(`/api/marketplace/items/${params.itemId}`)
        if (response.ok) {
          const data = await response.json()
          setItem(data.item)
        } else {
          console.error("Item not found")
        }
      } catch (error) {
        console.error("Failed to fetch item:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.itemId) {
      fetchItem()
    }
  }, [params.itemId])

  const handlePurchase = async () => {
    if (!item) return

    setPurchasing(true)
    try {
      // Mock purchase API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(`Purchasing ${item.name} for ${item.price} credits`)
      // In a real app, you'd call your purchase API here
      // After successful purchase, redirect to marketplace or show success
      router.push("/marketplace")
    } catch (error) {
      console.error("Purchase failed:", error)
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
          <Button asChild>
            <Link href="/marketplace">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const canAfford = userCredits >= item.price
  const canPurchase = !item.owned && canAfford

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/marketplace">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Item Image and Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="relative">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-64 object-cover" />
              <Badge className={`absolute top-4 right-4 ${getRarityColor(item.rarity)} text-white`}>
                {item.rarity}
              </Badge>
              {item.owned && <Badge className="absolute top-4 left-4 bg-green-500 text-white">Owned</Badge>}
              {item.category === "themes" && (
                <div className="absolute bottom-4 right-4">
                  <Sparkles className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              )}
            </div>
          </Card>

          {/* Preview Section */}
          {item.category === "themes" && item.cssVariables && (
            <ThemePreview cssVariables={item.cssVariables} themeName={item.name} />
          )}

          {item.category === "decorations" && item.decorationUrl && (
            <DecorationPreview decorationUrl={item.decorationUrl} />
          )}
        </div>

        {/* Item Details and Purchase */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {getCategoryIcon(item.category)}
              <h1 className="text-3xl font-bold">{item.name}</h1>
            </div>
            <p className="text-muted-foreground capitalize">{item.category}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Purchase Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span>Price:</span>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold">{item.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>Your Credits:</span>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold">{userCredits.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between font-bold">
                  <span>After Purchase:</span>
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span className={canAfford ? "text-foreground" : "text-destructive"}>
                      {(userCredits - item.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Button onClick={handlePurchase} disabled={!canPurchase || purchasing} className="w-full" size="lg">
                {purchasing ? (
                  "Processing..."
                ) : item.owned ? (
                  "Already Owned"
                ) : !canAfford ? (
                  "Insufficient Credits"
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Purchase for {item.price.toLocaleString()} Credits
                  </>
                )}
              </Button>

              {item.category === "themes" && item.cssVariables && (
                <ThemeApplyButton
                  themeId={item.id}
                  themeName={item.name}
                  cssVariables={item.cssVariables}
                  isOwned={item.owned}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
