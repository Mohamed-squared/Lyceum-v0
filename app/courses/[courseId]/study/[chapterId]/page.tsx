"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LatexRenderer } from "@/components/LatexRenderer"
import { FloatingAIHelper } from "@/components/FloatingAIHelper"
import { getChapter } from "@/lib/api"
import type { Chapter } from "@/lib/mock-data"
import { BookOpen, FileText, Presentation, Clock, Play, FileDown } from "lucide-react"

export default function StudyPage() {
  const params = useParams()
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedText, setSelectedText] = useState("")

  useEffect(() => {
    const loadChapter = async () => {
      if (params.courseId && params.chapterId) {
        const chapterData = await getChapter(params.courseId as string, params.chapterId as string)
        setChapter(chapterData)
        setLoading(false)
      }
    }
    loadChapter()
  }, [params.courseId, params.chapterId])

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString())
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading chapter...</div>
  }

  if (!chapter) {
    return <div className="text-center py-8">Chapter not found</div>
  }

  return (
    <div className="container mx-auto py-6" onMouseUp={handleTextSelection}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{chapter.title}</h1>
            <p className="text-muted-foreground mt-2">{chapter.description}</p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {chapter.duration}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="lectures" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="lectures" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Lectures
          </TabsTrigger>
          <TabsTrigger value="textbook" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Textbook
          </TabsTrigger>
          <TabsTrigger value="powerpoint" className="flex items-center gap-2">
            <Presentation className="w-4 h-4" />
            Slides
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="formulas" className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Formulas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lectures" className="space-y-6">
          {chapter.resources.lectures?.map((videoId, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Lecture {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`Lecture ${index + 1}`}
                      frameBorder="0"
                      allowFullScreen
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Transcript</h4>
                    <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto text-sm">
                      <p className="mb-2">
                        Welcome to today's lecture on quantum mechanics fundamentals. We'll be exploring the concept of
                        wave-particle duality and its implications.
                      </p>
                      <p className="mb-2">
                        The de Broglie wavelength, given by λ = h/p, shows us that all matter has wave-like properties.
                        This was a revolutionary concept that changed our understanding of physics.
                      </p>
                      <p>Let's examine some experimental evidence for this phenomenon...</p>
                    </div>
                    {selectedText && (
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-500">
                        <p className="text-sm font-medium">Selected text:</p>
                        <p className="text-sm">{selectedText}</p>
                        <Button size="sm" className="mt-2" variant="outline">
                          Ask AI about Selection
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="textbook">
          <Card>
            <CardHeader>
              <CardTitle>Textbook Chapter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-center text-muted-foreground">PDF Viewer would be embedded here</p>
                <p className="text-center text-sm mt-2">Interactive PDF with text selection and AI help</p>
                <div className="flex justify-center mt-4">
                  <Button variant="outline">Ask AI about this Page</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="powerpoint">
          <Card>
            <CardHeader>
              <CardTitle>Presentation Slides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-center text-muted-foreground">PowerPoint viewer would be embedded here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Notes</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <LatexRenderer content={chapter.resources.notes || "No notes available"} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulas">
          <Card>
            <CardHeader>
              <CardTitle>Formula Sheet</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <LatexRenderer content={chapter.resources.formulaSheets || "No formulas available"} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FloatingAIHelper context={selectedText} contextType="text" />
    </div>
  )
}
