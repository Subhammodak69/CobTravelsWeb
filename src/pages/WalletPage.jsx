import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, ChevronDown, CircleDollarSign, Clock3, CreditCard, RefreshCw, Search, WalletCards } from "lucide-react";
import { fetchTransactions, fetchWalletBalance } from "../api";

const PAGE_SIZE = 20;

function formatDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatAmount(value, currency = "INR") {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `${currency} ${value || "0"}`;
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  }
}

function isIncoming(transaction) {
  const type = String(transaction.transaction_type || "").toUpperCase();
  return ["CREDIT", "REFUND", "REWARD", "DEPOSIT", "CASHBACK"].some((value) => type.includes(value));
}

function statusStyle(status) {
  const value = String(status || "PENDING").toUpperCase();
  if (["SUCCESS", "COMPLETED", "PAID", "SETTLED"].includes(value)) return "bg-emerald-50 text-emerald-700";
  if (["FAILED", "CANCELLED", "REJECTED"].includes(value)) return "bg-rose-50 text-rose-700";
  return "bg-amber-50 text-amber-700";
}

function Summary({ icon: Icon, label, value, note }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-200 py-3 last:border-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-0">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary"><Icon size={19} /></span>
      <div className="min-w-0"><p className="text-[10px] font-bold uppercase text-slate-400">{label}</p><p className="truncate font-display text-lg font-extrabold text-navy">{value}</p>{note && <p className="truncate text-[10px] text-slate-500">{note}</p>}</div>
    </div>
  );
}

export default function WalletPage() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");

  const loadWallet = useCallback(async ({ nextPage = 1, refresh = false } = {}) => {
    if (refresh) setRefreshing(true);
    else if (nextPage > 1) setLoadingMore(true);
    else setLoading(true);
    setError("");
    try {
      const [balanceResult, transactionResult] = await Promise.allSettled([
        fetchWalletBalance(),
        fetchTransactions(nextPage, PAGE_SIZE),
      ]);
      if (balanceResult.status === "fulfilled") setBalance(balanceResult.value?.data || null);
      if (transactionResult.status === "rejected") throw transactionResult.reason;

      const response = transactionResult.value || {};
      const items = Array.isArray(response.data) ? response.data : response.data?.items || response.data?.results || [];
      const pageInfo = response.pagination || response.data?.pagination || null;
      setTransactions((current) => nextPage === 1 ? items : [...current, ...items]);
      setPagination(pageInfo);
      setPage(nextPage);
      if (balanceResult.status === "rejected") {
        setError(balanceResult.reason?.message || "Wallet balance could not be loaded.");
      }
    } catch (loadError) {
      setError(loadError.message || "Wallet transactions could not be loaded.");
      if (nextPage === 1) setTransactions([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadWallet(); }, [loadWallet]);

  const visibleTransactions = useMemo(() => {
    const search = query.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const incoming = isIncoming(transaction);
      const typeMatches = filter === "ALL" || (filter === "CREDIT" ? incoming : !incoming);
      const text = [transaction.description, transaction.category, transaction.transaction_type, transaction.reference, transaction.booking_code, transaction.payment_method, transaction.status].filter(Boolean).join(" ").toLowerCase();
      return typeMatches && (!search || text.includes(search));
    });
  }, [transactions, filter, query]);

  const canLoadMore = pagination?.has_next ?? (pagination?.total_pages ? page < pagination.total_pages : transactions.length === PAGE_SIZE);
  const totalCredits = transactions.filter(isIncoming).reduce((sum, item) => sum + Math.abs(Number(item.amount) || 0), 0);
  const totalDebits = transactions.filter((item) => !isIncoming(item)).reduce((sum, item) => sum + Math.abs(Number(item.amount) || 0), 0);

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <section className="bg-navy px-4 pb-9 pt-9 text-white sm:px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-200">Your account</p>
          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">Wallet &amp; transactions</h1><p className="mt-1 text-sm text-white/70">Your balance and complete payment ledger.</p></div>
            <button type="button" onClick={() => loadWallet({ nextPage: 1, refresh: true })} disabled={loading || refreshing} className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20 disabled:opacity-60"><RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />Refresh</button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="-mt-4 grid gap-0 rounded-xl border border-slate-200 bg-white px-4 shadow-card sm:grid-cols-3 sm:px-5">
          <Summary icon={WalletCards} label="Available balance" value={balance ? formatAmount(balance.balance, balance.currency) : loading ? "Loading…" : "Not available"} note={balance?.account_id ? `Account • ${balance.account_id.slice(0, 8)}` : "Wallet balance"} />
          <Summary icon={ArrowDownLeft} label="Credits shown" value={formatAmount(totalCredits)} note="Current page history" />
          <Summary icon={ArrowUpRight} label="Debits shown" value={formatAmount(totalDebits)} note="Current page history" />
        </section>

        <section className="mt-8">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
            <div><p className="eyebrow">Ledger</p><h2 className="section-title">Payment history</h2></div>
            <p className="text-xs font-semibold text-slate-500">{pagination?.total_items ?? transactions.length} transactions</p>
          </div>

          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block min-w-0 flex-1 sm:max-w-md"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search transactions" className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary" /></label>
            <div className="flex gap-2" role="group" aria-label="Filter transaction type">{[{ value: "ALL", label: "All" }, { value: "CREDIT", label: "Credits" }, { value: "DEBIT", label: "Debits" }].map((option) => <button key={option.value} type="button" onClick={() => setFilter(option.value)} className={`rounded-lg border px-3 py-2 text-xs font-bold ${filter === option.value ? "border-primary bg-primary text-white" : "border-slate-200 bg-white text-slate-600 hover:border-primary-300"}`}>{option.label}</button>)}</div>
          </div>

          {error && <div role="alert" className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"><span>{error}</span><button type="button" onClick={() => loadWallet({ nextPage: 1 })} className="font-bold underline">Retry</button></div>}

          {loading ? <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">{[1, 2, 3, 4].map((item) => <div key={item} className="h-20 animate-pulse bg-slate-50" />)}</div> : visibleTransactions.length ? (
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
              {visibleTransactions.map((transaction, index) => {
                const incoming = isIncoming(transaction);
                const Icon = incoming ? ArrowDownLeft : ArrowUpRight;
                const amount = Math.abs(Number(transaction.amount) || 0);
                return (
                  <article key={transaction.id || `${transaction.reference}-${index}`} className="flex items-start gap-3 px-3 py-4 sm:items-center sm:px-5">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${incoming ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}><Icon size={19} /></span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-slate-800">{transaction.description || transaction.category || transaction.transaction_type || "Wallet transaction"}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500"><span>{formatDate(transaction.transaction_date || transaction.created_at)}</span>{transaction.payment_method && <><span aria-hidden="true">·</span><span className="inline-flex items-center gap-1"><CreditCard size={12} />{String(transaction.payment_method).replace(/[_-]+/g, " ")}</span></>}{transaction.booking_code && <><span aria-hidden="true">·</span><span>{transaction.booking_code}</span></>}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2"><span className="text-[10px] font-semibold uppercase text-slate-400">{[transaction.transaction_type, transaction.category].filter(Boolean).join(" · ") || "Transaction"}</span><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${statusStyle(transaction.status)}`}>{transaction.status || "PENDING"}</span></div>
                    </div>
                    <p className={`shrink-0 text-right font-display text-sm font-extrabold ${incoming ? "text-emerald-700" : "text-slate-800"}`}>{incoming ? "+" : "−"}{formatAmount(amount, transaction.currency || "INR")}</p>
                  </article>
                );
              })}
            </div>
          ) : <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><CircleDollarSign className="mx-auto text-primary-300" size={34} /><p className="mt-3 font-display font-bold text-navy">{transactions.length ? "No matching transactions" : "No transactions yet"}</p><p className="mt-1 text-xs text-slate-500">Wallet payments and adjustments will appear here.</p></div>}

          {canLoadMore && !loading && <div className="mt-4 flex justify-center"><button type="button" onClick={() => loadWallet({ nextPage: page + 1 })} disabled={loadingMore} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-primary-300 disabled:opacity-60">{loadingMore ? "Loading…" : "Load more transactions"}<ChevronDown size={15} /></button></div>}
        </section>
        <p className="mt-5 inline-flex items-center gap-1.5 text-[10px] text-slate-400"><Clock3 size={12} />Transaction records are shown as received from your account ledger.</p>
      </div>
    </main>
  );
}
