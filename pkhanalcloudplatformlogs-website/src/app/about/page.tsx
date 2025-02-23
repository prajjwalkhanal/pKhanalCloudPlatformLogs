// src/app/about/page.tsx
import Navbar from "@/components/Navbar";

export default function About() {
  return (
    <main className="bg-gray-100 p-6">
      <Navbar />
      <h1 className="text-4xl font-extrabold text-gray-800">About Me</h1>
      <p className="mt-6 text-lg text-gray-700">
        DemoText
      </p>
      <ul className="mt-6 space-y-4">
        <li>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" className="text-blue-600 hover:text-blue-800">
            LinkedIn
          </a>
        </li>
        <li>
          <a href="https://github.com/your-username" target="_blank" className="text-blue-600 hover:text-blue-800">
            GitHub
          </a>
        </li>
      </ul>
    </main>
  );
}
