"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-md p-4 flex justify-between items-center">
      <Link href="/" className="text-white text-xl font-bold">
        SnapShare
      </Link>
      <div className="space-x-4">
        <Link href="/upload" className="text-white hover:underline">Upload</Link>
        <Link href="/feedback" className="text-white hover:underline">Feedback</Link>
      </div>
    </nav>
  );
}
