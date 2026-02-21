"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import OrderSummary from "@/components/OrderSummary";
import data from "@/data/menu-data.json";
import * as Icons from "lucide-react";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState(data.categories[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderItems, setOrderItems] = useState({});
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [dragged, setDragged] = useState(false);

  const sliderRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const CategoryIcon = ({ name }) => {
    const IconComponent = Icons[name] || Icons.HelpCircle;

    return <IconComponent size={28} strokeWidth={2} />;
  };

  const categoryMap = useMemo(() => Object.fromEntries(data.categories.map((c) => [c.id, c])), []);

  const itemCountMap = useMemo(() => 
    data.menu_items.reduce((acc, item) => {
      acc[item.category_id] = (acc[item.category_id] || 0) + 1;

      return acc;
    }, {}), []
  );

  const preparedItems = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return data.menu_items
      .filter(item => item.category_id === selectedCategory && item.name.toLowerCase().includes(query))
      .map(item => ({ ...item, qty: orderItems[item.id] || 0, color: categoryMap[item.category_id]?.color }));
  }, [selectedCategory, searchQuery, orderItems, categoryMap]);

  const { selectedProducts, subtotal, tax, total } = useMemo(() => {
    const selected = data.menu_items.filter(item => orderItems[item.id] > 0).map(item => ({ ...item, quantity: orderItems[item.id] }));

    const sub = selected.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return { selectedProducts: selected, subtotal: sub, tax: sub * 0.1, total: sub * 1.1 };
  }, [orderItems]);

  const updateQuantity = useCallback((id, delta) => {
    setOrderItems(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  }, []);

  const handleMouseDown = (e) => {
    isDown.current = true; setDragged(false);

    startX.current = e.pageX - sliderRef.current.offsetLeft;

    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;

    e.preventDefault();

    const walk = e.pageX - sliderRef.current.offsetLeft - startX.current;

    if (Math.abs(walk) > 5) setDragged(true);

    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDragging = () => (isDown.current = false);

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="mb-26 md:mb-0 flex-1 flex flex-col gap-8 overflow-y-auto select-none py-6 px-8 md:py-8 lg:py-10 lg:mr-100">
        {/* Search Bar Section */}
        <div className="relative flex items-center w-full lg:max-w-[50%]">
          <div className="absolute left-5 opacity-50 text-[#121212] dark:text-[#ffffff] pointer-events-none">
            <Icons.Search size={20} />
          </div>

          <input
            type="text" placeholder="Search" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#dddddd] dark:bg-[#2d2d2d] rounded-2xl py-4 pl-14 pr-6 outline-none border border-transparent focus:border-white/20 transition-colors"
          />
        </div>

        {/* Categories Slider Section */}
        <div
          ref={sliderRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
          onMouseUp={stopDragging} onMouseLeave={stopDragging}
          className="flex flex-nowrap gap-3 md:gap-4 overflow-x-auto cursor-grab active:cursor-grabbing lg:grid lg:grid-rows-2 lg:grid-flow-col"
        >
          {data.categories.map((cat) => (
            <button
              key={cat.id} onClick={() => !dragged && setSelectedCategory(cat.id)}
              style={{ backgroundColor: cat.color }}
              className="min-w-35 h-32.5 lg:min-w-44 lg:h-38 rounded-2xl p-4 md:p-5 lg:p-6 flex flex-col justify-between text-black shrink-0 transition-all duration-300 outline-none"
            >
              <span className="text-black"><CategoryIcon name={cat.icon} /></span>

              <div className="text-left">
                <h3 className="font-bold text-[14px] leading-tight">{cat.name}</h3>
                <p className="text-[10px] font-bold opacity-40">{itemCountMap[cat.id] || 0} items</p>
              </div>
            </button>
          ))}
        </div>

        <div className="w-full h-px bg-[#dddddd] dark:bg-[#2d2d2d]" />

        {/* Menu Items Grid Section */}
        <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          {preparedItems.map((item) => (
            <div
              key={item.id} style={{ backgroundColor: item.qty > 0 ? item.color : undefined }}
              className={`relative overflow-hidden rounded-2xl p-4 md:p-5 lg:p-6 pl-7 md:pl-8 lg:pl-9 flex flex-col justify-between min-h-38 transition-all duration-300 ${item.qty > 0 ? "text-[#121212] shadow-lg" : "text-[#121212] dark:text-[#ffffff] bg-[#dddddd] dark:bg-[#2d2d2d]"}`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: item.color }} />

              <div className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Orders → {item.orders_to}</div>

              <div className="mt-2">
                <h4 className="text-[15px] font-bold leading-tight">{item.name}</h4>
                <p className="text-xs font-bold mt-1 opacity-50">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex justify-end">
                <div className={`flex items-center gap-2 ${item.qty > 0 ? "text-black" : "text-[#121212] dark:text-[#ffffff]"}`}>
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-[10px] border-2 border-black/40 dark:border-white/10 font-medium transition-all active:scale-90">−</button>
                  <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-[10px] border-2 border-black/40 dark:border-white/10 font-medium transition-all active:scale-90">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Footer Section */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#f3f3f3] dark:bg-[#111315] pointer-events-none lg:hidden">
          <button
            disabled={selectedProducts.length === 0} onClick={() => setShowOrderSummary(true)}
            className={`pointer-events-auto w-full py-4 rounded-xl font-bold transition-all shadow-2xl active:scale-[0.98] ${selectedProducts.length > 0 ? "bg-white text-black" : "bg-[#1c1c1e] text-[#5e5e5e] opacity-50"}`}
          >
            Add to Order ({selectedProducts.length})
          </button>
        </div>
      </div>

      {/* Order Summary Sidebars & Overlays Section */}
      {showOrderSummary && (
        <div className="fixed inset-0 bg-[#0a0a0a] z-80 lg:hidden overflow-hidden">
          <OrderSummary products={selectedProducts} setProducts={updateQuantity} subtotal={subtotal} tax={tax} total={total} onClose={() => setShowOrderSummary(false)} isSidebar={false} />
        </div>
      )}

      <aside className="hidden lg:flex w-100 bg-[#0f0f0f] border-l border-[#dddddd] dark:border-[#2d2d2d] h-screen fixed top-0 right-0">
        <OrderSummary products={selectedProducts} setProducts={updateQuantity} subtotal={subtotal} tax={tax} total={total} isSidebar={true} />
      </aside>
    </div>
  );
}