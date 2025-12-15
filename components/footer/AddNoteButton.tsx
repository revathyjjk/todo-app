import { FaPlus } from "react-icons/fa";
import styles from "./AddNoteButton.module.css";

type AddNoteButtonProps = {
  onClick?: () => void;
};

export default function AddNoteButton({ onClick }: AddNoteButtonProps) {
  return (
    <button
      onClick={onClick}
      className={styles.addButton}
      aria-label="Add new note"
    >
      <FaPlus size={20} />
    </button>
  );
}

