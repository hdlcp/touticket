// AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Ticket, Users, Wallet, Vote } from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardPage from "./TouticketComponents/DashboardPage";
import { getStats } from "@/services/statsService";
import { getAdminAllEvents } from "@/services/eventService";

// ✅ IDs des types vote directement dans le fichier
const VOTE_TYPE_IDS = [1, 2, 3]; // Election Miss, Election Mister, Concours de talents
const isVoteType = (typeId) => VOTE_TYPE_IDS.includes(Number(typeId));

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [statsData, setStatsData]         = useState(null);
  const [statsLoading, setStatsLoading]   = useState(true);
  const [concertEvents, setConcertEvents] = useState([]);
  const [voteEvents, setVoteEvents]       = useState([]);
  const [eventLoading, setEventLoading]   = useState(true);
  const [eventPrices, setEventPrices]     = useState({});

  useEffect(() => {
    fetchStats();
    fetchEvents();
  }, []);

  async function fetchStats() {
    try {
      const res = await getStats();
      if (res.success) setStatsData(res.data.global);
    } catch {
      toast.error("Impossible de charger les statistiques");
    } finally {
      setStatsLoading(false);
    }
  }

  async function fetchEvents() {
    setEventLoading(true);
    try {
      const res = await getAdminAllEvents({ qType: "all" });
      if (res.success) {
        const all = res.data.events_data || [];
        setConcertEvents(all.filter((e) => !isVoteType(e.event_type?.id)));
        setVoteEvents(all.filter((e) => isVoteType(e.event_type?.id)));
        const prices = {};
        all.forEach((e) => {
          if (e.minimum_vote_price !== undefined) prices[e.id] = e.minimum_vote_price;
        });
        setEventPrices(prices);
      }
    } catch (e) {
      console.error("Erreur fetchEvents:", e);
      toast.error("Impossible de charger les événements");
    } finally {
      setEventLoading(false);
    }
  }

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }) : "—";

  const concertStats = [
    { icon: Calendar, label: "Total événements",  value: statsLoading ? "..." : statsData?.ticketing?.total_events        ?? 0, subtitle: "Événements actifs" },
    { icon: Ticket,   label: "Tickets vendus",     value: statsLoading ? "..." : statsData?.ticketing?.total_tickets_sold  ?? 0, subtitle: "Sur tous tickets"  },
    { icon: Users,    label: "Places disponibles", value: statsLoading ? "..." : statsData?.ticketing?.total_available_places ?? 0, subtitle: "Places restantes" },
    { icon: Wallet,   label: "Revenus totaux",     value: statsLoading ? "..." : `${(statsData?.ticketing?.total_revenue ?? 0).toLocaleString()} F`, subtitle: "FCFA" },
  ];

  const voteStats = [
    { icon: Calendar, label: "Total événements", value: statsLoading ? "..." : statsData?.voting?.total_events    ?? 0, subtitle: "Événements actifs" },
    { icon: Vote,     label: "Total votes",       value: statsLoading ? "..." : statsData?.voting?.total_votes     ?? 0, subtitle: "Votes collectés"  },
    { icon: Users,    label: "Candidates",         value: statsLoading ? "..." : statsData?.voting?.total_candidates ?? 0, subtitle: "Participantes"   },
    { icon: Wallet,   label: "Revenus totaux",     value: statsLoading ? "..." : `${(statsData?.voting?.total_revenue ?? 0).toLocaleString()} F`, subtitle: "FCFA" },
  ];

  return (
    <DashboardPage
      concertStats={concertStats}
      voteStats={voteStats}
      concertEvents={concertEvents}
      voteEvents={voteEvents}
      eventLoading={eventLoading}
      eventPrices={eventPrices}
      formatDate={formatDate}
      onEventClick={(id) => navigate(`/statistics/${id}`)}
      onEventEdit={(id) => navigate(`/edit-event/${id}`)}
      onEventDelete={(id) => console.log("delete", id)}
    />
  );
}