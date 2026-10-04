import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ProfileSettingsForm from "@/components/admin/ProfileSettingsForm";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-slate-900">Pengaturan Profil</h1>
      <p className="mt-1 text-slate-500 text-sm mb-6">
        Kelola informasi akun dan kata sandi Anda.
      </p>

      <ProfileSettingsForm 
        initialName={session.user.name || ""} 
        email={session.user.email || ""} 
        role={session.user.role} 
      />
    </div>
  );
}
