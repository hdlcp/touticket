// TouticketComponents/Vote.jsx
import { Loader2 } from "lucide-react";
import EventCard from "./EventCard";
import { useNavigate } from "react-router-dom";

export default function Votes({ events = [], loading, error, onRetry }) {
    const navigate = useNavigate();
  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">Chargement...</span>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-sm text-red-400 mb-2">{error}</p>
      <button onClick={onRetry} className="text-xs text-orange-500 font-semibold underline">Réessayer</button>
    </div>
  );

  if (events.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-sm text-gray-400">Aucun événement de vote disponible.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          image={event.cover?.url}                    // ✅ cover.url
          title={event.name}
          badge={event.event_type?.label}             // ✅ event_type.label
          date={event.started_at}
          location={event.place_description}          // ✅ place_description
          price={event.minimum_vote_price}            // ✅ minimum_vote_price
          publishedAt={event.created_at}
          buttonLabel="VOTER MAINTENANT"
          onCardClick={() => navigate(`/vote/${event.id}`)}
          onButtonClick={() => navigate(`/vote/${event.id}`)}
        />
      ))}
    </div>
  );
}