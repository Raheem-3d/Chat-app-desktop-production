




"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useSocket } from "@/lib/socket-client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, ImageIcon, File, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"

type MessageInputProps = {
  channelId?: string
  receiverId?: string
  onMessageSent?: () => void
}

export default function MessageInput({ channelId, receiverId, onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage } = useSocket()
  const { data: session } = useSession()

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    // Check file size (max 10MB per file)
    const oversizedFiles = selectedFiles.filter((file) => file.size > 10 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      toast.error("Files must be smaller than 10MB")
      return
    }

    // Limit to 5 files at once
    if (files.length + selectedFiles.length > 5) {
      toast.error("You can only upload up to 5 files at once")
      return
    }

    setFiles((prev) => [...prev, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return { fileUrl: null, fileName: null, fileType: null }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", files[0]) // For now, just upload the first file

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 5
        })
      }, 100)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const data = await response.json()
      return {
        fileUrl: data.fileUrl,
        fileName: files[0].name,
        fileType: files[0].type,
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error("Failed to upload file. Please try again.")
      return { fileUrl: null, fileName: null, fileType: null }
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if ((!message.trim() && files.length === 0) || isSubmitting || isUploading) return
    if (!session?.user?.id) return

    setIsSubmitting(true)

    try {
      // Upload files if any
      let fileData = { fileUrl: null, fileName: null, fileType: null }
      if (files.length > 0) {
        fileData = await uploadFiles()
        if (!fileData.fileUrl && files.length > 0) {
          throw new Error("File upload failed")
        }
      }

      // Send message via API
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message.trim(),
          channelId,
          receiverId,
          fileUrl: fileData.fileUrl,
          fileName: fileData.fileName,
          fileType: fileData.fileType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setMessage("")
      setFiles([])
      if (onMessageSent) onMessageSent()
      toast.success("Message sent successfully")
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t bg-background p-4">
      {files.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="flex items-center p-2 bg-muted rounded-md border">
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="h-4 w-4 mr-2 text-blue-500" />
                  ) : (
                    <File className="h-4 w-4 mr-2 text-blue-500" />
                  )}
                  <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                  <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0" onClick={() => removeFile(index)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {isUploading && (
            <div className="space-y-1">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">{uploadProgress}%</p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={files.length > 0 ? "Add a message or send files..." : "Type a message..."}
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isSubmitting || isUploading}
            rows={1}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting || isUploading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <Button
            type="submit"
            disabled={(!message.trim() && files.length === 0) || isSubmitting || isUploading}
            size="icon"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>

      <p className="text-xs text-muted-foreground mt-1">Press Enter to send, Shift+Enter for new line</p>
    </div>
  )
}


// mere pass chat app jo next js me front End and backend hai.or database mysql me prisma k saath hai.mai us ko saas app me convert karna chata hu ki jab bhi koi person Aeey or app per register kare to us ko 14 days ka free trail 
// lene ka option de.phir wo register karke 14 days tk free use kar ke.or 14 days complete hone se pehle us ko gmail per reminder jate rahe ki tumhara plan expire hone wala hai.renew karao.or jab wo renw karta hai to ek saath ka option do.razerpay k saath.
// aisa mere ko ek detail ai promt do english me jo ek saas app me hoti hai wo sari funcality ho.