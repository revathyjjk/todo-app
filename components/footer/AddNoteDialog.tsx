"use client";

import { useState } from "react";
import AddNoteButton from "./AddNoteButton";
import styles from "./AddNoteDialog.module.css";

type Note = {
  id: number;
  title: string;
  completed: boolean;
};

export default function AddNoteDialog({
  onAddNote,
}: {
  onAddNote: (note: Note) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;

    onAddNote({
      id: Date.now(),
      title,
      completed: false,
    });

    setTitle("");
    setOpen(false);
  };

  return (
    <>
      {/* ➕ Floating Button */}
      <AddNoteButton onClick={() => setOpen(true)} />

      {open && (
        <div className={styles.overlay}>
          <div className={styles.dialog}>
            <h2 className={styles.title}>NEW NOTE</h2>

            <input
              type="text"
              placeholder="Input your note..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />

            <div className={styles.actions}>
              <button
                onClick={() => setOpen(false)}
                className={styles.cancel}
              >
                CANCEL
              </button>

              <button
                onClick={handleAdd}
                className={styles.apply}
              >
                APPLY
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
