import { useParams, useNavigate } from "react-router-dom";
import { SearchX, ArrowLeft } from "lucide-react";
import EventStatPage from "./EventStatPage";

import {
  concertEvent,
  concertStats,
  ticketTiers,
  voteEvent,
  voteStats,
  candidates
} from "./TouticketComponents/eventStatMockData";

export default function EventStatContainer() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const events = [concertEvent, voteEvent];
  const event = events.find(e => e.id === Number(eventId));

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-6">
            <SearchX className="w-9 h-9 text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Événement introuvable
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            L'événement que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => navigate("/touticket/dashboard")}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-main-gradient btn-gradient text-white text-sm font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  if (event.type === "concert") {
    return (
      <EventStatPage
        event={event}
        type="concert"
        stats={concertStats}
        ticketTiers={ticketTiers}
      />
    );
  }

  if (event.type === "vote") {
    return (
      <EventStatPage
        event={event}
        type="vote"
        stats={voteStats}
        candidates={candidates}
        totalVotes={7420}
      />
    );
  }
}