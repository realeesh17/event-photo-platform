"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Camera, Users, Download, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PhotoGallery } from "@/components/photo-gallery"
import { SelfieUploader } from "@/components/selfie-uploader"

interface EventPageProps {
  params: {
    code: string
  }
}

export default function EventPage({ params }: EventPageProps) {
  const [activeTab, setActiveTab] = useState<"gallery" | "selfie">("selfie")
  const [matchedPhotos, setMatchedPhotos] = useState<string[]>([])
  const [isMatching, setIsMatching] = useState(false)

  // Mock event data - in real app, fetch from database
  const eventData = {
    name: "Sarah & John's Wedding",
    date: "June 15, 2024",
    location: "Sunset Gardens",
    totalPhotos: 247,
    code: params.code,
  }

  const handleSelfieMatch = async (selfieFile: File) => {
    setIsMatching(true)

    // Mock API call for face matching
    // In real implementation, send to your Python Flask API
    setTimeout(() => {
      // Mock matched photos
      const mockMatches = [
        "/placeholder.svg?height=400&width=300",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=350&width=350",
        "/placeholder.svg?height=400&width=280",
        "/placeholder.svg?height=320&width=400",
        "/placeholder.svg?height=380&width=320",
      ]
      setMatchedPhotos(mockMatches)
      setIsMatching(false)
      setActiveTab("gallery")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-bold text-blue-900">{eventData.name}</h1>
              <p className="text-sm text-blue-600">
                {eventData.date} • {eventData.location}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-blue-700">
              <Users className="h-4 w-4" />
              <span className="text-sm">{eventData.totalPhotos} photos</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-blue-200">
            <Button
              variant={activeTab === "selfie" ? "default" : "ghost"}
              onClick={() => setActiveTab("selfie")}
              className={`${activeTab === "selfie" ? "bg-blue-600 text-white" : "text-blue-600"}`}
            >
              <Camera className="h-4 w-4 mr-2" />
              Find My Photos
            </Button>
            <Button
              variant={activeTab === "gallery" ? "default" : "ghost"}
              onClick={() => setActiveTab("gallery")}
              className={`${activeTab === "gallery" ? "bg-blue-600 text-white" : "text-blue-600"}`}
            >
              <Users className="h-4 w-4 mr-2" />
              All Photos
            </Button>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "selfie" ? (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-2">Find Your Photos</h2>
                <p className="text-blue-700">
                  Upload a clear selfie and we'll find all photos you appear in using AI face recognition
                </p>
              </div>

              <SelfieUploader onSelfieUpload={handleSelfieMatch} isMatching={isMatching} />

              {matchedPhotos.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                      Found {matchedPhotos.length} photos with you!
                    </h3>
                    <Button
                      onClick={() => setActiveTab("gallery")}
                      variant="outline"
                      className="border-blue-200 text-blue-600"
                    >
                      View All Matches
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {matchedPhotos.slice(0, 6).map((photo, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group cursor-pointer"
                      >
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Match ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" className="bg-white/90 text-blue-600 hover:bg-white">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <PhotoGallery
              photos={
                matchedPhotos.length > 0
                  ? matchedPhotos
                  : [
                      "/placeholder.svg?height=400&width=300",
                      "/placeholder.svg?height=300&width=400",
                      "/placeholder.svg?height=350&width=350",
                      "/placeholder.svg?height=400&width=280",
                      "/placeholder.svg?height=320&width=400",
                      "/placeholder.svg?height=380&width=320",
                      "/placeholder.svg?height=300&width=300",
                      "/placeholder.svg?height=400&width=350",
                    ]
              }
              eventCode={params.code}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}
