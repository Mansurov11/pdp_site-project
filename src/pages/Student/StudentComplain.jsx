import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const STATUS_MAP = {
  pending:  { label: "Kutilmoqda", cls: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Tasdiqlandi", cls: "bg-green-100 text-green-700" },
  rejected: { label: "Rad etildi",  cls: "bg-red-100 text-red-700" },
};

export default function StudentComplain() {
  const location = useLocation();
  const preselectedTxId = location.state?.transactionId || null;
  const preselectedTeacher = location.state?.teacher || null;

  const [appeals, setAppeals] = useState([]);
  const [message, setMessage] = useState("");
  const [txId, setTxId] = useState(preselectedTxId || "");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppeals();
  }, []);

  const fetchAppeals = async () => {
    try {
      const res = await axios.get(
        "https://pdp-system-backend-1.onrender.com/api/v1/appeals/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppeals(res.data?.data || []);
    } catch {
      toast.error("Shikoyatlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!txId.trim()) return toast.warning("Tranzaksiya ID kiriting");
    if (message.trim().length < 20)
      return toast.warning("Kamida 20 ta belgi yozing");

    setSubmitting(true);
    try {
      await axios.post(
        "https://pdp-system-backend-1.onrender.com/api/v1/appeals",
        { transactionId: txId.trim(), message: message.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Shikoyat yuborildi!");
      setMessage("");
      setTxId("");
      fetchAppeals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shikoyatlar</h1>
        <p className="text-slate-500 font-semibold mt-1">
          Oyiga 3 ta shikoyat yuborishingiz mumkin
        </p>
      </div>

      {/* Submit form */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-8">
        <h2 className="text-xl font-black text-slate-800 mb-6">Yangi shikoyat</h2>

        {preselectedTeacher && (
          <div className="mb-5 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p className="text-sm font-bold text-indigo-700">
              Ustoz: {preselectedTeacher.fullName}
            </p>
            <p className="text-xs text-indigo-500 font-medium">{preselectedTeacher.email}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
              Tranzaksiya ID
            </label>
            <input
              type="text"
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              placeholder="Tranzaksiya ID ni kiriting..."
              className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
              readOnly={!!preselectedTxId}
            />
            {preselectedTxId && (
              <p className="text-xs text-slate-400 font-medium mt-1">
                Bosh sahifadan tanlangan tranzaksiya
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
              Shikoyat matni (kamida 20 belgi)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Shikoyatingizni batafsil yozing..."
              rows={4}
              className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700 resize-none"
            />
            <p className={`text-xs font-medium mt-1 ${message.length >= 20 ? "text-green-500" : "text-slate-400"}`}>
              {message.length} / 20 belgi
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-60"
          >
            {submitting ? "Yuborilmoqda..." : "Shikoyat yuborish"}
          </button>
        </form>
      </div>

      {/* Appeals list */}
      <h2 className="text-2xl font-black text-slate-800 mb-5">Yuborilgan shikoyatlar</h2>

      {loading ? (
        <div className="text-slate-400 font-black animate-pulse">Yuklanmoqda...</div>
      ) : appeals.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-100">
          <p className="text-slate-400 font-bold">Hali shikoyat yo'q</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {appeals.map((appeal) => {
            const st = STATUS_MAP[appeal.status] || STATUS_MAP.pending;
            const tx = appeal.transactionId;
            return (
              <div
                key={appeal._id}
                className="bg-white rounded-2xl p-6 border border-slate-50 hover:border-indigo-100 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">
                      {tx?.ruleSnapshot?.title || "Tranzaksiya"}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {tx?.reason}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {tx?.pointChange !== undefined && (
                      <span
                        className={`font-black text-sm ${
                          tx.pointChange > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tx.pointChange > 0 ? "+" : ""}{tx.pointChange} ball
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${st.cls}`}>
                      {st.label}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 font-medium bg-slate-50 rounded-xl p-3">
                  "{appeal.message}"
                </p>

                {appeal.adminResponse && (
                  <p className="text-sm text-indigo-700 font-medium bg-indigo-50 rounded-xl p-3 mt-2">
                    Admin javobi: {appeal.adminResponse}
                  </p>
                )}

                <p className="text-xs text-slate-300 font-medium mt-2">
                  {new Date(appeal.createdAt).toLocaleDateString("uz-UZ")}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
