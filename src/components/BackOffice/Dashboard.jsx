import { Calendar, Ticket, Users, DollarSign, Plus } from "lucide-react";
import StatCard from "../Touticket/TouticketComponents/StatsCard.jsx";
import EventCard from "./EventCard";
import { getStats } from "../../services/statsService";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { getAllEvents, getEventAdminById } from "../../services/eventService";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventLoading, setEventLoading] = useState(true);
  const [eventPrices, setEventPrices] = useState({});
  const navigate = useNavigate();

  // Charger les stats au montage
  useEffect(() => {
    fetchStats();
    fetchEvents();
  }, []);

  async function fetchStats() {
    try {
      const res = await getStats();

      setStatsData(res.data.global);
      setLoading(false);
    } catch (error) {
      toast.error("Impossible de charger les statistiques");
      setLoading(false);
    }
  }

  async function fetchEvents() {
    try {
      setEventLoading(true);
      // Appeler sans paramètres (utilisera les valeurs par défaut)
      const res = await getAllEvents();

      console.log("Réponse API:", res); // Pour déboguer

      if (res.success && res.data) {
        const eventsData = res.data.events_data || [];
        setEvents(eventsData);
        // Charger les prix pour chaque événement
        fetchEventPrices(eventsData);
      } else {
        setEvents([]);
        toast.error(res.message || "Aucun événement trouvé");
      }
    } catch (error) {
      console.error("Erreur détaillée:", error);

      // Afficher un message plus précis
      if (error.response) {
        // Erreur de l'API (4xx, 5xx)
        toast.error(`Erreur serveur. Veuillez réessayer plus tard`);
      } else if (error.request) {
        // Pas de réponse du serveur
        toast.error("Impossible de joindre le serveur");
      } else {
        // Autre erreur
        toast.error("Une erreur est survenue");
      }

      setEvents([]);
    } finally {
      setEventLoading(false);
    }
  }

  // Récupérer les prix des tickets pour chaque événement
  async function fetchEventPrices(eventsData) {
    const prices = {};

    await Promise.all(
      eventsData.map(async (event) => {
        try {
          const detailRes = await getEventAdminById(event.id);

          if (detailRes.success && detailRes.data?.tickets) {
            const tickets = detailRes.data.tickets;

            if (tickets.length > 0) {
              const minPrice = Math.min(...tickets.map((t) => t.price));
              prices[event.id] = minPrice;
            }
          }
        } catch (error) {
          console.error(`Erreur prix pour événement ${event.id}:`, error);
        }
      }),
    );

    setEventPrices(prices); // ← Cette ligne était déjà là
  }

  const stats = [
    {
      icon: Calendar,
      label: "Total événements",
      value: statsData?.total_events,
      subtitle: "Événements actifs",
    },
    {
      icon: Ticket,
      label: "Total tickets vendus",
      value: statsData?.total_tickets_sold,
      subtitle: "Sur tous tickets",
    },
    {
      icon: Users,
      label: "Nombre total de places disponibles",
      value: statsData?.total_available_places,
      subtitle: "Places disponibles",
    },
    {
      icon: DollarSign,
      label: "Revenu totaux",
      value: statsData?.total_revenue,
      subtitle: "FCFA",
    },
  ];

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    // Vérifier si la date est valide
    if (isNaN(date.getTime())) return "—";

    // Options de formatage en français
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return date.toLocaleDateString("fr-FR", options);
  };

  return (
    <div className="min-h-screen">
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-16 mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-black">
              Tableau de bord
            </h1>
            <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-600">
              Gérez vos événements et suivez vos ventes
            </p>
          </div>

          {/* Bouton */}
          <button
            onClick={() => navigate("/create-event")}
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 px-4 sm:px-6 text-sm sm:text-base text-white font-semibold rounded-lg bg-main-gradient btn-gradient hover:shadow-lg transition-shadow w-full sm:w-auto whitespace-nowrap"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Nouvel événement</span>
          </button>
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

        <div className="mx-auto w-full max-w-6xl bg-white border border-gray-200 rounded-xl shadow-sm px-4 sm:px-6 py-5 overflow-hidden">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Tous les événements
            </h2>
            <p className="text-sm text-gray-500">
              Gérez et modifiez vos événements
            </p>
          </div>

          {/* Liste des événements */}
          <div className="space-y-4 max-h-[90vh] overflow-y-auto pr-1">
            {eventLoading ? (
              <p>Chargement des événements...</p>
            ) : events.length === 0 ? (
              <p>Aucun événement trouvé</p>
            ) : (
              events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  image={event.images[0]?.url}
                  category={event.category || "Concert"}
                  title={event.name}
                  date={formatDate(event.started_at)}
                  price={
                    eventPrices[event.id] !== undefined
                      ? `${eventPrices[event.id].toLocaleString()} FCFA`
                      : "Prix en attente..."
                  }
                  location={event.city}
                  publishedAt={formatDate(event.created_at)}
                  likes={event.likes_count}
                  status={
                    new Date(event.ended_at) > new Date()
                      ? "En cours"
                      : "Terminé"
                  }
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
