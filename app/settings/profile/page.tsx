"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/lib/contexts/UserContext" // For initial data
import { Camera, Save, Loader2 } from "lucide-react"
import { ImageCropperModal } from "@/components/ImageCropperModal"
import { updateUserProfileAction } from "@/app/actions/profile" // Server Action
import { toast } from "@/components/ui/use-toast"

// Helper to convert base64 data URI to File, assuming it's available or defined elsewhere
// For this example, I'll copy it from the onboarding page refactor.
function dataURItoFile(dataURI: string, filename: string): File {
  const arr = dataURI.split(',');
  if (arr.length < 2) throw new Error('Invalid data URI');
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch || mimeMatch.length < 2) throw new Error('Could not parse MIME type from data URI');
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) { u8arr[n] = bstr.charCodeAt(n); }
  return new File([u8arr], filename, { type: mime });
}

const initialFormState = { message: "", errors: null, success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="flex items-center gap-2">
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export default function ProfileSettingsPage() {
  const { user, fetchUser } = useUser(); // fetchUser to refresh context if needed
  const [state, formAction] = useFormState(updateUserProfileAction, initialFormState);

  const [formData, setFormData] = useState({
    name: "",
    // Email is typically not changed here directly, or requires verification. Assuming it's read-only or handled elsewhere.
    bio: "",
    location: "",
    website: "",
    twitter: "",
    linkedin: "",
    github: "",
  });

  // Populate form when user data is available from context
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.user_metadata?.full_name || "",
        // email: user.email || "", // Email is often sensitive and not directly editable
        bio: user.user_metadata?.bio || "",
        location: user.user_metadata?.location || "",
        website: user.user_metadata?.website_url || "",
        twitter: user.user_metadata?.twitter_url || "", // Assuming these are stored this way
        linkedin: user.user_metadata?.linkedin_url || "",
        github: user.user_metadata?.github_url || "",
      });
      // Also set initial croppedProfileImage if avatarUrl exists
      if (user.user_metadata?.avatar_url) {
        setCroppedProfileImage(user.user_metadata.avatar_url);
      }
    }
  }, [user]);

  const [croppedProfileImage, setCroppedProfileImage] = useState<string>(""); // base64 or URL
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null); // Store the new File object

  const [cropperModal, setCropperModal] = useState<{
    isOpen: boolean;
    imageSrc: string;
    aspectRatio: number;
  }>({
    isOpen: false,
    imageSrc: "",
    aspectRatio: 1,
  });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({ title: "Success", description: state.message });
        fetchUser?.(); // Refresh user context data
      } else {
        const errorMessages = state.errors ? Object.values(state.errors).flat().join("\n") : "An unknown error occurred.";
        toast({ title: "Error", description: state.message || errorMessages, variant: "destructive" });
      }
    }
  }, [state, fetchUser]);


  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setCropperModal({ isOpen: true, imageSrc, aspectRatio: 1 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageDataUri: string) => {
    setCroppedProfileImage(croppedImageDataUri); // Show preview
    try {
        const imageFile = dataURItoFile(croppedImageDataUri, "profile-avatar.png");
        setNewAvatarFile(imageFile); // Store the File object for submission
    } catch (e) {
        console.error("Error converting cropped image to File:", e);
        toast({ title: "Image Error", description: "Could not process cropped image.", variant: "destructive"});
        setNewAvatarFile(null);
    }
    setCropperModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = new FormData(event.currentTarget); // Gets named form fields

    // Append other data not directly in named inputs or if structure is complex
    // payload.append('bio', formData.bio); // Example if Textarea doesn't have name="bio"

    if (newAvatarFile) {
      payload.append('avatarFile', newAvatarFile);
    }
    // If croppedProfileImage is an existing URL and no new file, don't send avatarFile
    // The server action should handle not receiving an avatarFile gracefully.

    formAction(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto py-6 space-y-6">
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
                <AvatarImage src={croppedProfileImage || user?.user_metadata?.avatar_url} alt={formData.name || user?.email} />
                <AvatarFallback className="text-2xl">
                  {formData.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
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
                name="avatarFile_input_temp" // Temporary name for file input, actual file is handled by newAvatarFile
              />
            </div>
            {user?.user_metadata?.tier && (
                <div className="text-center">
                <Badge variant="secondary" className="capitalize">
                    {user.user_metadata.tier} Member
                </Badge>
                </div>
            )}

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
                <Input id="name" name="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Read-only)</Label>
                <Input id="email" name="email" type="email" value={user?.email || ""} readOnly disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
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
                name="location"
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
                  name="website"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  placeholder="@username or full URL"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  placeholder="linkedin.com/in/username or full URL"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  placeholder="github.com/username or username"
                  value={formData.github}
                  onChange={(e) => handleInputChange("github", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="lg:col-span-3 flex justify-end">
          <SubmitButton />
        </div>
         {/* Display Server Action Messages/Errors */}
        {state?.message && !state.success && state.errors && (
          <div className="lg:col-span-3 mt-4 p-4 border rounded-md bg-destructive/10 text-destructive">
            <p className="font-semibold mb-1">{state.message}</p>
            <ul className="list-disc list-inside text-sm">
              {Object.entries(state.errors).map(([key, messages]) =>
                messages?.map((msg, i) => <li key={`${key}-${i}`}>{msg}</li>)
              )}
            </ul>
          </div>
        )}
      </div>
    </form>
  )
}
