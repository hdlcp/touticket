import { ArrowRight } from "lucide-react";

export function EntityCard({ entity }) {
  return (
    
      <a href={`/entity/${entity.slug}`}
      className="group block bg-card rounded-xl overflow-hidden border border-blue-50 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={entity.coverImage}
          alt={entity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-bold">{entity.name}</h3>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm line-clamp-2 text-[#6e6c6c] mb-4">
          {entity.description}
        </p>
        <div className="flex items-center text-[#E95503] font-medium text-sm group-hover:gap-2 transition-all">
          <span>Voir les événements</span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </a>
    
  );
}