import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Pdp from "../../assets/pdp.png";

/* ─── Injected responsive styles ─── */
const styles = `
  .login-wrapper {
    display: flex;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
    font-family: sans-serif;
  }

  /* ── Left Panel ── */
  .login-left {
    width: 45%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    background: linear-gradient(135deg, #5b52f0 0%, #4338ca 40%, #3730a3 100%);
  }

  .login-left-shimmer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(-132.5deg, #6366f1 50%, transparent 50%);
    z-index: 1;
  }

  .login-left-content {
    display: flex;
    flex-direction: column;
    gap: 32px;
    z-index: 10;
  }

  .login-logo-box {
    width: 56px;
    height: 56px;
    background: white;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    flex-shrink: 0;
  }

  .login-left-footer {
    color: #a5b4fc;
    font-size: 12px;
    z-index: 10;
    font-weight: 500;
  }

  /* ── Right Panel ── */
  .login-right {
    flex: 1;
    min-height: 100vh;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
  }

  .login-form-inner {
    width: 100%;
    max-width: 420px;
  }

  .login-input {
    width: 100%;
    padding: 14px 18px;
    border: 2px solid #f1f5f9;
    border-radius: 14px;
    font-size: 15px;
    color: #1e293b;
    outline: none;
    background-color: #f8fafc;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .login-input:focus {
    border-color: #6366f1;
  }

  .login-btn {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
    transition: transform 0.1s, opacity 0.2s;
    margin-bottom: 24px;
  }

  .login-btn:disabled {
    cursor: not-allowed;
    opacity: 0.75;
  }

  .login-btn:not(:disabled):hover  { opacity: 0.9; }
  .login-btn:not(:disabled):active { transform: scale(0.98); }

  /* ── Mobile breakpoint ── */
  @media (max-width: 1023px) {
    .login-left {
      display: none;
    }

    .login-right {
      padding: 36px 20px;
    }

    .login-form-inner {
      max-width: 100%;
    }
  }

  /* ── Extra-small screens ── */
  @media (max-width: 480px) {
    .login-right {
      padding: 28px 16px;
      align-items: flex-start;
      padding-top: 60px;
    }
  }
`;

const Login = () => {
  const [email, setEmail]       = useState("student.9a1@gmail.com");
  const [password, setPassword] = useState("Student@123");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  /* ─── SAHIFAGA KIRGANDA BACKENDNI UYG'OTISH ─── */
  useEffect(() => {
    // Stillarni inject qilish
    const tag = document.createElement("style");
    tag.id = "login-styles";
    tag.textContent = styles;
    if (!document.getElementById("login-styles")) {
      document.head.appendChild(tag);
    }

    // Backend serverga "ping" jo'natib uyg'otib qo'yamiz
    axios.get("https://pdp-system-backend-1.onrender.com/")
      .then(() => console.log("Backend muvaffaqiyatli uyg'ondi."))
      .catch(() => console.log("Backend uyg'onmoqda..."));

    return () => tag.remove();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Iltimos, barcha maydonlarni to'ldiring");
    }

    let wakeUpWarning;

    try {
      setLoading(true);

      // Agar foydalanuvchi tezda bosib yuborsa va backend hali uxlab yotgan bo'lsa, 3 soniyadan keyin ogohlantiradi
      wakeUpWarning = setTimeout(() => {
        toast.info("Kirilmoqda, iltimos kuting", { autoClose: 8000 });
      }, 8000);

      const res = await axios.post(
        "https://pdp-system-backend-1.onrender.com/api/v1/auth/login",
        { email, password },
        { timeout: 60000 }
      );

      clearTimeout(wakeUpWarning);

      const { accessToken, user } = res.data.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

     toast.success(`Xush kelibsiz, ${user.fullName}!`, { autoClose: 2000 });

      if (user.role === "student") {
        navigate("/student/home");
      } else if (user.role === "teacher" || user.role === "admin") {
        navigate("/home");
      } else {
        localStorage.clear();
        toast.warning("Sizda ushbu tizimga kirish huquqi yo'q!");
      }
    } catch (err) {
      clearTimeout(wakeUpWarning);
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message || "Login yoki parol noto'g'ri";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-left-shimmer" />
        <div className="login-left-content">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="login-logo-box">
              <img src={Pdp} alt="PDP Logo" style={{ width: "80%" }} />
            </div>
            <div>
              <div style={{ color: "white", fontWeight: 800, fontSize: 22, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                PDP School
              </div>
              <div style={{ color: "#a5b4fc", fontSize: 13, fontWeight: 600 }}>
                O'quvchi Etikasi Indeksi
              </div>
            </div>
          </div>
          <div>
            <p style={{ color: "white", fontSize: 24, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, letterSpacing: "-0.01em" }}>
              "Tartib va intizom — muvaffaqiyatning kaliti"
            </p>
            <p style={{ color: "#a5b4fc", fontSize: 14, fontWeight: 600 }}>
              - PDP School Management
            </p>
          </div>
        </div>
        <p className="login-left-footer">
          © 2026 PDP School. Barcha huquqlar himoyalangan.
        </p>
      </div>

      <div className="login-right">
        <div className="login-form-inner">
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#111827", marginBottom: 6, letterSpacing: "-0.03em" }}>
            Xush kelibsiz
          </h2>
          <p style={{ color: "#64748b", fontSize: 15, marginBottom: 40, fontWeight: 500 }}>
            Tizimga kirish uchun ma'lumotlaringizni kiriting
          </p>

          <form onSubmit={handleLogin}>
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
                className="login-input"
              />
            </div>

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
                className="login-input"
              />
            </div>

            <div style={{ marginBottom: 32, textAlign: "right" }}>
              <span
                style={{ color: "#6366f1", fontSize: 14, cursor: "pointer", fontWeight: 700 }}
                onClick={() => toast.info("Parolni tiklash uchun adminstratsiyaga murojaat qiling")}
              >
                Parolni unutdingizmi?
              </span>
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "Kirilmoqda..." : "Tizimga kirish"}
            </button>
          </form>

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