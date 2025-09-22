import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <Link href="/signup">
          <button className={styles.topButton}>Sign Up</button>
        </Link>
        <Link href="/login">
          <button className={styles.topButton}>Sign In</button>
        </Link>
      </div>

      {/* Main Center Content */}
      <main className={styles.main}>
        <div className={styles.centerText}>
          <h1 className={styles.group28}>Group 28</h1>
          <h2 className={styles.contactManager}>Contact Manager</h2>
        </div>

        <div className={styles.centerButtons}>
          <Link href="/signup">
            <button className={styles.mainButton}>Sign Up</button>
          </Link>
          <Link href="/login">
            <button className={styles.mainButton}>Sign In</button>
          </Link>
        </div>
      </main>
    </div>
  );
}
