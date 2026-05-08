import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE = "https://pdp-system-backend-1.onrender.com/api/v1";

export default function AdminRules() {
  const [tab, setTab] = useState("positive");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    pointValue: "",
    category: "light",
  });
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRules(tab);
  }, [tab]);

  const fetchRules = async (sign) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/rules?sign=${sign}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRules(res.data?.data || []);
    } catch {
      toast.error("Qoidalarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.pointValue)
      return toast.warning("Sarlavha va ball qiymatini kiriting");
    setSubmitting(true);
    try {
      const pointValue = Number(form.pointValue);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        pointValue:
          tab === "negative" ? -Math.abs(pointValue) : Math.abs(pointValue),
        category: form.category,
        order: 0,
      };
      await axios.post(`${BASE}/rules`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Qoida qo'shildi!");
      setModalOpen(false);
      setForm({
        title: "",
        description: "",
        pointValue: "",
        category: "light",
      });
      fetchRules(tab);
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu qoidani o'chirmoqchimisiz?")) return;
    try {
      await axios.delete(`${BASE}/rules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Qoida o'chirildi");
      fetchRules(tab);
    } catch (err) {
      toast.error(err.response?.data?.message || "O'chirishda xatolik");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Qoidalar
          </h1>
          <p className="text-slate-500 font-semibold mt-1">
            PDP School intizom qoidalari boshqaruvi
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
        >
          + Qoida qo'shish
        </button>
      </div>

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
        <div className="text-slate-400 font-black animate-pulse">
          Yuklanmoqda...
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rules.map((rule) => {
            const isPositive = rule.pointValue > 0;
            return (
              <div
                key={rule._id}
                className="bg-white rounded-2xl p-5 border border-slate-50 flex items-center justify-between gap-4 hover:border-indigo-100 transition-all group"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 ${
                      isPositive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isPositive ? "+" : "−"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800">{rule.title}</p>
                    <p className="text-sm text-slate-400 font-medium mt-0.5">
                      {rule.description}
                    </p>
                    {rule.category && (
                      <span className="text-xs text-slate-300 font-medium capitalize">
                        {rule.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`px-4 py-1.5 rounded-2xl font-black text-sm ${
                      isPositive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {rule.pointValue} ball
                  </span>
                  <button
                    onClick={() => handleDelete(rule._id)}
                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
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

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-6">
              Yangi qoida
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Sarlavha
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Qoida sarlavhasi"
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Tavsif
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Qoida tavsifi (ixtiyoriy)"
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Ball qiymati
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={form.pointValue}
                  onChange={(e) =>
                    setForm({ ...form, pointValue: e.target.value })
                  }
                  placeholder="1"
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
                  required
                />
                <p className="text-xs text-slate-400 font-medium mt-1">
                  {tab === "negative"
                    ? "Minus ball sifatida saqlanadi"
                    : "Plus ball sifatida saqlanadi"}
                </p>
              </div>
              {tab === "negative" && (
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Kategoriya
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
                  >
                    <option value="light">Yengil (light)</option>
                    <option value="medium">O'rta (medium)</option>
                    <option value="heavy">Og'ir (heavy)</option>
                  </select>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl font-black border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 rounded-2xl font-black bg-indigo-600 text-white hover:bg-indigo-700 transition-all disabled:opacity-60"
                >
                  {submitting ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
