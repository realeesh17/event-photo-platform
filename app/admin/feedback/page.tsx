import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type Feedback = {
  name: string;
  message: string;
  timestamp?: any;
};

const AdminFeedbackViewer = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      const querySnapshot = await getDocs(collection(db, "feedback"));
      const feedbackData = querySnapshot.docs.map((doc) => doc.data() as Feedback);
      setFeedbackList(feedbackData);
    };

    fetchFeedback();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 User Feedback</h1>

      {feedbackList.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {feedbackList.map((fb, i) => (
            <div key={i} className="border p-4 rounded-xl shadow-sm bg-white">
              <h2 className="text-lg font-semibold">🧑 {fb.name}</h2>
              <p className="mt-2">💬 {fb.message}</p>
              {fb.timestamp && (
                <p className="text-sm text-gray-500 mt-1">
                  🕒 {new Date(fb.timestamp.seconds * 1000).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackViewer;
