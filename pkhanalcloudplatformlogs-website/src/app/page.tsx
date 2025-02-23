import Navbar from "@/components/Navbar";  // Correct import path

export default function BlogHome() {
  const posts = [
    { slug: "my-first-article", title: "My First Article", date: "2025-02-23", preview: "Introduction to my thoughts on software development." },
    { slug: "learning-nextjs", title: "Learning Next.js", date: "2025-02-22", preview: "Exploring Next.js for modern web apps." },
  ];

  const externalArticles = [
    { title: "Why TypeScript?", url: "https://blog.example.com/typescript", preview: "Understanding TypeScript in large projects." },
    { title: "Cloud Trends", url: "https://blog.example.com/cloud", preview: "Latest trends in cloud computing." },
  ];

  return (
    <main className="bg-gray-100 p-6">
      <Navbar />  {/* Navbar is correctly included here */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">My Blog</h1>

      <h2 className="text-2xl font-semibold mt-6 text-gray-700">📖 My Articles</h2>
      <ul className="mt-4 space-y-6">
        {posts.map(post => (
          <li key={post.slug} className="bg-white shadow-md rounded-md p-4">
            <a href={`/blog/${post.slug}`} className="text-xl font-bold text-indigo-600 hover:text-indigo-800">{post.title}</a>
            <p className="text-sm text-gray-500">{post.date}</p>
            <p className="text-gray-600">{post.preview}</p>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-8 text-gray-700">🔗 External Articles</h2>
      <ul className="mt-4 space-y-6">
        {externalArticles.map((article, index) => (
          <li key={index} className="bg-white shadow-md rounded-md p-4">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-indigo-600 hover:text-indigo-800">{article.title}</a>
            <p className="text-gray-600">{article.preview}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
