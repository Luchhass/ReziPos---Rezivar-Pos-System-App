"use client";

import { Trash2, Pencil, ChevronDown, LayoutGrid } from "lucide-react";
import salesHistory from "@/data/sales-history.json";

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-8 min-h-screen bg-[#f3f3f3] dark:bg-[#111315] py-6 px-8 md:py-8 lg:py-10 font-sans tracking-tight">
      {/* Orders Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-[#121212] dark:text-[#ffffff] text-[25px] md:text-[28px] lg:text-[31px] tracking-tight">Orders</h1>

        <div className="flex gap-3">
          <div className="bg-[#dddddd] dark:bg-[#2d2d2d] rounded-xl text-[#121212] dark:text-[#ffffff] px-4 py-2.5 cursor-pointer hover:opacity-80 transition-all">
            <span className="flex items-center justify-center opacity-70">Current <ChevronDown size={16} className="ml-2" /></span>
          </div>

          <button className="bg-[#dddddd] dark:bg-[#2d2d2d] rounded-xl text-sm font-medium text-[#121212] dark:text-[#ffffff] px-4 py-2.5 hover:opacity-80 transition-all">
            <span className="flex items-center justify-center gap-2 opacity-70"><LayoutGrid size={16} /> Layout of halls</span>
          </button>
        </div>
      </div>

      {/* Orders List Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {salesHistory.map((o) => (
          <div key={o.order_id} className="flex flex-col gap-4 bg-[#dddddd] dark:bg-[#2d2d2d] rounded-2xl p-4 md:p-5 lg:p-6 transition-all">
            
            <div className="flex justify-between items-baseline">
              <h2 className="text-[25px] md:text-[28px] lg:text-[31px] text-[#121212] dark:text-[#ffffff]">Table <span className="text-[#86EFAC]">{o.table}</span></h2>
              
              <div className="text-[14px] md:text-[17px] lg:text-[20px] text-[#121212] dark:text-[#ffffff]">
                <span className="opacity-50 mr-2">Order</span><span className="font-bold">#{o.order_id.split("-")[1]}</span>
              </div>
            </div>

            <div className="h-px bg-[#cecece] dark:bg-[#484848]" />

            <div className="grid grid-cols-12 text-[10px] font-bold text-[#121212] dark:text-[#ffffff] opacity-50 uppercase tracking-widest">
              <div className="col-span-2">QT</div>
              <div className="col-span-7 pl-1">Items</div>
              <div className="col-span-3 text-right">Price</div>
            </div>

            <div className="flex flex-col gap-1">
              {o.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 text-[15px] px-1 tracking-tight text-[#121212] dark:text-[#ffffff]">
                  <div className="col-span-2">{item.qt}</div>
                  <div className="col-span-7 pr-2 leading-tight">{item.name}</div>
                  <div className="col-span-3 text-right font-semibold tabular-nums">${(item.price * item.qt).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="h-px bg-[#cecece] dark:bg-[#484848] mt-auto" />

            <div className="flex justify-between items-center text-[#121212] dark:text-[#ffffff]">
              <span className="opacity-50 text-[14px] md:text-[17px] lg:text-[20px]">Subtotal</span>
              <span className="text-[25px] md:text-[28px] lg:text-[31px] tracking-tighter">${o.items.reduce((a, b) => a + b.price * b.qt, 0).toFixed(2)}</span>
            </div>

            {/* Action Buttons Section */}
            <div className="flex gap-2.5">
              <button className="flex-1 flex items-center justify-center h-12 bg-[#cdcdcd] dark:bg-[#272727] border border-[#c4c4c4] dark:border-[#212121] rounded-[14px] text-[#121212] dark:text-[#ffffff] hover:text-red-400 hover:border-red-900/30 transition-all active:scale-90">
                <Trash2 size={20} />
              </button>

              <button className="flex-1 flex items-center justify-center h-12 bg-[#cdcdcd] dark:bg-[#272727] border border-[#c4c4c4] dark:border-[#212121] rounded-[14px] text-[#121212] dark:text-[#ffffff] hover:text-white hover:border-gray-500 transition-all active:scale-90">
                <Pencil size={20} />
              </button>

              <button className="w-[50%] h-12 bg-[#ffffff] hover:bg-[#c5c5c5] text-[#121212] rounded-[14px] text-[15px] font-bold shadow-sm transition-all active:scale-95">
                Payment
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}