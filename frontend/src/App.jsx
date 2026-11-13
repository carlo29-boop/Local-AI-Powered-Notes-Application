
import { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Sparkles,
  Loader2,
  Brain,
  X,
  RefreshCw,
  TrendingUp,
  Meh,
  Frown,
  Smile,
} from "lucide-react";

import { noteApi } from "./services/noteApi";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  async function fetchNotes() {
    try {
      setLoading(true);
      setError("");

      const data = await noteApi.getAll();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  async function handleCreateNote(e) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    try {
      setLoading(true);
      setError("");

      await noteApi.create({
        title: title.trim(),
        content: content.trim(),
      });

      setTitle("");
      setContent("");
      setShowForm(false);

      await fetchNotes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze(id) {
    try {
      setAnalyzing(id);
      setError("");

      const result = await noteApi.analyze(id);

      setSelectedAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(null);
    }
  }

  const filteredNotes = notes.filter((note) =>
    `${note.title} ${note.content}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function getSentimentIcon(sentiment) {
    const value = sentiment?.toLowerCase();

    if (value === "positive") return Smile;
    if (value === "negative") return Frown;

    return Meh;
  }

  function getSentimentColor(sentiment) {
    const value = sentiment?.toLowerCase();

    if (value === "positive") return "text-green-600 bg-green-50";
    if (value === "negative") return "text-red-600 bg-red-50";

    return "text-yellow-700 bg-yellow-50";
  }

  const SentimentIcon = selectedAnalysis
    ? getSentimentIcon(selectedAnalysis.sentiment)
    : Meh;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-end px-6 py-4">

          {/* <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2 text-white">
              <Brain size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                NoteMind
              </h1>
              <p className="text-xs text-slate-500">
                Smart Notes & Sentiment Analysis
              </p>
            </div>
          </div> */}

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            New Note
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <X size={18} />
            </button>
          </div>
        )}

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-1">

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Notes</p>
                <h3 className="mt-2 text-3xl font-bold">
                  {notes.length}
                </h3>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <FileText size={24} />
              </div>
            </div>
          </div>
        </section>

        {/* Search and refresh */}
        <section className="mb-6 flex flex-col gap-3 sm:flex-row">

          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-3.5 text-slate-400"
              size={18}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your notes..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            onClick={fetchNotes}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </section>

        {/* Notes */}
        <section>
          {loading && notes.length === 0 ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <FileText className="mx-auto mb-4 text-slate-300" size={42} />

              <h3 className="font-semibold">
                No notes found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Create your first note to get started.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-5 text-sm font-semibold text-indigo-600"
              >
                Create a note
              </button>
            </div>
          ) : (

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {filteredNotes.map((note) => (
                <article
                  key={note.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                >

                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                      <FileText size={20} />
                    </div>

                    <span className="text-xs text-slate-400">
                      Note #{note.id}
                    </span>
                  </div>

                  <h3 className="mb-2 truncate text-lg font-bold">
                    {note.title}
                  </h3>

                  <p className="mb-6 line-clamp-4 min-h-20 text-sm leading-6 text-slate-500">
                    {note.content}
                  </p>

                  <button
                    onClick={() => handleAnalyze(note.id)}
                    disabled={analyzing === note.id}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-600 hover:text-white disabled:opacity-50"
                  >
                    {analyzing === note.id ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Sparkles size={17} />
                    )}

                    {analyzing === note.id
                      ? "Analyzing..."
                      : "Analyze Sentiment"}
                  </button>

                </article>
              ))}

            </div>
          )}
        </section>

      </main>

      {/* Create Note Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Create a Note</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Write down your thoughts.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNote}>

              <label className="mb-2 block text-sm font-semibold">
                Title
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
                maxLength={200}
                required
                className="mb-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <label className="mb-2 block text-sm font-semibold">
                Content
              </label>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
                rows={6}
                maxLength={10000}
                required
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                Save Note
              </button>

            </form>
          </div>
        </div>
      )}

      {/* Sentiment Analysis Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <Brain size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Sentiment Analysis
                  </h2>
                  <p className="text-xs text-slate-500">
                    Note #{selectedAnalysis.note_id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAnalysis(null)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <h3 className="font-bold">
                {selectedAnalysis.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {selectedAnalysis.content}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 p-5">

              <p className="text-sm font-medium text-slate-500">
                Detected Sentiment
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className={`rounded-xl p-3 ${getSentimentColor(selectedAnalysis.sentiment)}`}>
                  <SentimentIcon size={30} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold capitalize">
                    {selectedAnalysis.sentiment}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sentiment classification
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Polarity
                  </span>

                  <span className="font-bold">
                    {Number(selectedAnalysis.polarity).toFixed(4)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          (Number(selectedAnalysis.polarity) + 1) * 50,
                          0
                        ),
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-slate-400">
  <span>Negative</span>

  <span className="flex flex-col items-center">
    <span>(0)</span>
    <span>Neutral</span>
  </span>

  <span>Positive</span>
</div>
              </div>

            </div>

            <button
              onClick={() => setSelectedAnalysis(null)}
              className="mt-5 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Close Analysis
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
