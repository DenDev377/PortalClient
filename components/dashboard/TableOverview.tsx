"use client";

export default function TableOverview() {
  const data = [
    {
      invoiceNumber: "INV-001",
      clientName: "John Doe",
      status: "Paid",
      date: "2023-08-01",
      amount: 50000,
    },
    {
      invoiceNumber: "INV-002",
      clientName: "JohnYY Doe",
      status: "Pending",
      date: "2023-08-01",
      amount: 5000000,
    },
    {
      invoiceNumber: "INV-003",
      clientName: "JohnZZ Doe",
      status: "Overdue",
      date: "2023-08-01",
      amount: 50000000,
    },
  ];
  const renderBadge = (status: string) => {
    if (status === "Paid") {
      return (
        <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
          {status}
        </span>
      );
    } else if (status === "Pending") {
      return (
        <span className="bg-rose-100 text-rose-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-rose-200 dark:text-rose-900">
          {status}
        </span>
      );
    } else if (status === "Overdue") {
      return (
        <span className="bg-amber-100 text-amber-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-amber-200 dark:text-amber-900">
          {status}
        </span>
      );
    } else {
      return (
        <span className="bg-slate-100 text-slate-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-slate-200 dark:text-slate-900">
          {status}
        </span>
      );
    }
  };

  return (
    <div className="max-w-full mx-auto w-full mt-4">
      <div className="mt-4 grid grid-cols-3 lg:grid-cols-1 gap-6">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Total Revenue</h2>
          <a
            href="#"
            className="text-blue-600 bg-blue-50 px-4 py-2 rounded-md hover:text-blue-800"
          >
            Lihat Semua
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200/80">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">
                  No.Invoice
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Nama Client
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Tanggal Jatuh Tempo
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Total Nominal
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Status Badge
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item, index) => (
                <tr key={index} className="bg-white hover:bg-slate-50">
                  <td className="px-6 py-4">{item.invoiceNumber}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {item.clientName}
                  </td>
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4">{item.amount}</td>
                  <td className="px-6 py-4">{renderBadge(item.status)}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-slate-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
