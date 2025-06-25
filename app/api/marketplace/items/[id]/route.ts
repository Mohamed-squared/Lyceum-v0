import { type NextRequest, NextResponse } from "next/server"

// Mock marketplace items data (same as in route.ts)
const mockMarketplaceItems = [
  {
    id: "1",
    name: "Dark Ocean Theme",
    description:
      "A beautiful dark theme with ocean-inspired colors and calming blue tones. This theme transforms your entire Lyceum experience with deep blues and teals that are easy on the eyes during long study sessions.",
    price: 500,
    category: "themes",
    image: "/placeholder.svg?height=300&width=400",
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
    description:
      "Warm gradient theme perfect for evening study sessions with orange and pink hues. Experience the warmth of a sunset while you learn, with carefully crafted gradients that inspire creativity and focus.",
    price: 750,
    category: "themes",
    image: "/placeholder.svg?height=300&width=400",
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
    description:
      "Futuristic neon theme for the tech-savvy learner with electric green accents. Step into the future with this high-contrast theme that makes every element pop with cyberpunk aesthetics.",
    price: 1200,
    category: "themes",
    image: "/placeholder.svg?height=300&width=400",
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
    description:
      "Show off your quick learning abilities with this lightning bolt badge. This badge appears on your profile to showcase your rapid progress through courses.",
    price: 300,
    category: "badges",
    image: "/placeholder.svg?height=300&width=400",
    rarity: "common",
    owned: false,
  },
  {
    id: "5",
    name: "Night Owl Badge",
    description:
      "For those who study best after midnight - an owl silhouette badge. Perfect for night owls who burn the midnight oil studying.",
    price: 600,
    category: "badges",
    image: "/placeholder.svg?height=300&width=400",
    rarity: "rare",
    owned: false,
  },
  {
    id: "6",
    name: "Golden Crown Decoration",
    description:
      "A luxurious golden crown decoration for your profile picture. This premium decoration adds a regal touch to your avatar, showing your dedication to learning.",
    price: 2000,
    category: "decorations",
    image: "/placeholder.svg?height=300&width=400",
    rarity: "legendary",
    owned: false,
    decorationUrl: "/placeholder.svg?height=40&width=40&text=👑",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const item = mockMarketplaceItems.find((item) => item.id === params.id)

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }

  return NextResponse.json({ item })
}
