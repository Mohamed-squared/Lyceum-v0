import { type NextRequest, NextResponse } from "next/server"

// Mock marketplace items data
const mockMarketplaceItems = [
  {
    id: "forest-sanctuary",
    name: "Forest Sanctuary",
    description:
      "Immerse yourself in nature with this calming forest-inspired theme featuring rich greens and earth tones",
    price: 850,
    category: "themes",
    image: "/themes/forest-sanctuary-hero.png",
    rarity: "rare",
    owned: false,
    cssVariables: {
      "--background": "47 15% 94%", // Warm cream background
      "--foreground": "120 25% 15%", // Deep forest green text
      "--card": "47 20% 97%", // Light cream cards
      "--card-foreground": "120 25% 15%",
      "--popover": "47 20% 97%",
      "--popover-foreground": "120 25% 15%",
      "--primary": "120 40% 25%", // Forest green primary
      "--primary-foreground": "47 15% 94%",
      "--secondary": "35 25% 85%", // Warm beige secondary
      "--secondary-foreground": "120 25% 15%",
      "--muted": "35 20% 88%", // Light earth tone
      "--muted-foreground": "120 15% 35%",
      "--accent": "85 30% 70%", // Sage green accent
      "--accent-foreground": "120 25% 15%",
      "--destructive": "0 65% 50%",
      "--destructive-foreground": "47 15% 94%",
      "--border": "35 20% 82%", // Soft earth border
      "--input": "35 20% 88%",
      "--ring": "120 40% 25%",
    },
  },
  {
    id: "1",
    name: "Dark Ocean Theme",
    description: "A beautiful dark theme with ocean-inspired colors and calming blue tones",
    price: 500,
    category: "themes",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "common",
    owned: false,
    cssVariables: {
      "--background": "210 40% 8%",
      "--foreground": "210 40% 98%",
      "--primary": "200 100% 50%",
      "--primary-foreground": "210 40% 8%",
      "--secondary": "200 20% 15%",
      "--accent": "200 30% 20%",
    },
  },
  {
    id: "2",
    name: "Sunset Gradient",
    description: "Warm gradient theme perfect for evening study sessions with orange and pink hues",
    price: 750,
    category: "themes",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "rare",
    owned: false,
    cssVariables: {
      "--background": "20 40% 8%",
      "--foreground": "20 40% 98%",
      "--primary": "15 100% 60%",
      "--primary-foreground": "20 40% 8%",
      "--secondary": "15 20% 15%",
      "--accent": "15 30% 20%",
    },
  },
  {
    id: "3",
    name: "Neon Cyberpunk",
    description: "Futuristic neon theme for the tech-savvy learner with electric green accents",
    price: 1200,
    category: "themes",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "epic",
    owned: false,
    cssVariables: {
      "--background": "240 10% 5%",
      "--foreground": "120 100% 80%",
      "--primary": "120 100% 50%",
      "--primary-foreground": "240 10% 5%",
      "--secondary": "120 20% 15%",
      "--accent": "120 30% 20%",
    },
  },
  {
    id: "4",
    name: "Speed Learner Badge",
    description: "Show off your quick learning abilities with this lightning bolt badge",
    price: 300,
    category: "badges",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "common",
    owned: false,
  },
  {
    id: "5",
    name: "Night Owl Badge",
    description: "For those who study best after midnight - an owl silhouette badge",
    price: 600,
    category: "badges",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "rare",
    owned: false,
  },
  {
    id: "6",
    name: "Golden Crown Decoration",
    description: "A luxurious golden crown decoration for your profile picture",
    price: 2000,
    category: "decorations",
    image: "/placeholder.svg?height=150&width=200",
    rarity: "legendary",
    owned: false,
    decorationUrl: "/placeholder.svg?height=40&width=40&text=👑",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  let items = mockMarketplaceItems

  if (category && category !== "all") {
    items = items.filter((item) => item.category === category)
  }

  return NextResponse.json({ items })
}
