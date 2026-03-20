// VoteDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, BarChart2, Ticket, Loader2 } from "lucide-react";
import EventDetail from "./TouticketComponents/EventDetail";
import CandidateCard from "./TouticketComponents/CandidateCard";
import { getEventById } from "@/services/eventService";

export default function VoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vote, setVote]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function fetchVote() {
      setLoading(true);
      try {
        const res = await getEventById(id);
        if (res.success) {
          setVote(res.data);
        } else {
          setError(res.message || "Erreur lors du chargement");
        }
      } catch (e) {
        console.error("Erreur fetchVote:", e);
        setError("Impossible de charger l'événement");
      } finally {
        setLoading(false);
      }
    }
    fetchVote();
  }, [id]);

  // ── États de chargement ──
  if (loading) return (
    <div className="flex items-center justify-center py-32 gap-2 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">Chargement...</span>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-sm text-red-400 mb-2">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="text-xs text-orange-500 font-semibold underline"
      >
        Réessayer
      </button>
    </div>
  );

  if (!vote) return (
    <div className="p-10 text-center text-gray-400 text-sm">
      Vote introuvable
    </div>
  );

  // ── Données depuis l'API ──
  const candidates  = vote.candidates || [];
  const totalVotes  = vote.total_votes_registered || 0;

  const handleVote = (candidateId) => {
    navigate(`/vote/${vote.id}/candidate/${candidateId}`);
  };

  return (
    <div className="space-y-10">

      {/* Détail du vote */}
      <EventDetail
        image={vote.cover?.url}                   // ✅ cover.url
        title={vote.name}
        description={vote.description}
        date={vote.started_at}
        address={vote.place_description}          // ✅ place_description
        onButtonClick={null}                      // pas de CTA ici
        stats={[
          {
            icon: Users,
            label: "Candidates",
            value: vote.candidates_count,         // ✅ candidates_count
            color: "purple",
          },
          {
            icon: BarChart2,
            label: "Total votes",
            value: totalVotes,                    // ✅ total_votes_registered
            color: "blue",
          },
          {
            icon: Ticket,
            label: "Prix du vote",
            value: `${vote.minimum_vote_price} F`, // ✅ minimum_vote_price
            color: "orange",
          },
        ]}
      />

      {/* Titre section candidates */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choisissez votre candidate</h2>
        <p className="text-gray-500 text-sm">
          Cliquez sur une candidate pour voir son profil complet et voter
        </p>
      </div>

      {/* Grid des candidates */}
      {candidates.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">
          Aucune candidate disponible pour le moment.
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...candidates]
            .sort((a, b) => b.votes_count - a.votes_count) // ✅ votes_count
            .map((candidate, index) => (
              <CandidateCard
                key={candidate.id}
                id={candidate.id}
                firstName={candidate.firstname}           // ✅ firstname
                lastName={candidate.lastname}             // ✅ lastname
                photo={candidate.photos?.[0]?.url}        // ✅ photos[0].url
                field={candidate.field}
                age={candidate.age}
                votes={candidate.votes_count}             // ✅ votes_count
                totalVotes={totalVotes}
                rank={index + 1}
                buttonLabel="VOTER POUR ELLE"
                onButtonClick={() => handleVote(candidate.id)}
              />
            ))}
        </div>
      )}
    </div>
  );
}