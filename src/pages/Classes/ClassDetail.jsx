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

  useEffect(() => { fetchClassDetail(); }, [id]);

  const fetchClassDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://pdp-system-backend-1.onrender.com/api/v1/scores/class/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
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
      await axios.post(
        `https://pdp-system-backend-1.onrender.com/api/v1/users`,
        {
          fullName: `${firstName} ${lastName}`.trim(),
          email,
          password: "password123",
          role: "student",
          classId: id,
          taughtClassIds: [],
          tutorOfClassId: null,
          phone: "",
          parentEmail: `parent.${email}`,
          parentPhone: "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Yangi o'quvchi muvaffaqiyatli qo'shildi!");
      setIsModalOpen(false);
      setFirstName(""); setLastName(""); setEmail("");
      fetchClassDetail();
    } catch (err) {
      console.log("Error details:", err.response?.data);
      toast.error("Daraja yetarli emas" || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = (student, type) => {
    setSelectedStudent({ id: student.studentId?._id, name: student.studentId?.fullName });
    setModalType(type);
    setModalOpen(true);
  };

  const handleScoreSubmit = async (data) => {
    try {
      await axios.post(
        `https://pdp-system-backend-1.onrender.com/api/v1/transactions`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Transaction qo'shildi!");
      setModalOpen(false);
      fetchClassDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik");
    }
  };

  const getStatus = (score) => {
    if (score <= 4) return { text: "Sariq ro'yhat",   className: "bg-yellow-100 text-orange-600" };
    if (score <= 6) return { text: "Ogohlantirish",   className: "bg-yellow-100 text-yellow-500" };
    return             { text: "Normal",               className: "bg-green-100  text-green-600"  };
  };

  if (loading) return <Loader />;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">

      {/* ── BACK BUTTON ───────────────────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold mb-6 sm:mb-8 hover:text-indigo-600 transition-all"
      >
        <ArrowLeft size={18} /> Orqaga
      </button>

      {/* ── CLASS INFO CARD ───────────────────────────────────── */}
      <div className="bg-white rounded-3xl sm:rounded-[40px] p-6 sm:p-8 md:p-10 border border-slate-100 shadow-sm mb-6 sm:mb-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-block bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Sinf ma'lumotlari
            </span>
            <div className="flex items-center gap-2 mt-4 sm:mt-6 text-slate-400 font-bold text-sm sm:text-base">
              <Users size={18} />
              <span>{classData.length} o'quvchi ro'yxatda</span>
            </div>
          </div>

          {/* Add student button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 bg-indigo-600 text-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
            aria-label="O'quvchi qo'shish"
          >
            <UserPlus size={22} className="sm:hidden" />
            <UserPlus size={26} className="hidden sm:block" />
          </button>
        </div>
      </div>

      {/* ── SECTION TITLE ─────────────────────────────────────── */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <GraduationCap size={26} className="text-indigo-600 shrink-0 sm:hidden" />
        <GraduationCap size={32} className="text-indigo-600 shrink-0 hidden sm:block" />
        O'quvchilar ro'yxati
      </h2>

      {/* ── STUDENT LIST ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {classData.length === 0 && (
          <div className="bg-slate-50 rounded-3xl p-12 sm:p-16 text-center border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold">O'quvchilar topilmadi</p>
          </div>
        )}

        {classData.map((student, index) => {
          const status = getStatus(student.disciplineScore);
          const totalScore = student.disciplineScore + student.rewardScore;

          return (
            <div
              key={student._id || index}
              className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-50 group hover:border-indigo-100 transition-all"
            >
              {/* ── MOBILE layout (< sm): stacked ── */}
              <div className="flex items-center gap-3 sm:hidden">
                {/* Index */}
                <div className="w-10 h-10 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-sm">
                  {index + 1}
                </div>

                {/* Name + email */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-[15px] truncate">
                    {student.studentId?.fullName}
                  </p>
                  <p className="text-xs text-slate-400 font-medium truncate flex items-center gap-1">
                    <Mail size={11} /> {student.studentId?.email}
                  </p>
                </div>

                {/* Score */}
                <div className="shrink-0 text-right">
                  <span className="text-xl font-bold text-slate-800">{totalScore}</span>
                  <span className="text-xs text-slate-400 ml-0.5">b</span>
                </div>
              </div>

              {/* Status + actions row (mobile) */}
              <div className="flex items-center justify-between mt-3 sm:hidden">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>
                  {status.text}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(student, "positive")}
                    className="bg-green-100 text-green-600 w-9 h-9 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-green-200 active:scale-95 transition-all"
                  >+</button>
                  <button
                    onClick={() => openModal(student, "negative")}
                    className="bg-red-100 text-red-600 w-9 h-9 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-red-200 active:scale-95 transition-all"
                  >−</button>
                </div>
              </div>

              {/* ── DESKTOP layout (≥ sm): single row ── */}
              <div className="hidden sm:flex items-center justify-between gap-3">
                {/* Index + name */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-sm">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg md:text-xl font-black text-slate-800 truncate">
                      {student.studentId?.fullName}
                    </p>
                    <p className="text-sm text-slate-400 font-bold flex items-center gap-1 truncate">
                      <Mail size={13} /> {student.studentId?.email}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <p className="text-2xl md:text-3xl text-black font-bold shrink-0">
                  {totalScore}
                  <span className="text-sm md:text-base text-slate-400 font-medium ml-1">ball</span>
                </p>

                {/* Status */}
                <span className={`rounded-full px-3 md:px-4 py-1 text-sm font-bold shrink-0 ${status.className}`}>
                  {status.text}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openModal(student, "positive")}
                    className="bg-green-300 text-green-600 w-10 h-10 rounded-xl font-bold text-xl flex items-center justify-center shadow-sm hover:bg-green-400 active:scale-95 transition-all"
                  >+</button>
                  <button
                    onClick={() => openModal(student, "negative")}
                    className="bg-red-300 text-red-600 w-10 h-10 rounded-xl font-bold text-xl flex items-center justify-center shadow-sm hover:bg-red-400 active:scale-95 transition-all"
                  >−</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ADD STUDENT MODAL ─────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg rounded-t-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl">

            {/* Drag handle (mobile only) */}
            <div className="sm:hidden mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200" />

            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800">Yangi o'quvchi</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label="Yopish"
              >
                <X size={26} />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4 sm:space-y-5">
              {[
                { label: "Ism",      value: firstName, setter: setFirstName, placeholder: "Ismni kiriting",      icon: User },
                { label: "Familiya", value: lastName,  setter: setLastName,  placeholder: "Familiyani kiriting", icon: User },
                { label: "Email",    value: email,     setter: setEmail,     placeholder: "example@pdp.uz",      icon: Mail, type: "email" },
              ].map(({ label, value, setter, placeholder, icon: Icon, type }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={17} />
                    <input
                      required
                      type={type || "text"}
                      className="w-full pl-11 pr-4 py-3.5 sm:py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm sm:text-base"
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 text-white py-4 sm:py-5 rounded-3xl font-black text-lg sm:text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
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