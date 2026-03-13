// tabs/Votes.jsx
import EventCard from "./EventCard";
import { votes } from "./data";
import { useNavigate } from "react-router-dom";


export default function Votes() {
  const navigate = useNavigate();
  const handleVoteClick = (id) => {
    navigate(`/vote/${id}`);
  };

  if (votes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Votes & Élections</h2>
        <p className="text-sm text-gray-400 max-w-sm">
          Les campagnes de vote et élections en cours apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {votes.map((vote) => (
        <EventCard
          key={vote.id}
          image={vote.images?.[0]?.url}
          title={vote.name}
          badge="Vote"
          date={vote.started_at}
          publishedAt={vote.created_at}
          price={vote.price}
          location={vote.city}
          buttonLabel="VOTER MAINTENANT"
          onCardClick={() => handleVoteClick(vote.id)}
          onButtonClick={() => handleVoteClick(vote.id)}
        />
      ))}
    </div>
  );
}