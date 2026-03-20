import React, { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import logo from "@/assets/logo/touticket-logo.svg";
import { useNavigate, useParams } from "react-router-dom";
import { getOrganizationById } from "@/services/organizationService";

export default function Header() {
  const navigate = useNavigate();
  const { organizationId } = useParams();
  const [orgName, setOrgName] = useState("");

  useEffect(() => {
    if (organizationId) {
      getOrganizationById(organizationId)
        .then((res) => { if (res.success) setOrgName(res.data.name); })
        .catch(() => {});
    } else {
      setOrgName(""); // ✅ reset si pas d'organizationId
    }
  }, [organizationId]);

  return (
    <header className="w-full bg-black">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">

        {/* Logo + Titre */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="Logo TOUTICKET"
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
          />
          <h1 className="font-display text-white font-medium text-lg sm:text-xl md:text-2xl tracking-wider uppercase">
            Touticket
            {/* ✅ Le tiret et le nom n'apparaissent que si orgName existe */}
            {orgName && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/entity/${organizationId}`);
                }}
                className="cursor-pointer hover:text-orange-400 transition-colors"
              >
                -{orgName}
              </span>
            )}
          </h1>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/tickets")}
          className="flex items-center gap-2 text-sm bg-[#E95503] hover:bg-[#D44A00] text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg shadow-orange-900/30"
        >
          <Ticket size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden xs:inline sm:inline">Mes Tickets</span>
          <span className="inline xs:hidden sm:hidden">Tickets</span>
        </button>
      </div>
    </header>
  );
}