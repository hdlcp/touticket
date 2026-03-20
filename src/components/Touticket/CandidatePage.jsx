import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import CandidateDetail from "./TouticketComponents/CandidateDetail";
import { getPublicCandidateById } from "@/services/voteEventService";
import { getEventById } from "@/services/eventService";

export default function CandidatePage() {
  const { eventId, candidateId } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [vote, setVote]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [candidateRes, voteRes] = await Promise.all([
          getPublicCandidateById(candidateId),  // ✅ GET /api/candidate/{id}/get
          getEventById(eventId),       // ✅ ton endpoint déjà corrigé
        ]);

        if (candidateRes.success) setCandidate(candidateRes.data);
        if (voteRes.success)      setVote(voteRes.data);

      } catch (e) {
        console.error("Erreur fetchData:", e);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [eventId, candidateId]);

  if (loading) return (
    <div className="flex items-center justify-center py-32 gap-2 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">Chargement...</span>
    </div>
  );

  if (error || !candidate || !vote) return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-sm text-red-400 mb-2">{error || "Données introuvables"}</p>
      <button onClick={() => navigate(-1)}
        className="text-xs text-orange-500 font-semibold underline">
        Retour
      </button>
    </div>
  );

  const totalVotes = vote.total_votes_registered || 0;

  const handleVote = ({ voteAmount, numberOfVotes }) => {
    console.log(`Vote de ${voteAmount} F = ${numberOfVotes} votes`);
    // Appel API paiement ici
  };

  return (
    <CandidateDetail
      firstName={candidate.firstname}
      lastName={candidate.lastname}
      photos={candidate.photos?.map((p) => p.url)}
      field={candidate.field}
      age={candidate.age}
      description={candidate.description}
      votes={candidate.votes_count}
      totalVotes={totalVotes}
      minVotePrice={vote.minimum_vote_price}
      backHref={`/vote/${eventId}`}
      onVote={handleVote}
    />
  );
}