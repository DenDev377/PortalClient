import React from "react";
import BillingSettingsForm from "@/components/admin/BillingSettingsForm";

export default async function BillingSettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-slate-900">Aturan Penagihan</h1>
      <p className="mt-1 text-slate-500 text-sm mb-6">
        Konfigurasikan aturan pajak, notifikasi, dan preferensi invoice default.
      </p>

      <BillingSettingsForm />
    </div>
  );
}
