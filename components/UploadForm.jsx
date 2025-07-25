import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import { storage, db } from "../firebase"; // if exported already

export default function UploadForm() 
{
  const [file, setFile] = useState(null);
  const [eventCode, setEventCode] = useState("");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file || !eventCode) {
      alert("Please select a file and enter event code");
      return;
    }

    const storageRef = ref(storage, `${eventCode}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(percent);
      },
      (error) => {
        console.error("Upload error:", error);
        setMessage("Upload failed ❌");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        await addDoc(collection(db, "eventPhotos"), {
          eventCode,
          fileName: file.name,
          url: downloadURL,
          uploadedAt: Timestamp.now(),
        });

        setMessage("✅ Upload complete & metadata saved!");
        setProgress(0);
        setFile(null);
        setEventCode("");
      }
    );
  };

  // Add JSX to use the state variables and handler
  return (
    <div>
      <h2>Upload Photo</h2>
      <input
        type="file"
        onChange={e => setFile(e.target.files[0])}
        accept="image/*"
      />
      <input
        type="text"
        placeholder="Event Code"
        value={eventCode}
        onChange={e => setEventCode(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
      {progress > 0 && <div>Progress: {progress}%</div>}
      {message && <div>{message}</div>}
    </div>
  );
}
