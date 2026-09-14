"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Email atau password salah. Silakan coba lagi.");
      setIsLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E15A3E]/20 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#E15A3E] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
              P
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              ortal<span className="text-slate-400 font-semibold">Client</span>
            </span>
          </div>
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Platform agensi modern untuk <span className="text-[#E15A3E]">klien profesional.</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Kelola proyek, lacak worklog, dan kirimkan invoice — semuanya dalam satu tempat.
          </p>
          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["Invoice Otomatis", "Track Worklog", "Multi-Role", "Webhook Payment"].map((f) => (
              <span key={f} className="text-xs bg-white/5 border border-white/10 text-slate-300 px-3 py-1.5 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-slate-600 text-sm">
          © 2025 PortalClient. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-[#E15A3E] rounded-xl flex items-center justify-center text-white font-black text-lg">
              P
            </div>
            <span className="text-xl font-extrabold text-white">
              ortal<span className="text-slate-400 font-semibold">Client</span>
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Selamat Datang Kembali</h1>
              <p className="text-slate-400 mt-1 text-sm">
                Masuk ke akun kamu untuk melanjutkan
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@agensi.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#E15A3E]/50 focus:border-[#E15A3E]/50 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-11 py-2.5 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#E15A3E]/50 focus:border-[#E15A3E]/50 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-[#E15A3E] hover:bg-[#C54A30] text-white font-semibold rounded-xl py-2.5 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#E15A3E]/20"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {isLoading ? "Memproses..." : "Masuk"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link href="/register" className="text-[#E15A3E] font-medium hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
