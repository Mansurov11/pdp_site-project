import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE = "https://pdp-system-backend-1.onrender.com/api/v1";

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${BASE}/users?role=teacher`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = res.data?.data;
      const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
      setTeachers(list);
    } catch {
      toast.error("Ustozlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim())
      return toast.warning("Barcha maydonlarni to'ldiring");
    setSubmitting(true);
    try {
      await axios.post(
        `${BASE}/users`,
        { ...form, role: "teacher" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Ustoz qo'shildi!");
      setModalOpen(false);
      setForm({ fullName: "", email: "", password: "" });
      fetchTeachers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu ustozni o'chirmoqchimisiz?")) return;
    try {
      await axios.delete(`${BASE}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Ustoz o'chirildi");
      fetchTeachers();
    } catch (err) {
      toast.error(err.response?.data?.message || "O'chirishda xatolik");
    }
  };

  const filtered = teachers.filter(
    (t) =>
      t.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Ustozlar</h1>
          <p className="text-slate-500 font-semibold mt-1">Barcha o'qituvchilar ro'yxati</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
        >
          + Ustoz qo'shish
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ism yoki email bo'yicha qidirish..."
          className="w-full max-w-md px-4 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="text-slate-400 font-black animate-pulse">Yuklanmoqda...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-100">
          <p className="text-slate-400 font-bold">Ustozlar topilmadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((teacher) => {
            const initials = teacher.fullName
              ? teacher.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
              : "T";
            return (
              <div
                key={teacher._id}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-indigo-100 transition-all relative group"
              >
                <button
                  onClick={() => handleDelete(teacher._id)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 text-xl font-bold"
                >
                  ×
                </button>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-800 truncate">{teacher.fullName}</p>
                    <p className="text-xs text-slate-400 font-medium truncate">{teacher.email}</p>
                  </div>
                </div>
                <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Ustoz
                </span>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Yangi ustoz</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                  To'liq ism
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Ism Familiya"
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="teacher@pdp.uz"
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Parol
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-700"
                  required
                />
              </div>
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
