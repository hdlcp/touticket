// components/EventDetail.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Calendar, MapPin, Users, BarChart2, Ticket } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "Date inconnue";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventDetail({
  // Image
  image = "",
  imageName = "",

  // Contenu
  title = "Sans titre",
  description = "",

  // Infos principales
  date,
  address,
  city,

  // Stats optionnelles
  stats = [],
  // stats = [
  //   { icon: Users,    label: "Candidates",   value: 5,      color: "purple" },
  //   { icon: BarChart2, label: "Total votes",  value: 689,    color: "blue"   },
  //   { icon: Ticket,   label: "Prix du vote", value: "500 F", color: "orange" },
  // ]

  // Bouton CTA

  onButtonClick,

  // Affichage conditionnel
  showStats = true,
  showDescription = true,
  showDate = true,
  showLocation = true,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const descRef = useRef(null);

  useEffect(() => {
    if (descRef.current) {
      setShowToggle(descRef.current.scrollHeight > descRef.current.clientHeight + 2);
    }
  }, [description]);

  const colorMap = {
    orange: { bg: "bg-orange-50", text: "text-orange-600", value: "text-orange-600" },
    blue:   { bg: "bg-blue-50",   text: "text-blue-600",   value: "text-blue-700"   },
    purple: { bg: "bg-purple-50", text: "text-purple-600", value: "text-purple-700" },
    green:  { bg: "bg-green-50",  text: "text-green-600",  value: "text-green-700"  },
    red:    { bg: "bg-red-50",    text: "text-red-500",    value: "text-red-600"    },
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* Image */}
          <div className="w-full lg:w-5/12 flex-shrink-0">
            <div className="w-full max-w-[600px] mx-auto lg:mx-0">
              <img
                src={image}
                alt={imageName || title}
                className="w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px] rounded-xl shadow-xl object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Infos */}
          <div className="flex-1 space-y-6">

            <h1 className="text-3xl sm:text-4xl font-bold text-black leading-tight">
              {title}
            </h1>

            {/* Description */}
            {showDescription && description && (
              <div>
                <p
                  ref={descRef}
                  className={`text-base sm:text-lg text-gray-600 leading-relaxed transition-all duration-300 ${!isExpanded ? "line-clamp-3" : ""}`}
                >
                  {description}
                </p>
                {showToggle && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 mt-3 transition-colors"
                  >
                    {isExpanded ? <><span>Lire moins</span><ChevronUp className="w-4 h-4" /></> : <><span>Lire plus</span><ChevronDown className="w-4 h-4" /></>}
                  </button>
                )}
              </div>
            )}

            {/* Stats */}
            {showStats && stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stats.map(({ icon: Icon, label, value, color = "orange" }) => {
                  const c = colorMap[color] || colorMap.orange;
                  return (
                    <div key={label} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
                      <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${c.text}`} />
                      </div>
                      <p className={`text-xl font-bold ${c.value}`}>{value}</p>
                      <p className="text-xs text-gray-500 font-medium">{label}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Date + Lieu */}
            <div className="space-y-4 pt-4 border-t border-gray-200">

              {showDate && date && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-orange-50 rounded-lg flex-shrink-0">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Date</p>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(date)}</p>
                  </div>
                </div>
              )}

              {showLocation && (address || city) && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Lieu</p>
                    <p className="text-lg font-semibold text-gray-900">{address || city}</p>
                    {address && city && <p className="text-sm text-gray-500">{city}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Bouton CTA */}
            {onButtonClick }

          </div>
        </div>
      </div>
    </section>
  );
}