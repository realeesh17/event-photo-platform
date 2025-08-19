import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function MainUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/user/login");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/user/login");
  };

  if (loading) return <p>Checking authentication...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to the Main User Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
