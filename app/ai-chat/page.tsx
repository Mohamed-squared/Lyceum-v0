"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LatexRenderer } from "@/components/LatexRenderer"
import { Send, Plus, BookOpen, Calculator, Beaker, Globe, Settings, Download, Share } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  hasLatex?: boolean
}

interface ChatSession {
  id: string
  title: string
  subject: string
  lastMessage: Date
  messageCount: number
}

const mockSessions: ChatSession[] = [
  {
    id: "1",
    title: "Quantum Mechanics Help",
    subject: "Physics",
    lastMessage: new Date(Date.now() - 1000 * 60 * 30),
    messageCount: 12,
  },
  {
    id: "2",
    title: "Calculus Integration",
    subject: "Mathematics",
    lastMessage: new Date(Date.now() - 1000 * 60 * 60 * 2),
    messageCount: 8,
  },
  {
    id: "3",
    title: "Organic Chemistry Reactions",
    subject: "Chemistry",
    lastMessage: new Date(Date.now() - 1000 * 60 * 60 * 24),
    messageCount: 15,
  },
]

const subjectIcons = {
  Physics: Beaker,
  Mathematics: Calculator,
  Chemistry: Beaker,
  Biology: BookOpen,
  History: Globe,
}

export default function AIChatStudio() {
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
        hasLatex: inputValue.toLowerCase().includes("math") || inputValue.toLowerCase().includes("equation"),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    if (userInput.toLowerCase().includes("math") || userInput.toLowerCase().includes("equation")) {
      return `Here's the solution to your math problem:

The quadratic formula is: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

For the equation $ax^2 + bx + c = 0$, we can substitute the values and solve step by step.

Would you like me to work through a specific example?`
    }

    if (userInput.toLowerCase().includes("physics")) {
      return `Great physics question! Let me help you understand this concept.

The wave equation is: $$\\psi(x,t) = A \\sin(kx - \\omega t + \\phi)$$

Where:
- $A$ is the amplitude
- $k$ is the wave number
- $\\omega$ is the angular frequency
- $\\phi$ is the phase constant

This describes the motion of a wave in space and time.`
    }

    return `I understand your question about "${userInput}". Let me provide a comprehensive explanation:

This is a complex topic that involves several key concepts. I'll break it down step by step to make it easier to understand.

1. First, let's establish the fundamental principles
2. Then we'll explore the practical applications
3. Finally, we'll look at some examples

Would you like me to elaborate on any specific aspect?`
  }

  const startNewSession = () => {
    const newSessionId = Date.now().toString()
    setActiveSession(newSessionId)
    setMessages([])
  }

  const loadSession = (sessionId: string) => {
    setActiveSession(sessionId)
    // Load mock messages for the session
    const mockMessages: Message[] = [
      {
        id: "1",
        content: "Can you help me understand quantum superposition?",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
      },
      {
        id: "2",
        content: `Quantum superposition is a fundamental principle of quantum mechanics. It states that a quantum system can exist in multiple states simultaneously until it's measured.

The mathematical representation is: $$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$$

Where $\\alpha$ and $\\beta$ are complex probability amplitudes, and $|\\alpha|^2 + |\\beta|^2 = 1$.

This means the particle exists in both states with certain probabilities until observation collapses the wave function.`,
        sender: "ai",
        timestamp: new Date(Date.now() - 1000 * 60 * 9),
        hasLatex: true,
      },
    ]
    setMessages(mockMessages)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">AI Chat Studio</h2>
            <Button size="sm" onClick={startNewSession}>
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="mt-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2">
                  {mockSessions.map((session) => {
                    const IconComponent = subjectIcons[session.subject as keyof typeof subjectIcons] || BookOpen
                    return (
                      <Card
                        key={session.id}
                        className={`cursor-pointer transition-colors hover:bg-accent ${
                          activeSession === session.id ? "bg-accent" : ""
                        }`}
                        onClick={() => loadSession(session.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <IconComponent className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium truncate">{session.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {session.subject}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{session.messageCount} messages</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {session.lastMessage.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="subjects" className="mt-4">
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(subjectIcons).map(([subject, IconComponent]) => (
                  <Button
                    key={subject}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-center gap-2"
                    onClick={startNewSession}
                  >
                    <IconComponent className="h-6 w-6" />
                    <span className="text-xs">{subject}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">Ready to help with your studies</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card border"
                      }`}
                    >
                      {message.hasLatex ? (
                        <div className="prose prose-sm max-w-none">
                          <LatexRenderer>{message.content}</LatexRenderer>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}
                      <div className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card border rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <div className="animate-pulse flex space-x-1">
                          <div className="rounded-full bg-muted h-2 w-2"></div>
                          <div className="rounded-full bg-muted h-2 w-2"></div>
                          <div className="rounded-full bg-muted h-2 w-2"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-card">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about your studies..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>💡 Tip: I can help with math equations, physics problems, and more!</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to AI Chat Studio</h2>
                <p className="text-muted-foreground">
                  Start a new conversation or continue from where you left off. I'm here to help with your studies!
                </p>
              </div>

              <div className="space-y-3">
                <Button onClick={startNewSession} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>

                <div className="text-sm text-muted-foreground">Or select a recent session from the sidebar</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
