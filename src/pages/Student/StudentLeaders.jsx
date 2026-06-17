import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function StudentLeaders() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const res = await axios.get(
        "https://pdp-system-backend-1.onrender.com/api/v1/stats/leaderboard/students",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sorted = (res.data?.data || []).sort(
        (a, b) =>
          b.disciplineScore - a.disciplineScore ||
          b.rewardScore - a.rewardScore
      );
      setLeaders(sorted);
    } catch {
      toast.error("Liderlar ro'yxatini yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10 font-black text-slate-400 animate-pulse text-center">
        Yuklanmoqda...
      </div>
    );
  }

  const medalColors = [
    "bg-amber-100 text-amber-600",
    "bg-slate-100 text-slate-500",
    "bg-orange-100 text-orange-500",
  ];

  return (
    <div className="w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Liderlar</h1>
        <p className="text-slate-500 font-semibold mt-1 text-sm md:text-base">
          Sinf bo'yicha eng yaxshi o'quvchilar
        </p>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 md:p-8 border-b border-slate-50">
          <h2 className="text-lg md:text-xl font-black text-slate-800">Reyting jadvali</h2>
        </div>

        {leaders.length === 0 ? (
          <div className="p-12 md:p-16 text-center">
            <p className="text-slate-400 font-bold text-sm md:text-base">Ma'lumot topilmadi</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {leaders.map((leader, index) => (
              <div
                key={leader.student?._id || index}
                className="hover:bg-slate-50/50 transition-all"
              >
                {/* Mobile Layout */}
                <div className="flex flex-col sm:hidden gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0 ${
                        medalColors[index] || "bg-slate-50 text-slate-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center font-black text-indigo-600 text-xs flex-shrink-0">
                      {leader.student?.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate">
                        {leader.student?.fullName}
                      </p>
                      <p className="text-xs text-slate-400 font-medium truncate">
                        {leader.student?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pl-11">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-black text-indigo-600">
                        +{leader.rewardScore}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">bonus</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-black text-slate-700">
                        {leader.disciplineScore}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">intizom</span>
                    </div>
                  </div>
                </div>

                {/* Tablet Layout */}
                <div className="hidden sm:flex md:hidden items-center gap-3 px-5 py-4">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                      medalColors[index] || "bg-slate-50 text-slate-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-black text-indigo-600 text-sm flex-shrink-0">
                    {leader.student?.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{leader.student?.fullName}</p>
                    <p className="text-sm text-slate-400 font-medium truncate">{leader.student?.email}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-center">
                      <span className="block text-lg font-black text-indigo-600">
                        +{leader.rewardScore}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">bonus</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-lg font-black text-slate-700">
                        {leader.disciplineScore}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">intizom</span>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-center gap-4 px-8 py-5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                      medalColors[index] || "bg-slate-50 text-slate-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-black text-indigo-600 text-sm flex-shrink-0">
                    {leader.student?.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{leader.student?.fullName}</p>
                    <p className="text-sm text-slate-400 font-medium truncate">{leader.student?.email}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="block text-lg font-black text-indigo-600">
                        +{leader.rewardScore}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">bonus</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-lg font-black text-slate-700">
                        {leader.disciplineScore}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">intizom</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}