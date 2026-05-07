// components/CandidateCard.jsx
import { Heart, Vote } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CandidateCard({
  // Candidat
  id,
  firstName = "",
  lastName = "",
  photo = "",
  field = "",
  age,
  votes = 0,

  // Contexte
  totalVotes = 0,
  rank,

  // Navigation
  href,

  // Bouton
  buttonLabel = "VOTER POUR CE CANDIDAT",
  onButtonClick,

  // Affichage conditionnel
  showRank = true,
  showVoteCount = true,
  showProgress = true,
  showAge = true,
  showField = true,
}) {
  const navigate = useNavigate();
  const votePercentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

  const rankColors = {
    1: "bg-yellow-400 text-white",
    2: "bg-gray-400 text-white",
    3: "bg-amber-700 text-white",
  };

  const handleCardClick = () => {
    if (href) navigate(href);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 ${href ? "cursor-pointer" : ""}`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={photo}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Rank badge */}
        {showRank && rank && rank <= 3 && (
          <div className={`absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${rankColors[rank]}`}>
            #{rank}
          </div>
        )}

        {/* Compteur de votes */}
        {showVoteCount && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-3 py-1.5">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span className="text-sm font-bold text-gray-800">{votes.toLocaleString()}</span>
          </div>
        )}

        {/* Nom + filière */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-xl leading-tight">
            {firstName} {lastName}
          </h3>
          {showField && field && (
            <p className="text-white/80 text-sm mt-0.5">{field}</p>
          )}
        </div>
      </div>

      {/* Infos + bouton */}
      <div className="p-4">

        {/* Âge + pourcentage */}
        <div className="flex items-center justify-between mb-2">
          {showAge && age && (
            <span className="text-sm text-gray-500">{age} ans</span>
          )}
          {showProgress && (
            <span className="text-sm font-semibold text-orange-500 ml-auto">
              {votePercentage.toFixed(1)}%
            </span>
          )}
        </div>

        {/* Barre de progression */}
        {showProgress && (
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-main-gradient rounded-full transition-all duration-500"
              style={{ width: `${votePercentage}%` }}
            />
          </div>
        )}

        {/* Bouton */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onButtonClick?.();
          }}
          className="w-full bg-main-gradient btn-gradient text-white py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
        >
          <Vote className="w-4 h-4" />
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}