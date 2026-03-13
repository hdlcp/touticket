import { useParams } from "react-router-dom";
import CandidateDetail from "./TouticketComponents/CandidateDetail";
import { votes, candidates } from "./TouticketComponents/data";

export default function CandidatePage() {

  const { entitySlug, eventId, candidateId } = useParams();

  const vote = votes.find(
    (v) => v.id === Number(eventId) && v.entitySlug === entitySlug
  );

  if (!vote) {
    return <div className="p-10 text-center">Vote introuvable</div>;
  }

  const voteCandidates = candidates.filter(
    (c) => c.voteId === Number(eventId)
  );

  const candidate = voteCandidates.find(
    (c) => c.id === Number(candidateId)
  );

  if (!candidate) {
    return <div className="p-10 text-center">Candidate introuvable</div>;
  }

  const totalVotes = voteCandidates.reduce(
    (sum, c) => sum + c.votes,
    0
  );

  const handleVote = ({ voteAmount, numberOfVotes }) => {
    console.log(`Vote de ${voteAmount} F = ${numberOfVotes} votes`);
  };

  return (
    <CandidateDetail
      firstName={candidate.firstName}
      lastName={candidate.lastName}
      photos={candidate.photos}
      field={candidate.field}
      age={candidate.age}
      description={candidate.description}
      votes={candidate.votes}
      totalVotes={totalVotes}
      minVotePrice={vote.price}
      backHref={`/vote/${vote.id}`}
      onVote={handleVote}
    />
  );
}