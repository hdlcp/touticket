import { useState } from "react";
import { EntityCard } from "./TouticketComponents/EntityCard";
import { entities } from "./TouticketComponents/data";
import { Search } from "lucide-react";

export default function HomePage() {
  const [query, setQuery] = useState("");

  const filtered = entities.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex flex-col">

      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Découvrez les organisations qui utilisent notre plateforme pour leurs événements.
            </h1>
            <div className="h-1.5 w-56 md:w-72 mx-auto rounded-full bg-main-gradient" />
          </div>

          {/* Search */}
          <form onSubmit={handleSubmit} className="mt-4 mx-auto relative w-full max-w-md">
            <input
              type="text"
              placeholder="Rechercher..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-1 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-1 rounded-lg hover:bg-orange-600"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filtered.map((entity) => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </div>
        </div>
      </section>

  
    </div>
  );
}