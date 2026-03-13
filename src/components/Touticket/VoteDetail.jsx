import { useParams } from "react-router-dom";
import { votes, candidates } from "./TouticketComponents/data";
import EventDetail from "./TouticketComponents/EventDetail";
import CandidateCard from "./TouticketComponents/CandidateCard";
import { Users, BarChart2, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VoteDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const vote = votes.find((v) => v.id === Number(id));

  const voteCandidates = candidates.filter(
    (c) => c.voteId === Number(id)
  );

  const totalVotes = voteCandidates.reduce(
    (sum, c) => sum + c.votes,
    0
  );


  if (!vote) {
    return <div className="p-10 text-center">Vote introuvable</div>;
  }

  const handleVote = (candidateId) => {
   navigate(`/entity/${vote.entitySlug}/event/${vote.id}/candidate/${candidateId}`);
  };

  return (
    <div className="space-y-10">

      {/* Detail du vote */}
      <EventDetail
        image={vote.images?.[0]?.url}
        title={vote.name}
        description={vote.description}
        date={vote.started_at}
        city={vote.city}
        onButtonClick={() => {}}
        stats={[
          {
            icon: Users,
            label: "Candidates",
            value: voteCandidates.length,
            color: "purple"
          },
          {
            icon: BarChart2,
            label: "Total votes",
            value: totalVotes,
            color: "blue"
          },
          {
            icon: Ticket,
            label: "Prix du vote",
            value: `${vote.price} F`,
            color: "orange"
          }
        ]}
      />

      {/* Titre */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-2">
          Choisissez votre candidate
        </h2>
        <p className="text-gray-500">
          Cliquez sur une candidate pour voir son profil complet et voter
        </p>
      </div>

      {/* Grid des candidates */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

        {voteCandidates
          .sort((a, b) => b.votes - a.votes)
          .map((candidate, index) => (

            <CandidateCard
              key={candidate.id}
              id={candidate.id}
              firstName={candidate.firstName}
              lastName={candidate.lastName}
              photo={candidate.photos?.[0]}
              field={candidate.field}
              age={candidate.age}
              votes={candidate.votes}
              totalVotes={totalVotes}
              rank={index + 1}
              buttonLabel="VOTER POUR ELLE"
              onButtonClick={() => handleVote(candidate.id)}
            />

          ))}

      </div>

    </div>
  );
}