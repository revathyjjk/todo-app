import styles from "./header.module.css";
import { IoMdLogOut } from "react-icons/io";
type HeaderProps = {
  onLogout: () => void;
  email?: string;
};

export default function Header({ onLogout, email }: HeaderProps) {
  return (
    <div className={styles.headerContainer}>
      {/* left empty column */}
      <div />

      {/* true center */}
      <div className={styles.headerCenter}>
        <h1 className={styles.headerTitle}>Welcome to Notepad!</h1>
      </div>

      {/* right */}
      <div className={styles.headerRight}>
        {email && <span className={styles.userName}>{email}</span>}
        <button className={styles.logoutButton} onClick={onLogout}>
          <IoMdLogOut />
        </button>
      </div>
    </div>
  );
}
