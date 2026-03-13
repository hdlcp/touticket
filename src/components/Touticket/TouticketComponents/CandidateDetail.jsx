// components/CandidateDetail.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Minus, Plus, GraduationCap, Calendar, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

export default function CandidateDetail({
  // Candidat
  firstName = "",
  lastName = "",
  photos = [],
  field = "",
  age,
  description = "",
  votes = 0,

  // Événement
  totalVotes = 0,
  minVotePrice = 500,
  quickMultipliers = [1, 5, 10, 20],

  // Navigation
  backHref="/vote/:id",
  backLabel = "Retour aux candidates",

  // Bouton vote
  onVote,
  buttonLabel,

  // Affichage conditionnel
  showStats = true,
  showQuickAmounts = true,
}) {
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [voteAmount, setVoteAmount] = useState(minVotePrice);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const descRef = useRef(null);

  const votePercentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  const numberOfVotes = Math.floor(voteAmount / minVotePrice);

  useEffect(() => {
    if (descRef.current) {
      setShowToggle(descRef.current.scrollHeight > descRef.current.clientHeight + 2);
    }
  }, [description]);

  const handleVote = async () => {
    setIsProcessing(true);
    try {
      await onVote?.({ voteAmount, numberOfVotes });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4">

          {/* Retour */}
          {backHref && (
            <button
              onClick={() => navigate(backHref)}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-6 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </button>
          )}

          <div className="grid lg:grid-cols-2 gap-10">

            {/* ── Galerie photos ── */}
            <div className="space-y-3">
              {/* Photo principale */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={photos[selectedPhoto] || ""}
                  alt={`${firstName} ${lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Miniatures */}
              {photos.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhoto(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedPhoto === index
                          ? "border-orange-500"
                          : "border-transparent hover:border-orange-300"
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Infos + vote ── */}
            <div className="space-y-6">

              {/* Identité */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {firstName} {lastName}
                </h1>
                <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
                  {field && (
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" />
                      <span>{field}</span>
                    </div>
                  )}
                  {age && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{age} ans</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {description && (
                <div>
                  <p
                    ref={descRef}
                    className={`text-gray-600 leading-relaxed text-sm transition-all duration-300 ${!isExpanded ? "line-clamp-3" : ""}`}
                  >
                    {description}
                  </p>
                  {showToggle && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 mt-2 transition-colors"
                    >
                      {isExpanded ? <><span>Voir moins</span><ChevronUp className="w-4 h-4" /></> : <><span>Voir plus</span><ChevronDown className="w-4 h-4" /></>}
                    </button>
                  )}
                </div>
              )}

              {/* Stats votes */}
              {showStats && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      <span className="font-bold text-lg text-gray-900">{votes.toLocaleString()} votes</span>
                    </div>
                    <span className="text-orange-500 font-semibold">{votePercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-main-gradient rounded-full transition-all duration-500"
                      style={{ width: `${votePercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Section vote */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
                <h2 className="text-lg font-bold text-gray-900 text-center">
                  Votez pour {firstName}
                </h2>

                {/* Sélecteur de montant */}
                <div>
                  <p className="text-xs text-gray-400 text-center mb-3">
                    Montant du vote (min. {minVotePrice.toLocaleString()} F CFA)
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setVoteAmount((p) => Math.max(minVotePrice, p - minVotePrice))}
                      disabled={voteAmount <= minVotePrice}
                      className="w-11 h-11 rounded-full border border-gray-200 hover:border-orange-300 disabled:opacity-40 flex items-center justify-center text-gray-600 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <div className="text-center min-w-[160px]">
                      <span className="text-3xl font-bold text-gray-900">{voteAmount.toLocaleString()}</span>
                      <span className="text-base text-gray-400 ml-1">F CFA</span>
                    </div>

                    <button
                      onClick={() => setVoteAmount((p) => p + minVotePrice)}
                      className="w-11 h-11 rounded-full border border-gray-200 hover:border-orange-300 flex items-center justify-center text-gray-600 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Nombre de votes */}
                <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Nombre de votes</p>
                  <p className="text-4xl font-bold text-orange-500">{numberOfVotes}</p>
                </div>

                {/* Montants rapides */}
                {showQuickAmounts && (
                  <div className="grid grid-cols-4 gap-2">
                    {quickMultipliers.map((multiplier) => {
                      const amount = minVotePrice * multiplier;
                      const isActive = voteAmount === amount;
                      return (
                        <button
                          key={multiplier}
                          onClick={() => setVoteAmount(amount)}
                          className={`py-2 rounded-lg border text-xs font-semibold transition-all ${
                            isActive
                              ? "bg-main-gradient btn-gradient text-white border-transparent"
                              : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
                          }`}
                        >
                          {amount.toLocaleString()} F
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Bouton vote */}
                <button
                  onClick={handleVote}
                  disabled={isProcessing}
                  className="w-full h-14 rounded-xl bg-main-gradient btn-gradient disabled:opacity-60 text-white text-base font-bold flex items-center justify-center gap-2 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    buttonLabel || `VOTER — ${voteAmount.toLocaleString()} F CFA`
                  )}
                </button>

                <p className="text-xs text-center text-gray-400">
                  En votant, vous acceptez nos conditions d'utilisation. Les paiements sont sécurisés.
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}