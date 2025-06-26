"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion } from "framer-motion"
import { Upload, Camera, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface SelfieUploaderProps {
  onSelfieUpload: (file: File) => void
  isMatching: boolean
}

export function SelfieUploader({ onSelfieUpload, isMatching }: SelfieUploaderProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // Simulate upload progress
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 100)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleStartMatching = () => {
    if (uploadedFile) {
      onSelfieUpload(uploadedFile)
    }
  }

  const handleReset = () => {
    setUploadedFile(null)
    setPreviewUrl(null)
    setUploadProgress(0)
  }

  return (
    <Card className="border-blue-200 shadow-lg">
      <CardContent className="p-6">
        {!uploadedFile ? (
          <motion.div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-400 bg-blue-50" : "border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Upload Your Selfie</h3>
                <p className="text-blue-700 mb-4">
                  {isDragActive ? "Drop your selfie here..." : "Drag & drop your selfie here, or click to browse"}
                </p>
                <p className="text-sm text-blue-600">Supports JPG, PNG, WebP (max 10MB)</p>
              </div>
              <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                <Camera className="h-4 w-4 mr-2" />
                Choose Photo
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={previewUrl! || "/placeholder.svg"}
                  alt="Uploaded selfie"
                  className="w-48 h-48 object-cover rounded-lg shadow-md mx-auto"
                />
                {uploadProgress < 100 && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Uploading...</p>
                    </div>
                  </div>
                )}
              </div>

              {uploadProgress < 100 && (
                <div className="mt-4 max-w-xs mx-auto">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-blue-600 mt-2">{uploadProgress}% uploaded</p>
                </div>
              )}
            </div>

            {/* Actions */}
            {uploadProgress === 100 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Button onClick={handleStartMatching} disabled={isMatching} className="bg-blue-600 hover:bg-blue-700">
                  {isMatching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Finding Your Photos...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Start Face Matching
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  disabled={isMatching}
                  className="border-blue-200 text-blue-600"
                >
                  Upload Different Photo
                </Button>
              </motion.div>
            )}

            {/* Matching Progress */}
            {isMatching && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">AI is analyzing your photo...</h3>
                  <p className="text-blue-700">This may take a few moments while we search through all event photos</p>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Tips for better matching:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use a clear, well-lit photo of your face</li>
            <li>• Face the camera directly</li>
            <li>• Avoid sunglasses or face coverings</li>
            <li>• Make sure your face is clearly visible</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
