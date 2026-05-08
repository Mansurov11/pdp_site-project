import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Search, Users, BookOpen, ShieldCheck } from "lucide-react";
import Loader from "../../components/Loader";

const BASE = "https://pdp-system-backend-1.onrender.com/api/v1";

const Classes = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState("");
  const [studentCounts, setStudentCounts] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role || "");
    }
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      if (!token) return navigate("/login");

      const res = await axios.get(`${BASE}/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedData = res.data?.data || res.data || [];
      const arr = Array.isArray(fetchedData) ? fetchedData : [];
      setClasses(arr);

      const counts = {};
      await Promise.all(
        arr.map(async (cls) => {
          const classId = cls._id || cls.id;
          try {
            const detail = await axios.get(`${BASE}/scores/class/${classId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            counts[classId] = (detail.data?.data || []).length;
          } catch {
            counts[classId] = 0;
          }
        })
      );
      setStudentCounts(counts);
    } catch (err) {
      toast.error("Sinflarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const filtered = classes.filter((c) =>
    (c.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Sinflar
          </h1>
          {userRole === "admin" && (
            <div className="flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full font-bold text-sm">
              <ShieldCheck size={16} /> <span>Admin</span>
            </div>
          )}
        </div>

        <div className="relative mb-10">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
            size={22}
          />
          <input
            type="text"
            placeholder="Sinf qidirish..."
            className="w-full bg-white border border-slate-100 rounded-[28px] py-5 pl-16 pr-8 outline-none focus:ring-4 focus:ring-indigo-500/5 font-semibold shadow-sm transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold">Sinflar topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => {
              const classId = item._id || item.id;
              return (
                <div
                  key={classId}
                  onClick={() => navigate(`/home/classes/${classId}`)}
                  className="bg-white border border-slate-50 rounded-[40px] p-8 hover:shadow-2xl transition-all group flex flex-col justify-between h-full cursor-pointer"
                >
                  <div>
                    <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                      <BookOpen size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 font-bold mt-4">
                      <Users size={18} className="text-indigo-300" />
                      <span>{studentCounts[classId] ?? "..."} o'quvchi ro'yxatda</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;