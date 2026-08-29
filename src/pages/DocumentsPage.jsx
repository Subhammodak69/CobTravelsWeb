// DocumentsPage.jsx
import { useEffect, useRef, useState } from "react";
import { Download, FileText, FolderUp, LoaderCircle, Trash2, Upload, X } from "lucide-react";
import { fetchDocuments, uploadDocument, downloadDocument, deleteDocument, uploadFile } from "../api";

const DOCUMENT_TYPES = ["ID_PROOF", "PASSPORT", "VISA", "TICKET", "INSURANCE", "OTHER"];
const EMPTY_FORM = { fileUrl: "", fileName: "", fileSize: 0, fileType: "", documentType: "ID_PROOF", title: "", description: "" };

const formatDate = (value) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
const formatSize = (value) => {
  if (!value) return "Unknown size";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(0)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};
const label = (value) => (value || "OTHER").replace(/_/g, " ");

export default function DocumentsPage() {
  const fileInput = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState("incoming");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadDocuments = () => {
    setLoading(true);
    fetchDocuments()
      .then((response) => {
        const data = response?.data;
        setDocuments(Array.isArray(data) ? data : data?.items || data?.results || []);
      })
      .catch((err) => setError(err.message || "Could not load documents."))
      .finally(() => setLoading(false));
  };
  useEffect(() => { loadDocuments(); }, []);

  const isOutgoing = (doc) => {
    // If the API provides a direction field, use it
    if (doc.direction) return doc.direction === "outgoing";
    // Otherwise, try to infer from uploaded_by
    return doc.uploaded_by === "CUSTOMER" || doc.uploaded_by === "customer";
  };
  const visibleDocuments = documents.filter((doc) => (activeTab === "outgoing" ? isOutgoing(doc) : !isOutgoing(doc)));

  const setField = (name, value) => setForm((curr) => ({ ...curr, [name]: value }));
  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setError("");
    if (fileInput.current) fileInput.current.value = "";
  };

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const response = await uploadFile(file);
      const data = response?.data;
      if (!data?.url) throw new Error("Upload did not return a file URL.");
      setForm((curr) => ({ ...curr, fileUrl: data.url, fileName: file.name, fileSize: file.size, fileType: file.type }));
    } catch (err) {
      setError(err.message || "Could not upload file.");
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e) => { handleFile(e.target.files?.[0]); e.target.value = ""; };
  const onDrop = (e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files?.[0]); };
  const onDragOver = (e) => { e.preventDefault(); if (!uploading) setDragActive(true); };
  const onDragLeave = (e) => { e.preventDefault(); setDragActive(false); };
  const clearFile = () => {
    setForm((curr) => ({ ...curr, fileUrl: "", fileName: "", fileSize: 0, fileType: "" }));
    if (fileInput.current) fileInput.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (uploading) return setError("Please wait for the file to finish uploading.");
    if (!form.fileUrl) return setError("Choose a document before uploading.");
    setBusy(true); setError(""); setNotice("");
    try {
      await uploadDocument({ 
        fileUrl: form.fileUrl, 
        documentType: form.documentType, 
        title: form.title, 
        description: form.description 
      });
      setNotice("Document uploaded successfully.");
      closeModal();
      loadDocuments();
    } catch (err) {
      setError(err.message || "Could not upload document.");
    } finally {
      setBusy(false);
    }
  };

  const download = async (doc) => {
    try {
      const response = await downloadDocument(doc.id);
      const url = response?.data?.download_url;
      if (!url) throw new Error("Download link unavailable.");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err.message || "Could not prepare download.");
    }
  };

  const remove = async (doc) => {
    if (!window.confirm(`Delete ${doc.file_name || "this document"}?`)) return;
    try {
      await deleteDocument(doc.id);
      setDocuments((curr) => curr.filter((item) => item.id !== doc.id));
      setNotice("Document deleted.");
    } catch (err) {
      setError(err.message || "Could not delete document.");
    }
  };

  return (
    <>
      <style>{`
        @keyframes optionFade {
          0% { opacity: 0; transform: translateY(-4px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="min-h-screen bg-[#f5f6f2] px-4 py-6 sm:px-6 lg:px-8 max-w-8xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-5 mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 mb-1">Travel files</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950 font-display">
              Your <span className="text-amber-500">documents.</span>
            </h1>
            <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">Keep files from your team and shared documents in one place.</p>
          </div>
          <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200/80" role="tablist">
            {["incoming", "outgoing"].map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl transition ${
                  activeTab === tab ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-950"
                }`}
              >
                {tab === "incoming" ? "Incoming" : "Outgoing"}
              </button>
            ))}
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-950 font-display">
              {activeTab === "incoming" ? "Received files" : "Files you shared"}
            </h2>
            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {visibleDocuments.length} {visibleDocuments.length === 1 ? "doc" : "docs"}
            </span>
          </div>
          {activeTab === "outgoing" && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 bg-amber-300 hover:bg-amber-200 text-slate-950 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm shadow-amber-300/20 transition"
            >
              <Upload size={14} /> Upload
            </button>
          )}
        </div>

        {/* NOTICE / ERROR */}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")}><X size={14} /></button>
          </div>
        )}
        {notice && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            {notice}
          </div>
        )}

        {/* DOCUMENT GRID */}
        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-slate-400">
            <LoaderCircle className="animate-spin" size={22} />
          </div>
        ) : visibleDocuments.length ? (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {visibleDocuments.map((doc) => (
              <article
                key={doc.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700">
                    <FileText size={17} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                    {label(doc.document_type)}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-950 truncate" title={doc.file_name}>
                  {doc.title || doc.file_name || "Untitled"}
                </h3>
                <p className="text-[10px] text-slate-400 truncate">{doc.file_name || "File"}</p>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-400">
                  <span>{formatDate(doc.uploaded_at)} · {formatSize(doc.file_size)}</span>
                  <div className="flex gap-0.5">
                    <button onClick={() => download(doc)} className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition" aria-label="Download">
                      <Download size={14} />
                    </button>
                    {doc.can_delete && (
                      <button onClick={() => remove(doc)} className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition" aria-label="Delete">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <FolderUp className="mx-auto text-amber-400" size={26} />
            <h3 className="mt-3 text-base font-semibold text-slate-950">No {activeTab} documents yet</h3>
            <p className="text-xs text-slate-500">Uploaded files will appear here when available.</p>
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-sm rounded-2xl bg-slate-950 p-5 text-white shadow-2xl">
              <button onClick={closeModal} className="absolute right-3 top-3 text-white/50 hover:text-white">
                <X size={18} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-300 text-slate-950">
                  <Upload size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold font-display">Upload a file</h2>
                  <p className="text-[10px] text-white/50">Share with your travel team</p>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-4">
                {/* File drop zone */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">File</p>
                  <div
                    onClick={() => !uploading && fileInput.current?.click()}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    className={`mt-1 flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed p-3 text-center transition ${
                      uploading ? "cursor-wait border-white/10 bg-white/5 opacity-70" : "cursor-pointer border-white/20 bg-white/5 hover:border-amber-300/60"
                    } ${dragActive ? "border-amber-300 bg-amber-300/10" : ""}`}
                  >
                    <input ref={fileInput} type="file" className="hidden" onChange={onInputChange} />
                    {uploading ? (
                      <>
                        <LoaderCircle className="animate-spin text-amber-300" size={18} />
                        <p className="text-[10px] text-white/50">Uploading...</p>
                      </>
                    ) : form.fileUrl ? (
                      <div className="flex w-full items-center gap-3 text-left">
                        {form.fileType?.startsWith("image/") ? (
                          <img src={form.fileUrl} alt={form.fileName} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-300/20 text-amber-300">
                            <FileText size={16} />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-white">{form.fileName}</p>
                          <p className="text-[10px] text-white/40">{formatSize(form.fileSize)}</p>
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); clearFile(); }} className="text-white/40 hover:text-white">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="text-white/40" size={18} />
                        <p className="text-[10px] text-white/50">Drag & drop, or <span className="font-bold text-amber-300">browse</span></p>
                      </>
                    )}
                  </div>
                </div>

                {/* Document type */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Document type</p>
                  <select
                    value={form.documentType}
                    onChange={(e) => setField("documentType", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none"
                  >
                    {DOCUMENT_TYPES.map((type) => (
                      <option key={type} value={type} className="text-slate-900">{label(type)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Title</p>
                  <input
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="e.g. Passport copy"
                    className="mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Description</p>
                  <textarea
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    rows="2"
                    placeholder="Add a note for your team"
                    className="mt-1 w-full resize-none rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy || uploading || !form.fileUrl}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-300 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busy ? <LoaderCircle className="animate-spin" size={16} /> : <Upload size={16} />}
                  {busy ? "Uploading..." : "Upload document"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}