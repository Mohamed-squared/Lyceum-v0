"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Users, Search, UserPlus, MessageCircle, ArrowLeft, Check, X, Flame, BookOpen } from "lucide-react"
import Link from "next/link"
import {
  getStudyPartners,
  searchUsers,
  sendPartnerRequest,
  acceptPartnerRequest,
  declinePartnerRequest,
} from "@/lib/api"
import type { StudyPartner, PartnerRequest, User } from "@/lib/mock-data"

export default function StudyPartnersPage() {
  const [partners, setPartners] = useState<StudyPartner[]>([])
  const [requests, setRequests] = useState<PartnerRequest[]>([])
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [requestMessage, setRequestMessage] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudyPartners()
        setPartners(data.partners)
        setRequests(data.requests)
      } catch (error) {
        console.error("Failed to fetch study partners:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await searchUsers(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error("Failed to search users:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSendRequest = async () => {
    if (!selectedUser) return

    try {
      await sendPartnerRequest(selectedUser.id, requestMessage)
      setIsDialogOpen(false)
      setRequestMessage("")
      setSelectedUser(null)
      // Show success message
    } catch (error) {
      console.error("Failed to send partner request:", error)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptPartnerRequest(requestId)
      setRequests((prev) => prev.filter((req) => req.id !== requestId))
      // Add to partners list in real implementation
    } catch (error) {
      console.error("Failed to accept request:", error)
    }
  }

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await declinePartnerRequest(requestId)
      setRequests((prev) => prev.filter((req) => req.id !== requestId))
    } catch (error) {
      console.error("Failed to decline request:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Study Partners</h1>
                <p className="text-muted-foreground">Connect with fellow learners and study together</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="partners" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="partners">My Partners ({partners.length})</TabsTrigger>
            <TabsTrigger value="requests">
              Requests ({requests.length})
              {requests.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {requests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="search">Find Partners</TabsTrigger>
          </TabsList>

          <TabsContent value="partners" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Your Study Partners</h2>
                <Badge variant="outline">{partners.length} partners</Badge>
              </div>

              {partners.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partners.map((partner) => (
                    <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-lg font-medium text-primary">
                              {partner.avatar}
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                                partner.status === "online" ? "bg-green-500" : "bg-muted-foreground"
                              }`}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{partner.name}</CardTitle>
                            <CardDescription className="capitalize">{partner.status}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Mutual Courses:</span>
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              <span className="font-medium">{partner.mutualCourses}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Study Streak:</span>
                            <div className="flex items-center">
                              <Flame className="h-4 w-4 mr-1 text-orange-500" />
                              <span className="font-medium">{partner.studyStreak} days</span>
                            </div>
                          </div>
                          <Button variant="outline" className="w-full" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No study partners yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by searching for other learners or accepting partner requests
                    </p>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Find Study Partners
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Partner Requests</h2>
                <Badge variant="outline">{requests.length} pending</Badge>
              </div>

              {requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-lg font-medium text-primary">
                            {request.from.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-foreground">{request.from.name}</h3>
                              <span className="text-sm text-muted-foreground">{request.timestamp}</span>
                            </div>
                            <p className="text-foreground mb-3">{request.message}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center">
                                <BookOpen className="h-4 w-4 mr-1" />
                                <span>{request.from.mutualCourses} mutual courses</span>
                              </div>
                              <div className="flex items-center">
                                <Flame className="h-4 w-4 mr-1 text-orange-500" />
                                <span>{request.from.studyStreak} day streak</span>
                              </div>
                            </div>
                            <div className="flex space-x-3">
                              <Button
                                size="sm"
                                onClick={() => handleAcceptRequest(request.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Accept
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeclineRequest(request.id)}>
                                <X className="h-4 w-4 mr-2" />
                                Decline
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No pending requests</h3>
                    <p className="text-muted-foreground">
                      When other learners send you partner requests, they'll appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="search" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Find Study Partners</h2>
              </div>

              {/* Search Bar */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <Button onClick={handleSearch} disabled={isSearching}>
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Search Results</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {searchResults.map((user) => (
                      <Card key={user.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-lg font-medium text-primary">
                              {user.avatar}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{user.name}</h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {user.role} • {user.tier}
                              </p>
                              <p className="text-sm text-muted-foreground">{user.credits} credits</p>
                            </div>
                            <Dialog open={isDialogOpen && selectedUser?.id === user.id} onOpenChange={setIsDialogOpen}>
                              <DialogTrigger asChild>
                                <Button size="sm" onClick={() => setSelectedUser(user)}>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Add Partner
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Send Partner Request</DialogTitle>
                                  <DialogDescription>Send a partner request to {user.name}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="message">Message (optional)</Label>
                                    <Textarea
                                      id="message"
                                      placeholder="Hi! I'd like to be study partners..."
                                      value={requestMessage}
                                      onChange={(e) => setRequestMessage(e.target.value)}
                                      rows={3}
                                    />
                                  </div>
                                  <div className="flex justify-end space-x-3">
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleSendRequest}>Send Request</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery && searchResults.length === 0 && !isSearching && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
                    <p className="text-muted-foreground">Try searching with a different name or email</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
