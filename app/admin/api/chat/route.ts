import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();
  const query = message.toLowerCase();

  // Custom smart replies
  const answers: { [key: string]: string } = {
    upload:
      "To upload photos, go to the event page and click the 'Upload Photos' button. Make sure you select the correct event!",
    "event code":
      "Your event code is a unique ID used to view photos from your specific event. You can get it from the event organizer or QR code.",
    gallery:
      "To view photos, enter the event code on the homepage or scan the event QR code. You'll only see images matched to your face! 😊",
    match:
      "Face matching happens automatically once the admin uploads reference selfies. Just enter your event code to view matched photos.",
    feedback:
      "To leave feedback, scroll to the bottom of the page and use the form. We’d love to hear from you! 💙",
    help:
      "Sure! Ask me anything about uploading, viewing photos, or event codes. I’m here for you. 💬",
    contact:
      "You can contact the event admin by email or phone if they’ve provided it. Or just drop feedback and we’ll reach out!",
  };

  // Check if any keyword matches
  const matchedKey = Object.keys(answers).find((keyword) =>
    query.includes(keyword)
  );

  const reply =
    matchedKey != null
      ? answers[matchedKey]
      : "Hmm 🤔 I’m not sure about that, but you can try asking about 'upload', 'event code', 'gallery', 'match', or 'feedback'.";

  return NextResponse.json({ reply });
}
