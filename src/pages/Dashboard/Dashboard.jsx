import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { Calendar, TrendingUp, Users, Award } from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: "Bugun bergan ballarim",
      value: "0",
      icon: <Calendar size={20} />,
    },
    { title: "Bu oy", value: "11", icon: <TrendingUp size={20} /> },
    { title: "Faol sinflarim", value: "2", icon: <Users size={20} /> },
    { title: "Jami tranzaksiyalar", value: "5", icon: <Award size={20} /> },
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

  const activities = [
    {
      name: "Alisher Karimov",
      action: "Darsga kechikish",
      desc: "10 daqiqa kechikdi",
      score: "-1",
      date: "15.04.2026 08:15",
      initials: "AK",
      type: "negative",
    },
    {
      name: "Madina Yusupova",
      action: "A'lo baholar",
      desc: "Barcha fanlarda a'lo natijalar",
      score: "+3",
      date: "10.04.2026 10:00",
      initials: "MY",
      type: "positive",
    },
  ];

  const token = localStorage.getItem("token");

  async function getId() {
    try {
      const res = await axios.get(
        "https://pdp-system-backend-1.onrender.com/api/v1/auth/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
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
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTransactions(res.data.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getId();
  }, []);

  if (loading) return <Loader />;

  const newLocal =
    "absolute left-1/2 -translate-x-1/2 -top-12 z-50 bg-slate-900 text-white p-2 rounded-lg text-[11px] font-bold whitespace-nowrap";
  return (
    <div className="w-full max-w-400 mx-auto p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bosh sahifa</h1>
        <p className="text-gray-400 text-sm mt-1 font-medium">
          O'qituvchi paneli
        </p>
      </div>

      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-33.75 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <span className="text-gray-500 text-[13px] font-medium leading-tight max-w-30">
                {item.title}
              </span>
              <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg">
                {item.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">{item.value}</div>
          </div>
        ))}
      </div>

      {/* 2. Chart Section */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm w-full mb-8">
        <h3 className="text-[16px] font-bold text-gray-800 mb-12">
          Haftalik faollik
        </h3>
        <div className="relative flex h-80 w-full border-b border-gray-200 ml-8 pr-8">
          {/* Y-Axis */}
          <div className="absolute -left-12 h-full flex flex-col justify-between text-[11px] text-gray-400 pb-1 text-right w-10 font-bold">
            <span>3</span>
            <span>2.25</span>
            <span>1.5</span>
            <span>0.75</span>
            <span className="translate-y-1">0</span>
          </div>
          {/* Bars Area */}
          <div className="flex-1 flex items-end">
            {chartData.map((bar, idx) => (
              <div
                key={idx}
                className="group relative flex-1 h-full flex flex-col items-center justify-end px-2"
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
                <div
                  className="bg-[#5b52f0] w-full max-w-45 rounded-t-lg relative z-10 transition-all duration-300"
                  style={{ height: `${(bar.value / 3) * 100}%` }}
                >
                  {hoveredBar == idx && (
                    <div className={newLocal}>ballar: {bar.value}</div>
                  )}
                </div>
                <span className="absolute -bottom-8 text-[11px] text-gray-400 font-bold uppercase tracking-tighter">
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
