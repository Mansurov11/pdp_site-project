import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function StudentProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "https://pdp-system-backend-1.onrender.com/api/v1/auth/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data?.data);
    } catch {
      toast.error("Profilni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 font-black text-slate-400 animate-pulse text-sm">
        Yuklanmoqda...
      </div>
    );
  }

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "ST";

  return (
    <div className="p-4 sm:p-6">

      {/* ── Page header ── */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Profil
        </h1>
        <p className="text-slate-500 font-semibold mt-1 text-sm sm:text-base">
          Shaxsiy ma'lumotlaringiz
        </p>
      </div>

      {/* ── Avatar + name card ── */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-sm mb-4 sm:mb-6 flex flex-col xs:flex-row items-center xs:items-start sm:items-center gap-4 sm:gap-6 text-center xs:text-left">
        {/* Avatar */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-black shrink-0">
          {initials}
        </div>

        {/* Name / email / badge */}
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 truncate">
            {user?.fullName}
          </h2>
          <p className="text-slate-400 font-semibold text-sm sm:text-base truncate">
            {user?.email}
          </p>
          <span className="mt-2 inline-block bg-indigo-50 text-indigo-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
            O'quvchi
          </span>
        </div>
      </div>

      {/* ── Info cards grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <InfoRow label="To'liq ism"        value={user?.fullName} />
        <InfoRow label="Email"             value={user?.email} />
        <InfoRow label="Sinf"              value={user?.classId?.name || "—"} />
        <InfoRow label="Ota-ona email"     value={user?.parentEmail || "—"} />
        <InfoRow
          label="Hisobga olingan sana"
          value={
            user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("uz-UZ")
              : "—"
          }
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100">
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="font-bold text-slate-800 text-sm sm:text-base wrap-break-word">
        {value || "—"}
      </p>
    </div>
  );
}