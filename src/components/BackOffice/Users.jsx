import { useEffect, useState } from "react";
import { Search, Shield, UserCircle, User, ChevronLeft, ChevronRight, Trash2, UserPlus, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { getAllUsers, deleteUser, addAdmin } from "../../services/userService";

// Modal d'ajout d'admin
function AddAdminModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    email: "",
    firstname: "",
    lastname: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.firstname || !form.lastname || !form.username) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);
      await addAdmin(form);
      toast.success("Administrateur ajouté avec succès !");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur ajout admin:", error);
      toast.error(error.message || "Erreur lors de l'ajout de l'administrateur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-orange-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Ajouter un administrateur</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulaire */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Prénom *
              </label>
              <input
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                placeholder="Jean"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Nom *
              </label>
              <input
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                placeholder="Dupont"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Nom d'utilisateur *
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="jean.dupont"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email *
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jean.dupont@example.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-main-gradient btn-gradient text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition disabled:opacity-60"
          >
            {loading ? "Ajout en cours..." : "Ajouter l'admin"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("q");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const params = { page, per_page: 10 };
      if (search.trim()) {
        params[searchType] = search.trim();
      }
      const res = await getAllUsers(params);
      setUsers(res.data.users_data || []);
      setTotalPages(res.data.total_pages || 1);
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
      toast.error("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  }

  async function handleDeleteUser(userId, userName) {
    if (!confirm(`Supprimer définitivement l'utilisateur ${userName} ?`)) return;
    try {
      await deleteUser(userId);
      toast.success("Utilisateur supprimé");
      fetchUsers();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  }

  function getUserIcon(user) {
    if (user.is_superuser) return <Shield className="w-5 h-5 text-purple-600" />;
    if (user.is_admin) return <UserCircle className="w-5 h-5 text-orange-600" />;
    return <User className="w-5 h-5 text-blue-600" />;
  }

  function getUserBadge(user) {
    if (user.is_superuser) return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
        <Shield className="w-3 h-3" /> SuperAdmin
      </span>
    );
    if (user.is_admin) return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
        <UserCircle className="w-3 h-3" /> Admin
      </span>
    );
    return (
      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
        Utilisateur
      </span>
    );
  }

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-16 py-10">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* En-tête */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Gestion des utilisateurs
            </h1>
            <p className="text-gray-600">Liste complète des utilisateurs de la plateforme</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-main-gradient btn-gradient text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            Ajouter un admin
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="q">Tous les champs</option>
              <option value="q_email">Email</option>
              <option value="q_name">Nom</option>
              <option value="q_username">Username</option>
            </select>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un utilisateur..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-main-gradient btn-gradient text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              Rechercher
            </button>
          </form>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Version desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          user.is_superuser ? "bg-purple-100" : user.is_admin ? "bg-orange-100" : "bg-blue-100"
                        }`}>
                          {getUserIcon(user)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.firstname} {user.lastname}</p>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                    <td className="px-6 py-4">{getUserBadge(user)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {user.is_active ? "✓ Actif" : "✗ Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id, `${user.firstname} ${user.lastname}`)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Version mobile */}
          <div className="md:hidden divide-y">
            {users.map((user) => (
              <div key={user.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      user.is_superuser ? "bg-purple-100" : user.is_admin ? "bg-orange-100" : "bg-blue-100"
                    }`}>
                      {getUserIcon(user)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.firstname} {user.lastname}</p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  {getUserBadge(user)}
                </div>
                <p className="text-sm text-gray-700">{user.email}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {user.is_active ? "✓ Actif" : "✗ Inactif"}
                  </span>
                  <button
                    onClick={() => handleDeleteUser(user.id, `${user.firstname} ${user.lastname}`)}
                    className="p-2 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && !loading && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Page {page} sur {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Modal ajout admin */}
      {showAddModal && (
        <AddAdminModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchUsers}
        />
      )}
    </section>
  );
}