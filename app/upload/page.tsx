"use client";

import { useState } from "react";
import { UploadCloud, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "@/lib/firebase"; // ✅ Your Firebase config

export default function UploadPage() {
  const [eventCode, setEventCode] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (!eventCode || files.length === 0) return;

    setUploading(true);
    setProgress(0);
    setSuccess(false);

    const storage = getStorage(app);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, `events/${eventCode}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const totalProgress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(Math.floor((totalProgress + i * 100) / files.length));
          },
          reject,
          () => resolve()
        );
      });
    }

    setUploading(false);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen py-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <Card className="max-w-xl mx-auto shadow-lg border-blue-200">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-900">Upload Event Photos</h1>
            <p className="text-blue-600 text-sm">
              Select your event code and upload multiple images
            </p>
          </div>

          <Input
            placeholder="Enter Event Code"
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value)}
            className="border-blue-200"
          />

          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="border-blue-200"
          />

          <div className="grid grid-cols-3 gap-3">
            {files.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                alt="preview"
                className="rounded-md h-24 object-cover"
              />
            ))}
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploading || files.length === 0 || !eventCode}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4 mr-2" />
                Upload Photos
              </>
            )}
          </Button>

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-blue-600 text-center">{progress}%</p>
            </div>
          )}

          {success && (
            <div className="text-center text-green-600 font-medium flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Upload Complete!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
