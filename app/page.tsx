"use client";

import { useState } from "react";

import Header from "@/components/header/header";
import Search from "@/components/Search/search";
import Dropdown from "@/components/dropdown/dropdown";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import AddNoteDialog from "@/components/footer/AddNoteDialog";

import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import "@/components/footer/note.css";

type Note = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handleAddNote = (note: Note) => {
    setNotes((prev) => [...prev, note]);
  };

  const handleDelete = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleEditSave = (id: number) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, title: editText } : n
      )
    );
    setEditingId(null);
  };

  return (
    <div>
      <Header />

      <div className="header">
        <h1>TODO LIST</h1>
      </div>

      <div className="sub-header">
        <Search />
        <Dropdown />
        <ThemeToggle />
      </div>

      {/* 📝 Notes */}
      <div
        style={{
          maxWidth: "720px",
          margin: "24px auto 0",
          padding: "0 16px",
        }}
      >
        {notes.map((note) => (
          <div key={note.id} className="note-row">
            {/* Checkbox */}
            <input
              type="checkbox"
              className="note-checkbox"
              checked={note.completed}
              onChange={() =>
                setNotes((prev) =>
                  prev.map((n) =>
                    n.id === note.id
                      ? { ...n, completed: !n.completed }
                      : n
                  )
                )
              }
            />

            {/* Text / Edit input */}
            {editingId === note.id ? (
              <input
                className="note-edit-input"
                value={editText}
                autoFocus
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => handleEditSave(note.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEditSave(note.id);
                  }
                }}
              />
            ) : (
              <span
                className={`note-text ${
                  note.completed ? "note-completed" : ""
                }`}
              >
                {note.title}
              </span>
            )}

            {/* Actions */}
            <div className="note-actions">
              <MdOutlineEdit
                className="note-icon"
                onClick={() => {
                  setEditingId(note.id);
                  setEditText(note.title);
                }}
              />

              <RiDeleteBin6Line
                className="note-icon delete"
                onClick={() => handleDelete(note.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ➕ Add Note Dialog */}
      <AddNoteDialog onAddNote={handleAddNote} />
    </div>
  );
}
