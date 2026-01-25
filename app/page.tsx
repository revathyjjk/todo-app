
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

// 1. Updated Type to match MongoDB's _id
type Note = {
  _id: string;
  title: string;
  completed: boolean;
};

type Filter = "All" | "Todo" | "Done";

export default function Home() {
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null); // string for _id
  const [editText, setEditText] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const getUserFromStorage = () => {
    const user = localStorage.getItem("user");
    if (!user) return null;

    try {
      return JSON.parse(user).name; // or .email
    } catch {
      return null;
    }
  };


  /* 🔐 Protect page + Load notes */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const name = getUserFromStorage();
    setUserEmail(name);

    console.log("User email:", userEmail);
    const fetchNotes = async () => {
      try {
        const data = await apiRequest("/notes");
        setNotes(data);
      } catch (error) {
        router.replace("/login");
      }
    };

    fetchNotes();
  }, [router]);


  /* ➕ Add note → Backend */
  const handleAddNote = async (noteData: Partial<Note>) => {
    try {
      const newNote = await apiRequest("/notes", {
        method: "POST",
        body: JSON.stringify({ title: noteData.title }),
      });

      setNotes((prev) => [newNote, ...prev]);
    } catch (error) {
      console.error("Failed to add note", error);
    }
  };

  /* ❌ Delete note → Backend */
  const handleDelete = async (id: string) => {
    try {
      await apiRequest(`/notes/${id}`, {
        method: "DELETE",
      });

      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  /* ✏️ Edit note → Backend */
  const handleEditSave = async (id: string) => {
    try {
      const updatedNote = await apiRequest(`/notes/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title: editText }),
      });

      setNotes((prev) =>
        prev.map((n) => (n._id === id ? updatedNote : n))
      );
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update note", error);
    }
  };

  /* ✅ Toggle Completion → Backend */
  const handleToggleComplete = async (note: Note) => {
    try {
      const updatedNote = await apiRequest(`/notes/${note._id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !note.completed }),
      });

      setNotes((prev) =>
        prev.map((n) => (n._id === note._id ? updatedNote : n))
      );
    } catch (error) {
      console.error("Failed to toggle completion", error);
    }
  };

  /* 🔍 Filter + Search Logic */
  const filteredNotes = notes.filter((note) => {
    if (filter === "Todo" && note.completed) return false;
    if (filter === "Done" && !note.completed) return false;

    if (searchText.trim() !== "") {
      return note.title.toLowerCase().includes(searchText.toLowerCase());
    }

    return true;
  });

  return (
    <div>
      <Header onLogout={handleLogout} email={userEmail ?? undefined} />

      {/* ✅ EVERYTHING that must be centered goes INSIDE .page */}
      <div className="page">
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

        {/* ✅ NOTES MUST BE INSIDE .page */}
        <div className="notes-container">
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <Image
                src="/empty-notes.svg"
                alt="No notes"
                width={280}
                height={280}
                priority
              />
              <p>No notes yet. Add your first note ✨</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div key={note._id} className="note-row">
                <input
                  type="checkbox"
                  className="note-checkbox"
                  checked={note.completed}
                  onChange={() => handleToggleComplete(note)}
                />

                {editingId === note._id ? (
                  <input
                    className="note-edit-input"
                    value={editText}
                    autoFocus
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => handleEditSave(note._id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditSave(note._id);
                    }}
                  />
                ) : (
                  <span
                    className={`note-text ${note.completed ? "note-completed" : ""
                      }`}
                  >
                    {note.title}
                  </span>
                )}

                <div className="note-actions">
                  <MdOutlineEdit
                    className="note-icon"
                    onClick={() => {
                      setEditingId(note._id);
                      setEditText(note.title);
                    }}
                  />
                  <RiDeleteBin6Line
                    className="note-icon delete"
                    onClick={() => handleDelete(note._id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AddNoteDialog onAddNote={handleAddNote} />
    </div>
  );
}
