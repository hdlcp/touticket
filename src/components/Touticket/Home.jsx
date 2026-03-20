// HomePage.jsx
import { useState, useEffect, useCallback } from "react";
import { EntityCard } from "./TouticketComponents/EntityCard";
import { Search, Loader2 } from "lucide-react";
import { getAllOrganizations } from "@/services/organizationService";
import Header from "./Header"
import Footer from "./Footer";

export default function HomePage() {
  const [query, setQuery]         = useState("");
  const [entities, setEntities]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchOrganizations = useCallback(async (search = "") => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllOrganizations({ q: search });
      if (res.success) {
        setEntities(res.data.items);
      } else {
        setError(res.message || "Erreur lors du chargement");
      }
    } catch (e) {
      setError("Impossible de charger les organisations");
      console.log("📛 Erreur fetchOrganizations détaillée:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchOrganizations(query);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
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

          {/* États */}
          {loading && (
            <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Chargement...</span>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm font-medium text-red-500 mb-2">{error}</p>
              <button
                onClick={() => fetchOrganizations(query)}
                className="text-xs text-orange-500 hover:text-orange-600 font-semibold underline"
              >
                Réessayer
              </button>
            </div>
          )}

          {!loading && !error && entities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-gray-400">Aucune organisation trouvée.</p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && entities.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {entities.map((entity) => (
                <EntityCard key={entity.id} entity={entity} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />

    </div>
  );
}