// src/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-xl font-bold">
          My Blog
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-indigo-300">Home</Link>
          <Link href="/about" className="hover:text-indigo-300">About</Link>
        </div>
      </div>
    </nav>
  );
}
