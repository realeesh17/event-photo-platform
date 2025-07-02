"use client"

import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"

export default function FeedbackPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!name || !email || !message) return

    setLoading(true)
    try {
      await addDoc(collection(db, "feedbacks"), {
        name,
        email,
        message,
        timestamp: Timestamp.now()
      })
      setSuccess(true)
      setName("")
      setEmail("")
      setMessage("")
    } catch (error) {
      console.error("Error submitting feedback:", error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen py-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <Card className="max-w-xl mx-auto shadow-md border-blue-200">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center text-blue-900">Send Us Feedback</h1>
          <p className="text-sm text-center text-blue-600">
            Let us know what you think or suggest improvements!
          </p>

          <Input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-blue-200"
          />

          <Input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-blue-200"
          />

          <Textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border-blue-200"
          />

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>

          {success && (
            <div className="text-green-600 text-center flex items-center justify-center gap-2 mt-2">
              <CheckCircle className="h-5 w-5" />
              Thank you! Feedback sent.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
