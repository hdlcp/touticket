// components/dashboard/EventRow.jsx
import { Heart, BarChart3, Pencil } from "lucide-react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  "En cours": "bg-green-100 text-green-600",
  "Terminé":  "bg-red-100 text-red-600",
  "À venir":  "bg-blue-100 text-blue-600",
};

export default function EventRow({
  id,
  image,
  category,
  title,
  date,
  price,
  location,
  publishedAt,
  status,
  // Callbacks optionnels (si tu veux override la navigation)
  onEdit,
  onStats,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 sm:p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow">

      {/* Left */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">

        {/* Image */}
        <div className="rounded-xl overflow-hidden w-xs">
          <div className="relative h-48 overflow-hidden cursor-pointer">
            {/* Background flouté */}
            <div
              className="absolute inset-0 blur-sm scale-110"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-white/0" />

            {/* Image nette */}
            <img
              src={image}
              alt={title}
              className="relative h-48 px-6 mx-auto object-cover z-20"
            />

            {/* Badge catégorie */}
            <span className="flex gap-1 items-center absolute top-3 left-3 bg-main-gradient text-white text-xs font-bold px-3 py-1 rounded z-30">
              <Icon icon="iconamoon:badge-fill" width="16" height="16" />
              {category}
            </span>
          </div>
        </div>

        {/* Infos */}
        <div className="space-y-1">
          <h3 className="font-bold text-lg mb-4">{title}</h3>

          {date && (
            <div className="flex items-center gap-2 mb-2 text-sm text-black font-bold">
              <Icon icon="bxs:calendar" width="20" height="20" />
              {date}
            </div>
          )}

          {price && (
            <div className="flex items-center gap-2 mb-2 text-[#855DDE] font-bold">
              <Icon icon="mdi:money" width="30" height="30" />
              <span className="text-sm">À partir de {price}</span>
            </div>
          )}

          {location && (
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Icon icon="bxs:map" width="20" height="20" />
              {location}
            </div>
          )}

          {publishedAt && (
            <p className="text-xs text-black mt-4">Publié le {publishedAt}</p>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
        <button
          onClick={() => onStats ? onStats() : navigate(`/touticket/dashboard/event/${id}/statistics`)}
          className="flex items-center font-semibold gap-1 px-3 py-1.5 text-sm border border-gray-200 shadow-md rounded-md hover:shadow-lg transition-shadow"
        >
          <BarChart3 className="w-4 h-4" />
          Statistique
        </button>

        <button
          onClick={() => onEdit ? onEdit() : navigate(`/edit-event/${id}`)}
          className="flex items-center gap-1 px-3 py-1.5 font-semibold text-sm border border-gray-200 shadow-md rounded-md hover:shadow-lg transition-shadow"
        >
          <Pencil className="w-4 h-4" />
          Modifier
        </button>

        {status && (
          <span className={`text-xs px-3 py-1 rounded-lg font-semibold ${statusStyles[status] || "bg-gray-100 text-gray-500"}`}>
            {status}
          </span>
        )}
      </div>
    </div>
  );
}