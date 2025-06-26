"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Camera, QrCode, Heart, Upload, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import UploadPage from "C:\Users\rakesh\Downloads\event-photo-platform\components\Upload.tsx'ge'"" // ✅ Add the upload functionality here if needed

export default function LandingPage() {
  const [eventCode, setEventCode] = useState("")

  const handleEventAccess = () => {
    if (eventCode.trim()) {
      window.location.href = `/event/${eventCode}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Camera className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">FaceTag</span>
          </motion.div>
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                Admin
              </Button>
            </Link>
            <Link href="/upload">
              <Button className="bg-blue-600 hover:bg-blue-700">Upload Photos</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6">
              Find Yourself in
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                {" "}Every Memory
              </span>
            </h1>
            <p className="text-xl text-blue-700 mb-8 max-w-3xl mx-auto">
              Upload a selfie and instantly discover all the photos you appear in from any event. Perfect for weddings,
              parties, trips, and special occasions.
            </p>
          </motion.div>

          {/* Event Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto mb-12"
          >
            <Card className="border-blue-200 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Access Event Photos</h3>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter event code"
                      value={eventCode}
                      onChange={(e) => setEventCode(e.target.value)}
                      className="border-blue-200 focus:border-blue-400"
                      onKeyDown={(e) => e.key === "Enter" && handleEventAccess()}
                    />
                    <Button onClick={handleEventAccess} className="bg-blue-600 hover:bg-blue-700">
                      Go
                    </Button>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-blue-600">or</span>
                  </div>
                  <Link href="/scan">
                    <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                      <QrCode className="h-4 w-4 mr-2" />
                      Scan QR Code
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Face Recognition</h3>
              <p className="text-blue-700">Advanced AI technology automatically finds all photos you appear in</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Easy Upload</h3>
              <p className="text-blue-700">Simply upload a selfie and let our AI do the matching work</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Share & Connect</h3>
              <p className="text-blue-700">Like, comment, and share your favorite memories with others</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Enter Event Code", desc: "Get the event code from organizer or scan QR" },
              { step: 2, title: "Upload Selfie", desc: "Take or upload a clear photo of yourself" },
              { step: 3, title: "AI Matching", desc: "Our AI finds all photos you appear in" },
              { step: 4, title: "Enjoy & Share", desc: "View, download, and share your memories" },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">{item.title}</h3>
                <p className="text-blue-700">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-cyan-300 transform -translate-x-8"></div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Camera className="h-6 w-6" />
            <span className="text-xl font-bold">FaceTag</span>
          </div>
          <p className="text-blue-200">Making memories accessible through AI-powered face recognition</p>
        </div>
      </footer>
    </div>
  )
}