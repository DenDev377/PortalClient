"use client";

import dynamic from "next/dynamic";

const Charts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function FinancialOverview() {
  const dataChart = {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    paid: [
      12000000, 15000000, 18000000, 20000000, 22000000, 25000000, 27000000,
      30000000, 32000000, 35000000, 37000000, 40000000,
    ],
    unpaid: [
      2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000,
      10000000, 11000000, 12000000, 13000000,
    ],
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
      name: "Paid",
      data: dataChart.paid,
    },
    {
      name: "Unpaid",
      data: dataChart.unpaid,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">
          Financial Overview
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Paid revenue vs pending invoices
        </p>
      </div>
      <Charts options={options} series={series} type="area" height={300} />
    </div>
  );
}
