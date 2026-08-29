import { useEffect, useRef, useState } from "react";
import { Download, FileText, FolderUp, LoaderCircle, Trash2, Upload, X } from "lucide-react";
import { deleteDocument, downloadDocument, fetchDocuments, uploadDocument, uploadFile } from "../api";
import { useTravel } from "../contexts/TravelContext";
import CustomSelect from "../components/CustomSelect";

const DOCUMENT_TYPES = ["ID_PROOF", "PASSPORT", "VISA", "TICKET", "INSURANCE", "OTHER"];
const EMPTY_FORM = { fileUrl: "", fileName: "", fileSize: 0, fileType: "", documentType: "ID_PROOF", title: "", description: "" };

function formatDate(value) { if (!value) return "Date unavailable"; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
function formatSize(value) { if (!value) return "Unknown size"; if (value < 1024) return `${value} B`; if (value < 1024 * 1024) return `${(value / 1024).toFixed(0)} KB`; return `${(value / (1024 * 1024)).toFixed(1)} MB`; }
function label(value) { return (value || "OTHER").replace(/_/g, " "); }

export default function DocumentsPage() {
  const { user } = useTravel();
  const fileInput = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState("incoming");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
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
  useEffect(() => { window.scrollTo({ top: 0 }); loadDocuments(); }, []);

  const isOutgoing = (document) => {
    const documentType = document.type?.toLowerCase();
    if (documentType === "incoming" || documentType === "outgoing") return documentType === "outgoing";
    const customerId = user?.id || user?.customer_id;
    return Boolean(customerId && document.uploaded_by_customer_id === customerId) || ["CUSTOMER", "customer"].includes(document.uploaded_by);
  };
  const visibleDocuments = documents.filter((document) => (activeTab === "outgoing" ? isOutgoing(document) : !isOutgoing(document)));

  const setField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

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
      setForm((current) => ({ ...current, fileUrl: data.url, fileName: file.name, fileSize: file.size, fileType: file.type }));
    } catch (err) {
      setError(err.message || "Could not upload file.");
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (event) => { handleFile(event.target.files?.[0]); event.target.value = ""; };
  const onDrop = (event) => { event.preventDefault(); setDragActive(false); handleFile(event.dataTransfer.files?.[0]); };
  const onDragOver = (event) => { event.preventDefault(); if (!uploading) setDragActive(true); };
  const onDragLeave = (event) => { event.preventDefault(); setDragActive(false); };
  const clearFile = () => {
    setForm((current) => ({ ...current, fileUrl: "", fileName: "", fileSize: 0, fileType: "" }));
    if (fileInput.current) fileInput.current.value = "";
  };

  const submit = async (event) => {
    event.preventDefault();
    if (uploading) return setError("Please wait for the file to finish uploading.");
    if (!form.fileUrl) return setError("Choose a document before uploading.");
    setBusy(true); setError(""); setNotice("");
    try {
      await uploadDocument({ fileUrl: form.fileUrl, documentType: form.documentType, title: form.title, description: form.description });
      setNotice("Document uploaded successfully.");
      closeModal();
      loadDocuments();
    } catch (err) {
      setError(err.message || "Could not upload document.");
    } finally {
      setBusy(false);
    }
  };

  const download = async (document) => {
    try {
      const response = await downloadDocument(document.id);
      const url = response?.data?.download_url;
      if (!url) throw new Error("Download link unavailable.");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err.message || "Could not prepare download.");
    }
  };

  const remove = async (document) => {
    if (!window.confirm(`Delete ${document.file_name || "this document"}?`)) return;
    try {
      await deleteDocument(document.id);
      setDocuments((current) => current.filter((item) => item.id !== document.id));
      setNotice("Document deleted.");
    } catch (err) {
      setError(err.message || "Could not delete document.");
    }
  };

  return (
    <>
      <style>{`
        @keyframes optionFade {
          0% { opacity: 0; transform: translateY(-8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <main className="min-h-screen bg-[#f5f6f2] px-5 pb-24 pt-28 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[90rem]">
        <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-rose-500">Travel files</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">Your <em className="text-amber-500">documents.</em></h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">Keep the files your travel team sends and the documents you share in one quiet place.</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200" role="tablist" aria-label="Document direction">
            {[{ id: "incoming", text: "Incoming" }, { id: "outgoing", text: "Outgoing" }].map((tab) => (
              <button key={tab.id} role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeTab === tab.id ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-950"}`}>{tab.text}</button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-slate-950">{activeTab === "incoming" ? "Received files" : "Files you shared"}</h2>
                <p className="mt-1 text-xs text-slate-500">{visibleDocuments.length} document{visibleDocuments.length === 1 ? "" : "s"}</p>
              </div>
              {activeTab === "outgoing" && (
                <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-bold text-slate-950 shadow-md shadow-amber-300/25 transition hover:-translate-y-0.5 hover:bg-amber-200">
                  <Upload size={18} /> Upload a file
                </button>
              )}
            </div>

            {error && (
              <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700" role="alert">
                <span>{error}</span>
                <button aria-label="Dismiss error" onClick={() => setError("")}><X size={17} /></button>
              </div>
            )}
            {notice && <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">{notice}</div>}

            {loading ? (
              <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-slate-500"><LoaderCircle className="animate-spin" size={24} /></div>
            ) : visibleDocuments.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {visibleDocuments.map((document) => (
                  <article key={document.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700"><FileText size={21} /></div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">{label(document.document_type)}</span>
                    </div>
                    <h3 className="mt-5 truncate text-base font-bold text-slate-950" title={document.file_name}>{document.title || document.file_name || "Untitled document"}</h3>
                    <p className="mt-1 truncate text-xs text-slate-400">{document.file_name || "File"}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] text-slate-500">
                      <span>{formatDate(document.uploaded_at)} · {formatSize(document.file_size)}</span>
                      <div className="flex gap-1">
                        <button onClick={() => download(document)} className="grid h-8 w-8 place-items-center rounded-xl text-slate-500 transition hover:bg-amber-100 hover:text-amber-700" aria-label={`Download ${document.file_name || "document"}`}><Download size={16} /></button>
                        {document.can_delete && (
                          <button onClick={() => remove(document)} className="grid h-8 w-8 place-items-center rounded-xl text-slate-500 transition hover:bg-rose-100 hover:text-rose-600" aria-label={`Delete ${document.file_name || "document"}`}><Trash2 size={16} /></button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <FolderUp className="mx-auto text-amber-500" size={30} />
                <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950">No {activeTab} documents yet</h3>
                <p className="mt-2 text-sm text-slate-500">Uploaded files will appear here when they are available.</p>
              </div>
            )}
          </section>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md rounded-3xl bg-slate-950 p-6 text-white shadow-2xl">
              <button onClick={closeModal} className="absolute right-4 top-4 rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white p-1.5" aria-label="Close modal"><X size={20} /></button>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-300 text-slate-950"><Upload size={19} /></div>
                <div>
                  <h2 className="font-display text-2xl font-semibold">Upload a file</h2>
                  <p className="text-xs text-white/55">Share it with your travel team</p>
                </div>
              </div>

              <form onSubmit={submit} className="mt-7">
                <div>
                  <p className="block text-xs font-bold uppercase tracking-wider text-white/65">File</p>
                  <div
                    onClick={() => !uploading && fileInput.current?.click()}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    className={`mt-2 flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition ${uploading ? "cursor-wait border-white/15 bg-white/5 opacity-70" : "cursor-pointer border-white/20 bg-white/5 hover:border-amber-300/60"} ${dragActive ? "border-amber-300 bg-amber-300/10" : ""}`}
                  >
                    <input ref={fileInput} type="file" className="hidden" onChange={onInputChange} />
                    {uploading ? (
                      <>
                        <LoaderCircle className="animate-spin text-amber-300" size={22} />
                        <p className="text-xs text-white/60">Uploading...</p>
                      </>
                    ) : form.fileUrl ? (
                      <div className="flex w-full items-center gap-3 text-left">
                        {form.fileType?.startsWith("image/") ? (
                          <img src={form.fileUrl} alt={form.fileName} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                        ) : (
                          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-amber-300/20 text-amber-300"><FileText size={22} /></div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-white">{form.fileName}</p>
                          <p className="text-[11px] text-white/50">{formatSize(form.fileSize)}</p>
                        </div>
                        <button type="button" onClick={(event) => { event.stopPropagation(); clearFile(); }} className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white" aria-label="Remove file"><X size={15} /></button>
                      </div>
                    ) : (
                      <>
                        <Upload className="text-white/50" size={22} />
                        <p className="text-xs text-white/60">Drag and drop, or <span className="font-bold text-amber-300">browse</span></p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="block text-xs font-bold uppercase tracking-wider text-white/65">Document type</p>
                  <div className="mt-2">
                    <CustomSelect
                      value={form.documentType}
                      options={DOCUMENT_TYPES.map((type) => ({ label: label(type), value: type }))}
                      onChange={(value) => setField("documentType", value)}
                      placeholder="Select document type"
                      triggerClassName="bg-white/10 border-white/15 text-white"
                    />
                  </div>
                </div>

                <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-white/65">Title
                  <input value={form.title} onChange={(event) => setField("title", event.target.value)} placeholder="e.g. Passport copy" className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm text-white outline-none placeholder:text-white/35" />
                </label>

                <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-white/65">Description
                  <textarea value={form.description} onChange={(event) => setField("description", event.target.value)} rows="3" placeholder="Add a note for your travel team" className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm text-white outline-none placeholder:text-white/35" />
                </label>

                <button type="submit" disabled={busy || uploading || !form.fileUrl} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50">
                  {busy ? <LoaderCircle className="animate-spin" size={17} /> : <Upload size={17} />} {busy ? "Uploading..." : "Upload document"}
                </button>
              </form>
            </div>
          </div>
        )}
        </div>
      </main>
    </>
  );
}