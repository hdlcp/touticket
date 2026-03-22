// EntityPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Hero from "./TouticketComponents/Hero";
import Billetterie from "./TouticketComponents/Billeterie";
import Votes from "./TouticketComponents/Vote";
import { Search } from "lucide-react";
import { getPublicAllEvents } from "@/services/eventService";


const tabs = [
  { id: "billetterie", label: "Billetterie" },
  { id: "votes", label: "Votes", isNew: true },
];

export default function EntityPage() {
  const { organizationId } = useParams();
  const [activeTab, setActiveTab] = useState("billetterie");
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const qType = activeTab === "billetterie" ? "ticketing" : "voting";

  const fetchEvents = useCallback(async (search = "") => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicAllEvents({
        organizationId,
        qType,
        q: search,
      });
      if (res.success) {
        setEvents(res.data.events_data);
      } else {
        setError(res.message || "Erreur lors du chargement");
      }
    } catch (e) {
      console.error("Erreur fetchEvents:", e);
      setError("Impossible de charger les événements");
    } finally {
      setLoading(false);
    }
  }, [organizationId, qType]);

  // Recharge quand on change d'onglet
  useEffect(() => {
    fetchEvents(query);
  }, [fetchEvents]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchEvents(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />

      {/* Tab bar */}
      <div className="flex justify-center px-4 py-10">
        <div className="flex items-center border border-gray-300 bg-gray-100 rounded-full p-1 relative">
          {tabs.map((tab) => (
            <div key={tab.id} className="relative">
              {tab.isNew && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] font-bold px-2 py-[2px] rounded-full leading-none">
                  Nouveau
                </span>
              )}
              <button
                onClick={() => { setActiveTab(tab.id); setQuery(""); }}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200
                  ${activeTab === tab.id
                    ? "bg-white border border-[#E95503] text-[#E95503] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit} className="mx-auto relative w-full px-4 sm:px-6 max-w-md mb-6">
        <input
          type="text"
          placeholder="Rechercher..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="absolute right-8 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-1 rounded-lg hover:bg-orange-600"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "billetterie" && (
          <Billetterie events={events} loading={loading} error={error} onRetry={() => fetchEvents(query)} />
        )}
        {activeTab === "votes" && (
          <Votes events={events} loading={loading} error={error} onRetry={() => fetchEvents(query)} />
        )}
      </div>
    </div>
  );
}