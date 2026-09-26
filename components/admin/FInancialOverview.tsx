"use client";

import dynamic from "next/dynamic";

const Charts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function FinancialOverview({ chartData }: { chartData?: { paid: number[], unpaid: number[] } }) {
  const dataChart = {
    categories: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    paid: chartData?.paid || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    unpaid: chartData?.unpaid || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: dataChart.categories,
    },
    yaxis: {
      labels: {
        formatter: (value) => `Rp ${(value / 1000000).toFixed(1)}jt`,
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `Rp ${value.toLocaleString("id-ID")}`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  };
  const series = [
    {
      name: "Dibayar",
      data: dataChart.paid,
    },
    {
      name: "Belum Dibayar",
      data: dataChart.unpaid,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">
          Ringkasan Keuangan
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Pendapatan yang sudah dibayar vs tagihan menunggu
        </p>
      </div>
      <Charts options={options} series={series} type="area" height={300} />
    </div>
  );
}
