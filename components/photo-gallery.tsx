"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Download, Share2, MessageCircle, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface PhotoGalleryProps {
  photos: string[]
  eventCode: string
}

interface PhotoData {
  id: string
  url: string
  likes: number
  comments: Array<{ user: string; text: string; time: string }>
  isLiked: boolean
}

export function PhotoGallery({ photos, eventCode }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const [newComment, setNewComment] = useState("")

  // Mock photo data with interactions
  const [photoData, setPhotoData] = useState<PhotoData[]>(
    photos.map((url, index) => ({
      id: `photo-${index}`,
      url,
      likes: Math.floor(Math.random() * 20) + 1,
      comments: [
        { user: "Sarah", text: "Great shot! 📸", time: "2h ago" },
        { user: "Mike", text: "Love this moment ❤️", time: "1h ago" },
      ].slice(0, Math.floor(Math.random() * 3)),
      isLiked: Math.random() > 0.7,
    })),
  )

  const handleLike = (photoId: string) => {
    setPhotoData((prev) =>
      prev.map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              isLiked: !photo.isLiked,
              likes: photo.isLiked ? photo.likes - 1 : photo.likes + 1,
            }
          : photo,
      ),
    )
  }

  const handleComment = (photoId: string) => {
    if (newComment.trim()) {
      setPhotoData((prev) =>
        prev.map((photo) =>
          photo.id === photoId
            ? {
                ...photo,
                comments: [
                  ...photo.comments,
                  {
                    user: "You",
                    text: newComment,
                    time: "now",
                  },
                ],
              }
            : photo,
        ),
      )
      setNewComment("")
    }
  }

  const handleDownload = (photoUrl: string, index: number) => {
    // In a real app, this would download the actual image
    const link = document.createElement("a")
    link.href = photoUrl
    link.download = `event-${eventCode}-photo-${index + 1}.jpg`
    link.click()
  }

  const handleShare = (photoUrl: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this photo!",
        url: photoUrl,
      })
    } else {
      navigator.clipboard.writeText(photoUrl)
      // You could show a toast notification here
    }
  }

  const navigatePhoto = (direction: "prev" | "next") => {
    if (selectedPhoto === null) return

    if (direction === "prev") {
      setSelectedPhoto(selectedPhoto > 0 ? selectedPhoto - 1 : photos.length - 1)
    } else {
      setSelectedPhoto(selectedPhoto < photos.length - 1 ? selectedPhoto + 1 : 0)
    }
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {photoData.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="break-inside-avoid"
          >
            <Card className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <img
                  src={photo.url || "/placeholder.svg"}
                  alt={`Event photo ${index + 1}`}
                  className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                  onClick={() => setSelectedPhoto(index)}
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 text-gray-700 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLike(photo.id)
                        }}
                      >
                        <Heart className={`h-4 w-4 ${photo.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        <span className="ml-1">{photo.likes}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 text-gray-700 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedPhoto(index)
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="ml-1">{photo.comments.length}</span>
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 text-gray-700 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShare(photo.url)
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 text-gray-700 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(photo.url, index)
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Photo Modal */}
      <Dialog open={selectedPhoto !== null} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
          {selectedPhoto !== null && (
            <div className="flex h-full">
              {/* Image Section */}
              <div className="flex-1 relative bg-black flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setSelectedPhoto(null)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => navigatePhoto("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => navigatePhoto("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <img
                  src={photoData[selectedPhoto].url || "/placeholder.svg"}
                  alt={`Event photo ${selectedPhoto + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Sidebar */}
              <div className="w-80 bg-white flex flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Photo Details</h3>
                    <span className="text-sm text-gray-500">
                      {selectedPhoto + 1} of {photos.length}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={photoData[selectedPhoto].isLiked ? "default" : "outline"}
                      onClick={() => handleLike(photoData[selectedPhoto].id)}
                      className={photoData[selectedPhoto].isLiked ? "bg-red-500 hover:bg-red-600" : ""}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${photoData[selectedPhoto].isLiked ? "fill-white" : ""}`} />
                      {photoData[selectedPhoto].likes}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleShare(photoData[selectedPhoto].url)}>
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(photoData[selectedPhoto].url, selectedPhoto)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Comments */}
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 p-4 overflow-y-auto">
                    <h4 className="font-medium text-gray-900 mb-3">Comments</h4>
                    <div className="space-y-3">
                      {photoData[selectedPhoto].comments.map((comment, index) => (
                        <div key={index} className="flex space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">{comment.user[0]}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                              <span className="text-xs text-gray-500">{comment.time}</span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Comment */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleComment(photoData[selectedPhoto].id)
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleComment(photoData[selectedPhoto].id)}
                        disabled={!newComment.trim()}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
