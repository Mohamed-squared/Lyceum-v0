"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Upload, FileText, ImageIcon, MoreHorizontal, Eye, Edit, Trash2, Bot, Scan } from "lucide-react"
import { FileIcon } from "lucide-react" // Import FileIcon

interface Note {
  id: string
  title: string
  type: "text" | "pdf" | "image" | "file"
  content?: string
  size?: string
  createdAt: string
}

const mockChapters = [
  { id: "1", title: "Introduction to Quantum Mechanics" },
  { id: "2", title: "Wave-Particle Duality" },
  { id: "3", title: "Uncertainty Principle" },
  { id: "4", title: "Schrödinger Equation" },
]

const mockNotes: Record<string, Note[]> = {
  "1": [
    {
      id: "1",
      title: "Key Concepts Summary",
      type: "text",
      content: "Wave-particle duality is fundamental to quantum mechanics...",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Lecture Slides Chapter 1",
      type: "pdf",
      size: "2.4 MB",
      createdAt: "2024-01-14",
    },
    {
      id: "3",
      title: "Quantum States Diagram",
      type: "image",
      size: "856 KB",
      createdAt: "2024-01-13",
    },
  ],
  "2": [
    {
      id: "4",
      title: "Double-Slit Experiment Notes",
      type: "text",
      content: "The double-slit experiment demonstrates...",
      createdAt: "2024-01-16",
    },
  ],
  "3": [],
  "4": [],
}

const getFileIcon = (type: string) => {
  switch (type) {
    case "text":
      return <FileText className="w-4 h-4" />
    case "pdf":
      return <FileIcon className="w-4 h-4" />
    case "image":
      return <ImageIcon className="w-4 h-4" />
    default:
      return <FileIcon className="w-4 h-4" />
  }
}

export default function NotesPage() {
  const params = useParams()
  const [selectedChapter, setSelectedChapter] = useState("1")
  const [notes, setNotes] = useState(mockNotes)
  const [addNoteOpen, setAddNoteOpen] = useState(false)
  const [uploadFileOpen, setUploadFileOpen] = useState(false)
  const [newNote, setNewNote] = useState({ title: "", content: "" })

  const currentNotes = notes[selectedChapter] || []

  const handleAddNote = () => {
    if (newNote.title && newNote.content) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        type: "text",
        content: newNote.content,
        createdAt: new Date().toISOString().split("T")[0],
      }

      setNotes((prev) => ({
        ...prev,
        [selectedChapter]: [...(prev[selectedChapter] || []), note],
      }))

      setNewNote({ title: "", content: "" })
      setAddNoteOpen(false)
    }
  }

  const handleFileUpload = (fileName: string) => {
    const note: Note = {
      id: Date.now().toString(),
      title: fileName,
      type: "pdf",
      size: "1.2 MB",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setNotes((prev) => ({
      ...prev,
      [selectedChapter]: [...(prev[selectedChapter] || []), note],
    }))

    setUploadFileOpen(false)
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => ({
      ...prev,
      [selectedChapter]: prev[selectedChapter]?.filter((note) => note.id !== noteId) || [],
    }))
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Notes & Documents</h1>
        <p className="text-muted-foreground mt-2">Organize your study materials by chapter</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Chapter List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Chapters</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {mockChapters.map((chapter) => (
                  <Button
                    key={chapter.id}
                    variant={selectedChapter === chapter.id ? "default" : "ghost"}
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => setSelectedChapter(chapter.id)}
                  >
                    <div>
                      <p className="font-medium">{chapter.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{(notes[chapter.id] || []).length} notes</p>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Notes Panel */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notes for {mockChapters.find((c) => c.id === selectedChapter)?.title}</CardTitle>
              <div className="flex gap-2">
                <Dialog open={addNoteOpen} onOpenChange={setAddNoteOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Note</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="note-title">Title</Label>
                        <Input
                          id="note-title"
                          value={newNote.title}
                          onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter note title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="note-content">Content</Label>
                        <Textarea
                          id="note-content"
                          value={newNote.content}
                          onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
                          placeholder="Write your note here..."
                          className="min-h-[200px]"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setAddNoteOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddNote}>Add Note</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={uploadFileOpen} onOpenChange={setUploadFileOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload File</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop files here, or click to browse
                        </p>
                        <Button variant="outline" size="sm">
                          Choose Files
                        </Button>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setUploadFileOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleFileUpload("Sample Document.pdf")}>Upload</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentNotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No notes for this chapter yet</p>
                <p className="text-sm">Add your first note or upload a document to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(note.type)}
                      <div>
                        <p className="font-medium">{note.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {note.type}
                          </Badge>
                          {note.size && <span>{note.size}</span>}
                          <span>Created {note.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Bot className="w-4 h-4 mr-2" />
                            AI Tools
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem>
                              <Bot className="w-4 h-4 mr-2" />
                              Review with AI
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Scan className="w-4 h-4 mr-2" />
                              OCR & Convert
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteNote(note.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
