import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const STATUS_MAP = {
  normal:   { label: "Normal",        cls: "bg-green-100 text-green-700" },
  warning:  { label: "Ogohlantirish", cls: "bg-yellow-100 text-yellow-700" },
  yellow:   { label: "Sariq ro'yhat", cls: "bg-orange-100 text-orange-700" },
  red:      { label: "Qizil ro'yhat", cls: "bg-red-100 text-red-700" },
  expelled: { label: "Chiqarilgan",   cls: "bg-slate-200 text-slate-600" },
};

export default function StudentHome() {
  const [score, setScore] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [scoreRes, txRes] = await Promise.all([
        axios.get("https://pdp-system-backend-1.onrender.com/api/v1/scores/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://pdp-system-backend-1.onrender.com/api/v1/transactions/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setScore(scoreRes.data?.data);
      setTransactions(txRes.data?.data?.data || []);
    } catch (err) {
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 font-black text-slate-400 animate-pulse">
        Yuklanmoqda...
      </div>
    );
  }

  const status = STATUS_MAP[score?.status] || STATUS_MAP.normal;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bosh sahifa</h1>
        <p className="text-slate-500 font-semibold mt-1">Sizning joriy natijalaringiz</p>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            Intizom bali
          </p>
          <div className="flex items-end gap-1">
            <span className="text-5xl font-black text-slate-900">{score?.disciplineScore ?? 0}</span>
            <span className="text-xl font-bold text-slate-400 mb-1">/10</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            Bonus ball
          </p>
          <span className="text-5xl font-black text-indigo-600">
            +{score?.rewardScore ?? 0}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            Holat
          </p>
          <span className={`self-start px-4 py-2 rounded-2xl text-sm font-black ${status.cls}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Transactions */}
      <h2 className="text-2xl font-black text-slate-800 mb-5">
        So'nggi tranzaksiyalar
      </h2>

      {transactions.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-100">
          <p className="text-slate-400 font-bold">Hech qanday tranzaksiya yo'q</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {transactions.map((tx) => {
            const isPlus = tx.pointChange > 0;
            return (
              <div
                key={tx._id}
                className="bg-white rounded-2xl p-5 border border-slate-50 flex items-center justify-between gap-3 hover:border-indigo-100 transition-all"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl flex-shrink-0 ${
                      isPlus ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isPlus ? "+" : "−"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate">
                      {tx.ruleSnapshot?.title || tx.ruleId?.title}
                    </p>
                    <p className="text-sm text-slate-400 font-semibold truncate">{tx.reason}</p>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      {tx.teacherId?.fullName} •{" "}
                      {new Date(tx.createdAt).toLocaleDateString("uz-UZ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`font-black text-lg ${
                      isPlus ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isPlus ? "+" : ""}{tx.pointChange}
                  </span>

                  {!tx.isRevoked && tx.pointChange < 0 && (
                    <button
                      onClick={() =>
                        navigate("/student/complain", {
                          state: { transactionId: tx._id, teacher: tx.teacherId },
                        })
                      }
                      className="text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-2 rounded-xl hover:bg-indigo-100 transition-all"
                    >
                      Shikoyat
                    </button>
                  )}

                  {tx.isRevoked && (
                    <span className="text-xs bg-slate-100 text-slate-400 font-bold px-3 py-2 rounded-xl">
                      Bekor
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
