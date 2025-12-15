"use client";

import { useState } from "react";
import AddNoteButton from "./AddNoteButton";

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

      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-lg w-[300px]">
            <h2 className="text-lg font-semibold mb-4">Add New Note</h2>

            <input
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4 dark:bg-[#2a2a2a]"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm rounded-md border"
              >
                Cancel
              </button>

              <button
                onClick={handleAdd}
                className="px-4 py-2 text-sm rounded-md bg-indigo-500 text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
