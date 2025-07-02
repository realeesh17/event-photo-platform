"use client"

import { useState } from "react"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { getFirestore, collection, addDoc } from "firebase/firestore"
import { app } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function AdminUploader() {
  const [name, setName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!name.trim() || !file) {
      alert("Please enter a valid name and select a photo.")
      return
    }

    setUploading(true)

    try {
      const storage = getStorage(app)
      const db = getFirestore(app)

      const filePath = `reference_faces/${Date.now()}-${name.replace(/\s+/g, "_")}.jpg`
      const fileRef = ref(storage, filePath)
      await uploadBytes(fileRef, file)
      const downloadURL = await getDownloadURL(fileRef)

      await addDoc(collection(db, "reference_faces"), {
        name: name.trim(),
        filePath,
        downloadURL,
        timestamp: new Date()
      })

      alert("Selfie uploaded successfully!")
      setName("")
      setFile(null)
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-4 p-6 bg-white rounded-xl shadow-md border border-blue-200">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Admin – Upload Reference Selfie</h2>

      <div className="mb-4">
        <Label htmlFor="name" className="text-sm text-blue-600 mb-1 block">Person’s Name</Label>
        <Input
          id="name"
          placeholder="e.g., Rakesh"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="file" className="text-sm text-blue-600 mb-1 block">Upload Selfie</Label>
        <Input
          id="file"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <Button onClick={handleUpload} disabled={uploading || !name || !file}>
        {uploading ? "Uploading..." : "Upload Selfie"}
      </Button>
    </div>
  )
}
