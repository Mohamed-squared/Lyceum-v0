"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Coins, Palette, Trophy, Zap, Crown } from "lucide-react"

interface MarketplaceItem {
  id: string
  name: string
  description: string
  price: number
  category: "themes" | "badges" | "boosts" | "premium"
  image: string
  rarity: "common" | "rare" | "epic" | "legendary"
  owned?: boolean
}

const mockMarketplaceItems: MarketplaceItem[] = [
  // Themes
  {
    id: "1",
    name: "Dark Ocean Theme",
    description: "A beautiful dark theme with ocean-inspired colors",
    price: 500,
    category: "themes",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "common",
  },
  {
    id: "2",
    name: "Sunset Gradient",
    description: "Warm gradient theme perfect for evening study sessions",
    price: 750,
    category: "themes",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "rare",
  },
  {
    id: "3",
    name: "Neon Cyberpunk",
    description: "Futuristic neon theme for the tech-savvy learner",
    price: 1200,
    category: "themes",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "epic",
  },
  // Badges
  {
    id: "4",
    name: "Speed Learner",
    description: "Show off your quick learning abilities",
    price: 300,
    category: "badges",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "common",
  },
  {
    id: "5",
    name: "Night Owl",
    description: "For those who study best after midnight",
    price: 600,
    category: "badges",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "rare",
  },
  {
    id: "6",
    name: "Master Scholar",
    description: "The ultimate badge for dedicated learners",
    price: 2000,
    category: "badges",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "legendary",
  },
  // Boosts
  {
    id: "7",
    name: "2x Credit Boost (24h)",
    description: "Double your credit earnings for 24 hours",
    price: 400,
    category: "boosts",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "common",
  },
  {
    id: "8",
    name: "Study Streak Shield",
    description: "Protect your study streak for one missed day",
    price: 800,
    category: "boosts",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "rare",
  },
  // Premium
  {
    id: "9",
    name: "VIP Membership (1 Month)",
    description: "Unlock premium features and exclusive content",
    price: 2500,
    category: "premium",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "epic",
  },
]

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
    case "boosts":
      return <Zap className="w-4 h-4" />
    case "premium":
      return <Crown className="w-4 h-4" />
    default:
      return <ShoppingCart className="w-4 h-4" />
  }
}

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [purchaseItem, setPurchaseItem] = useState<MarketplaceItem | null>(null)
  const userCredits = 2450 // Mock user credits

  const filteredItems =
    selectedCategory === "all"
      ? mockMarketplaceItems
      : mockMarketplaceItems.filter((item) => item.category === selectedCategory)

  const handlePurchase = (item: MarketplaceItem) => {
    setPurchaseItem(item)
  }

  const confirmPurchase = () => {
    if (purchaseItem) {
      // Mock purchase logic
      console.log(`Purchasing ${purchaseItem.name} for ${purchaseItem.price} credits`)
      setPurchaseItem(null)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-8 h-8" />
            Marketplace
          </h1>
          <p className="text-muted-foreground mt-2">Spend your credits on themes, badges, and premium features</p>
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
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Themes
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="boosts" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Boosts
          </TabsTrigger>
          <TabsTrigger value="premium" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Premium
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-40 object-cover" />
                  <Badge className={`absolute top-2 right-2 ${getRarityColor(item.rarity)} text-white`}>
                    {item.rarity}
                  </Badge>
                  {item.owned && <Badge className="absolute top-2 left-2 bg-green-500 text-white">Owned</Badge>}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getCategoryIcon(item.category)}
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold">{item.price.toLocaleString()}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(item)}
                      disabled={item.owned || userCredits < item.price}
                      variant={item.owned ? "outline" : "default"}
                    >
                      {item.owned ? "Owned" : userCredits < item.price ? "Insufficient Credits" : "Purchase"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={!!purchaseItem} onOpenChange={() => setPurchaseItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
          </DialogHeader>
          {purchaseItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={purchaseItem.image || "/placeholder.svg"}
                  alt={purchaseItem.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold">{purchaseItem.name}</h3>
                  <p className="text-sm text-muted-foreground">{purchaseItem.description}</p>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Item Price:</span>
                  <span className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    {purchaseItem.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Your Credits:</span>
                  <span className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    {userCredits.toLocaleString()}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center font-bold">
                  <span>After Purchase:</span>
                  <span className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    {(userCredits - purchaseItem.price).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPurchaseItem(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={confirmPurchase} className="flex-1">
                  Confirm Purchase
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
