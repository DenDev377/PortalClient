import React from "react";

export default async function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-slate-900">Pengaturan Profil</h1>
      <p className="mt-1 text-slate-500 text-sm">
        Kelola informasi akun dan kata sandi Anda.
      </p>

      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-sm text-slate-500 italic">
          // TODO UI: Developer (Anda) dapat mengembangkan antarmuka form pengaturan di sini sesuai aturan desain.
          <br />
          // Endpoint yang tersedia: <strong>PUT /api/settings/profile</strong>
          <br />
          // Payload: <code className="bg-slate-100 px-1 rounded">{`{ name: string, password?: string }`}</code>
        </p>
      </div>
    </div>
  );
}
