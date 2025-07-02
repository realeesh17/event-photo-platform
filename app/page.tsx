"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, QrCode, Heart, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function LandingPage() {
  const [eventCode, setEventCode] = useState("");

  const handleEventAccess = () => {
    if (eventCode.trim()) {
      window.location.href = `/event/${eventCode}`;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Camera className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">EventPhoto</span>
          </motion.div>
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" className="text-primary border-border hover:bg-muted">
                Admin
              </Button>
            </Link>
            <Link href="/upload">
              <Button className="bg-primary text-primary-foreground hover:bg-accent">
                Upload Photos
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              Find Yourself in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Every Memory
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Upload a selfie and instantly discover all the photos you appear in from any event. Perfect for weddings,
              parties, trips, and special occasions.
            </p>
          </motion.div>

          {/* Event Code Entry */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto mb-12"
          >
            <Card className="border border-border shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Access Event Photos</h3>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter event code"
                      value={eventCode}
                      onChange={(e) => setEventCode(e.target.value)}
                      className="border-border focus-visible:ring-ring"
                      onKeyDown={(e) => e.key === "Enter" && handleEventAccess()}
                    />
                    <Button onClick={handleEventAccess} className="bg-primary hover:bg-accent text-white">
                      Go
                    </Button>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">or</div>
                  <Link href="/scan">
                    <Button variant="outline" className="w-full border-border text-primary hover:bg-muted">
                      <QrCode className="h-4 w-4 mr-2" />
                      Scan QR Code
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              icon: <Sparkles className="h-6 w-6 text-primary" />,
              title: "AI Face Recognition",
              desc: "Advanced AI finds all photos you're in automatically.",
            },
            {
              icon: <Upload className="h-6 w-6 text-primary" />,
              title: "Easy Upload",
              desc: "Upload a selfie and let the platform do the magic.",
            },
            {
              icon: <Heart className="h-6 w-6 text-primary" />,
              title: "Share & Connect",
              desc: "Like, comment, and share memories with friends.",
            },
          ].map((item, i) => (
            <Card key={i} className="border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-primary mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              "Enter Event Code",
              "Upload Selfie",
              "AI Matching",
              "Enjoy & Share",
            ].map((title, idx) => (
              <div key={idx} className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {idx + 1}
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
                <p className="text-muted-foreground">
                  {[
                    "Get the event code or scan the QR.",
                    "Take or upload your selfie.",
                    "Our AI finds all your moments.",
                    "Download & share your memories.",
                  ][idx]}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Camera className="h-6 w-6" />
            <span className="text-xl font-bold">EventPhoto</span>
          </div>
          <p className="text-sm text-primary-foreground/80">
            Making memories accessible through AI-powered face recognition.
          </p>
        </div>
      </footer>
    </div>
  );
}
