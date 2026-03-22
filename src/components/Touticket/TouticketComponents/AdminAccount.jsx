import { Lock, Mail, Shield, Trash2, User, UserCircle, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  deleteAccount,
  getUserProfile,
  updatePassword,
  updateUserProfile,
} from "@/services/userService";
import OrganizationCarousel from "./OrganizationCarousel";
import { getOrganization, updateOrganization } from "@/services/organizationService";
import { getApiErrorMessage } from "@/services/apiError";

export default function AdminAccount() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [org, setOrg]               = useState(null);
const [orgForm, setOrgForm]       = useState({ name: "", description: "" });
const [isUpdatingOrg, setIsUpdatingOrg] = useState(false);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    gender: "male",
  });

  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Charger le profil
 useEffect(() => {
  fetchProfile();
  fetchOrg();
}, []);

async function fetchOrg() {
  try {
    const res = await getOrganization();
    if (res.success) {
      setOrg(res.data);
      setOrgForm({ name: res.data.name || "", description: res.data.description || "" });
    }
  } catch (e) {
    const message = await getApiErrorMessage(e, "Erreur chargement organisation");
    toast.error(message);
  }
}

async function handleOrgUpdate(e) {
  e.preventDefault();
  if (!orgForm.name.trim()) { toast.error("Le nom est obligatoire"); return; }
  setIsUpdatingOrg(true);
  try {
    const res = await updateOrganization({ name: orgForm.name, description: orgForm.description });
    if (res.success) {
      toast.success("Organisation mise à jour !");
      fetchOrg();
    } else {
      toast.error(res.message || "Erreur");
    }
  } catch (e) {
    const message = await getApiErrorMessage(e, "Erreur lors de la mise à jour");
    toast.error(message);
  } finally {
    setIsUpdatingOrg(false);
  }
}

  async function fetchProfile() {
    try {
      const res = await getUserProfile();
    
      const userData = res.data || res;

      setProfile(userData);
      setForm({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        email: userData.email || "",
        username: userData.username || "",
        gender: userData.gender || "male",
      });
    } catch (error) {
      const message = await getApiErrorMessage(error, "Impossible de charger le profil");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  // Update profil
  async function handleProfileUpdate(e) {
    e.preventDefault();

    // Validations
    if (!form.firstname.trim() || !form.lastname.trim()) {
      return toast.error("Le prénom et le nom sont obligatoires");
    }

    if (!form.email.trim()) {
      return toast.error("L'email est obligatoire");
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return toast.error("Format d'email invalide");
    }

    if (!form.username.trim()) {
      return toast.error("Le nom d'utilisateur est obligatoire");
    }

    setIsUpdatingProfile(true);

    try {
      await updateUserProfile({
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        username: form.username,
        gender: form.gender,
      });

      toast.success("Profil mis à jour avec succès !");
      fetchProfile(); // Recharger le profil
    } catch (error) {
      const message = await getApiErrorMessage(error, "Erreur lors de la mise à jour du profil");
      toast.error(message);
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  // Changer mot de passe
  async function handlePasswordUpdate(e) {
    e.preventDefault();

    if (
      !passwords.old_password ||
      !passwords.new_password ||
      !passwords.confirm_password
    ) {
      return toast.error("Tous les champs sont obligatoires");
    }

    if (passwords.new_password.length < 8) {
      return toast.error(
        "Le nouveau mot de passe doit contenir au moins 8 caractères",
      );
    }

    if (passwords.new_password !== passwords.confirm_password) {
      return toast.error("Les mots de passe ne correspondent pas");
    }

    setIsUpdatingPassword(true);

    try {
      await updatePassword({
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      });

      toast.success("Mot de passe modifié avec succès !");
      setPasswords({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      const message = await getApiErrorMessage(error, "Erreur lors du changement de mot de passe");
      toast.error(message);
    } finally {
      setIsUpdatingPassword(false);
        }
  }

  // Suppression compte
  async function handleDeleteAccount() {
    const confirmation = window.confirm(
      "⚠️ ATTENTION : Cette action est IRRÉVERSIBLE.\n\nToutes vos données seront définitivement supprimées.\n\nÊtes-vous absolument certain(e) de vouloir supprimer votre compte ?",
    );

    if (!confirmation) return;

    if (profile?.is_superuser) {
      const doubleConfirmation = window.confirm(
        "🔴 SUPERADMIN : Dernière confirmation\n\nVous êtes sur le point de supprimer un compte SUPERADMIN.\n\nConfirmez-vous cette action ?",
      );

      if (!doubleConfirmation) return;
    }

    try {
      await deleteAccount();
      toast.success("Compte supprimé");

      localStorage.clear();
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      const message = await getApiErrorMessage(error, "Erreur lors de la suppression du compte");
      toast.error(message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-16 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* En-tête avec icône de rôle */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div
              className={`flex items-center justify-center w-24 h-24 rounded-full ${
                profile?.is_superuser
                  ? "bg-gradient-to-br from-purple-500 to-pink-600"
                  : profile?.is_admin
                    ? "bg-gradient-to-br from-orange-500 to-red-600"
                    : "bg-gradient-to-br from-blue-500 to-cyan-600"
              } shadow-lg`}
            >
              {profile?.is_superuser ? (
                <Shield className="w-12 h-12 text-white" />
              ) : profile?.is_admin ? (
                <UserCircle className="w-12 h-12 text-white" />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {profile?.firstname} {profile?.lastname}
              </h1>
              <p className="text-gray-600 mb-1">{profile?.email}</p>
              <p className="text-sm text-gray-500 mb-2">@{profile?.username}</p>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {profile?.is_superuser && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                    <Shield className="w-3 h-3" />
                    Super Admin
                  </span>
                )}
                {profile?.is_admin && !profile?.is_superuser && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                    <UserCircle className="w-3 h-3" />
                    Administrateur
                  </span>
                )}
                {profile?.is_verified && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    ✓ Vérifié
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Informations personnelles
            </h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={form.firstname}
                  onChange={(e) =>
                    setForm({ ...form, firstname: e.target.value })
                  }
                  placeholder="Votre prénom"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={form.lastname}
                  onChange={(e) =>
                    setForm({ ...form, lastname: e.target.value })
                  }
                  placeholder="Votre nom"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="votre.email@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full py-3 text-white font-semibold rounded-lg bg-main-gradient btn-gradient hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUpdatingProfile ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Mise à jour...
                </>
              ) : (
                "Mettre à jour le profil"
              )}
            </button>
          </form>
        </div>


        {/* Organisation */}
<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-green-100 rounded-lg">
      <Building2 className="w-5 h-5 text-green-600" />
    </div>
    <h2 className="text-lg font-semibold text-gray-900">Mon organisation</h2>
  </div>

  <form onSubmit={handleOrgUpdate} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
      <input
        type="text"
        value={orgForm.name}
        onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
      <textarea
        value={orgForm.description}
        onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
        rows={3}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
      />
    </div>
    <button type="submit" disabled={isUpdatingOrg}
      className="w-full py-3 text-white font-semibold rounded-lg bg-main-gradient btn-gradient hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
      {isUpdatingOrg
        ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Mise à jour...</>
        : "Mettre à jour l'organisation"
      }
    </button>
  </form>
</div>

{/* Carrousel */}
<OrganizationCarousel />

        {/* Sécurité - Mot de passe */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Sécurité</h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ancien mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.old_password}
                onChange={(e) =>
                  setPasswords({ ...passwords, old_password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.new_password}
                onChange={(e) =>
                  setPasswords({ ...passwords, new_password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwords.confirm_password}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirm_password: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUpdatingPassword ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Modification...
                </>
              ) : (
                "Changer le mot de passe"
              )}
            </button>
          </form>
        </div>
        {/* Zone dangereuse */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-red-700">
              Zone dangereuse
            </h2>
          </div>

          <p className="text-sm text-red-700 mb-4">
            ⚠️ La suppression de votre compte est{" "}
            <strong>définitive et irréversible</strong>. Toutes vos données
            seront perdues.
          </p>

          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer mon compte
          </button>
        </div>
      </div>
    </section>
  );
}
