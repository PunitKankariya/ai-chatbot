


import React, { useRef, useState, useMemo } from "react";
import AppLayout from "../components/ui/AppLayout";

export default function NotesPage() {
  const [notes, setNotes] = useState([
    {
      id: "1",
      title: "Operating Systems: Scheduling",
      content: "FCFS, SJF, Priority, Round Robin... pros/cons and use cases.",
      tags: ["OS", "Exam"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "DBMS: Normalization",
      content: "1NF, 2NF, 3NF, BCNF with examples and anomalies removed.",
      tags: ["DBMS"],
      createdAt: new Date().toISOString(),
    },
  ]);
  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState({ title: "", content: "", tags: "" });
  const pdfInputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return notes;
    const q = query.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.join(",").toLowerCase().includes(q)
    );
  }, [notes, query]);

  const addNote = () => {
    if (!draft.title.trim() || !draft.content.trim()) return;
    const newNote = {
      id: Date.now().toString(),
      title: draft.title.trim(),
      content: draft.content.trim(),
      tags: draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setDraft({ title: "", content: "", tags: "" });
    setIsAdding(false);
  };

  const deleteNote = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));

  const handlePdfSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newNote = {
      id: Date.now().toString(),
      title: file.name.replace(/\.pdf$/i, ""),
      content: `Attached PDF: ${file.name}`,
      tags: ["PDF"],
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    e.target.value = "";
  };

  return (
    <AppLayout>
      <div className="h-full p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">📒 Notes</h1>
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes..."
              className="px-3 py-2 rounded-lg bg-white/10 placeholder-white/60"
            />
            <button
              onClick={() => setIsAdding((v) => !v)}
              className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700"
            >
              {isAdding ? "Close" : "New note"}
            </button>
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handlePdfSelected}
            />
            <button
              onClick={() => pdfInputRef.current?.click()}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              Upload PDF
            </button>
          </div>
        </div>

        {isAdding && (
          <div className="mb-6 grid gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Note title"
              className="px-3 py-2 rounded-lg bg-white/10 placeholder-white/60"
            />
            <textarea
              value={draft.content}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              placeholder="Write your note..."
              rows={4}
              className="px-3 py-2 rounded-lg bg-white/10 placeholder-white/60"
            />
            <input
              value={draft.tags}
              onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
              placeholder="Comma-separated tags (e.g., OS, Exam)"
              className="px-3 py-2 rounded-lg bg-white/10 placeholder-white/60"
            />
            <div className="flex justify-end">
              <button
                onClick={addNote}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((n) => (
            <article key={n.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <header className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-lg">{n.title}</h2>
                <button
                  onClick={() => deleteNote(n.id)}
                  className="text-sm px-2 py-1 rounded-md bg-red-600/80 hover:bg-red-700"
                >
                  Delete
                </button>
              </header>
              <p className="mt-2 text-white/80 text-sm leading-relaxed">
                {n.content}
              </p>
              <footer className="mt-3 flex items-center justify-between text-xs text-white/60">
                <div className="flex gap-2 flex-wrap">
                  {n.tags.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/10 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
                <time>{new Date(n.createdAt).toLocaleString()}</time>
              </footer>
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="text-white/70">No notes found.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}