"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { apiRequest } from "@/lib/api";

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

type Filter = "All" | "Todo" | "Done";

export default function Home() {
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  /* 🔐 Protect page + Load notes */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchNotes = async () => {
      try {
        const data = await apiRequest("/api/notes");
        setNotes(data);
      } catch (error) {
        console.error("Failed to load notes", error);
      }
    };

    fetchNotes();
  }, [router]);

  /* ➕ Add note → Backend */
  const handleAddNote = async (note: Note) => {
    try {
      const newNote = await apiRequest("/api/notes", {
        method: "POST",
        body: JSON.stringify(note),
      });

      setNotes((prev) => [...prev, newNote]);
    } catch (error) {
      console.error("Failed to add note", error);
    }
  };

  /* ❌ Delete note → Backend */
  const handleDelete = async (id: number) => {
    try {
      await apiRequest(`/api/notes/${id}`, {
        method: "DELETE",
      });

      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  /* ✏️ Edit note (frontend only for now) */
  const handleEditSave = (id: number) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, title: editText } : n
      )
    );
    setEditingId(null);
  };

  /* 🔍 Filter + Search */
  const filteredNotes = notes.filter((note) => {
    if (filter === "Todo" && note.completed) return false;
    if (filter === "Done" && !note.completed) return false;

    if (searchText.trim() !== "") {
      return note.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
    }

    return true;
  });

  return (
    <div>
      <Header />

      <div className="header">
        <h1>TODO LIST</h1>
      </div>

      <div className="sub-header">
        <Search onSearch={setSearchText} />

        <Dropdown
          value={filter}
          onChange={(value: Filter) => {
            setFilter(value);
            setSearchText("");
          }}
        />

        <ThemeToggle />
      </div>

      {/* 📝 Notes */}
      <div
        style={{
          maxWidth: "720px",
          margin: "24px auto 0",
          padding: "0 16px",
          textAlign: "center",
        }}
      >
        {filteredNotes.length === 0 ? (
          <>
            <Image
              src="/empty-notes.svg"
              alt="No notes"
              width={280}
              height={280}
              priority
            />
            <p style={{ marginTop: 12, color: "#888" }}>
              No notes yet. Add your first note ✨
            </p>
          </>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="note-row">
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
          ))
        )}
      </div>

      <AddNoteDialog onAddNote={handleAddNote} />
    </div>
  );
}
