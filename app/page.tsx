"use client";

import { useState } from "react";

import Header from "@/components/header/header";
import Search from "@/components/Search/search";
import Dropdown from "@/components/dropdown/dropdown";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import AddNoteDialog from "@/components/footer/AddNoteDialog";

type Note = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);

  const handleAddNote = (note: Note) => {
    setNotes((prev) => [...prev, note]);
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

      {/* 📝 Notes list */}
      <div style={{ padding: "16px" }}>
        {notes.map((note) => (
          <div key={note.id}>
            #{note.id} — {note.title}
          </div>
        ))}
      </div>

      {/* ➕ Floating Add Note Dialog */}
      <AddNoteDialog onAddNote={handleAddNote} />
    </div>
  );
}
