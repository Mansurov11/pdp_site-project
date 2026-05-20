import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";

const navClass = ({ isActive }) =>
  `flex items-center gap-4 px-6 py-4 mx-2 rounded-2xl transition-all duration-300 group ${
    isActive
      ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-100 font-bold"
      : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600 font-semibold"
  }`;

const StudentSidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-full h-full bg-white flex flex-col justify-between py-6">
      <div className="flex flex-col">
        <ul className="flex flex-col gap-2">
          <li>
            <NavLink to="/student/home" className={navClass} onClick={handleNavClick}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span className="text-[15px]">Bosh sahifa</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/student/leaders" className={navClass} onClick={handleNavClick}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
              </svg>
              <span className="text-[15px]">Liderlar</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/student/rules" className={navClass} onClick={handleNavClick}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
              <span className="text-[15px]">Qoidalar</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/student/complain" className={navClass} onClick={handleNavClick}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <span className="text-[15px]">Shikoyatlar</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/student/profile" className={navClass} onClick={handleNavClick}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span className="text-[15px]">Profil</span>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="px-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          <span className="text-[15px]">Chiqish</span>
        </button>
      </div>
    </aside>
  );
};

const StudentHeader = ({ onMenuClick }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "ST";

  return (
    <div className="h-full flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger button — mobile only */}
        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
        </div>
        <span className="font-black text-slate-800 text-lg tracking-tight">PDP School</span>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full hidden sm:inline">O'quvchi</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-slate-600 hidden sm:block">{user.fullName}</span>
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-black">
          {initials}
        </div>
      </div>
    </div>
  );
};

const StudentLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFF] overflow-hidden">
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-50">
        <StudentHeader onMenuClick={() => setMobileOpen(true)} />
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
            <span className="font-black text-slate-800 tracking-tight">PDP School</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <StudentSidebar onClose={() => setMobileOpen(false)} />
      </div>

      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="w-72 fixed left-0 top-16 bottom-0 bg-white border-r border-slate-100 z-40 hidden md:flex flex-col overflow-y-auto">
          <StudentSidebar />
        </aside>

        <main className="flex-1 md:ml-72 overflow-y-auto p-6 md:p-10">
          <div className="max-w-360 mx-auto min-h-[calc(100vh-64px)]">
            <Outlet />
          </div>
          <footer className="mt-20 py-8 text-center border-t border-slate-50">
            <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
              PDP School © 2026
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;