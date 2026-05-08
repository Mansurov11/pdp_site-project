import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE = "https://pdp-system-backend-1.onrender.com/api/v1";

const STATUS_TABS = [
  { key: "", label: "Barchasi" },
  { key: "pending", label: "Kutilmoqda" },
  { key: "approved", label: "Tasdiqlandi" },
  { key: "rejected", label: "Rad etildi" },
];

const STATUS_MAP = {
  pending: { label: "Kutilmoqda", cls: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Tasdiqlandi", cls: "bg-green-100 text-green-700" },
  rejected: { label: "Rad etildi", cls: "bg-red-100 text-red-700" },
};

export default function AdminAppeals() {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [rejectModal, setRejectModal] = useState(null); // appeal object
  const [adminResponse, setAdminResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppeals();
  }, [statusFilter]);

  const fetchAppeals = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : "";
      const res = await axios.get(`${BASE}/appeals${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = res.data?.data;
      const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
      setAppeals(list);
    } catch {
      toast.error("Shikoyatlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Bu shikoyatni tasdiqlaysizmi? Tranzaksiya bekor qilinadi.")) return;
    setSubmitting(true);
    try {
      await axios.post(
        `${BASE}/appeals/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Shikoyat tasdiqlandi, tranzaksiya bekor qilindi");
      fetchAppeals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectOpen = (appeal) => {
    setRejectModal(appeal);
    setAdminResponse("");
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (adminResponse.trim().length < 10)
      return toast.warning("Javob kamida 10 ta belgi bo'lishi kerak");
    setSubmitting(true);
    try {
      await axios.post(
        `${BASE}/appeals/${rejectModal._id}/reject`,
        { adminResponse: adminResponse.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Shikoyat rad etildi");
      setRejectModal(null);
      fetchAppeals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = appeals.filter((a) => a.status === "pending").length;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shikoyatlar</h1>
          {pendingCount > 0 && (
            <span className="bg-yellow-100 text-yellow-700 text-sm font-black px-3 py-1 rounded-full">
              {pendingCount} yangi
            </span>
          )}
        </div>
        <p className="text-slate-500 font-semibold mt-1">
          O'quvchilardan kelgan shikoyatlarni ko'rib chiqing
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              statusFilter === tab.key
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-slate-400 font-black animate-pulse">Yuklanmoqda...</div>
      ) : appeals.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-100">
          <p className="text-slate-400 font-bold">Shikoyatlar topilmadi</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {appeals.map((appeal) => {
            const st = STATUS_MAP[appeal.status] || STATUS_MAP.pending;
            const tx = appeal.transactionId;
            const student = appeal.studentId;
            const initials = student?.fullName
              ? student.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
              : "ST";

            return (
              <div
                key={appeal._id}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-indigo-100 transition-all"
              >
                {/* Header: student + status */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="font-black text-slate-800">{student?.fullName || "O'quvchi"}</p>
                      <p className="text-xs text-slate-400 font-medium">{student?.email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black flex-shrink-0 ${st.cls}`}>
                    {st.label}
                  </span>
                </div>

                {/* Transaction info */}
                {tx && (
                  <div className="bg-slate-50 rounded-xl p-4 mb-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-700 text-sm truncate">
                        {tx.ruleSnapshot?.title || "Tranzaksiya"}
                      </p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{tx.reason}</p>
                    </div>
                    {tx.pointChange !== undefined && (
                      <span
                        className={`font-black text-sm flex-shrink-0 ${
                          tx.pointChange > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tx.pointChange > 0 ? "+" : ""}
                        {tx.pointChange} ball
                      </span>
                    )}
                  </div>
                )}

                {/* Appeal message */}
                <p className="text-sm text-slate-600 font-medium bg-indigo-50 rounded-xl p-3 mb-4">
                  "{appeal.message}"
                </p>

                {/* Admin response (if exists) */}
                {appeal.adminResponse && (
                  <p className="text-sm text-slate-500 font-medium border-l-4 border-slate-200 pl-3 mb-4">
                    Admin javobi: {appeal.adminResponse}
                  </p>
                )}

                {/* Date */}
                <p className="text-xs text-slate-300 font-medium mb-4">
                  {new Date(appeal.createdAt).toLocaleDateString("uz-UZ")}{" "}
                  {new Date(appeal.createdAt).toLocaleTimeString("uz-UZ", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                {/* Action buttons — only for pending */}
                {appeal.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(appeal._id)}
                      disabled={submitting}
                      className="flex-1 py-3 rounded-xl font-black text-sm bg-green-600 text-white hover:bg-green-700 transition-all active:scale-95 disabled:opacity-60"
                    >
                      Tasdiqlash
                    </button>
                    <button
                      onClick={() => handleRejectOpen(appeal)}
                      disabled={submitting}
                      className="flex-1 py-3 rounded-xl font-black text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-all active:scale-95 disabled:opacity-60"
                    >
                      Rad etish
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Rad etish sababi</h2>
            <p className="text-slate-400 font-medium text-sm mb-6">
              O'quvchiga javob yozing (kamida 10 belgi)
            </p>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Shikoyat rad etilish sababini tushuntiring..."
                  rows={4}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-red-400 font-semibold text-slate-700 resize-none"
                  autoFocus
                />
                <p
                  className={`text-xs font-medium mt-1 ${
                    adminResponse.length >= 10 ? "text-green-500" : "text-slate-400"
                  }`}
                >
                  {adminResponse.length} / 10 belgi
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModal(null)}
                  className="flex-1 py-3.5 rounded-2xl font-black border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 rounded-2xl font-black bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-60"
                >
                  {submitting ? "Yuborilmoqda..." : "Rad etish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
