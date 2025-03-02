import Navbar from "../components/Navbar";
import styles from "../styles/About.module.css";
import footer from "../styles/Footer.module.css";
import Link from "next/link";

export default function About() {
  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.aboutContent}>
        <h2>About Me</h2>
        <p>
          Hi, I&apos;m [Your Name], a passionate developer focusing on cloud computing, IT, and programming. I love building scalable and efficient applications.
        </p>
        <div className={styles.links}>
          <a href="https://www.linkedin.com/in/yourlinkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/yourgithub" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </section>

      <footer className={footer.footer}>
        <Link href="/">Back to Home</Link>
      </footer>
    </div>
  );
}
