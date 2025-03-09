import Navbar from '../components/Navbar';
import styles from '../styles/About.module.css';
import footerStyles from '../styles/Footer.module.css';
import Link from 'next/link';

export default function About() {
  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.aboutContent}>
        <h2>Hi, I’m Prajjwal Khanal</h2>
        <p>
          I’m a <strong>DevOps Engineer</strong> working in the healthcare industry, where I get to contribute to systems that make a difference. Tech has been my home for as long as I can remember, and I’m grateful to have spent my career exploring its possibilities.
        </p>
        <p>
          Right now, I’m focused on building and optimizing cloud infrastructure—trying to make things a little smoother, a little smarter. I’ve always been drawn to innovation and the way technology keeps pushing us forward. It’s humbling to be part of that journey, learning every day and tackling new challenges.
        </p>
        <p>
          Outside of work, I enjoy digging into the latest tools and ideas in tech, often with a cup of tea in hand. I’m just here to share what I’ve picked up along the way and maybe inspire someone else to dive into this amazing field.
        </p>
        <div className={styles.links}>
          <a
            href="https://www.linkedin.com/in/prajjwalkhanal/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/prajjwalkhanal"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </section>

      <footer className={footerStyles.footer}>
        <Link href="/">Back to Home</Link>
      </footer>
    </div>
  );
}