// components/EventCard.jsx
import { Icon } from "@iconify/react";

function formatDate(dateStr) {
  if (!dateStr) return "Date inconnue";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventCard({
  // Image
  image = "",

  // Contenu principal
  title = "Sans titre",
  badge = "Concert",

  // Infos
  date,
  publishedAt,
  price,
  location,

  // Bouton
  buttonLabel = "ACHETER MON TICKET",
  onButtonClick,
  onCardClick,

  // Optionnels
  showDate = true,
  showPrice = true,
  showLocation = true,
  showPublishedAt = true,
  showBadge = true,
}) {
  return (
    <div className="rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white">

      {/* Image avec badge */}
      <div
        onClick={onCardClick}
        className="relative h-48 overflow-hidden cursor-pointer"
      >
        {/* Background flouté */}
        <div
          className="absolute inset-0 blur-sm scale-110"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Image nette */}
        <img
          src={image}
          alt={title}
          className="relative h-48 mx-auto object-cover z-20"
        />

        {/* Badge */}
        {showBadge && (
          <span className="flex gap-1 items-center absolute top-3 left-3 bg-main-gradient text-white text-xs font-bold px-3 py-1 rounded z-30">
            <Icon icon="iconamoon:badge-fill" width="16" height="16" />
            {badge}
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-4">{title}</h3>

        {/* Date */}
        {showDate && date && (
          <div className="flex items-center gap-2 mb-2 text-sm text-black font-bold">
            <Icon icon="bxs:calendar" width="20" height="20" />
            <span>{formatDate(date)}</span>
          </div>
        )}

        {/* Prix */}
        {showPrice && (
          <div className="flex items-center gap-2 mb-2 text-[#855DDE] font-bold">
            <Icon icon="mdi:money" width="30" height="30" />
            <span className="text-sm">
              {price !== undefined
                ? `À partir de ${price.toLocaleString()} FCFA`
                : "Prix en attente..."}
            </span>
          </div>
        )}

        {/* Localisation */}
        {showLocation && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <Icon icon="bxs:map" width="20" height="20" />
            <span>{location || "Indisponible pour l'instant"}</span>
          </div>
        )}

        {/* Bouton */}
        <button
          onClick={onButtonClick}
          className="w-full text-white text-sm bg-main-gradient btn-gradient cursor-pointer font-semibold py-2 rounded-full transition-colors"
        >
          {buttonLabel}
        </button>

        {/* Date de publication */}
        {showPublishedAt && publishedAt && (
          <p className="text-xs text-black mt-4">
            Publié le {formatDate(publishedAt)}
          </p>
        )}
      </div>
    </div>
  );
}