import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function StudentRules() {
  const [tab, setTab] = useState("positive");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRules(tab);
  }, [tab]);

  const fetchRules = async (sign) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://pdp-system-backend-1.onrender.com/api/v1/rules?sign=${sign}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRules(res.data?.data || []);
    } catch {
      toast.error("Qoidalarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Qoidalar</h1>
        <p className="text-slate-500 font-semibold mt-1">PDP School intizom qoidalari</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setTab("positive")}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            tab === "positive"
              ? "bg-white text-green-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Mukofotlar
        </button>
        <button
          onClick={() => setTab("negative")}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            tab === "negative"
              ? "bg-white text-red-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Jazolar
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 font-black animate-pulse">Yuklanmoqda...</div>
      ) : (
        <div className="flex flex-col gap-3">
          {rules.map((rule) => {
            const isPositive = rule.pointValue > 0;
            return (
              <div
                key={rule._id}
                className="bg-white rounded-2xl p-5 border border-slate-50 flex items-center justify-between gap-4 hover:border-indigo-100 transition-all"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 ${
                      isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isPositive ? "+" : "−"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800">{rule.title}</p>
                    <p className="text-sm text-slate-400 font-medium mt-0.5">{rule.description}</p>
                  </div>
                </div>
                <span
                  className={`flex-shrink-0 px-4 py-1.5 rounded-2xl font-black text-sm ${
                    isPositive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isPositive ? "+" : ""}{rule.pointValue} ball
                </span>
              </div>
            );
          })}

          {rules.length === 0 && (
            <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-100">
              <p className="text-slate-400 font-bold">Qoidalar topilmadi</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
