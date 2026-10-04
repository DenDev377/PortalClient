"use client";

import { useState } from "react";
import { User, Lock, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileSettingsFormProps {
  initialName: string;
  email: string;
  role: string;
}

export default function ProfileSettingsForm({ initialName, email, role }: ProfileSettingsFormProps) {
  const router = useRouter();
  
  const [name, setName] = useState(initialName);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (password && password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password: password || undefined }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setPassword("");
        setConfirmPassword("");
        router.refresh(); // Refresh session data in Next.js
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.message || "Gagal memperbarui profil.");
      }
    } catch (err) {
      setError("Kesalahan jaringan. Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
        <h2 className="text-base font-semibold text-slate-800">Detail Akun</h2>
        <p className="text-sm text-slate-500 mt-1">
          Perbarui nama lengkap dan kata sandi untuk akun login Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {success && (
          <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <p>Profil berhasil diperbarui.</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Akun Read-Only Data */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Akses</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Hak Akses (Role)</label>
            <input
              type="text"
              value={role}
              disabled
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E15A3E]/40 focus:border-[#E15A3E] transition-all"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Ubah Kata Sandi (Opsional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Kata Sandi Baru</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak ingin diubah"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E15A3E]/40 focus:border-[#E15A3E] transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Konfirmasi Kata Sandi Baru</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E15A3E]/40 focus:border-[#E15A3E] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#E15A3E] hover:bg-[#C14A2F] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-60 shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
