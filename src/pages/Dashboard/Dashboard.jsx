import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { Calendar, TrendingUp, Users, Award } from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const stats = [
    { title: "Bugun bergan ballarim", value: "0",  icon: <Calendar size={20} /> },
    { title: "Bu oy",                 value: "11", icon: <TrendingUp size={20} /> },
    { title: "Faol sinflarim",        value: "2",  icon: <Users size={20} /> },
    { title: "Jami tranzaksiyalar",   value: "5",  icon: <Award size={20} /> },
  ];

  const chartData = [
    { date: "11.04", value: 0 },
    { date: "12.04", value: 3 },
    { date: "13.04", value: 2 },
    { date: "14.04", value: 2 },
    { date: "15.04", value: 1 },
    { date: "16.04", value: 0 },
    { date: "17.04", value: 0 },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);
  // Nice y-axis ticks
  const yTicks = [maxValue, (maxValue * 0.75).toFixed(2), (maxValue * 0.5).toFixed(2), (maxValue * 0.25).toFixed(2), 0];

  const token = localStorage.getItem("token");

  async function getId() {
    try {
      const res = await axios.get(
        "https://pdp-system-backend-1.onrender.com/api/v1/auth/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getTransactions(res.data.data._id);
    } catch (err) {
      console.error(err);
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
      setTransactions(res.data.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    getId();
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="w-full mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 bg-[#F8FAFC] min-h-screen">

      {/* ── PAGE TITLE ─────────────────────────────────────────── */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bosh sahifa</h1>
        <p className="text-gray-400 text-sm mt-1 font-medium">O'qituvchi paneli</p>
      </div>

      {/* ── STATS CARDS ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow min-h-[108px] sm:min-h-[135px]"
          >
            <div className="flex justify-between items-start gap-2">
              <span className="text-gray-500 text-[12px] sm:text-[13px] font-medium leading-snug">
                {item.title}
              </span>
              <div className="text-indigo-600 bg-indigo-50 p-1.5 sm:p-2 rounded-lg shrink-0">
                {item.icon}
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-800">{item.value}</div>
          </div>
        ))}
      </div>

      {/* ── CHART ──────────────────────────────────────────────── */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-6 sm:mb-8 overflow-hidden">
        <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-800 mb-8 sm:mb-12">
          Haftalik faollik
        </h3>

        {/* Chart wrapper: left padding for y-axis, bottom padding for x labels */}
        <div className="relative pl-10 sm:pl-12 pb-8">

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] sm:text-[11px] text-gray-400 text-right w-9 sm:w-11 font-bold pointer-events-none">
            {yTicks.map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </div>

          {/* Bars */}
          <div
            className="relative flex items-end border-b border-gray-200"
            style={{ height: "clamp(160px, 30vw, 320px)" }}
          >
            {chartData.map((bar, idx) => (
              <div
                key={idx}
                className="group relative flex-1 h-full flex flex-col items-center justify-end px-1 sm:px-2"
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
                onTouchStart={() => setHoveredBar(idx)}
                onTouchEnd={() => setTimeout(() => setHoveredBar(null), 1200)}
              >
                {/* Hover column highlight */}
                <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />

                {/* Bar */}
                <div
                  className="w-full max-w-[40px] rounded-t-lg bg-[#5b52f0] relative z-10 transition-all duration-300"
                  style={{ height: `${(bar.value / maxValue) * 100}%`, minHeight: bar.value > 0 ? "4px" : "0" }}
                >
                  {/* Tooltip */}
                  {hoveredBar === idx && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-10 z-50 bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold whitespace-nowrap shadow-lg">
                      {bar.value} ball
                    </div>
                  )}
                </div>

                {/* X-axis label */}
                <span className="absolute -bottom-6 sm:-bottom-7 text-[9px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-tighter whitespace-nowrap">
                  {bar.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;