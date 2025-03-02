import Navbar from "../components/Navbar";
import styles from "../styles/Blog.module.css";
import footer from "../styles/Footer.module.css";
import Link from "next/link";

const blogPosts = [
  { id: 1, title: "My First Blog Post", content: "This is my first blog post content." },
  { id: 2, title: "Learning Next.js", content: "This post is about learning Next.js and its features." }
];

export default function Blog() {
  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.blogContent}>
        <h2>My Blog Posts</h2>
        <div className={styles.postList}>
          {blogPosts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <Link href={`/post/${post.id}`} className={styles.readMore}>Read More</Link>
            </div>
          ))}
        </div>
      </section>

      <footer className={footer.footer}>
        <Link href="/">Back to Home</Link>
      </footer>
    </div>
  );
}
