import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../services/eventService";
import { createTicket } from "../../services/ticketService";
import EventForm from "../Touticket/TouticketComponents/EventForm";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData, tickets) => {
    try {
      setLoading(true);

      const eventRes = await createEvent(formData);
      console.log("📦 Réponse événement complète:", eventRes);

      if (!eventRes.success) {
        throw new Error("Erreur création événement");
      }

      const eventId = eventRes.data.id;
      console.log("🆔 Event ID récupéré:", eventId);

      for (const ticket of tickets) {
        const ticketData = {
          event_id: eventId,
          label: ticket.name,
          available_places: Number(ticket.places),
          price: Number(ticket.price),
          description: ticket.description || "",
        };
        console.log("🎫 Ticket envoyé:", ticketData);

        await createTicket(ticketData);
      }

      toast.success("Événement et tickets créés avec succès !");
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Erreur complète:", error);
      toast.error(error.message || "Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-16">
      {/* Bouton retour */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-start gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au tableau de bord
      </button>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-2">Nouvel événement</h1>
        <p className="text-gray-500 mb-6">Ajouter une nouvelle événement</p>

        <EventForm mode="create" onSubmit={handleCreate} loading={loading} />
      </div>
    </div>
  );
}
