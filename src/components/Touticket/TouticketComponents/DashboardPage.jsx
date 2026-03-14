// components/dashboard/DashboardPage.jsx
import { useState, useRef, useEffect } from "react";
import { Plus, Ticket, Vote, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "./StatsCard";
import EventRow from "./EventRow";

const TABS = [
  { id: "concert", label: "Billetterie" },
  { id: "vote",    label: "Votes & Élections" },
];

export default function DashboardPage({
  concertStats  = [],
  voteStats     = [],
  concertEvents = [],
  voteEvents    = [],
  eventLoading  = false,
  eventPrices   = {},
  title         = "Tableau de bord",
  subtitle      = "Gérez vos événements et suivez vos ventes",
  listTitle     = "Tous les événements",
  listSubtitle  = "Gérez et modifiez vos événements",
  onEventClick,
  onEventEdit,
  onEventDelete,
  formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—",
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("concert");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Ferme le dropdown si clic en dehors
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeStats  = activeTab === "concert" ? concertStats  : voteStats;
  const activeEvents = activeTab === "concert" ? concertEvents : voteEvents;

  return (
    <div className="min-h-screen">
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-16 mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-black">{title}</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-500">{subtitle}</p>
          </div>

          {/* Bouton avec dropdown */}
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-5 text-sm font-semibold text-white rounded-lg bg-main-gradient btn-gradient hover:shadow-lg transition-shadow w-full sm:w-auto whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Nouvel événement
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-58 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">

                <button
                  onClick={() => { setDropdownOpen(false); navigate("/create-event?type=concert"); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Ticket className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Billetterie</p>
                    <p className="text-xs text-gray-400">Concert, soirée, gala...</p>
                  </div>
                </button>

                <div className="border-t border-gray-100" />

                <button
                  onClick={() => { setDropdownOpen(false); navigate("/create-event?type=vote"); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-50 group-hover:bg-green-100 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Vote className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Votes & Élections</p>
                    <p className="text-xs text-gray-400">Miss, Mister, talents...</p>
                  </div>
                </button>

              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? "border-orange-500 text-orange-500 bg-white"
                  : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-200 bg-transparent"
                }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? "bg-orange-50 text-orange-400" : "bg-gray-100 text-gray-400"
              }`}>
                {tab.id === "concert" ? concertEvents.length : voteEvents.length}
              </span>
            </button>
          ))}
        </div>

        {/* Stats */}
        {activeStats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {activeStats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        )}

        {/* Card liste */}
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 pt-5 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">{listTitle}</h2>
            <p className="text-sm text-gray-400">{listSubtitle}</p>
          </div>

          <div className="border-t border-gray-100" />

          <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
            {eventLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
                <span className="w-4 h-4 border-2 border-gray-300 border-t-orange-400 rounded-full animate-spin" />
                Chargement...
              </div>
            ) : activeEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                  <Plus className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">Aucun événement trouvé</p>
                <p className="text-xs text-gray-400 mt-1">Créez votre premier événement</p>
              </div>
            ) : (
              activeEvents.map((event) => (
                <EventRow
                  key={event.id}
                  id={event.id}
                  type={event.type}
                  image={event.images?.[0]?.url}
                  title={event.name}
                  category={event.category}
                  date={formatDate(event.started_at)}
                  publishedAt={formatDate(event.created_at)}
                  price={
                    eventPrices[event.id] !== undefined
                      ? `${eventPrices[event.id].toLocaleString()} FCFA`
                      : "Prix en attente..."
                  }
                  location={event.city}
                  status={new Date(event.ended_at) > new Date() ? "En cours" : "Terminé"}
                  onClick={() => onEventClick?.(event.id)}
                  onEdit={() => onEventEdit?.(event.id)}
                  onDelete={() => onEventDelete?.(event.id)}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}