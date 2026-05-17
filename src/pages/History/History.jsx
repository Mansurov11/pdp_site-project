import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import "./History.css";
import {
  Undo2,
  TrendingUp,
  TrendingDown,
  Clock,
  User as UserIcon,
  Download,
  FileText,
  RotateCcw,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import * as XLSX from "xlsx";

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const Students = () => {
  const token = localStorage.getItem("token");
  const [transactions, setTransactions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null); // mobile accordion

  async function getId() {
    try {
      const res = await axios.get(
        "https://pdp-system-backend-1.onrender.com/api/v1/auth/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getTransactions(res.data.data._id);
    } catch (err) {
      console.error("Auth Error:", err);
      setLoading(false);
    }
  }

  async function getTransactions(id) {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://pdp-system-backend-1.onrender.com/api/v1/transactions/teacher/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data?.data?.data || res.data?.data || [];
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { getId(); }, []);

  const handleRevoke = async (id, reason) => {
    try {
      await axios.post(
        `https://pdp-system-backend-1.onrender.com/api/v1/transactions/${id}/revoke`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Muvaffaqiyatli bekor qilindi");
      setOpenModal(false);
      getId();
    } catch (err) {
      const msg = err.response?.data?.message || "Xatolik yuz berdi";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  const handleExport = () => {
    if (transactions.length === 0) return;
    const exportData = transactions.map((item) => ({
      "O'quvchi": item.studentId?.fullName || "---",
      "Sabab/Qoida": item.ruleId?.title || "---",
      "Izoh": item.reason || "---",
      "Ball": item.pointChange,
      "Sana": new Date(item.createdAt).toLocaleString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tarix");
    XLSX.writeFile(workbook, `Tarix_${new Date().toLocaleDateString()}.xlsx`);
  };

  if (loading) return <Loader />;

  const teacherName = transactions[0]?.teacherId?.fullName || "Ustoz";

  return (
    <main className="min-h-screen bg-[#F8F9FB] px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 font-sans antialiased text-[#2D3139]">
      <div className="mx-auto max-w-6xl">

        {/* ── PAGE HEADER ───────────────────────────────────────── */}
        <header className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tarixim</h1>
            <p className="text-sm font-medium text-gray-400">O'qituvchi faoliyat tarixi</p>
          </div>

          {/* Teacher badge */}
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100 self-start sm:self-auto">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <UserIcon size={22} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ustoz</p>
              <h2 className="font-bold text-sm sm:text-base leading-tight">{teacherName}</h2>
            </div>
          </div>
        </header>

        {/* ── STATS GRID ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard icon={<FileText size={18} />}    color="indigo"  label="Jami"    value={transactions.length}                                              unit="tr" />
          <StatCard icon={<TrendingUp size={18} />}  color="emerald" label="Ijobiy"  value={transactions.filter(t => t.pointChange > 0  && !t.isRevoked).length} unit="ta" />
          <StatCard icon={<TrendingDown size={18} />}color="rose"    label="Salbiy"  value={transactions.filter(t => t.pointChange < 0  && !t.isRevoked).length} unit="ta" />
          <StatCard icon={<RotateCcw size={18} />}   color="amber"   label="Bekorlar" value={transactions.filter(t => t.isRevoked).length}                     unit="ta" />
        </div>

        {/* ── TABLE TOOLBAR ─────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Harakatlar tarixi</h2>
          <button
            onClick={handleExport}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 text-indigo-600 transition-all active:scale-95"
          >
            <Download size={15} /> Excelga yuklash
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════
            MOBILE CARDS  (< sm)
        ════════════════════════════════════════════════════════ */}
        <div className="sm:hidden space-y-3">
          {transactions.length === 0 && (
            <EmptyState />
          )}
          {transactions.map((t, idx) => (
            <MobileCard
              key={t._id || idx}
              t={t}
              expanded={expandedRow === idx}
              onToggle={() => setExpandedRow(expandedRow === idx ? null : idx)}
              onRevoke={() => { setActiveTransaction(t); setOpenModal(true); }}
            />
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════
            TABLET / DESKTOP TABLE  (≥ sm)
        ════════════════════════════════════════════════════════ */}
        <div className="hidden sm:block overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

          {/* Table head */}
          <div className="grid border-b border-gray-100 bg-gray-50/60 px-5 md:px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest text-gray-400
                          grid-cols-[1fr_1fr_auto_auto]
                          md:grid-cols-[1.2fr_1.2fr_1.4fr_80px_auto]">
            <div>O'quvchi</div>
            <div>Sabab</div>
            <div className="hidden md:block">Izoh</div>
            <div className="text-center">Ball</div>
            <div className="text-right">Amal</div>
          </div>

          {/* Rows */}
          <ul className="divide-y divide-gray-50">
            {transactions.length === 0 && (
              <li className="py-16"><EmptyState /></li>
            )}
            {transactions.map((t, idx) => (
              <li
                key={t._id || idx}
                className={`grid items-center px-5 md:px-8 py-4 md:py-5 transition-colors
                            grid-cols-[1fr_1fr_auto_auto]
                            md:grid-cols-[1.2fr_1.2fr_1.4fr_80px_auto]
                            ${t.isRevoked ? "opacity-50 grayscale" : "hover:bg-gray-50/80"}`}
              >
                {/* Student */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 md:h-11 md:w-11 shrink-0 flex items-center justify-center rounded-full bg-[#EEF2FF] text-[#4F46E5] font-bold text-sm uppercase">
                    {t.studentId?.fullName?.charAt(0)}
                  </div>
                  <span className="font-bold text-[14px] md:text-[15px] truncate">
                    {t.studentId?.fullName}
                  </span>
                </div>

                {/* Rule */}
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-[13px] md:text-[15px] block truncate">{t.ruleId?.title}</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium mt-0.5">
                    <Clock size={11} /> {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Comment — hidden on tablet, shown on desktop */}
                <div className="hidden md:block text-sm text-gray-400 italic truncate pr-4">
                  {t.reason || "Izohsiz"}
                </div>

                {/* Score */}
                <div className="flex justify-center">
                  <span className={`px-2.5 py-1 rounded-xl font-bold text-sm
                    ${t.pointChange < 0 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}`}>
                    {t.pointChange > 0 ? `+${t.pointChange}` : t.pointChange}
                  </span>
                </div>

                {/* Action */}
                <div className="flex justify-end">
                  {t.isRevoked ? (
                    <span className="text-xs font-bold text-gray-400 whitespace-nowrap">Bekor qilindi</span>
                  ) : (
                    <button
                      onClick={() => { setActiveTransaction(t); setOpenModal(true); }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-white px-3 md:px-4 py-2 text-xs md:text-sm font-bold text-amber-600 transition-all hover:bg-amber-50 whitespace-nowrap"
                    >
                      <Undo2 size={14} />
                      <span className="hidden md:inline">Bekor qilish</span>
                      <span className="md:hidden">Bekor</span>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal */}
        {openModal && (
          <Modal data={activeTransaction} setOpenModal={setOpenModal} onConfirm={handleRevoke} />
        )}
      </div>
    </main>
  );
};

/* ─────────────────────────────────────────────────────────────
   MOBILE CARD
───────────────────────────────────────────────────────────── */
function MobileCard({ t, expanded, onToggle, onRevoke }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all ${t.isRevoked ? "opacity-50 grayscale" : ""}`}>
      {/* Card header — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-4 text-left"
      >
        {/* Avatar */}
        <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-[#EEF2FF] text-[#4F46E5] font-bold text-sm uppercase">
          {t.studentId?.fullName?.charAt(0)}
        </div>

        {/* Name + rule */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[14px] truncate">{t.studentId?.fullName}</p>
          <p className="text-[12px] text-gray-400 truncate">{t.ruleId?.title}</p>
        </div>

        {/* Score */}
        <span className={`px-2.5 py-1 rounded-xl font-bold text-sm shrink-0
          ${t.pointChange < 0 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}`}>
          {t.pointChange > 0 ? `+${t.pointChange}` : t.pointChange}
        </span>

        {/* Chevron */}
        <span className="text-gray-300 ml-1 shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-3">
          <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
            <Clock size={12} />
            {new Date(t.createdAt).toLocaleString()}
          </div>

          {t.reason && (
            <p className="text-sm text-gray-500 italic bg-gray-50 rounded-xl px-3 py-2">
              {t.reason}
            </p>
          )}

          <div className="pt-1">
            {t.isRevoked ? (
              <span className="text-xs font-bold text-gray-400">Bekor qilindi</span>
            ) : (
              <button
                onClick={onRevoke}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-bold text-amber-600 transition-all hover:bg-amber-50 active:scale-95"
              >
                <Undo2 size={15} /> Bekor qilish
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────── */
function StatCard({ icon, color, label, value, unit }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4">
      <div className={`h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">{label}</p>
        <p className="text-lg sm:text-xl font-black leading-tight">
          {value}{" "}
          <span className="text-[10px] font-medium text-gray-300 uppercase">{unit}</span>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-300">
      <FileText size={40} strokeWidth={1} />
      <p className="mt-3 text-sm font-medium">Hech qanday tranzaksiya topilmadi</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MODAL
───────────────────────────────────────────────────────────── */
function Modal({ data, setOpenModal, onConfirm }) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4">
      {/* Bottom sheet on mobile, centered card on sm+ */}
      <div className="w-full sm:max-w-md bg-white p-6 sm:p-8 rounded-t-[32px] sm:rounded-[32px] shadow-2xl">
        {/* Handle (mobile only) */}
        <div className="sm:hidden mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200" />

        <div className="mb-6 flex items-center justify-between">
          <div className="h-11 w-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
            <RotateCcw size={22} />
          </div>
          <button
            onClick={() => setOpenModal(false)}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <h3 className="mb-4 text-xl sm:text-2xl font-black text-gray-900">Bekor qilish</h3>

        <div className="space-y-4 mb-6 sm:mb-8">
          <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100 text-sm">
            <p className="font-bold text-gray-800">{data?.studentId?.fullName}</p>
            <p className="text-gray-500">{data?.ruleId?.title} ({data?.pointChange} ball)</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Sabab (Majburiy)
            </label>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
              placeholder="Nima uchun bekor qilyapsiz?"
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={() => onConfirm(data._id, reason)}
          disabled={!reason.trim()}
          className="w-full rounded-2xl bg-gray-900 py-3.5 sm:py-4 font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Tasdiqlash
        </button>
      </div>
    </div>
  );
}

export default Students;