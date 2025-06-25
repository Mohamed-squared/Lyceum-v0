import { type NextRequest, NextResponse } from "next/server"

// Mock marketplace items data (same as in route.ts)
const mockMarketplaceItems = [
  {
    id: "forest-sanctuary",
    name: "Forest Sanctuary",
    description:
      "Immerse yourself in the tranquil beauty of nature with this carefully crafted forest-inspired theme. Featuring rich forest greens, warm earth tones, and soft cream backgrounds, this theme creates a calming study environment that reduces eye strain and promotes focus. Perfect for long study sessions, the Forest Sanctuary theme brings the serenity of nature to your digital learning experience.",
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
