import { Shield, Ticket, User, UserCircle, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "@/services/userService";
import logo from "@/assets/logo/touticket-logo.svg";

export default function Header() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const menuRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await getUserProfile();
      setProfile(res.data || res);
    } catch (error) {
      // Silencieux — CORS en dev, on ignore
      console.warn("Profil non chargé:", error.message);
    } finally {
      setProfileLoading(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const avatarClass = profile?.is_superuser
    ? "bg-gradient-to-br from-purple-500 to-pink-600"
    : profile?.is_admin
      ? "bg-gradient-to-br from-orange-500 to-red-600"
      : "bg-gradient-to-br from-blue-500 to-cyan-600";

  return (
    <header className="w-full bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">

        {/* Logo */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
          onClick={() => navigate("/touticket/dashboard")}
        >
          <img src={logo} alt="Logo TOUTICKET"
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain transition-transform group-hover:scale-110" />
          <h1 className="font-display text-white font-medium text-lg sm:text-xl md:text-2xl tracking-wider uppercase group-hover:text-[#E95503] transition-colors">
            TOUTICKET
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">

          {/* Scanner */}
          <button
            onClick={() => navigate("/qr-scanner")}
           className="flex items-center gap-2 text-sm bg-[#E95503] hover:bg-[#D44A00] text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg shadow-orange-900/30"
            >
            <Ticket size={18} />
            <span className="hidden sm:inline text-sm font-semibold">Eliminer un ticket</span>
            <span className="sm:hidden text-xs font-semibold">Scanner</span>
          </button>

          {/* Avatar + menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer ${avatarClass} shadow-lg hover:scale-105 transition-transform`}
            >
              {profileLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : profile?.is_superuser ? (
                <Shield className="w-5 h-5 text-white" />
              ) : profile?.is_admin ? (
                <UserCircle className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Dropdown */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">

                {/* Infos utilisateur */}
                {profile ? (
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {profile.firstname} {profile.lastname}
                    </p>
                    <p className="text-xs text-gray-400 truncate">@{profile.username}</p>
                    {profile.is_superuser && (
                      <span className="inline-block mt-1 text-[10px] font-bold bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                        Super Admin
                      </span>
                    )}
                    {profile.is_admin && !profile.is_superuser && (
                      <span className="inline-block mt-1 text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-400">Chargement du profil...</p>
                  </div>
                )}

                <div className="py-1">
                  <button
                    onClick={() => { navigate("/admin/account"); setShowMenu(false); }}
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Mon compte
                  </button>

                  {profile?.is_superuser && (
                    <button
                      onClick={() => { navigate("/admin/users"); setShowMenu(false); }}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Utilisateurs
                    </button>
                  )}
                </div>

                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                  >
                    Déconnexion
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