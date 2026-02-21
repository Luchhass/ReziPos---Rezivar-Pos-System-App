"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/menu", label: "Menu" },
    { href: "/orders", label: "Orders" },
    { href: "/reservation", label: "Reservation" },
  ];

  return (
    <>
      {/* Mobile Header Section */}
      <header className="sticky top-0 w-full bg-[#f3f3f3] dark:bg-[#111315] text-[#121212] dark:text-[#ffffff] py-6 px-8 md:py-8 lg:py-10 flex items-center md:hidden z-60">
        <span className={`text-xl font-semibold tracking-wide transition-all duration-300 ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"}`}>
          ReziPOS
        </span>

        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="ml-auto group relative flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none"
        >
          <div className="flex flex-col justify-center items-center w-6 h-6 relative">
            <span className={`absolute block h-0.5 bg-[#121212] dark:bg-[#ffffff] rounded-2xl transition-all duration-500 ease-out ${isOpen ? "w-5 rotate-45 top-1/2 -translate-y-1/2" : "w-6 top-1 group-hover:w-5"}`} />
            
            <span className={`absolute block h-0.5 bg-[#121212] dark:bg-[#ffffff] rounded-2xl transition-all duration-500 ease-out top-1/2 -translate-y-1/2 ${isOpen ? "w-0 opacity-0" : "w-5 group-hover:w-6"}`} />
            
            <span className={`absolute block h-0.5 bg-[#121212] dark:bg-[#ffffff] rounded-2xl transition-all duration-500 ease-out ${isOpen ? "w-5 -rotate-45 bottom-1/2 translate-y-1/2" : "w-4 bottom-1 group-hover:w-6"}`} />
          </div>
        </button>
      </header>

      {/* Mobile Menu Section */}
      <div className={`fixed top-19 py-6 px-8 md:py-8 lg:py-10 left-0 h-[calc(100vh-76px)] w-full bg-[#f3f3f3] dark:bg-[#111315] text-[#121212] dark:text-[#ffffff] z-50 md:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}`}>
        <div className="py-8 flex flex-col h-full">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} active={pathname === link.href} onClick={() => setIsOpen(false)} />
            ))}
          </nav>
          
          <div className="mt-auto pt-6 text-xs text-[#686868] dark:text-[#c6c6c6]">© {new Date().getFullYear()} ReziPOS App</div>
        </div>
      </div>

      {/* Desktop Sidebar Section */}
      <aside className="hidden md:flex flex-col gap-8 fixed top-0 left-0 h-screen w-64 bg-[#f3f3f3] dark:bg-[#111315] border-r border-[#dddddd] dark:border-[#2d2d2d] py-6 px-8 md:py-8 lg:py-10">
        <span className="text-[25px] md:text-[28px] lg:text-[31px] font-semibold tracking-wide">ReziPOS</span>
        
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} active={pathname === link.href} />
          ))}
        </nav>

        <div className="mt-auto text-xs text-neutral-500">© {new Date().getFullYear()} ReziPOS App</div>
      </aside>

      {/* Background Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}

// Navigation Link Component
function NavLink({ href, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`p-4 text-base font-medium transition-all max-w-xs rounded-2xl ${
        active 
          ? "bg-[#dddddd] dark:bg-[#2d2d2d] text-[#98A2F3]" 
          : "opacity-70 hover:opacity-100 hover:bg-[#dddddd]/50 dark:hover:bg-[#2d2d2d]/50"
      }`}
    >
      {label}
    </Link>
  );
}