import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

/* ── Floating orbs data ── */
const ORBS = [
  {
    top: "10%",
    left: "8%",
    size: 10,
    color: "#a855f7",
    delay: "0s",
    duration: "7s",
  },
  {
    top: "18%",
    left: "88%",
    size: 8,
    color: "#ec4899",
    delay: "1s",
    duration: "9s",
  },
  {
    top: "45%",
    left: "5%",
    size: 7,
    color: "#6366f1",
    delay: "2s",
    duration: "8s",
  },
  {
    top: "65%",
    left: "92%",
    size: 9,
    color: "#8b5cf6",
    delay: "0.5s",
    duration: "6s",
  },
  {
    top: "80%",
    left: "20%",
    size: 6,
    color: "#a855f7",
    delay: "3s",
    duration: "10s",
  },
  {
    top: "30%",
    left: "75%",
    size: 5,
    color: "#ec4899",
    delay: "1.5s",
    duration: "11s",
  },
  {
    top: "55%",
    left: "60%",
    size: 4,
    color: "#6366f1",
    delay: "2.5s",
    duration: "8s",
  },
  {
    top: "88%",
    left: "70%",
    size: 6,
    color: "#c084fc",
    delay: "0.8s",
    duration: "9s",
  },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

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

      {/* ── Radial glow center ── */}
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
        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5 mb-6">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white font-bold text-base"
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
        </div>

        {/* ── Heading ── */}
        <h1
          className="text-white text-2xl font-bold mb-1"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Create account
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Join the community today&nbsp;
          <span className="text-purple-400">✦</span>
        </p>

        {/* ── Form ── */}
        <form className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5 font-medium">
              Full Name
            </label>
            <input
              id="full-name"
              type="text"
              placeholder="Your name"
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="w-full rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                aria-label="Toggle password visibility"
              >
                <Icon
                  icon={
                    showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"
                  }
                  width={18}
                />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5 font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                aria-label="Toggle confirm password visibility"
              >
                <Icon
                  icon={showConfirm ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                  width={18}
                />
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer mt-0.5">
            <div
              className="relative mt-0.5 flex-shrink-0"
              onClick={() => setAgreed((v) => !v)}
            >
              <div
                className="w-4 h-4 rounded flex items-center justify-center transition"
                style={{
                  background: agreed
                    ? "linear-gradient(135deg,#a855f7,#7c3aed)"
                    : "rgba(255,255,255,0.06)",
                  border: agreed
                    ? "1.5px solid #a855f7"
                    : "1.5px solid rgba(255,255,255,0.15)",
                }}
              >
                {agreed && (
                  <Icon
                    icon="mdi:check-bold"
                    width={10}
                    className="text-white"
                  />
                )}
              </div>
            </div>
            <span className="text-slate-400 text-xs leading-relaxed">
              I agree to the{" "}
              <a href="#" className="text-purple-400 hover:underline">
                Terms &amp; Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-400 hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>

          {/* Submit */}
          <button
            id="register-btn"
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 mt-1"
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
              boxShadow: "0 4px 22px rgba(168,85,247,0.38)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Create Account
            <Icon icon="mdi:arrow-right" width={18} />
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-semibold transition"
          >
            Login
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
