// Navbar.jsx
import styles from "../styles/Navbar.module.css";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <Link href="/">
        <h1 className={styles.logo}>pkhanalcloudlogs</h1>
      </Link>
      <nav className={styles.menu}>
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <Link href="../diagram-generator" className={styles.menuLink}>GenAr</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;