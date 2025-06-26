"use client"

import { useState, useEffect, useRef } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { motion } from "framer-motion"
import { QrCode, ArrowLeft, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function QRScanPage() {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(true)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    if (isScanning && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false,
      )

      scannerRef.current.render(
        (decodedText) => {
          setScanResult(decodedText)
          setIsScanning(false)
          scannerRef.current?.clear()

          // Redirect to event page
          if (decodedText.includes("event/")) {
            window.location.href = `/${decodedText}`
          } else {
            window.location.href = `/event/${decodedText}`
          }
        },
        (error) => {
          console.warn(`QR scan error: ${error}`)
        },
      )
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
        scannerRef.current = null
      }
    }
  }, [isScanning])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5 text-blue-600" />
            <span className="text-blue-600 font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">PhotoMatch</span>
          </div>
        </nav>
      </header>

      {/* Scanner */}
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-blue-900">
                <QrCode className="h-6 w-6" />
                <span>Scan QR Code</span>
              </CardTitle>
              <p className="text-blue-700">Point your camera at the event QR code</p>
            </CardHeader>
            <CardContent>
              {isScanning ? (
                <div className="space-y-4">
                  <div id="qr-reader" className="w-full"></div>
                  <div className="text-center">
                    <p className="text-sm text-blue-600 mb-4">
                      Make sure the QR code is clearly visible in the camera frame
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsScanning(false)
                        if (scannerRef.current) {
                          scannerRef.current.clear()
                        }
                      }}
                      className="border-blue-200 text-blue-600"
                    >
                      Cancel Scanning
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  {scanResult ? (
                    <div>
                      <p className="text-green-600 font-medium mb-2">QR Code Detected!</p>
                      <p className="text-sm text-gray-600 mb-4">Redirecting to event...</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-blue-700 mb-4">Scanning stopped</p>
                      <Button onClick={() => setIsScanning(true)} className="bg-blue-600 hover:bg-blue-700">
                        Start Scanning Again
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Card className="border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Scanning Tips:</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Hold your device steady</li>
                  <li>• Ensure good lighting</li>
                  <li>• Keep the QR code within the frame</li>
                  <li>• Allow camera permissions when prompted</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
