"use client";

import React, { useState, useMemo } from "react";
import { DollarSign, Receipt, Wallet, ShoppingBag, ChevronDown, MoreVertical, Utensils, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import salesHistory from "@/data/sales-history.json";

export default function DashboardPage() {
  const years = useMemo(() => {
    const set = new Set(salesHistory.map(o => new Date(o.timestamp).getFullYear()));

    return Array.from(set).sort((a, b) => a - b);
  }, []);

  const [selectedYear, setSelectedYear] = useState(years[years.length - 1] || 2024);
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("Weekly");

  const { filteredOrders, stats, topProducts } = useMemo(() => {
    let rev = 0, tip = 0, dish = 0, counts = {}, filtered = [];

    salesHistory.forEach(o => {
      if (new Date(o.timestamp).getFullYear() === selectedYear) {
        filtered.push(o);
        tip += (o.payment.tip_amount || 0);

        o.items.forEach(i => {
          rev += i.price * i.qt; dish += i.qt;
          counts[i.name] = (counts[i.name] || 0) + i.qt;
        });
      }
    });

    const fmt = (v) => v.toLocaleString("en-US", { style: "currency", currency: "USD" });

    return {
      filteredOrders: filtered,
      stats: { revenue: fmt(rev), orders: filtered.length, tips: fmt(tip), dishes: dish },
      topProducts: Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4)
    };
  }, [selectedYear]);

  const chartData = useMemo(() => {
    const isWk = viewMode === "Weekly";
    const labels = isWk ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = new Array(labels.length).fill(0);
    filteredOrders.forEach(o => data[isWk ? new Date(o.timestamp).getDay() : new Date(o.timestamp).getMonth()]++);
    return labels.map((name, i) => ({ name, value: data[i] }));
  }, [filteredOrders, viewMode]);

  return (
    <div className="flex flex-col gap-4 md:gap-5 lg:h-screen lg:overflow-hidden py-6 px-8 md:py-8 lg:py-10 font-sans tracking-tight">
      {/* Header Section */}
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-[#121212] dark:text-[#ffffff] text-[25px] md:text-[28px] lg:text-[31px] tracking-tight">Dashboard</h1>
        
        <div className="relative">
          <div onClick={() => setIsYearPickerOpen(!isYearPickerOpen)} className="flex items-center gap-2 bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-[#ffffff] px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer hover:opacity-80">
            <Calendar size={16} className="opacity-70" /> 

            <span className="opacity-70">Year: {selectedYear}</span>

            <ChevronDown size={16} className={`transition-transform ${isYearPickerOpen ? "rotate-180" : ""} opacity-50`} />
          </div>

          {isYearPickerOpen && (
            <div className="absolute right-0 mt-2 z-50 bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-[#ffffff] border-[#262626] rounded-xl overflow-hidden shadow-2xl w-32">
              {years.map(y => (
                <div key={y} onClick={() => { setSelectedYear(y); setIsYearPickerOpen(false); }} className={`px-4 py-3 text-sm cursor-pointer hover:bg-[#98A2F3] hover:text-black ${selectedYear === y ? "bg-[#d0cfcf] dark:bg-[#242424] text-[#98A2F3]" : "text-gray-400"}`}>{y}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid Section */}
      <div className="grid h-[30%] grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 shrink-0">
        <StatCard label="Revenue" value={stats.revenue} icon={<DollarSign size={22} />} primary />

        <StatCard label="Total Orders" value={stats.orders} icon={<Receipt size={22} />} />

        <StatCard label="Tip Amount" value={stats.tips} icon={<Wallet size={22} />} />

        <StatCard label="Dishes Sold" value={stats.dishes} icon={<ShoppingBag size={22} />} />
      </div>

      <div className="lg:flex-1 grid gap-4 md:gap-5 grid-cols-1 lg:grid-cols-2 items-stretch lg:min-h-0 mb-2">
        {/* Top Products Section */}
        <div className="flex flex-col gap-4 text-[#121212] dark:text-[#ffffff] border border-[#dddddd] dark:border-[#2d2d2d] rounded-2xl p-4 md:p-5 lg:p-6 lg:min-h-0">
          <h2 className="text-[25px] md:text-[28px] lg:text-[31px] shrink-0">Top products</h2>
          
          <div className="flex flex-col gap-3 lg:overflow-y-auto pr-2 custom-scrollbar">
            {topProducts.map(([name, count], i) => (
              <div key={i} className="flex items-center gap-5 group cursor-pointer px-4 py-1.5 hover:bg-[#dddddd] dark:hover:bg-[#2d2d2d] rounded-[10px] transition-all"> 
                <div className="w-11 h-11 bg-[#dddddd] dark:bg-[#2d2d2d] rounded-[10px] flex items-center justify-center shrink-0"><Utensils size={20} className="group-hover:text-[#98A2F3]" /></div>
                
                <div className="flex-1 min-w-0"><h4 className="text-[14px] md:text-[17px] lg:text-[20px] truncate">{name}</h4><p className="opacity-50 text-[11px] md:text-[14px] lg:text-[16px]">Order: {count}</p></div>
                
                <MoreVertical size={16} className="text-gray-700 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex flex-col rounded-2xl p-4 md:p-5 lg:p-6 border border-[#dddddd] dark:border-[#2d2d2d] lg:min-h-0">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h2 className="text-[#121212] dark:text-[#ffffff] text-[25px] md:text-[28px] lg:text-[31px] tracking-tight">Accepted orders</h2>
            
            <div className="flex bg-[#dddddd] dark:bg-[#2d2d2d] p-1 rounded-xl">
              {["Weekly", "Monthly"].map(m => (
                <button key={m} onClick={() => setViewMode(m)} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === m ? "bg-[#98A2F3] text-white shadow-lg" : "text-[#121212] dark:text-[#ffffff] opacity-50 hover:opacity-100"}`}>{m}</button>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full min-h-86.75 lg:min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-[#121212] dark:stroke-[#ffffff] opacity-20" />
                
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ className: "text-[#121212] dark:text-[#ffffff] opacity-80 text-[11px] md:text-[14px] lg:text-[16px]" }} dy={10} />
                
                <YAxis axisLine={false} tickLine={false} tick={{ className: "text-[#121212] dark:text-[#ffffff] opacity-80 text-[11px] md:text-[14px] lg:text-[16px]" }} />
                
                <Tooltip cursor={{ className: "fill-[#dddddd] dark:fill-[#2d2d2d] opacity-50", radius: 8 }} content={({ active, payload, label }) => active && payload && (
                  <div className="bg-[#dddddd] dark:bg-[#2d2d2d] p-3 rounded-2xl shadow-xl border-none">
                    <p className="text-[12px] font-bold dark:text-white text-black mb-1">{label}</p>
                    {payload.map((it, i) => <p key={i} style={{ color: "#98A2F3", fontWeight: "600" }}>{it.name}: {it.value}</p>)}
                  </div>
                )} />
                
                <Bar dataKey="value" fill="#bbf7d0" radius={[6, 6, 0, 0]} barSize={viewMode === "Weekly" ? 45 : 25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Stat Card Component
function StatCard({ label, value, icon, primary = false }) {
  return (
    <div className={`flex flex-col justify-between p-4 md:p-5 lg:p-6 rounded-2xl transition-all ${primary ? 'bg-[#98A2F3] text-white' : 'bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-[#ffffff]'}`}>
      <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-6 ${primary ? 'bg-white/30' : 'bg-[#c5c5c5] dark:bg-[#ffffff] text-[#121212] dark:text-[#121212]/70'}`}>{icon}</div>
      
      <div>
        <p className={`text-[12px] font-medium mb-1 ${primary ? 'opacity-70' : 'opacity-50'}`}>{label}</p>

        <h3 className="text-[25px] md:text-[28px] lg:text-[31px] tracking-tighter tabular-nums leading-none">{value}</h3>
      </div>
    </div>
  );
}