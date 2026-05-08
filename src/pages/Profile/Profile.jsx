import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Camera,
} from "lucide-react";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" }); // Toast o'rniga ichki xabarnoma

  // States
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
  });
  const [notifications, setNotifications] = useState({
    email: true,
    reports: false,
  });

  const API_BASE = "https://pdp-system-backend-1.onrender.com/api/v1";
  const token = localStorage.getItem("token");

  // 1. Ma'lumotlarni yuklash
  const fetchUserData = async () => {
    if (!token) return setLoading(false);
    try {
      const res = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data?.data || res.data);
    } catch (err) {
      console.log(err.message);

      showStatus("Ma'lumot olishda xatolik!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  // Status xabarlarini ko'rsatish
  const showStatus = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  // 2. Parolni yangilash
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!passData.currentPassword || !passData.newPassword) {
      return toast.error("Barcha maydonlarni to‘ldiring!", "error");
    }
    try {
      await axios.post(
        `${API_BASE}/auth/reset-password`,
        {
          password: passData.currentPassword,
          newPassword: passData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      showStatus("Parol muvaffaqiyatli yangilandi!", "success");

      setPassData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      showStatus(
        error.response?.data?.message || "Xatolik yuz berdi!",
        "error",
      );
    }
  };

  // 3. Rasmni yuklash
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.put(`${API_BASE}/auth/updateavatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser({ ...user, avatar: res.data.data });
      showStatus("Rasm yangilandi!", "success");
    } catch (err) {
      console.log(err.message);

      showStatus("Rasmni yuklashda xato!", "error");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#FBFDFF] p-6 md:p-10 font-sans text-slate-700">
      {/* Toast Alert */}
      {message.text && (
        <div
          className={`fixed top-5 right-5 z-50 px-6 py-3 rounded-2xl shadow-lg font-bold text-sm animate-bounce ${
            message.type === "success"
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-8">
          Profil sozlamalari
        </h1>

        {/* --- HEADER HERO CARD --- */}
        <div className="bg-white rounded-[35px] border border-slate-100 shadow-sm mb-10 overflow-hidden">
          <div className="p-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative group">
                <div className="w-32 h-32 bg-[#F0F4FF] rounded-3xl flex items-center justify-center text-4xl font-black text-[#818CF8] uppercase overflow-hidden shadow-inner">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 p-3 bg-[#6366F1] text-white rounded-full border-4 cursor-pointer">
                  <Camera size={18} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>

              <div>
                <h2 className="text-3xl font-black text-slate-800 mb-1">
                  {user?.fullName || "Foydalanuvchi"}
                </h2>
                <p className="text-[#818CF8] font-bold">
                  {user?.role === "admin"
                    ? "Administrator"
                    : "Matematika o'qituvchisi"}
                </p>
                <div className="flex gap-2 mt-4 justify-center md:justify-start">
                  {user?.classes?.map((c, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#F0F3FF] text-[#6366F1] text-[10px] font-black rounded-full uppercase"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#F8FAFF] flex items-center justify-center text-[#6366F1] text-2xl font-black border-4 border-white shadow-sm">
                45
              </div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">
                Faollik
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-slate-50 bg-[#FCFDFF]">
            <StatsBox
              value={user?.classes?.length || 0}
              label="Sinflarim"
              color="text-indigo-400"
            />
            <StatsBox
              value="45"
              label="Harakatlar"
              color="text-slate-400"
              border
            />
            <StatsBox
              value="Faol"
              label="Holat"
              color="text-emerald-400"
              border
            />
          </div>
        </div>

        {/* --- GRID SECTIONS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Section title="Shaxsiy ma'lumotlar" icon={<User size={20} />}>
            <div className="space-y-6 mt-4">
              <Row
                label="F.I.SH"
                value={user?.fullName}
                icon={<User size={16} />}
              />
              <Row
                label="Email"
                value={user?.email}
                icon={<Mail size={16} />}
              />
              <Row
                label="Telefon"
                value={user?.phoneNumber || "+998 -- --- -- --"}
                icon={<Phone size={16} />}
              />
            </div>
          </Section>

          <Section title="Xavfsizlik" icon={<Lock size={20} />}>
            <form onSubmit={handleResetPassword} className="space-y-5 mt-4">
              <Input
                label="Joriy parol"
                value={passData.currentPassword}
                onChange={(e) =>
                  setPassData({ ...passData, currentPassword: e.target.value })
                }
                visible={showPassword.current}
                toggle={() =>
                  setShowPassword({
                    ...showPassword,
                    current: !showPassword.current,
                  })
                }
              />
              <Input
                label="Yangi parol"
                value={passData.newPassword}
                onChange={(e) =>
                  setPassData({ ...passData, newPassword: e.target.value })
                }
                visible={showPassword.new}
                toggle={() =>
                  setShowPassword({ ...showPassword, new: !showPassword.new })
                }
              />
              <button
                type="submit"
                className="w-full bg-[#6366F1] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#4F46E5] shadow-lg shadow-indigo-100 transition-all"
              >
                <Save size={16} className="inline mr-2" /> Saqlash
              </button>
            </form>
          </Section>
        </div>
      </div>
    </div>
  );
};

// --- SMALL COMPONENTS ---

const StatsBox = ({ value, label, color, border }) => (
  <div
    className={`py-8 text-center ${border ? "border-l border-slate-50" : ""}`}
  >
    <p className={`text-2xl font-black ${color}`}>{value}</p>
    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">
      {label}
    </p>
  </div>
);
<></>
const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-[35px] p-8 border border-slate-50 shadow-sm">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-[#F5F8FF] text-[#6366F1] rounded-xl">{icon}</div>
      <h3 className="font-black text-lg text-slate-800">{title}</h3>
    </div>
    {children}
  </div>
);

const Row = ({ label, value, icon }) => (
  <div className="flex flex-col border-b border-slate-50 pb-3">
    <div className="flex items-center gap-2 mb-1 text-slate-300 uppercase font-black text-[9px] tracking-widest">
      {icon} {label}
    </div>
    <p className="font-bold text-slate-700 text-sm pl-6">{value || "—"}</p>
  </div>
);

const ToggleRow = ({ title, active, onClick }) => (
  <div
    className="flex justify-between items-center cursor-pointer group"
    onClick={onClick}
  >
    <p className="font-bold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">
      {title}
    </p>
    <div
      className={`w-12 h-6 rounded-full relative transition-all ${active ? "bg-[#6366F1]" : "bg-slate-100"}`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? "left-7" : "left-1"}`}
      />
    </div>
  </div>
);

const Input = ({ label, value, onChange, visible, toggle }) => (
  <div>
    <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2 block">
      {label}
    </label>
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full bg-[#FBFDFF] border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-100 transition-all"
        placeholder="••••••••"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200 hover:text-indigo-300"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

export default Profile;
