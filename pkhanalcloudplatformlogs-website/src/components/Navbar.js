import styles from "../styles/Navbar.module.css";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <Link href="/"><h1 className={styles.logo}>pkhanalcloudlogs</h1></Link>
    </header>
  );
};

export default Navbar;
