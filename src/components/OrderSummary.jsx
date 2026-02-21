"use client";

import React, { useState } from "react";
import { Banknote, CreditCard, QrCode, Pencil, ArrowLeft, Utensils, X } from "lucide-react";

// Order Summary Header Component
const Header = ({ isSidebar, onClose, isEditing, setIsEditing }) => (
  <header className="flex items-center justify-between">
    <div className="flex items-center gap-5">
      {!isSidebar && (
        <button onClick={onClose} className="p-3 bg-[#dddddd] dark:bg-[#2d2d2d] rounded-full hover:bg-[#cccccc] dark:hover:bg-[#252527] transition-all">
          <ArrowLeft size={20} className="text-[#121212] dark:text-[#ffffff] opacity-60" />
        </button>
      )}

      <div className="flex flex-col">
        <h2 className="text-[25px] md:text-[28px] lg:text-[31px] tracking-tight text-[#121212] dark:text-[#ffffff]">Table 5</h2>
        
        <span className="text-[#121212] dark:text-[#ffffff] opacity-50 text-[11px] md:text-[14px] lg:text-[16px]">Leslie K.</span>
      </div>
    </div>

    <button onClick={() => setIsEditing(!isEditing)} className={`p-3.5 rounded-full transition-all duration-300 ${isEditing ? "bg-red-500 text-white" : "bg-[#dddddd] dark:bg-[#2d2d2d] hover:bg-[#cccccc] dark:hover:bg-[#252527]"}`}>
      {isEditing ? <X size={16} /> : <Pencil size={16} className="text-[#121212] dark:text-[#ffffff] opacity-60" />}
    </button>
  </header>
);

// Order Summary Empty State Component
const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center space-y-4">
    <div className="w-20 h-20 bg-[#1c1c1e] rounded-full flex items-center justify-center border border-white/5 opacity-40">
      <Utensils size={32} strokeWidth={1.5} className="text-gray-400" />
    </div>

    <p className="text-gray-500 font-medium text-[15px]">No items added</p>
  </div>
);

// Order Summary List Component
const OrderList = ({ products, isEditing, onRemove }) => (
  <div className="flex flex-col gap-2 overflow-y-auto pr-1">
    {products.map((item, idx) => (
      <div key={item.id} className="bg-[#dddddd] dark:bg-[#2d2d2d] p-4 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 flex items-center justify-center">
            {isEditing ? (
              <button onClick={() => onRemove(item.id)} className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors active:scale-90">
                <X size={12} strokeWidth={3} />
              </button>
            ) : (
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold">{idx + 1}</div>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <p className="text-[14px] font-bold md:text-[17px] text-[#121212] dark:text-[#ffffff]">{item.name}</p>
            
            <span className="text-[#121212] dark:text-[#ffffff] opacity-50 text-xs font-medium">x{item.quantity}</span>
          </div>
        </div>

        <span className="text-sm text-[#121212] dark:text-[#ffffff]">${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    ))}
  </div>
);

// Order Summary Payment Method Component
const PaymentMethod = ({ activeMethod, setMethod }) => {
  const methods = [
    { id: "cash", label: "Cash", icon: <Banknote size={20} /> },
    { id: "card", label: "Debit Card", icon: <CreditCard size={20} /> },
    { id: "e-wallet", label: "E-Wallet", icon: <QrCode size={20} /> },
  ];

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Payment Method</p>
      
      <div className="grid grid-cols-3 gap-2">
        {methods.map((m) => (
          <button key={m.id} onClick={() => setMethod(m.id)} className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all ${activeMethod === m.id ? "bg-white text-black border-white" : "bg-transparent text-gray-400 border-white/10"}`}>
            {m.icon}<span className="text-[9px] font-bold">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default function OrderSummary({ products = [], setProducts, subtotal = 0, tax = 0, total = 0, onClose, isSidebar = false }) {
  const [paymentMethod, setPaymentMethod] = useState("e-wallet");
  const [isEditing, setIsEditing] = useState(false);
  const isEmpty = products.length === 0;

  return (
    <div className="flex flex-col gap-8 md:gap-10 lg:gap-12 w-full h-full bg-[#f3f3f3] dark:bg-[#111315] text-white py-6 px-8 md:py-8 lg:py-10">
      <Header isSidebar={isSidebar} onClose={onClose} isEditing={isEditing} setIsEditing={setIsEditing} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {isEmpty ? <EmptyState /> : <OrderList products={products} isEditing={isEditing} onRemove={(id) => setProducts?.(id, -999)} />}
      </main>

      <footer className={`bg-[#dddddd] dark:bg-[#2d2d2d] p-4 md:p-5 lg:p-6 rounded-2xl ${!isEmpty && "shrink-0"}`}>
        {!isEmpty ? (
          <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-3">
              <SummaryLine label="Subtotal" value={subtotal} />
              
              <SummaryLine label="Tax 10%" value={tax} />
              
              <div className="border-t border-dashed border-[#b3b3b3] dark:border-[#595959] pt-4 flex justify-between items-center text-black dark:text-white">
                <span className="text-xl">Total</span>
                
                <span className="text-2xl font-semibold tracking-tight">${total.toFixed(2)}</span>
              </div>
            </div>

            {isSidebar && <PaymentMethod activeMethod={paymentMethod} setMethod={setPaymentMethod} />}

            <button className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-[#cccccc] transition-all">
              Place Order
            </button>
          </div>
        ) : (
          <button disabled className="w-full bg-[#c8c8c8] dark:bg-[#222222] text-gray-700 py-4 rounded-xl font-bold text-lg border border-white/5 cursor-not-allowed">
            Place Order
          </button>
        )}
      </footer>
    </div>
  );
}

// Helper component for summary lines
const SummaryLine = ({ label, value }) => (
  <div className="flex justify-between text-sm text-black dark:text-white">
    <span className="opacity-50">{label}</span>
    
    <span>${value.toFixed(2)}</span>
  </div>
);