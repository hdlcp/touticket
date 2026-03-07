import { useState, useEffect } from "react";
import Hero from "./Hero.jsx";
import { Search, Ticket } from "lucide-react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { getPublicAllEvents, getEventById } from "../services/eventService";
import { toast } from "react-hot-toast";


export default function Home() {
   const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [eventPrices, setEventPrices] = useState({});
  const perPage = 8;
  

 // Charger les événements au montage et quand la page change
  useEffect(() => {
    fetchEvents();
  }, [currentPage, searchQuery]);

  async function fetchEvents() {
    try {
      setLoading(true);
      const res = await getPublicAllEvents({
        page: currentPage,
        per_page: perPage,
        q: searchQuery
      });

      if (res.success && res.data) {
       const eventsData = res.data.events_data || [];
        setEvents(eventsData);
        setTotalPages(res.data.total_pages || 1);
          // Charger les prix pour chaque événement
        fetchEventPrices(eventsData);
      } else {
        setEvents([]);
        toast.error(res.message || "Aucun événement trouvé");
      }
    } catch (error) {
      console.error("Erreur chargement événements:", error);
      toast.error("Impossible de charger les événements");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

   // Récupérer les prix des tickets pour chaque événement
  async function fetchEventPrices(eventsData) {
    const prices = {};
    
    // Charger les détails de tous les événements en parallèle
    await Promise.all(
      eventsData.map(async (event) => {
        try {
          const detailRes = await getEventById(event.id);
          
          if (detailRes.success && detailRes.data?.tickets) {
            const tickets = detailRes.data.tickets;
            
            // Trouver le prix minimum
            if (tickets.length > 0) {
              const minPrice = Math.min(...tickets.map(t => t.price));
              prices[event.id] = minPrice;
            }
          }
        } catch (error) {
          console.error(`Erreur prix pour événement ${event.id}:`, error);
          // Ne pas bloquer si un événement échoue
        }
      })
    );
    
    setEventPrices(prices);
  }

  // Fonction pour formater les dates
const formatDate = (dateString) => {
  if (!dateString) return "—";
  
  const date = new Date(dateString);
  
  // Vérifier si la date est valide
  if (isNaN(date.getTime())) return "—";
  
  // Options de formatage en français
  const options = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('fr-FR', options);
};


  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Retour à la page 1 lors d'une nouvelle recherche
    fetchEvents();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  return (
    <div className="w-full">
      <Hero />
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto mb-8 flex flex-col items-center text-center gap-6">
          <h2 className="text-2xl font-primary md:text-4xl font-extrabold">
            Événement à venir : Billets disponibles
          </h2>
          {/* Barre gradient */}
          <div className="h-1.5 w-56 md:w-72 rounded-full bg-main-gradient" />

          <form onSubmit={handleSearch} className="mt-4 relative w-full max-w-md">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-1 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-1 rounded-lg hover:bg-orange-600">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

         {/* État de chargement */}
        {loading ? (
          <div className="max-w-7xl mx-auto text-center py-12">
            <p className="text-gray-500">Chargement des événements...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="max-w-7xl mx-auto text-center py-12">
            <p className="text-gray-500">Aucun événement trouvé</p>
          </div>
        ) : (
          <>
        {/* Grille d'événements */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image avec badge et favori */}
              <div
                onClick={() => handleEventClick(event.id)}
                className="relative h-48 overflow-hidden cursor-pointer"
              >
                {/* Image floue background */}
                <div
                  className="absolute inset-0 blur-xs  scale-110"
                  style={{
                    backgroundImage: `url(${event.images[0]?.url || ""})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                {/* Overlay sombre pour lisibilité */}
                <div className="absolute inset-0 bg-white/0" />

                {/* Image principale nette */}
                <img
                  src={event.images[0]?.url || ""}
                  alt={event.name}
                  className="relative h-48 mx-auto object-cover z-20"
                />

                <span className="flex gap-1 absolute top-3 left-3 bg-main-gradient text-white text-xs font-bold px-3 py-1 rounded z-30">
                  <Icon icon="iconamoon:badge-fill" width="16" height="16" />{" "}
                  {event.badge || "Concert"}
                </span>
              </div>

              {/* Contenu */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-4">  {event.name}</h3>

                {/* Date */}
                <div className="flex items-start gap-2 mb-2 text-sm text-black font-bold">
                  <Icon icon="bxs:calendar" width="20" height="20" />
                  <span>{formatDate(event.started_at)}</span>
                </div>

                {/* Prix */}
                <div className="flex items-center gap-2 mb-2 text-md text-[#855DDE] font-bold">
                  <Icon icon="mdi:money" width="30" height="30" />
                  <span className="text-sm">
                        {eventPrices[event.id] !== undefined
                          ? `À partir de ${eventPrices[event.id].toLocaleString()} FCFA`
                          : "Prix en attente..."}
                      </span>
                </div>

                {/* Localisation */}
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <Icon icon="bxs:map" width="20" height="20" />
                  <span>{event.city || "Indisponible pour l'instant"}</span>
                </div>

                {/* Bouton d'action */}
                <button
                  onClick={() => handleEventClick(event.id)}
                  className="w-full text-white text-sm bg-main-gradient btn-gradient cursor-pointer font-semibold py-2 rounded-full transition-colors"
                >
                  ACHETER MON TICKET
                </button>

                {/* Date de publication */}
                <p className="text-xs text-black mt-4">
                  Publié le {formatDate(event.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {/* Pagination */}
            {totalPages > 1 && (
              <div className="max-w-7xl mx-auto mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 flex items-center justify-center border border-[#CD4711] rounded hover:bg-gray-100 ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "text-[#CD4711]"
                  }`}
                >
                  &lt;
                </button>

                {/* Numéros de page */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded ${
                        currentPage === pageNum
                          ? "bg-[#CD4711] text-white"
                          : "text-[#CD4711] border border-[#CD4711] hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 flex items-center justify-center border border-[#CD4711] rounded hover:bg-gray-100 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "text-[#CD4711]"
                  }`}
                >
                  &gt;
                </button>
              </div>
            )}
          </>
           )}
      </section>

      {/* CTA */}
      <button className="flex items-center mx-auto gap-2 bg-[#E95503] text-white px-4 py-2 rounded-xl font-primary font-medium  hover:scale-105 transition-all">
        <Ticket size={18} />
        <span onClick={() => navigate("/tickets")}>Mes Tickets</span>
      </button>
    </div>
  );
}
