// EventStatContainer.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SearchX, ArrowLeft, Loader2, Users, Heart, Wallet, Ticket } from "lucide-react";
import EventStatPage from "./EventStatPage";
import { getEventById, getEventStats, getEventCandidates } from "@/services/eventService";

import { deleteTicket } from "@/services/ticketService";
import { toast } from "react-hot-toast";

const VOTE_TYPE_IDS = [1, 2, 3];
const isVoteType = (typeId) => VOTE_TYPE_IDS.includes(Number(typeId));

export default function EventStatContainer() {
  const { eventId } = useParams();
  const navigate    = useNavigate();

  const [event, setEvent]           = useState(null);
  const [stats, setStats]           = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => { fetchAll(); }, [eventId]);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const [eventRes, statsRes] = await Promise.all([
        getEventById(eventId),
        getEventStats(eventId),
      ]);

      if (eventRes.success) {
        const eventData = eventRes.data;
        setEvent(eventData);

        if (isVoteType(eventData.event_type?.id)) {
          const candidatesRes = await getEventCandidates(eventId);
          if (candidatesRes.success) {
            setCandidates(candidatesRes.data.candidates_data || []);
          }
        }
      }

      if (statsRes.success) setStats(statsRes.data);

    } catch (e) {
      console.error("Erreur:", e);
      setError("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Marquer un ticket comme terminé = le supprimer
  async function handleMarkTierFinished(tier) {
    if (!window.confirm(`Supprimer le ticket "${tier.name}" ?`)) return;
    try {
      const res = await deleteTicket(tier.id);
      if (res.success) {
        toast.success("Ticket supprimé !");
        await fetchAll(); // recharge l'événement
      } else {
        toast.error(res.message || "Erreur lors de la suppression");
      }
    } catch (e) {
      if (e.response) {
        const err = await e.response.json().catch(() => ({}));
        toast.error(err.message || "Erreur");
      } else {
        toast.error("Erreur de connexion");
      }
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center gap-2 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">Chargement...</span>
    </div>
  );

  if (error || !event) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-9 h-9 text-orange-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Événement introuvable</h1>
        <p className="text-sm text-gray-400 mb-8">{error || "Cet événement n'existe pas."}</p>
        <button
          onClick={() => navigate("/touticket/dashboard")}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-main-gradient btn-gradient text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </button>
      </div>
    </div>
  );

  const isVote = isVoteType(event.event_type?.id);

  const statsCards = isVote ? [
    { icon: Users,  label: "Total candidates", value: stats?.total_candidates ?? 0,                                    subtitle: "Participantes"    },
    { icon: Heart,  label: "Total votes",       value: stats?.total_votes      ?? 0,                                    subtitle: "Votes collectés"  },
    { icon: Wallet, label: "Total revenus",     value: `${(stats?.total_revenue ?? 0).toLocaleString()} FCFA`,          subtitle: "Revenus générés"  },
  ] : [
    { icon: Ticket, label: "Tickets vendus",    value: stats?.total_tickets_sold      ?? 0,                             subtitle: "Sur tous tickets" },
    { icon: Users,  label: "Places disponibles",value: stats?.total_available_places  ?? 0,                             subtitle: "Restantes"        },
    { icon: Wallet, label: "Total revenus",     value: `${(stats?.total_revenue ?? 0).toLocaleString()} FCFA`,          subtitle: "Revenus générés"  },
  ];

  const formattedCandidates = candidates.map((c) => ({
    id:          c.id,
    firstName:   c.firstname,
    lastName:    c.lastname,
    field:       c.field,
    age:         c.age,
    description: c.description,
    votes:       c.votes_count ?? 0,
    photos:      c.photos?.map((p) => p.url) || [],
    totalAmount: stats?.candidates_stats?.[`${c.firstname} ${c.lastname}`]?.total_amount,
  }));

  const totalVotes = formattedCandidates.reduce((sum, c) => sum + c.votes, 0);

  // ✅ Tickets depuis event.tickets avec les bons champs pour TicketTierRow
  const ticketTiers = (event.tickets || []).map((t) => ({
    id:         t.id,
    name:       t.label,
    price:      t.price?.toLocaleString(),
    available:  t.available_places,
    sold:       t.sold_count,
    remaining:  t.remaining_places,
    eliminated: t.eliminated_count ?? 0,
    status:     t.remaining_places === 0 ? "finished" : "active",
  }));

  return (
    <EventStatPage
      event={{
        ...event,
        images: event.cover ? [{ url: event.cover.url }] : [],
        city:   event.place_description ?? event.city,
      }}
      type={isVote ? "vote" : "concert"}
      stats={statsCards}
      candidates={formattedCandidates}
      totalVotes={totalVotes}
      ticketTiers={ticketTiers}                    // ✅ tickets branchés
      onMarkTierFinished={handleMarkTierFinished}  // ✅ suppression branchée
      backHref="/admin/dashboard"
    />
  );
}