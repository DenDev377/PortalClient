"use client";
import { FileText, Clock, UserPlus } from "lucide-react";

export default function QuickActionsWidget() {
  const handleNewInvoice = () => {
    console.log("Buka Modal Invoice Builder");
    // TODO: Trigger modal
  };

  const handleLogWorklog = () => {
    console.log("Buka Modal Time Tracker");
    // TODO: Trigger modal
  };

  const handleAddClient = () => {
    console.log("Buka Form Klien Baru");
    // TODO: Trigger modal
  };

  const actions = [
    {
      label: "Buat Invoice Baru",
      icon: FileText,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      hoverBg: "hover:bg-amber-100",
      onClick: handleNewInvoice,
    },
    {
      label: "Catat Worklog",
      icon: Clock,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      hoverBg: "hover:bg-blue-100",
      onClick: handleLogWorklog,
    },
    {
      label: "Tambah Klien",
      icon: UserPlus,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      hoverBg: "hover:bg-green-100",
      onClick: handleAddClient,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Aksi Cepat
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`${action.bgColor} ${action.textColor} ${action.hoverBg} rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md border border-transparent hover:border-slate-200 group`}
          >
            <action.icon className="w-6 h-6" />
            <span className="text-xs font-medium text-slate-700 text-center group-hover:text-slate-900">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
