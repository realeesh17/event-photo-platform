"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-background border-b border-border text-foreground shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-primary">EventPhoto</h1>
      <div className="space-x-4">
        <Link href="/" className="hover:text-primary">Home</Link>
        <Link href="/upload" className="hover:text-primary">Upload</Link>
        <Link href="/view" className="hover:text-primary">View</Link>
        <Link href="/feedback" className="hover:text-primary">Feedback</Link>
      </div>
    </nav>
  );
}
