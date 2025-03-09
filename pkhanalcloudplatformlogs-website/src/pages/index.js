// src/pages/index.js
import { posts } from "../data/posts";
import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";
import footerStyles from "../styles/Footer.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [externalPosts, setExternalPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);

  useEffect(() => {
    const fetchExternalData = async () => {
      const fetchedPosts = [];

      for (let post of posts) {
        if (post.type === "external" && post.url) {
          try {
            const response = await fetch(`/api/fetchOpenGraph?url=${post.url}`);
            const data = await response.json();
            fetchedPosts.push({ ...post, metadata: data });
          } catch (error) {
            console.error("Error fetching external post data:", error);
          }
        }
      }
      setExternalPosts(fetchedPosts);
    };

    fetchExternalData();
  }, []);

  // Handle search filtering
  useEffect(() => {
    const results = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(results);
  }, [searchTerm]);

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.mainContent}>
        <h3>DevOps Decoded: Pipelines, Power, and Zero Downtime Glory</h3>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <section className={styles.postList}>
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className={post.type === "internal" ? styles.internalPost : styles.externalPost}
            >
              <h2>{post.title}</h2>
              {post.type === "internal" ? (
                <p>{post.content}</p>
              ) : (
                <div>
                  {externalPosts
                    .filter((p) => p.id === post.id)
                    .map((externalPost) => (
                      <div key={externalPost.id}>
                        <p>{externalPost.metadata?.description}</p>
                        <a
                          href={externalPost.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.localLink}
                        >
                          Read Full Article
                        </a>
                      </div>
                    ))}
                </div>
              )}
              {post.type === "internal" && (
                <Link href={`/post/${post.id}`} className={styles.readMore}>Read More</Link>
              )}
            </div>
          ))}
        </section>
        <footer className={footerStyles.footer}>
          <Link href="/about">About Me</Link>
        </footer>
      </main>
    </div>
  );
}