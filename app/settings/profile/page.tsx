"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/lib/contexts/UserContext"
import { Camera, Save } from "lucide-react"
import { ImageCropperModal } from "@/components/ImageCropperModal"

export default function ProfileSettingsPage() {
  const { user } = useUser()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "Passionate educator and researcher in quantum physics and machine learning.",
    location: "San Francisco, CA",
    website: "https://johndoe.com",
    twitter: "@johndoe",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
  })

  const [croppedProfileImage, setCroppedProfileImage] = useState<string>("")
  const [cropperModal, setCropperModal] = useState<{
    isOpen: boolean
    imageSrc: string
    aspectRatio: number
    type: "profile" | "banner"
  }>({
    isOpen: false,
    imageSrc: "",
    aspectRatio: 1,
    type: "profile",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Mock save functionality
    console.log("Saving profile data:", formData)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string
        setCropperModal({
          isOpen: true,
          imageSrc,
          aspectRatio: 1,
          type: "profile",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = (croppedImageData: string) => {
    setCroppedProfileImage(croppedImageData)
    setCropperModal((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your personal information and public profile</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                {croppedProfileImage ? (
                  <img
                    src={croppedProfileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <AvatarFallback className="text-2xl">{user?.avatar}</AvatarFallback>
                )}
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("profile-image-upload")?.click()}
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="capitalize">
                {user?.tier} Member
              </Badge>
            </div>

            <ImageCropperModal
              isOpen={cropperModal.isOpen}
              onClose={() => setCropperModal((prev) => ({ ...prev, isOpen: false }))}
              imageSrc={cropperModal.imageSrc}
              aspectRatio={cropperModal.aspectRatio}
              onCropComplete={handleCropComplete}
              title="Crop Profile Picture"
            />
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  placeholder="@username"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  placeholder="linkedin.com/in/username"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  placeholder="github.com/username"
                  value={formData.github}
                  onChange={(e) => handleInputChange("github", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="lg:col-span-3 flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
