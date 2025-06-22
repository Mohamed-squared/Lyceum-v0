"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Eye, EyeOff, Mail, Lock, Trash2 } from "lucide-react"
import { useUser } from "@/lib/contexts/UserContext"
import { changeEmail, changePassword, deleteAccount } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function AccountSettingsPage() {
  const { user } = useUser()
  const router = useRouter()

  // Email change modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [emailForm, setEmailForm] = useState({
    currentPassword: "",
    newEmail: "",
  })
  const [emailLoading, setEmailLoading] = useState(false)

  // Password change modal state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Delete account modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleEmailChange = async () => {
    if (!emailForm.currentPassword || !emailForm.newEmail) return

    setEmailLoading(true)
    try {
      await changeEmail(emailForm.currentPassword, emailForm.newEmail)
      setEmailModalOpen(false)
      setEmailForm({ currentPassword: "", newEmail: "" })
      // Show success message
    } catch (error) {
      console.error("Failed to change email:", error)
    } finally {
      setEmailLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) return
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return

    setPasswordLoading(true)
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordModalOpen(false)
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      // Show success message
    } catch (error) {
      console.error("Failed to change password:", error)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE MY ACCOUNT") return

    setDeleteLoading(true)
    try {
      await deleteAccount(deleteConfirmation)
      router.push("/auth")
    } catch (error) {
      console.error("Failed to delete account:", error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const isDeleteButtonEnabled = deleteConfirmation === "DELETE MY ACCOUNT"

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account security and preferences</p>
      </div>

      <div className="space-y-8">
        {/* Email Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Management
            </CardTitle>
            <CardDescription>Update your email address and manage email preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="current-email">Current Email</Label>
                <Input id="current-email" value={user?.email || "user@example.com"} disabled className="mt-1" />
              </div>
              <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Change Email</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Email Address</DialogTitle>
                    <DialogDescription>
                      Enter your current password and new email address. A verification link will be sent to your new
                      email.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password-email">Current Password</Label>
                      <Input
                        id="current-password-email"
                        type="password"
                        value={emailForm.currentPassword}
                        onChange={(e) => setEmailForm({ ...emailForm, currentPassword: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-email">New Email Address</Label>
                      <Input
                        id="new-email"
                        type="email"
                        value={emailForm.newEmail}
                        onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={handleEmailChange}
                      disabled={emailLoading || !emailForm.currentPassword || !emailForm.newEmail}
                      className="w-full"
                    >
                      {emailLoading ? "Sending..." : "Send Verification Link"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Password Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Password Management
            </CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Change Password</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>Enter your current password and choose a new secure password.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="current-password"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="new-password"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="confirm-password"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  {passwordForm.newPassword &&
                    passwordForm.confirmPassword &&
                    passwordForm.newPassword !== passwordForm.confirmPassword && (
                      <p className="text-sm text-destructive">Passwords do not match</p>
                    )}
                  <Button
                    onClick={handlePasswordChange}
                    disabled={
                      passwordLoading ||
                      !passwordForm.currentPassword ||
                      !passwordForm.newPassword ||
                      passwordForm.newPassword !== passwordForm.confirmPassword
                    }
                    className="w-full"
                  >
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible and destructive actions. Please proceed with caution.</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete My Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-destructive">Delete Account</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data
                    from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <h4 className="font-medium text-destructive">Warning</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          This will permanently delete your account, all your courses, progress, and data. This action
                          cannot be reversed.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="delete-confirmation">
                      Type <strong>DELETE MY ACCOUNT</strong> to confirm
                    </Label>
                    <Input
                      id="delete-confirmation"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="DELETE MY ACCOUNT"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={!isDeleteButtonEnabled || deleteLoading}
                    className="w-full"
                  >
                    {deleteLoading ? "Deleting..." : "Permanently Delete Account"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
