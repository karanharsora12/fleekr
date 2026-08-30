import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { generateOtp, verifyOtp, loginUser } from "../services/authService";

/* ── Floating orbs data ── */
const ORBS = [
  {
    top: "8%",
    left: "7%",
    size: 10,
    color: "#a855f7",
    delay: "0s",
    duration: "7s",
  },
  {
    top: "15%",
    left: "87%",
    size: 8,
    color: "#ec4899",
    delay: "1s",
    duration: "9s",
  },
  {
    top: "42%",
    left: "4%",
    size: 7,
    color: "#6366f1",
    delay: "2s",
    duration: "8s",
  },
  {
    top: "63%",
    left: "91%",
    size: 9,
    color: "#8b5cf6",
    delay: "0.5s",
    duration: "6s",
  },
  {
    top: "78%",
    left: "18%",
    size: 6,
    color: "#a855f7",
    delay: "3s",
    duration: "10s",
  },
  {
    top: "28%",
    left: "74%",
    size: 5,
    color: "#ec4899",
    delay: "1.5s",
    duration: "11s",
  },
  {
    top: "52%",
    left: "58%",
    size: 4,
    color: "#6366f1",
    delay: "2.5s",
    duration: "8s",
  },
  {
    top: "86%",
    left: "68%",
    size: 6,
    color: "#c084fc",
    delay: "0.8s",
    duration: "9s",
  },
  {
    top: "70%",
    left: "40%",
    size: 5,
    color: "#f472b6",
    delay: "1.2s",
    duration: "7s",
  },
];

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState("password"); // 'password' or 'otp'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResendOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await generateOtp({ email });
      const data = response?.data || response;
      if (data?.success || data?.message?.includes("sent")) {
        setMessage("OTP resent to your email!");
      } else {
        setMessage(data?.message || "Error resending OTP");
      }
    } catch (error) {
      console.log(error);
      setMessage(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (loginMethod === "password") {
        const response = await loginUser({ email, password });
        const data = response?.data || response;
        if (data?.token || data?.access_token) {
          localStorage.setItem("token", data.token || data.access_token);
          navigate("/home", { replace: true });
        } else {
          setMessage(data?.message || "Invalid credentials");
        }
      } else {
        if (step === 1) {
          const response = await generateOtp({ email });
          const data = response?.data || response;
          if (data?.success || data?.message?.includes("sent") || data?.message?.includes("OTP")) {
            setStep(2);
            setMessage("OTP sent to your email!");
          } else {
            setMessage(data?.message || "Error sending OTP");
          }
        } else {
          const response = await verifyOtp({ email, otp });
          const data = response?.data || response;
          if (data?.token || data?.access_token) {
            localStorage.setItem("token", data.token || data.access_token);
            navigate("/home", { replace: true });
          } else {
            setMessage(data?.message || "Invalid OTP");
          }
        }
      }
    } catch (error) {
      console.log(error);
      setMessage(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0d0b1a] flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* ── Grid background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(120,60,220,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(120,60,220,0.07) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* ── Radial glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(120,40,255,0.13) 0%, transparent 70%)",
        }}
      />

      {/* ── Floating orbs ── */}
      {ORBS.map((orb, i) => (
        <span
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            boxShadow: `0 0 ${orb.size * 2}px ${orb.color}`,
            opacity: 0.8,
            animation: `floatOrb ${orb.duration} ${orb.delay} ease-in-out infinite alternate`,
          }}
        />
      ))}

      {/* ── Card ── */}
      <div
        className="relative z-10 w-full max-w-[420px] rounded-[22px] px-8 py-9 animate-fadeIn"
        style={{
          background: "rgba(15, 12, 28, 0.82)",
          border: "1px solid rgba(150, 80, 255, 0.22)",
          backdropFilter: "blur(28px)",
          boxShadow:
            "0 0 80px rgba(120, 40, 255, 0.14), 0 32px 64px rgba(0,0,0,0.55)",
        }}
      >
        {/* ── Logo + Badge ── */}
        <div className="flex items-center gap-2.5 mb-6">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white font-bold text-base flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #a855f7, #7c3aed)",
              boxShadow: "0 4px 16px rgba(168,85,247,0.45)",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            F
          </div>
          <span
            className="text-white text-xl font-bold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Fleekr
          </span>
          {/* Badge */}
          <span
            className="ml-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium"
            style={{
              background: "rgba(168,85,247,0.18)",
              border: "1px solid rgba(168,85,247,0.35)",
              color: "#c084fc",
            }}
          >
            ✦ Your vibe, your world
          </span>
        </div>

        {/* ── Heading ── */}
        <h1
          className="text-white text-2xl font-bold mb-1"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Welcome back
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Sign in to continue your journey
        </p>

        {/* ── Login Method Tabs ── */}
        <div className="flex p-1 mb-6 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              loginMethod === "password" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
            onClick={() => { setLoginMethod("password"); setStep(1); setMessage(""); }}
          >
            Password
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              loginMethod === "otp" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
            onClick={() => { setLoginMethod("otp"); setStep(1); setMessage(""); }}
          >
            OTP
          </button>
        </div>

        {/* ── Form ── */}
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMethod === "otp" && step === 2}
              placeholder="you@example.com"
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-50"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            />
          </div>

          {/* Password (if method is password) */}
          {loginMethod === "password" && (
            <div>
              <label className="block text-slate-300 text-sm mb-1.5 font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              />
              <div className="flex justify-end mt-1.5">
                <Link to="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 transition">
                  Forgot password?
                </Link>
              </div>
            </div>
          )}

          {/* OTP (if method is otp and step is 2) */}
          {loginMethod === "otp" && step === 2 && (
            <div>
              <label className="block text-slate-300 text-sm mb-1.5 font-medium">
                One-Time Password
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              />
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-xs text-purple-400 hover:text-purple-300 transition disabled:opacity-50"
                >
                  Resend OTP?
                </button>
              </div>
            </div>
          )}

          {message && (
             <div className="text-sm text-purple-400 mt-1">{message}</div>
          )}

          {/* Login Button */}
          <button
            id="login-btn"
            type="submit"
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 mt-1 ${loading ? "cursor-not-allowed opacity-70" : ""}`}
            disabled={loading || !email || (loginMethod === "password" && !password) || (loginMethod === "otp" && step === 2 && !otp)}
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
              boxShadow: "0 4px 22px rgba(168,85,247,0.38)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {loading ? (
              <>
                <Icon icon="mdi:loading" width={18} className="animate-spin" />
                Loading...
              </>
            ) : (
              <>
                {loginMethod === "password" ? 'Login' : step === 1 ? 'Send OTP' : 'Verify & Login'}
                <Icon icon="mdi:arrow-right" width={18} />
              </>
            )}
          </button>

          {/* OR divider */}
          <div className="flex items-center gap-3 my-0.5">
            <hr
              className="flex-1"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            />
            <span className="text-slate-500 text-xs tracking-widest">OR</span>
            <hr
              className="flex-1"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-slate-300 text-sm font-medium transition"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.09)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
              }
            >
              <Icon icon="flat-color-icons:google" width={18} />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-slate-300 text-sm font-medium transition"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.09)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
              }
            >
              <Icon icon="mdi:apple" width={18} className="text-white" />
              Apple
            </button>
          </div>
        </form>

        {/* ── Footer ── */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-400 hover:text-purple-300 font-semibold transition"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* ── Help button ── */}
      <button
        className="fixed bottom-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
        aria-label="Help"
      >
        <Icon icon="mdi:help" width={16} />
      </button>
    </div>
  );
}
