import React, { useState, useRef, useEffect } from "react";
import { User, Building2, Menu, X, Info, Phone, HelpCircle, ChevronRight } from "lucide-react";
import logo from "@/assets/logo/touticket-logo.svg";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { label: "À propos", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Phone },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
];

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Ferme le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-black border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">

        {/* Logo + Titre */}
         <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={() => navigate("/touticket")}
        >
          <img
            src={logo}
            alt="Logo TOUTICKET"
            className="h-8 w-8 sm:h-12 sm:w-12 object-contain"
          />
          <h1 className="font-display text-white font-medium text-lg sm:text-xl md:text-2xl tracking-wider uppercase">
            TOUTICKET
          </h1>
        </div>

        {/* CTA + Burger */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Boutons desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-[#E95503] hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 font-medium"
            >
              <User className="w-4 h-4" />
              Se connecter
            </button>
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 text-sm bg-[#E95503] hover:bg-[#D44A00] text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg shadow-orange-900/30"
            >
              <Building2 className="w-4 h-4" />
              Créer mon entité
            </button>
          </div>

          {/* Burger menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Menu"
              className="flex items-center justify-center w-9 h-9 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Popup menu */}
            {menuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-[#111] border border-white/10 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50 animate-fade-in">

                {/* Menu items */}
                <nav className="p-2 flex flex-col gap-1">
                  {menuItems.map(({ label, href, icon: Icon }) => (
                    <button
                      key={href}
                      onClick={() => { navigate(href); setMenuOpen(false); }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-150 text-sm font-medium group w-full text-left"
                    >
                      <Icon className="w-4 h-4 text-[#E95503]" />
                      <span className="flex-1">{label}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150" />
                    </button>
                  ))}
                </nav>

                {/* Boutons mobile (visibles uniquement sur mobile) */}
                <div className="md:hidden border-t border-white/10 p-2 flex flex-col gap-1">
                  <button
                    onClick={() => { navigate("/login"); setMenuOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-150 text-sm font-medium w-full text-left"
                  >
                    <User className="w-4 h-4 text-[#E95503]" />
                    Se connecter
                  </button>
                  <button
                    onClick={() => { navigate("/register"); setMenuOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#E95503] hover:bg-[#D44A00] text-white transition-all duration-150 text-sm font-medium w-full text-left"
                  >
                    <Building2 className="w-4 h-4" />
                    Créer mon entité
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}