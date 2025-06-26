"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion } from "framer-motion"
import { Upload, X, CheckCircle, AlertCircle, Camera, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface UploadedFile {
  file: File
  preview: string
  status: "pending" | "uploading" | "processing" | "completed" | "error"
  progress: number
}

export default function UploadPage() {
  const [eventCode, setEventCode] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending" as const,
      progress: 0,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB per file
  })

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const startUpload = async () => {
    if (!eventCode.trim()) {
      alert("Please enter an event code")
      return
    }

    setIsUploading(true)

    // Process each file
    for (let i = 0; i < uploadedFiles.length; i++) {
      if (uploadedFiles[i].status === "completed") continue

      // Update status to uploading
      setUploadedFiles((prev) => prev.map((file, index) => (index === i ? { ...file, status: "uploading" } : file)))

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setUploadedFiles((prev) => prev.map((file, index) => (index === i ? { ...file, progress } : file)))
      }

      // Update to processing (face detection)
      setUploadedFiles((prev) => prev.map((file, index) => (index === i ? { ...file, status: "processing" } : file)))

      // Simulate face processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mark as completed
      setUploadedFiles((prev) => prev.map((file, index) => (index === i ? { ...file, status: "completed" } : file)))
    }

    setIsUploading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Upload className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Ready to upload"
      case "uploading":
        return "Uploading..."
      case "processing":
        return "Processing faces..."
      case "completed":
        return "Upload complete"
      case "error":
        return "Upload failed"
      default:
        return "Unknown status"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Admin</span>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-blue-900">Upload Photos</h1>
              <p className="text-blue-600">Add photos to your event gallery</p>
            </div>
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-blue-900">PhotoMatch</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Event Code Input */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Event Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-md">
                <Label htmlFor="eventCode">Event Code</Label>
                <Input
                  id="eventCode"
                  placeholder="Enter event code"
                  value={eventCode}
                  onChange={(e) => setEventCode(e.target.value)}
                  className="border-blue-200 focus:border-blue-400"
                />
                <p className="text-sm text-blue-600 mt-2">Photos will be added to this event's gallery</p>
              </div>
            </CardContent>
          </Card>

          {/* Upload Area */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Upload Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      {isDragActive ? "Drop photos here..." : "Upload Event Photos"}
                    </h3>
                    <p className="text-blue-700 mb-4">Drag & drop photos here, or click to browse</p>
                    <p className="text-sm text-blue-600">Supports JPG, PNG, WebP (max 10MB per file)</p>
                  </div>
                  <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Photos
                  </Button>
                </div>
              </motion.div>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <Card className="border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-blue-900">Uploaded Photos ({uploadedFiles.length})</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={startUpload}
                    disabled={isUploading || !eventCode.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isUploading ? "Processing..." : "Start Upload"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      uploadedFiles.forEach((file) => URL.revokeObjectURL(file.preview))
                      setUploadedFiles([])
                    }}
                    disabled={isUploading}
                    className="border-blue-200 text-blue-600"
                  >
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedFiles.map((uploadedFile, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <div className="border border-blue-200 rounded-lg overflow-hidden">
                        <div className="relative">
                          <img
                            src={uploadedFile.preview || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                          {!isUploading && (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-900 truncate">{uploadedFile.file.name}</span>
                            {getStatusIcon(uploadedFile.status)}
                          </div>

                          <div className="text-xs text-blue-600 mb-2">{getStatusText(uploadedFile.status)}</div>

                          {(uploadedFile.status === "uploading" || uploadedFile.status === "processing") && (
                            <Progress
                              value={uploadedFile.status === "processing" ? 100 : uploadedFile.progress}
                              className="h-2"
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Instructions */}
          <Card className="border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Upload Instructions:</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Make sure photos are clear and well-lit for better face recognition</li>
                <li>• Our AI will automatically detect and process faces in each photo</li>
                <li>• Supported formats: JPG, PNG, WebP (max 10MB per file)</li>
                <li>• You can upload multiple photos at once</li>
                <li>• Processing may take a few moments depending on the number of faces</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
