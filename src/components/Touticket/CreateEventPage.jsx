// pages/CreateEventPage.jsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EventForm from "./TouticketComponents/EventForm";
import VoteEventForm from "./TouticketComponents/VoteEventForm";
import { createVoteEvent } from "@/services/voteEventService";
import { createTicketingEvent,  createTicketForEvent} from "@/services/eventService";
import toast from "react-hot-toast";

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type"); // "concert" | "vote" | null

  // Si le type est passé en URL, on l'utilise directement — sinon null
  const [eventType, setEventType] = useState(typeParam || null);
  const [loading, setLoading] = useState(false);

const handleSubmitConcert = async (formData, tickets) => {
  setLoading(true);
  try {
    const res = await createTicketingEvent(formData);

    if (!res.success) {
      toast.error(res.message || "Erreur lors de la création");
      return;
    }

    const eventId = res.data?.id;
    toast.success("Événement créé !");

    if (eventId && tickets.length > 0) {
      await Promise.all(
        tickets.map((ticket) =>
          createTicketForEvent(eventId, {
            name: ticket.name,
            places: Number(ticket.places),
            price: Number(ticket.price),
            description: ticket.description,
          })
        )
      );
      toast.success("Tickets créés !");
    }

    navigate("/touticket/dashboard");
  } catch (e) {
    // ✅ Récupère le vrai message d'erreur de l'API
    if (e.response) {
      try {
        const errBody = await e.response.json();
        toast.error(errBody.message || "Erreur lors de la création");
      } catch {
        toast.error("Erreur lors de la création");
      }
    } else {
      toast.error(e?.message || "Erreur inattendue");
    }
    console.error("Erreur création événement:", e);
  } finally {
    setLoading(false);
  }
};
const handleSubmitVote = async (formFields, candidates, coverFile) => {
  setLoading(true);
  try {
    console.log("formFields:", formFields);
    console.log("candidates:", candidates);
    console.log("coverFile:", coverFile);

    const res = await createVoteEvent(formFields, candidates, coverFile);

    console.log("✅ Réponse API:", res); // ← ajoute ce log

    if (res.success) {
      toast.success("Événement créé avec succès !");
      navigate("/touticket/dashboard");
    } else {
      toast.error(res.message || "Erreur lors de la création");
    }
  } catch (e) {
    console.error("❌ Erreur:", e);
    toast.error(e?.message || "Erreur lors de la création");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-16">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <button
              onClick={() => navigate("/touticket/dashboard")}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au tableau de bord
            </button>
            <div className="sm:text-right">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-black">
                Nouvel événement
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {eventType === "concert"
                  ? "Billetterie — Événement avec tickets"
                  : eventType === "vote"
                  ? "Votes & Élections — Événement avec candidates"
                  : "Choisissez le type d'événement"}
              </p>
            </div>
          </div>

          {/* ── Formulaire Billetterie ── */}
          {eventType === "concert" && (
            <EventForm
              mode="create"
              loading={loading}
              onSubmit={handleSubmitConcert}
            />
          )}

          {/* ── Formulaire Vote ── */}
          {eventType === "vote" && (
            <VoteEventForm
              mode="create"
              loading={loading}
              onSubmit={handleSubmitVote}
            />
          )}

        </div>
      </section>
    </div>
  );
}