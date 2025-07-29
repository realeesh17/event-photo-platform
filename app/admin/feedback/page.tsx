import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type Feedback = {
  name: string;
  message: string;
  timestamp?: any;
};

const getFeedbackList = async (): Promise<Feedback[]> => {
  const querySnapshot = await getDocs(collection(db, "feedback"));
  return querySnapshot.docs.map((doc) => doc.data() as Feedback);
};

const AdminFeedbackViewer = async () => {
  const feedbackList = await getFeedbackList();

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
                  🕒 {fb.timestamp?.seconds
                    ? new Date(fb.timestamp.seconds * 1000).toLocaleString()
                    : ""}
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
