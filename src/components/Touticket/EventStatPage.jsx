// components/dashboard/EventStatPage.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, ChevronDown, ChevronUp, Heart } from "lucide-react";
import StatCard from "./TouticketComponents/StatsCard";
import TicketTierRow from "./TouticketComponents/TicketTierRow";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

const rankColors = {
  0: "bg-yellow-400",
  1: "bg-gray-400",
  2: "bg-amber-700",
};

export default function EventStatPage({
  // Événement
  event = {},

  // Type : "concert" | "vote"
  type = "concert",

  // Stats du haut
  stats = [],

  // Billetterie
  ticketTiers = [],
  onMarkTierFinished,

  // Vote
  candidates = [],
  totalVotes = 0,

  // Navigation
  backHref = "/touticket/dashboard",
  backLabel = "Retour au tableau de bord",
}) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const descRef = useRef(null);

  useEffect(() => {
    if (descRef.current) {
      setShowToggle(descRef.current.scrollHeight > descRef.current.clientHeight + 2);
    }
  }, [event.description]);

  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1">
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-16 mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <button
            onClick={() => navigate(backHref)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-black sm:text-right">
            Tableau de bord — {event.name || "Événement"}
          </h1>
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        )}

        {/* Détail événement */}
        <div className="max-w-7xl mx-auto mb-10 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

            {/* Image */}
            <div className="w-full lg:w-5/12 flex-shrink-0">
              <img
                src={event.images?.[0]?.url || ""}
                alt={event.name}
                className="w-full h-[280px] sm:h-[360px] md:h-[420px] rounded-xl shadow-lg object-cover"
                loading="lazy"
              />
            </div>

            {/* Infos */}
            <div className="flex-1 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-black leading-tight">
                {event.name}
              </h2>

              {/* Description */}
              {event.description && (
                <div>
                  <p
                    ref={descRef}
                    className={`text-base text-gray-600 leading-relaxed transition-all duration-300 ${!isExpanded ? "line-clamp-3" : ""}`}
                  >
                    {event.description}
                  </p>
                  {showToggle && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 mt-3 transition-colors"
                    >
                      {isExpanded
                        ? <><span>Lire moins</span><ChevronUp className="w-4 h-4" /></>
                        : <><span>Lire plus</span><ChevronDown className="w-4 h-4" /></>}
                    </button>
                  )}
                </div>
              )}

              {/* Date + Lieu */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                {event.started_at && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-50 rounded-lg flex-shrink-0">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Date</p>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(event.started_at)}</p>
                    </div>
                  </div>
                )}
                {(event.city || event.address) && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Lieu</p>
                      <p className="text-lg font-semibold text-gray-900">{event.address || event.city}</p>
                      {event.address && event.city && (
                        <p className="text-sm text-gray-500">{event.city}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── BILLETTERIE : liste des tarifs ── */}
        {type === "concert" && ticketTiers.length > 0 && (
          <div className="max-w-7xl mx-auto mb-10">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Catégories de billets</h2>
              <div className="space-y-4">
                {ticketTiers.map((tier, i) => (
                  <TicketTierRow
                    key={i}
                    {...tier}
                    onMarkFinished={() => onMarkTierFinished?.(tier)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── VOTE : classement des candidates ── */}
        {type === "vote" && sortedCandidates.length > 0 && (
          <div className="max-w-7xl mx-auto mb-10">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Classement des candidates</h2>
              <div className="space-y-4">
                {sortedCandidates.map((candidate, index) => {
                  const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
                  return (
                    <div key={candidate.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                        {/* Rang + Photo */}
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0 ${rankColors[index] || "bg-gray-300"}`}>
                            #{index + 1}
                          </div>
                          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <img
                              src={candidate.photos?.[0] || ""}
                              alt={`${candidate.firstName} ${candidate.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900">
                            {candidate.firstName} {candidate.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {candidate.field}{candidate.age ? ` — ${candidate.age} ans` : ""}
                          </p>
                        </div>

                        {/* Stats votes + montant */}
                        <div className="flex items-center gap-6 flex-shrink-0">
                          <div className="text-center">
                            <div className="flex items-center gap-1 justify-center">
                              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                              <span className="font-bold text-gray-900">{candidate.votes}</span>
                            </div>
                            <p className="text-xs text-gray-400">votes</p>
                          </div>
                          {candidate.totalAmount !== undefined && (
                            <div className="text-center">
                              <p className="font-bold text-orange-500">
                                {candidate.totalAmount.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-400">FCFA</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-gray-400">Pourcentage des votes</span>
                          <span className="font-semibold text-gray-700">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-main-gradient rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </section>
      </main>
    </div>
  );
}