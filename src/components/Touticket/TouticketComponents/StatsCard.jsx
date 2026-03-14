export default function StatsCard({
  icon: Icon,
  label,
  value,
  subtitle,
}) {
  const isLoading = value === null || value === undefined;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-md hover:shadow-lg transition-shadow">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>

          {/* Label */}
          {isLoading ? (
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-sm text-gray-600">{label}</p>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="mb-2">
        {isLoading ? (
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        ) : (
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {isLoading ? (
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
          ) : (
            subtitle
          )}
        </div>
      )}
    </div>
  );
}
