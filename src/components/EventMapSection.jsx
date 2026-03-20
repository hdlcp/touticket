

export default function EventMapSection({ event }) {
  if (!event?.place_maps_url) return null;

  return (
    <section className="py-8 sm:py-12 md:py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 mt-12">
      <div className="max-w-7xl mx-auto">

        {/* Titre */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="h-1 w-56 bg-main-gradient rounded-full mb-4"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Voir le lieu sur la carte
          </h2>
        </div>

        {/* Card lieu */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#3b82f6" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-base mb-1">
                {event.address || event.city || "Lieu de l'événement"}
              </h3>
              {event.city && (
                <p className="text-sm text-gray-500 mb-3">{event.city}</p>
              )}
              <a
                href={event.place_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                🗺️ Voir sur Google Maps
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}