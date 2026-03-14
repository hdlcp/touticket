export default function TicketTierRow({
  name,
  price,
  available,
  sold,
  remaining,
  eliminated,
  status = "active",
  onMarkFinished,
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
      
      {/* Type & Prix */}
      <div className="min-w-[160px]">
        <p className="text-md font-medium text-gray-900 uppercase">
          {name}
        </p>
        <p className="text-md text-black font-semibold">
          {price} <span className="text-sm">FCFA</span> 
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1">
        <Stat label="Place disponible" value={available} />
        <Stat label="Tickets vendus" value={sold} />
        <Stat label="Tickets restant" value={remaining} />
        <Stat label="Tickets éliminé" value={eliminated} />
      </div>

      {/* Action */}
      <div className="flex justify-end">
        {status === "finished" ? (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-2 rounded-full">
            Terminé
          </span>
        ) : (
          <button
            onClick={onMarkFinished}
            className="text-xs font-semibold text-white border border-red-200 px-3 py-2 rounded-full bg-red-500 hover:bg-red-600 shadow-md transition"
          >
            Marquer comme terminé
          </button>
        )}
      </div>
    </div>
  );
}

/* Sous-composant pour les stats */
function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-black font-semibold mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
    </div>
  );
}
