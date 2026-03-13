// tabs/Billetterie.jsx
export default function Billetterie() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Billetterie</h2>
      <p className="text-sm text-gray-400 max-w-sm">
        Les événements et billets disponibles apparaîtront ici.
      </p>
    </div>
  );
}