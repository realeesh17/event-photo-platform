import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">SnapShare</h1>

      <div className="space-x-6">
        <Link href="/upload">Upload</Link>
        <Link href="/feedback">Feedback</Link>

        {/* New Admin Events link */}
        <Link href="/admin/events" className="hover:underline">
          Admin Events
        </Link>
      </div>
    </nav>
  );
}
