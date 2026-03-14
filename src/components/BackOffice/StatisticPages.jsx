import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,
  MapPin,
  Ticket,
  TicketCheck,
  TicketX,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom"; // ← AJOUTER useParams
import { getEventAdminById } from "../../services/eventService";
import { getStatsAdmin } from "../../services/statsService";
import { deleteTicket } from "../../services/ticketService";
import StatCard from "../Touticket/TouticketComponents/StatsCard.jsx";
import TicketTierRow from "./TicketStatsCard.jsx";

export default function StatisticPages() {
  const navigate = useNavigate();
  const { eventId } = useParams(); // ← RÉCUPÉRER L'ID DEPUIS L'URL

  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const descriptionRef = useRef(null);

  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true); // ← AJOUTER
  const [eventLoading, setEventLoading] = useState(true);
  const [event, setEvent] = useState(null); // ← Changer [] en null
  const [tickets, setTickets] = useState([]); // ← AJOUTER pour stocker les tickets
  const [eventTickets, setEventTickets] = useState([]);

  // Charger les stats et événements au montage
  useEffect(() => {
    if (eventId) fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    if (event && event.tickets?.length) fetchStats();
  }, [event]);

  // Fonction pour récupérer les stats de l'événement
  async function fetchStats() {
    try {
      const res = await getStatsAdmin(eventId); // ← PASSER eventId

      if (res.success && res.data) {
        setStatsData(res.data);

        // Transformer les données des tickets
        const ticketsArray = Object.entries(res.data.events || {}).map(
          ([name, data]) => {
            const ticketFromEvent = eventTickets.find((t) => t.label === name);

            return {
              id: ticketFromEvent?.id,
              name,
              price: data.price.toLocaleString(),
              available: data.remaining_places + data.sold + data.eliminated,
              sold: data.sold,
              remaining: data.remaining_places,
              eliminated: data.eliminated,
              revenue: data.revenue,
              status: data.remaining_places === 0 ? "finished" : "active",
            };
          },
        );

        setTickets(ticketsArray);
      }
    } catch (error) {
      console.error("Erreur stats:", error);
      toast.error("Impossible de charger les statistiques");
    }
  }

  // Fonction pour récupérer les détails de l'événement
  async function fetchEventDetails() {
    try {
      setEventLoading(true);
      setLoading(true);

      const res = await getEventAdminById(eventId); // ← PASSER eventId

      if (res.success && res.data) {
        setEvent(res.data);

        setEventTickets(
          res.data.tickets.map((ticket) => ({
            id: ticket.id,
            label: ticket.label,
          })),
        );
      } else {
        toast.error("Événement introuvable");
      }
    } catch (error) {
      console.error("Erreur événement:", error);
      toast.error("Impossible de charger l'événement");
    } finally {
      setEventLoading(false);
      setLoading(false);
    }
  }

  async function handleDeleteTicket(ticketId) {
    if (!confirm("Voulez-vous vraiment supprimer ce ticket ?")) return;

    try {
      await deleteTicket(ticketId);

      toast.success("Ticket supprimé avec succès");

      // 🔥 Mettre à jour l’UI sans recharger la page
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    } catch (error) {
      console.error("Erreur suppression ticket :", error);

      if (error.response?.status === 400) {
        toast.error("Impossible : des achats sont associés à ce ticket");
      } else if (error.response?.status === 403) {
        toast.error("Action non autorisée");
      } else if (error.response?.status === 404) {
        toast.error("Ticket introuvable");
      } else {
        toast.error("Erreur lors de la suppression");
      }
    }
  }

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "—";

    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return date.toLocaleDateString("fr-FR", options);
  };

  // Calculer les stats globales depuis statsData
  const calculateGlobalStats = () => {
    if (!statsData || !statsData.events) {
      return {
        totalTickets: 0,
        totalSold: 0,
        totalEliminated: 0,
        totalRevenue: 0,
        totalAvailable: 0,
      };
    }

    const ticketsData = Object.values(statsData.events);

    return {
      totalTickets: Object.keys(statsData.events).length,
      totalSold: ticketsData.reduce((sum, t) => sum + t.sold, 0),
      totalEliminated: ticketsData.reduce((sum, t) => sum + t.eliminated, 0),
      totalRevenue: ticketsData.reduce((sum, t) => sum + t.revenue, 0),
      totalAvailable: ticketsData.reduce(
        (sum, t) => sum + t.remaining_places,
        0,
      ),
    };
  };

  const globalStats = calculateGlobalStats();

  // Stats cards avec données réelles
  const stats = [
    {
      icon: Ticket,
      label: "Total tickets",
      value: globalStats.totalTickets,
      subtitle: "Types de tickets",
    },
    {
      icon: TicketCheck,
      label: "Tickets vendus",
      value: globalStats.totalSold,
      subtitle: `Sur ${globalStats.totalSold + globalStats.totalAvailable} places`,
    },
    {
      icon: TicketX,
      label: "Tickets éliminés",
      value: globalStats.totalEliminated,
      subtitle: "Places perdues",
    },
    {
      icon: DollarSign,
      label: "Revenus",
      value: globalStats.totalRevenue.toLocaleString(),
      subtitle: "FCFA",
    },
  ];

  useEffect(() => {
    if (descriptionRef.current && event?.description) {
      const element = descriptionRef.current;
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * 3;
      setShowButton(element.scrollHeight > maxHeight);
    }
  }, [event?.description]);

  // État de chargement
  if (loading || eventLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 text-lg">Chargement de l'événement...</p>
      </div>
    );
  }

  // Si pas d'événement après le chargement
  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 text-lg">Événement introuvable</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-16 mx-auto">
        <div className="mx-auto mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Bouton retour */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-black text-center sm:text-right">
              Tableau de bord - {event.name || "Événement"}
            </h1>
          </div>
        </div>

        {/* Grille de statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              subtitle={stat.subtitle}
              trend={stat.trend}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto mb-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Image */}
            <div className="w-full lg:w-5/12 flex-shrink-0">
              <div className="w-full max-w-[600px] mx-auto lg:mx-0">
                <img
                  src={event.images?.[0]?.url || ""}
                  alt={event.name}
                  className="w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px] rounded-xl shadow-xl object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Infos */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-black leading-tight">
                {event.name}
              </h1>

              {/* Description */}
              <div>
                <p
                  ref={descriptionRef}
                  className={`text-base sm:text-lg text-gray-600 leading-relaxed transition-all duration-300 ${
                    !isExpanded ? "line-clamp-3" : ""
                  }`}
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    ...(isExpanded && { display: "block" }),
                  }}
                >
                  {event.description}
                </p>

                {showButton && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 mt-3 transition-colors "
                  >
                    {isExpanded ? (
                      <>
                        Lire moins <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Lire plus <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6 pt-4 border-t border-gray-200">
                {/* Date */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                      Date
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(event.started_at)}
                    </p>
                  </div>
                </div>

                {/* Localisation */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                      Lieu
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {event.city || "Non spécifié"}
                    </p>
                  </div>
                </div>

                {/* Organisateur */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                      Organisé par
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {event.organizer || "Non spécifié"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des cartes de tickets */}
        <div className="space-y-6">
          {tickets.length === 0 ? (
            <p className="text-center text-gray-500">Aucun ticket disponible</p>
          ) : (
            tickets.map((ticket) => (
              <TicketTierRow
                key={ticket.id}
                {...ticket}
                onMarkFinished={() => handleDeleteTicket(ticket.id)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
