"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, QrCode, Upload, Users, Calendar, MapPin, Eye, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Event {
  id: string
  name: string
  date: string
  location: string
  code: string
  totalPhotos: number
  totalViews: number
  status: "active" | "draft" | "ended"
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      name: "Sarah & John's Wedding",
      date: "2024-06-15",
      location: "Sunset Gardens",
      code: "WEDDING2024",
      totalPhotos: 247,
      totalViews: 1250,
      status: "active",
    },
    {
      id: "2",
      name: "College Reunion 2024",
      date: "2024-07-20",
      location: "University Campus",
      code: "REUNION24",
      totalPhotos: 156,
      totalViews: 890,
      status: "active",
    },
  ])

  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
  })

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateEvent = () => {
    const eventCode =
      newEvent.name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 8) + Math.floor(Math.random() * 100)

    const event: Event = {
      id: Date.now().toString(),
      name: newEvent.name,
      date: newEvent.date,
      location: newEvent.location,
      code: eventCode,
      totalPhotos: 0,
      totalViews: 0,
      status: "draft",
    }

    setEvents([...events, event])
    setNewEvent({ name: "", date: "", location: "", description: "" })
    setIsCreateDialogOpen(false)
  }

  const generateQRCode = (eventCode: string) => {
    // In a real app, you'd generate an actual QR code
    const qrData = `${window.location.origin}/event/${eventCode}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "ended":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Admin Dashboard</h1>
              <p className="text-blue-600">Manage your events and photo galleries</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="border-blue-200 text-blue-600">
                  Back to Site
                </Button>
              </Link>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="eventName">Event Name</Label>
                      <Input
                        id="eventName"
                        placeholder="e.g., Sarah & John's Wedding"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventDate">Date</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventLocation">Location</Label>
                      <Input
                        id="eventLocation"
                        placeholder="e.g., Sunset Gardens"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventDescription">Description (Optional)</Label>
                      <Textarea
                        id="eventDescription"
                        placeholder="Brief description of the event"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      />
                    </div>
                    <Button
                      onClick={handleCreateEvent}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={!newEvent.name || !newEvent.date || !newEvent.location}
                    >
                      Create Event
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Events</p>
                  <p className="text-2xl font-bold text-blue-900">{events.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Photos</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {events.reduce((sum, event) => sum + event.totalPhotos, 0)}
                  </p>
                </div>
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Views</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {events.reduce((sum, event) => sum + event.totalViews, 0)}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Active Events</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {events.filter((e) => e.status === "active").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Your Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-blue-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-blue-900">{event.name}</h3>
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-blue-600">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </span>
                        <span className="flex items-center">
                          <Upload className="h-4 w-4 mr-1" />
                          {event.totalPhotos} photos
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {event.totalViews} views
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                            <QrCode className="h-4 w-4 mr-1" />
                            QR Code
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                          <DialogHeader>
                            <DialogTitle>Event QR Code</DialogTitle>
                          </DialogHeader>
                          <div className="text-center space-y-4">
                            <img
                              src={generateQRCode(event.code) || "/placeholder.svg"}
                              alt="QR Code"
                              className="mx-auto"
                            />
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Event Code:</p>
                              <code className="bg-gray-100 px-3 py-1 rounded text-lg font-mono">{event.code}</code>
                            </div>
                            <Button
                              onClick={() => {
                                const link = document.createElement("a")
                                link.href = generateQRCode(event.code)
                                link.download = `${event.name}-qr-code.png`
                                link.click()
                              }}
                              className="w-full"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download QR Code
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Link href={`/event/${event.code}`}>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>

                      <Link href={`/upload?event=${event.code}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Upload className="h-4 w-4 mr-1" />
                          Upload Photos
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setEvents(events.filter((e) => e.id !== event.id))
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {events.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-blue-900 mb-2">No events yet</h3>
                  <p className="text-blue-600 mb-4">Create your first event to get started</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
