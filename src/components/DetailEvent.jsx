// DetailEvent.jsx — corrections des champs selon la structure API
import { useState, useEffect, useRef } from "react";
import { Calendar, MapPin, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import TicketSEvent from "./TicketSEvent";
import { getEventById } from "@/services/eventService";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function DetailEvent() {
  const { eventId }  = useParams();
  const navigate     = useNavigate();
  const [event, setEvent]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const descriptionRef = useRef(null);

  useEffect(() => {
    if (eventId) fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    if (descriptionRef.current && event?.description) {
      const el = descriptionRef.current;
      const lineHeight = parseInt(window.getComputedStyle(el).lineHeight);
      setShowButton(el.scrollHeight > lineHeight * 3);
    }
  }, [event?.description]);

  async function fetchEventDetails() {
    setLoading(true);
    try {
      const res = await getEventById(eventId);
      if (res.success && res.data) {
        setEvent(res.data);
      } else {
        toast.error(res.message || "Événement introuvable");
        navigate("/");
      }
    } catch (e) {
      console.error("Erreur:", e);
      toast.error("Impossible de charger l'événement");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center gap-2 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span>Chargement...</span>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-500">Événement introuvable</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

            {/* Image */}
            <div className="w-full lg:w-5/12 flex-shrink-0">
              <div className="w-full max-w-[600px] mx-auto lg:mx-0">
                <img
                  src={event.cover?.url || ""}  
                  alt={event.name}
                  className="w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px] rounded-xl shadow-xl object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Infos */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-black leading-tight">
                {event.name}
              </h1>

              {/* Description */}
              {event.description && (
                <div>
                  <p
                    ref={descriptionRef}
                    className={`text-base sm:text-lg text-gray-600 leading-relaxed transition-all duration-300 ${
                      !isExpanded ? "line-clamp-3" : ""
                    }`}
                  >
                    {event.description}
                  </p>
                  {showButton && (
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

              <div className="space-y-4 pt-4 border-t border-gray-200">

                {/* Date début */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-orange-50 rounded-lg flex-shrink-0">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                      Date de début
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(event.started_at)}
                    </p>
                  </div>
                </div>

                {/* Date de fin */}
                {event.ended_at && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-50 rounded-lg flex-shrink-0">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Date de fin
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(event.ended_at)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Localisation */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                      Lieu
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {event.address || event.city || "—"}  
                    </p>
                    
                  </div>
                </div>

                {/* Date limite de paiement */}
                {event.ticket_due_payment_date && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                      <Calendar className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Date limite de paiement
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(event.ticket_due_payment_date)}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section tickets */}
      <TicketSEvent
        tickets={event.tickets || []}
        eventId={event.id}
        eventTitle={event.name}
        event={event}
      />
    </div>
  );
}