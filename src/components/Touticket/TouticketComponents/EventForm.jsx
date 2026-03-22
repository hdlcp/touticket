import { useState } from "react";
import { Calendar, Clock, MapPin, Upload, Save, X, Plus } from "lucide-react";
import { useEventTypes } from "./hooks/useEventTypes";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/services/apiError";


export default function EventForm({
  initialData = {},
  mode = "create",
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    event_type: initialData.event_type || "",
    locationDesc: initialData.locationDesc || "", // city ET address pour l'API
    mapsUrl: initialData.mapsUrl || "",// Pour géocodage uniquement
    startDate: initialData.startDate || "",
    startTime: initialData.startTime || "",
    endDate: initialData.endDate || "",
    endTime: initialData.endTime || "",
    ticket_due_payment_date: initialData.ticket_due_payment_date || "",
  });

  const [imagePreview, setImagePreview] = useState(initialData.image || null);
  const [images, setImages] = useState([]);
  const { eventTypes, loading: typesLoading } = useEventTypes();
  const VOTE_TYPE_IDS = [1, 2, 3]; 

  const [tickets, setTickets] = useState(
    initialData.tickets || [
      {
        id: Date.now(),
        name: "",
        places: "",
        price: "",
        description: "",
      },
    ]
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImages(files);
    setImagePreview(URL.createObjectURL(files[0]));
  };

  const removeImage = () => {
    setImagePreview(null);
    setImages([]);
  };

  const addTicket = () => {
    const newTicket = {
      id: Date.now(),
      name: "",
      places: "",
      price: "",
      description: "",
    };
    setTickets([...tickets, newTicket]);
  };

  const removeTicket = (ticketId) => {
    if (tickets.length > 1) {
      setTickets(tickets.filter((ticket) => ticket.id !== ticketId));
    }
  };

  const handleTicketChange = (ticketId, field, value) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, [field]: value } : ticket
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!form.name || !form.description || !form.event_type) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }
      if (!form.mapsUrl) { toast.error("Veuillez entrer une URL de carte"); return; }
      if (!form.locationDesc) { toast.error("Veuillez décrire le lieu"); return; }
      if (!form.startDate || !form.startTime || !form.endDate || !form.endTime) {
        toast.error("Veuillez remplir toutes les dates et heures");
        return;
      }
      if (images.length === 0 && !imagePreview) {
        toast.error("Veuillez ajouter une image");
        return;
      }
      for (const ticket of tickets) {
        if (!ticket.name || !ticket.places || !ticket.price) {
          toast.error("Veuillez remplir tous les champs des tickets");
          return;
        }
      }

      // Dates ISO
      const started_at = new Date(`${form.startDate}T${form.startTime}`).toISOString();
      const ended_at   = new Date(`${form.endDate}T${form.endTime}`).toISOString();
      const ticket_due_payment_date = new Date(`${form.ticket_due_payment_date}T00:00:00`).toISOString();

      // ✅ FormData avec les bons noms de champs selon l'API
      const formData = new FormData();
      formData.append("name",                   form.name);
      formData.append("description",            form.description);
      formData.append("event_type_id",          form.event_type);  // ✅ event_type_id (integer)
      formData.append("city",                   form.locationDesc);
      formData.append("address",                form.locationDesc);
      formData.append("place_maps_url",          form.mapsUrl);
      formData.append("started_at",             started_at);
      formData.append("ended_at",               ended_at);
      formData.append("ticket_due_payment_date", ticket_due_payment_date);

      // ✅ "cover" et non "images" selon la doc API
      if (images.length > 0) {
        formData.append("cover", images[0]);
      }

      await onSubmit(formData, tickets);

    } catch (error) {
      console.error("❌ Erreur:", error);
      const message = await getApiErrorMessage(error, "Erreur lors de la création");
      toast.error(message);
    }
  };

  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Informations de l'événement</h2>
        <p className="text-sm text-gray-500">
          Tous les champs sont obligatoires
        </p>
      </div>

      {/* Nom */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Nom de l'événement *
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Ex: EPAC 2025 - Journée de l'étudiant"
          required
        />
      </div>

      {/* Type */}
     <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Type d'événement *
        </label>
        <select
          name="event_type"
          value={form.event_type}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
          disabled={typesLoading}
        >
        <option value="">{typesLoading ? "Chargement..." : "Choisissez le type"}</option>
  {eventTypes
    .filter((type) => !VOTE_TYPE_IDS.includes(type.id)) // ✅ seulement les types billetterie
    .map((type) => (
      <option key={type.id} value={type.id}>{type.label}</option>
    ))}
        </select>
      </div>


      {/* Image Upload */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Image de l'événement *
        </label>

        {/* Zone d'upload */}
        <div className="space-y-3">
          {/* Aperçu de l'image si présente */}
          {imagePreview && (
            <div className="relative w-full h-48 border-2 border-gray-200 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Aperçu"
                className="w-full h-full object-cover"
              />
              {/* Bouton supprimer l'image */}
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                title="Supprimer l'image"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Input caché + bouton personnalisé */}
          <div className="flex items-center gap-3">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="imageUpload"
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition-colors w-full justify-center"
            >
              <Upload size={18} className="text-gray-600" />
              <span className="text-sm text-gray-600 font-medium">
                {imagePreview
                  ? "Changer l'image"
                  : "Cliquer pour uploader une image"}
              </span>
            </label>
          </div>

          <p className="text-xs text-gray-500">
            Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Description de l'événement *
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>

      {/* Date / Heure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Date de l'événement *
          </label>
          <div className="relative">
            <Calendar className={iconClass} />
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Heure de l'événement *
          </label>
          <div className="relative">
            <Clock className={iconClass} />
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
              required
            />
          </div>
        </div>
        {/* Date de fin */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Date de fin *
          </label>
          <div className="relative">
            <Calendar className={iconClass} />
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
              required
            />
          </div>
        </div>

        {/* Heure de fin */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Heure de fin *
          </label>
          <div className="relative">
            <Clock className={iconClass} />
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
              required
            />
          </div>
        </div>
      </div>

   
   
   {/* Adresse complète  */}
      <div className="relative">
  <label className="text-sm font-medium text-gray-700 mb-1 block">
    Lien Google Maps *
  </label>
  <div className="relative">
    <MapPin className={iconClass} />
    <input
      name="mapsUrl"
      value={form.mapsUrl}
      onChange={handleChange}
      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
      placeholder="https://maps.google.com/..."
      required
    />
  </div>
</div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Lieu de l'événement (Description) *
        </label>
        <div className="relative">
          <MapPin className={iconClass} />
          <input
            name="locationDesc"
            value={form.locationDesc}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
            placeholder="Décriver un peu le lieu"
            required
          />
        </div>
      </div>

      {/* Section Tickets */}
      <div className=" pt-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tickets</h3>
          <button
            type="button"
            onClick={addTicket}
            className="flex items-center gap-2 border border-orange-500 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Ajouter un ticket
          </button>
        </div>

        {/* Liste des tickets */}
        <div className="space-y-6">
          {tickets.map((ticket, index) => (
            <div
              key={ticket.id}
              className="border border-gray-200 rounded-lg p-4 relative bg-gray-50"
            >
              {/* Bouton supprimer (seulement si plus d'un ticket) */}
              {tickets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTicket(ticket.id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                  title="Supprimer ce ticket"
                >
                  <X size={18} />
                </button>
              )}

              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Ticket {index + 1}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nom du ticket */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Nom du ticket *
                  </label>
                  <input
                    value={ticket.name}
                    onChange={(e) =>
                      handleTicketChange(ticket.id, "name", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: VIP, Standard, Premium"
                    required
                  />
                </div>

                {/* Places disponibles */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Places disponibles *
                  </label>
                  <input
                    type="number"
                    value={ticket.places}
                    onChange={(e) =>
                      handleTicketChange(ticket.id, "places", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="100"
                    min="1"
                    required
                  />
                </div>

                {/* Prix */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Prix du ticket (FCFA) *
                  </label>
                  <input
                    type="number"
                    value={ticket.price}
                    onChange={(e) =>
                      handleTicketChange(ticket.id, "price", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="5000"
                    min="0"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Description / Avantages
                  </label>
                  <input
                    value={ticket.description}
                    onChange={(e) =>
                      handleTicketChange(
                        ticket.id,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Les avantages du ticket"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date limite de paiement */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Date de limite de paiement *
        </label>
        <div className="relative">
          <Calendar className={iconClass} />
          <input
            type="date"
            name="ticket_due_payment_date"
            value={form.ticket_due_payment_date}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
            required
          />
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="border border-gray-300 shadow-md hover:bg-gray-100 px-6 py-2 rounded-md text-gray-700 font-medium"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-main-gradient btn-gradient flex gap-2 items-center justify-center text-white px-6 py-2 rounded-md font-semibold hover:shadow-lg transition-shadow"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Enregistrement..." : "Enregistrer"}</span>
        </button>
      </div>
    </form>
  );
}
