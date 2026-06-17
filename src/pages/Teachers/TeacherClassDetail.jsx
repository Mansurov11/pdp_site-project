import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowLeft, Users, UserPlus, GraduationCap, X, Search, Check } from "lucide-react";

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Data States
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Add Student States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allStudents, setAllStudents] = useState([]); // List from /api/v1/users
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchClassDetail();
    fetchAllStudents();
  }, [id]);

  const fetchClassDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`https://pdp-system-backend-1.onrender.com/api/v1/classes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassData(res.data?.data || res.data);
    } catch (err) {
      console.log(err.message);
      
      toast.error("Sinfni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      // Adjust this URL if your student list endpoint is different
      const res = await axios.get(`https://pdp-system-backend-1.onrender.com/api/v1/users?role=student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllStudents(res.data?.data || res.data || []);
    } catch (err) {
            console.log(err.message);

      console.error("Student list load error");
    }
  };

  const handleAddStudent = async () => {
    if (!selectedStudent) return toast.warning("O'quvchini tanlang");
    
    try {
      const token = localStorage.getItem("token");
      // This is the POST request that actually SAVES the student to the class
      await axios.post(
        `https://pdp-system-backend-1.onrender.com/api/v1/classes/${id}/students`,
        { studentId: selectedStudent._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("O'quvchi sinfga qo'shildi!");
      setIsModalOpen(false);
      setSelectedStudent(null);
      fetchClassDetail(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-400">Yuklanmoqda...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 relative">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-indigo-600 transition-all">
        <ArrowLeft size={20} /> Orqaga
      </button>

      {/* Header */}
      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm mb-10">
        <div className="flex justify-between items-start">
          <div>
            <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Sinf ma'lumotlari</span>
            <h1 className="text-6xl font-black text-slate-900 mt-4">{classData?.name}</h1>
            <div className="flex items-center gap-2 mt-6 text-slate-400 font-bold">
              <Users size={20} /> <span>{classData?.students?.length || 0} o'quvchi</span>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white p-5 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl shadow-indigo-100"
          >
            <UserPlus size={28} />
          </button>
        </div>
      </div>

      {/* Student List */}
      <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
        <GraduationCap size={32} className="text-indigo-600" /> O'quvchilar ro'yxati
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {classData?.students?.length > 0 ? (
          classData.students.map((student, index) => (
            <div key={student._id} className="bg-white p-6 rounded-3xl border border-slate-50 flex items-center justify-between group hover:border-indigo-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">{index + 1}</div>
                <div>
                  <p className="text-xl font-black text-slate-800">{student.name}</p>
                  <p className="text-sm text-slate-400 font-bold">{student.email}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-50/50 rounded-[40px] p-20 text-center border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold text-xl">Bu sinfda hali o'quvchilar yo'q.</p>
          </div>
        )}
      </div>

      {/* --- ADD STUDENT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-100 p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-slate-800">O'quvchi qo'shish</h2>
              <X className="cursor-pointer text-slate-400 hover:text-slate-800" onClick={() => setIsModalOpen(false)} size={32} />
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                placeholder="Ism bo'yicha qidirish..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="max-h-60 overflow-y-auto mb-8 pr-2 space-y-2">
              {allStudents
                .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(student => (
                  <div 
                    key={student._id}
                    onClick={() => setSelectedStudent(student)}
                    className={`p-4 rounded-xl cursor-pointer flex justify-between items-center transition-all ${selectedStudent?._id === student._id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 hover:bg-slate-100'}`}
                  >
                    <span className="font-bold">{student.name}</span>
                    {selectedStudent?._id === student._id && <Check size={18} />}
                  </div>
                ))}
            </div>

            <button 
              onClick={handleAddStudent}
              className="w-full bg-indigo-600 text-white py-5 rounded-[20px] font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Sinfga qo'shish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetail;