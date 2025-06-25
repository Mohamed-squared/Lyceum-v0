"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Coins, Palette, Trophy, Crown, Sparkles } from "lucide-react"
import Link from "next/link"

interface MarketplaceItem {
  id: string
  name: string
  description: string
  price: number
  category: "themes" | "badges" | "decorations"
  image: string
  rarity: "common" | "rare" | "epic" | "legendary"
  owned?: boolean
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
      return <Palette className="w-4 h-4" />
    case "badges":
      return <Trophy className="w-4 h-4" />
    case "decorations":
      return <Crown className="w-4 h-4" />
    default:
      return <ShoppingCart className="w-4 h-4" />
  }
}

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [loading, setLoading] = useState(true)
  const userCredits = 2450 // Mock user credits - this should come from user context

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true)
        const response = await fetch(`/api/marketplace/items?category=${selectedCategory}`)
        const data = await response.json()
        setItems(data.items || [])
      } catch (error) {
        console.error("Failed to fetch marketplace items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [selectedCategory])

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-8 h-8" />
            Marketplace
          </h1>
          <p className="text-muted-foreground mt-2">
            Customize your Lyceum experience with themes, badges, and decorations
          </p>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-lg">{userCredits.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">Credits</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Themes
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="decorations" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Decorations
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-40 object-cover" />
                  <Badge className={`absolute top-2 right-2 ${getRarityColor(item.rarity)} text-white`}>
                    {item.rarity}
                  </Badge>
                  {item.owned && <Badge className="absolute top-2 left-2 bg-green-500 text-white">Owned</Badge>}
                  {item.category === "themes" && (
                    <div className="absolute bottom-2 right-2">
                      <Sparkles className="w-4 h-4 text-white drop-shadow-lg" />
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getCategoryIcon(item.category)}
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold">{item.price.toLocaleString()}</span>
                    </div>
                    <Button asChild size="sm" variant={item.owned ? "outline" : "default"}>
                      <Link href={`/marketplace/${item.id}`}>{item.owned ? "View" : "Details"}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
