import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Pdp from "../../assets/pdp.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isDesktop = window.innerWidth >= 1024;

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!email || !password) {
      return toast.error("Iltimos, barcha maydonlarni to'ldiring");
    }

    try {
      setLoading(true);
      
      const res = await axios.post(
        "https://pdp-system-backend-1.onrender.com/api/v1/auth/login",
        { email, password }
      );

      // Destructuring the response based on your API structure
      const { accessToken, user } = res.data.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Xush kelibsiz, ${user.fullName}!`);

      if (user.role === "student") {
        navigate("/student/home");
      } else if (user.role === "teacher" || user.role === "admin") {
        navigate("/home");
      } else {
        localStorage.clear();
        toast.warning("Sizda ushbu tizimga kirish huquqi yo'q!");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Login yoki parol noto'g'ri";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 69e0d9e520f198b345977645

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", overflow: "hidden", fontFamily: "sans-serif" }}>
      
      {/* ── Left Panel (Desktop Only) ── */}
      {isDesktop && (
        <div
          style={{
            width: "45%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "40px",
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #5b52f0 0%, #4338ca 40%, #3730a3 100%)",
            flexShrink: 0,
          }}
        >
          {/* Decorative Shimmer Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: `linear-gradient(-132.5deg, #6366f1 50%, transparent 50%)`,
              zIndex: 1,
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "32px", zIndex: 10 }}>
            {/* Logo Section */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "white",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  flexShrink: 0,
                }}
              >
                <img src={Pdp} alt="PDP Logo" style={{ width: "80%" }} />
              </div>
              <div>
                <div style={{ color: "white", fontWeight: 800, fontSize: 22, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                  PDP School
                </div>
                <div style={{ color: "#a5b4fc", fontSize: 13, fontWeight: 600 }}>O'quvchi Etikasi Indeksi</div>
              </div>
            </div>

            {/* Motivational Text */}
            <div>
              <p style={{ color: "white", fontSize: 24, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, letterSpacing: "-0.01em" }}>
                "Tartib va intizom — muvaffaqiyatning kaliti"
              </p>
              <p style={{ color: "#a5b4fc", fontSize: 14, fontWeight: 600 }}>- PDP School Management</p>
            </div>
          </div>

          <p style={{ color: "#a5b4fc", fontSize: 12, zIndex: 10, fontWeight: 500 }}>
            © 2026 PDP School. Barcha huquqlar himoyalangan.
          </p>
        </div>
      )}

      {/* ── Right Panel (Login Form) ── */}
      <div
        style={{
          flex: 1,
          minHeight: "100vh",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#111827", marginBottom: 6, letterSpacing: "-0.03em" }}>
            Xush kelibsiz
          </h2>
          <p style={{ color: "#64748b", fontSize: 15, marginBottom: 40, fontWeight: 500 }}>
            Tizimga kirish uchun ma'lumotlaringizni kiriting
          </p>

          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Email Manzili
              </label>
              <input
                type="email"
                required
                placeholder="name@pdp.uz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  border: "2px solid #f1f5f9",
                  borderRadius: 14,
                  fontSize: 15,
                  color: "#1e293b",
                  outline: "none",
                  backgroundColor: "#f8fafc",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                onBlur={(e) => e.target.style.borderColor = "#f1f5f9"}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Parol
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  border: "2px solid #f1f5f9",
                  borderRadius: 14,
                  fontSize: 15,
                  color: "#1e293b",
                  outline: "none",
                  backgroundColor: "#f8fafc",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                onBlur={(e) => e.target.style.borderColor = "#f1f5f9"}
              />
            </div>

            {/* Forgot Password Link */}
            <div style={{ marginBottom: 32, textAlign: "right" }}>
              <span 
                style={{ color: "#6366f1", fontSize: 14, cursor: "pointer", fontWeight: 700 }}
                onClick={() => toast.info("Parolni tiklash uchun adminstratsiyaga murojaat qiling")}
              >
                Parolni unutdingizmi?
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "white",
                fontWeight: 700,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
                transition: "transform 0.1s, opacity 0.2s",
                marginBottom: 24
              }}
              onMouseEnter={(e) => !loading && (e.target.style.opacity = "0.9")}
              onMouseLeave={(e) => !loading && (e.target.style.opacity = "1")}
              onMouseDown={(e) => !loading && (e.target.style.transform = "scale(0.98)")}
              onMouseUp={(e) => !loading && (e.target.style.transform = "scale(1)")}
            >
              {loading ? "Kirilmoqda..." : "Tizimga kirish"}
            </button>
          </form>

          {/* Bottom Help Text */}
          <p style={{ textAlign: "center", fontSize: 14, color: "#64748b", fontWeight: 500 }}>
            Hisobingiz yo'qmi?{" "}
            <span style={{ color: "#6366f1", cursor: "pointer", fontWeight: 700 }}>
               Ustozingizga ayting!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
