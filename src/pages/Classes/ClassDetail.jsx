import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Users,
  UserPlus,
  GraduationCap,
  X,
  Mail,
  User,
} from "lucide-react";
import Loader from "../../components/Loader";
import ScoreModal from "../../components/ScoreModal";

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClassDetail();
  }, [id]);

  const fetchClassDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://pdp-system-backend-1.onrender.com/api/v1/scores/class/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setClassData(res.data?.data || []);
    } catch (err) {
      console.error(err.message);
      toast.error("Sinf ma'lumotlarini yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        fullName: `${firstName} ${lastName}`.trim(),
        email: email,
        password: "password123",
        role: "student",
        classId: id,
        taughtClassIds: [],
        tutorOfClassId: null,
        phone: "",
        parentEmail: `parent.${email}`, // ✅ valid email format
        parentPhone: "",
      };

      console.log("Sending payload:", payload);

      await axios.post(
        `https://pdp-system-backend-1.onrender.com/api/v1/users`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Yangi o'quvchi muvaffaqiyatli qo'shildi!");
      setIsModalOpen(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      fetchClassDetail();
    } catch (err) {
      console.log("Error details:", err.response?.data);
      toast.error("Daraja yetarli emas" || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = (student, type) => {
    setSelectedStudent({
      id: student.studentId?._id,
      name: student.studentId?.fullName,
    });
    setModalType(type);
    setModalOpen(true);
  };

  const handleScoreSubmit = async (data) => {
    try {
      await axios.post(
        `https://pdp-system-backend-1.onrender.com/api/v1/transactions`,
        data,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Transaction qo'shildi!");
      setModalOpen(false);
      fetchClassDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik");
    }
  };

  const getStatus = (score) => {
    if (score <= 4)
      return {
        text: "Sariq ro'yhat",
        className: "bg-yellow-100 font-bold text-orange-600",
      };
    if (score <= 6)
      return {
        text: "Ogohlantirish",
        className: "bg-yellow-100 font-bold text-yellow-500",
      };
    return {
      text: "Normal",
      className: "bg-green-100 font-bold text-green-600",
    };
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-8xl p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-indigo-600 transition-all"
      >
        <ArrowLeft size={20} /> Orqaga
      </button>

      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm mb-10">
        <div className="flex justify-between items-start">
          <div>
            <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Sinf ma'lumotlari
            </span>
            <div className="flex items-center gap-2 mt-6 text-slate-400 font-bold">
              <Users size={20} />
              <span>{classData.length} o'quvchi ro'yxatda</span>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white p-5 rounded-3xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            <UserPlus size={28} />
          </button>
        </div>
      </div>

      <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
        <GraduationCap size={32} className="text-indigo-600" /> O'quvchilar
        ro'yxati
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {classData.map((student, index) => {
          const status = getStatus(student.disciplineScore);
          return (
            <div
              key={student._id || index}
              className="bg-white p-6 rounded-3xl border border-slate-50 flex items-center justify-between gap-1 group hover:border-indigo-100 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="text-xl font-black text-slate-800">
                    {student.studentId?.fullName}
                  </p>
                  <p className="text-sm text-slate-400 font-bold flex items-center gap-1">
                    <Mail size={14} /> {student.studentId?.email}
                  </p>
                </div>
              </div>

              <p className="text-3xl text-black font-bold">
                {student.disciplineScore + student.rewardScore}
                <span className="text-base text-slate-400 font-medium ml-1">
                  ball
                </span>
              </p>

              <span className={`rounded-full px-4 py-1 ${status.className}`}>
                {status.text}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(student, "positive")}
                  type="button"
                  className="bg-green-300 text-green-600 w-10 h-10 rounded-xl font-bold text-xl flex items-center justify-center shadow-sm hover:bg-green-400 active:scale-95 transition-all"
                >
                  +
                </button>
                <button
                  onClick={() => openModal(student, "negative")}
                  type="button"
                  className="bg-red-300 text-red-600 w-10 h-10 rounded-xl font-bold text-xl flex items-center justify-center shadow-sm hover:bg-red-400 active:scale-95 transition-all"
                >
                  −
                </button>
              </div>
            </div>
          );
        })}

        {classData.length === 0 && (
          <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold">O'quvchilar topilmadi</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-slate-800">
                Yangi o'quvchi
              </h2>
              <X
                className="cursor-pointer text-slate-400 hover:text-slate-800"
                onClick={() => setIsModalOpen(false)}
                size={32}
              />
            </div>

            <form onSubmit={handleAddStudent} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Ism
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    placeholder="Ismni kiriting"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Familiya
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    placeholder="Familiyani kiriting"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    required
                    type="email"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    placeholder="example@pdp.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 mt-4 disabled:opacity-60"
              >
                {submitting ? "Saqlanmoqda..." : "Sinfga qo'shish"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ScoreModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={selectedStudent}
        type={modalType}
        selectedPeople={selectedPeople}
        setSelectedPeople={setSelectedPeople}
        onSubmit={handleScoreSubmit}
      />
    </div>
  );
};

export default ClassDetail;
