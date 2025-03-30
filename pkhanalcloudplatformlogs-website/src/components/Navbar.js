// Navbar.jsx
import styles from "../styles/Navbar.module.css";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <Link href="/">
        <h1 className={styles.logo}>pkhanalcloudlogs</h1>
      </Link>
      <div className={styles.menuContainer}>
        <div className={styles.hamburger}>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>
        <nav className={styles.menu}>
          <ul className={styles.menuList}>
            <li className={styles.menuItem}>
              <Link href="../diagram-generator" className={styles.menuLink}>GenAr</Link>
            </li>
            <li className={styles.menuItem}>
              <Link href="/memory-game" className={styles.menuLink}>RetroRun</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;