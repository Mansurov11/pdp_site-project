import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFF] overflow-hidden">

      {/* ─── HEADER ──────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-[100] flex items-center">

        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
          className="md:hidden ml-4 p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="3" y1="5"  x2="17" y2="5" />
            <line x1="3" y1="10" x2="17" y2="10" />
            <line x1="3" y1="15" x2="17" y2="15" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <Header />
        </div>
      </header>

      {/* ─── BODY ────────────────────────────────────────────────── */}
      <div className="flex flex-1 pt-16 overflow-hidden">

        {/* ── DESKTOP SIDEBAR ────────────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-64 lg:w-72 fixed left-0 top-16 bottom-0 bg-white border-r border-slate-100 z-40 overflow-y-auto">
          <Sidebar />
        </aside>

        {/* ── MOBILE BACKDROP ────────────────────────────────────── */}
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          className={`md:hidden fixed inset-0 z-[90] bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        />

        {/* ── MOBILE DRAWER ──────────────────────────────────────── */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className={`md:hidden fixed left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white border-r border-slate-100 z-[100] flex flex-col overflow-y-auto shadow-2xl transition-transform duration-300 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 shrink-0">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="3" y1="3" x2="15" y2="15" />
                <line x1="15" y1="3" x2="3"  y2="15" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </aside>

        {/* ── MAIN CONTENT ───────────────────────────────────────── */}
        {/*
          No padding here — each page (Dashboard, History, etc.) owns
          its own padding so it never doubles up. Only the sidebar
          offset lives at the layout level.
        */}
        <main className="flex-1 md:ml-64 lg:ml-72 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto min-h-[calc(100vh-64px)]">
            <Outlet />
          </div>

          <footer className="py-8 text-center border-t border-slate-50">
            <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
              PDP School © 2026
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;