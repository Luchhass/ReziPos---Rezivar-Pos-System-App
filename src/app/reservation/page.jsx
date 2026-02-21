"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Users, ChevronDown, Calendar } from "lucide-react";
import data from "@/data/reservations.json";

export default function ReservationPage() {
  const { restaurantConfig, reservations } = data;
  const { layout, operatingHours } = restaurantConfig;
  const { tables, floors } = layout;
  const { open: startHour, close: endHour } = operatingHours;

  const HOUR_COLUMN_WIDTH = 120;
  const totalHours = endHour < startHour ? endHour + 24 - startHour : endHour - startHour;

  const availableDates = useMemo(() => 
    Array.from(new Set(reservations.map((res) => res.assignment.date))).sort(), 
  [reservations]);

  const [selectedDate, setSelectedDate] = useState(availableDates[0] || "2026-02-21");
  const [activeFloor, setActiveFloor] = useState(floors[0]);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [dragged, setDragged] = useState(false);

  const sliderRef = useRef(null);
  const dateMenuRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  const groupedReservations = useMemo(() => {
    return reservations.reduce((acc, res) => {
      const key = `${res.assignment.date}-${res.assignment.floor}-${res.assignment.tableId}`;

      if (!acc[key]) acc[key] = [];

      acc[key].push(res);

      return acc;
    }, {});
  }, [reservations]);

  const formatDateDisplay = (dateStr) => {
    const [year, month, day] = dateStr.split("-");

    return `${day} / ${month} / ${year}`;
  };

  useEffect(() => {
    const handleClickOutside = (e) => { if (dateMenuRef.current && !dateMenuRef.current.contains(e.target)) setIsDateMenuOpen(false); };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseDown = (e) => {
    isDown.current = true; setDragged(false);

    startX.current = e.pageX - sliderRef.current.offsetLeft;

    startY.current = e.pageY - sliderRef.current.offsetTop;

    scrollLeft.current = sliderRef.current.scrollLeft;

    scrollTop.current = sliderRef.current.scrollTop;

    sliderRef.current.style.scrollBehavior = "auto";
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;

    e.preventDefault();

    const walkX = (e.pageX - sliderRef.current.offsetLeft) - startX.current;

    const walkY = (e.pageY - sliderRef.current.offsetTop) - startY.current;

    if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) setDragged(true);

    sliderRef.current.scrollLeft = scrollLeft.current - walkX;

    sliderRef.current.scrollTop = scrollTop.current - walkY;
  };

  const stopDragging = () => { isDown.current = false; if (sliderRef.current) sliderRef.current.style.scrollBehavior = "smooth"; };

  const getPositionStyles = (start, end) => {
    const parseTime = (t) => {
      const [h, m] = t.split(":").map(Number);

      return (h < startHour ? h + 24 : h) + m / 60;
    };

    const s = parseTime(start), e = parseTime(end);

    return { left: `${(s - startHour) * HOUR_COLUMN_WIDTH}px`, width: `${(e - s) * HOUR_COLUMN_WIDTH}px` };
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "ARRIVED": return "bg-[#f3e5ab] text-[#1a1c1e] shadow-md";

      case "COMPLETED": return "bg-[#c7e8e1] text-[#1a1c1e] shadow-md";

      default: return "bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-[#ffffff] shadow-md";
    }
  };

  const currentFloorTables = useMemo(() => tables.filter((t) => t.floor === activeFloor), [tables, activeFloor]);

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden py-6 px-8 md:py-8 lg:py-10 select-none bg-[#f3f3f3] dark:bg-[#111315]">  
      {/* Reservations Header Section */}
      <header className="flex flex-col gap-8 justify-between shrink-0 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-[25px] font-bold md:text-[28px] lg:text-[31px] text-[#121212] dark:text-[#ffffff] tracking-tight">{restaurantConfig.brandName} Reservations</h1>
          
          <button className="bg-white text-black p-4 rounded-2xl hover:bg-[#cccccc] transition-all font-bold">New reservation</button>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {floors.map((floor) => (
              <button key={floor} onClick={() => setActiveFloor(floor)} className={`text-[#121212] dark:text-[#ffffff] px-6 py-2.5 text-sm font-medium transition-all rounded-xl border-2 ${activeFloor === floor ? "border-[#dddddd] dark:border-[#2d2d2d]" : "border-transparent hover:text-zinc-300"}`}>
                {floor.toLowerCase()}
              </button>
            ))}
          </div>

          <div className="relative" ref={dateMenuRef}>
            <button onClick={() => setIsDateMenuOpen(!isDateMenuOpen)} className="flex items-center gap-3 bg-[#dddddd] dark:bg-[#2d2d2d] px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/5 text-[#121212] dark:text-[#ffffff] hover:bg-[#d0cfcf] dark:hover:bg-[#242424] min-w-45 justify-between transition-colors">
              <div className="flex items-center gap-2 opacity-70"><Calendar size={16} /><span>{formatDateDisplay(selectedDate)}</span></div>
              
              <ChevronDown size={16} className={`transition-transform duration-200 ${isDateMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {isDateMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-[#ffffff] rounded-xl shadow-2xl z-100 overflow-hidden">
                <div className="max-h-64 overflow-y-auto scrollbar-hide">
                  {availableDates.map((date) => (
                    <button key={date} onClick={() => { setSelectedDate(date); setIsDateMenuOpen(false); }} className={`w-full text-left px-5 py-3 text-sm transition-colors ${selectedDate === date ? "bg-[#d0cfcf] dark:bg-[#242424] text-[#98A2F3]" : "text-gray-400 hover:bg-[#98A2F3]"}`}>
                      {formatDateDisplay(date)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Timeline Planner Grid Section */}
      <div className="flex-1 border border-[#dddddd] dark:border-[#2d2d2d] rounded-2xl overflow-hidden flex flex-col">
        <div 
          ref={sliderRef} 
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={stopDragging} onMouseLeave={stopDragging} 
          className="flex-1 overflow-auto cursor-grab active:cursor-grabbing scrollbar-hide touch-none"
          style={{ willChange: "scroll-position" }}
        >
          <div className="inline-block min-w-full w-fit align-middle">
            <div className="flex sticky top-0 z-40">
              <div className="w-32 shrink-0 border-r border-b border-[#dddddd] dark:border-[#2d2d2d] h-14 sticky left-0 z-50 bg-[#f3f3f3] dark:bg-[#111315]" style={{ willChange: "transform" }} />
              {Array.from({ length: totalHours + 1 }).map((_, i) => (
                <div key={i} style={{ width: `${HOUR_COLUMN_WIDTH}px` }} className="shrink-0 flex justify-center items-center text-xs font-medium text-[#121212] dark:text-[#ffffff] border-r border-b border-[#dddddd] dark:border-[#2d2d2d] h-14 bg-[#f3f3f3] dark:bg-[#111315]">
                  {((startHour + i) % 24).toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              {currentFloorTables.map((tableObj) => {
                const tableRes = groupedReservations[`${selectedDate}-${activeFloor}-${tableObj.id}`] || [];
                
                return (
                  <div key={tableObj.id} className="group flex h-28 relative bg-[#f3f3f3] dark:bg-[#111315]">
                    <div 
                      className="w-32 shrink-0 flex items-center justify-center text-sm font-medium text-[#121212] dark:text-[#ffffff] border-r border-b border-[#dddddd] dark:border-[#2d2d2d] sticky left-0 z-30 bg-[#f3f3f3] dark:bg-[#111315] group-last:border-b-0"
                      style={{ willChange: "transform" }}
                    >
                      {tableObj.id}
                    </div>
                    
                    <div className="relative border-b border-[#dddddd]/30 dark:border-[#2d2d2d]/30" style={{ width: `${(totalHours + 1) * HOUR_COLUMN_WIDTH}px` }}>
                      <div className="absolute inset-0 flex pointer-events-none">
                        {Array.from({ length: totalHours + 1 }).map((_, i) => (
                          <div key={i} style={{ width: `${HOUR_COLUMN_WIDTH}px` }} className="relative shrink-0 border-r border-[#dddddd]/50 dark:border-[#2d2d2d]/50 h-full">
                            <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-[#dddddd]/40 dark:border-[#2d2d2d]/40" />
                          </div>
                        ))}
                      </div>

                      {tableRes.map((res) => (
                        <div key={res.uid} className={`absolute top-2 bottom-2 rounded-2xl flex flex-col justify-between transition-all px-4 py-2 z-10 ${getStatusClass(res.status)}`} style={getPositionStyles(res.assignment.startTime, res.assignment.endTime)}>
                          <span className="text-[14px] font-bold md:text-[17px] truncate">{res.customer.fullName}</span>
                          
                          <div className="flex items-center gap-1.5 opacity-60 text-[14px] font-bold md:text-[17px]"><Users size={20} /> {res.assignment.partySize}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};