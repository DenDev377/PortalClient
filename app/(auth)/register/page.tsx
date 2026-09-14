"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Terjadi kesalahan.");
      } else {
        setSuccess("Akun berhasil dibuat! Mengalihkan ke halaman login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
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
            Mulai kelola klien & invoice <span className="text-[#E15A3E]">profesional.</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Buat akun tim dan mulai melacak proyek, worklog, dan tagihan dalam satu platform terpadu.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <div className="flex -space-x-2">
              {["A", "B", "C"].map((l) => (
                <div key={l} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs text-white font-medium">
                  {l}
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-sm">Bergabung dengan tim agensi terbaik</p>
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
              <h1 className="text-2xl font-bold text-white">Buat Akun Baru</h1>
              <p className="text-slate-400 mt-1 text-sm">
                Isi data di bawah untuk mendaftarkan akun tim kamu
              </p>
            </div>

            {/* Error / Success Alert */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-5 p-3.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nama */}
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-300">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ahmad Fauzi"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#E15A3E]/50 focus:border-[#E15A3E]/50 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@agensi.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#E15A3E]/50 focus:border-[#E15A3E]/50 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimal 8 karakter"
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
                <p className="mt-1.5 text-xs text-slate-500">Gunakan minimal 8 karakter</p>
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
                  <UserPlus className="w-4 h-4" />
                )}
                {isLoading ? "Membuat akun..." : "Buat Akun"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-[#E15A3E] font-medium hover:underline">
                Login di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
