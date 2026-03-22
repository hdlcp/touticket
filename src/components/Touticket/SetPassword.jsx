import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import logo from "@/assets/logo/touticket-logo.svg";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPasswordRequest } from "@/services/authService";
import { validatePassword, PasswordCriteria } from "./TouticketComponents/PasswordCriteria";
import { getApiErrorMessage } from "@/services/apiError";

export default function SetPassword() {
  const [showPassword, setShowPassword]         = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [otp, setOtp]                           = useState("");
  const [password, setPassword]                 = useState("");
  const [newPassword, setNewPassword]           = useState("");
  const [loading, setLoading]                   = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = location.state?.email;

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!otp.trim()) { toast.error("Veuillez entrer le code !"); return; }

  const passwordError = validatePassword(password);
  if (passwordError) { toast.error(passwordError); return; }

  if (password !== newPassword) { toast.error("Les mots de passe ne correspondent pas !"); return; }
  if (!email) { toast.error("Erreur email, recommencez le processus !"); return; }

  setLoading(true);
  try {
    await resetPasswordRequest(email, Number(otp), password, newPassword);
    toast.success("Mot de passe réinitialisé avec succès !");
    navigate("/login");
  } catch (error) {
    const message = await getApiErrorMessage(error, "Erreur lors de la réinitialisation");
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-400 transition-colors duration-200";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-4">
                <img src={logo} alt="TOUTICKET" className="h-8 w-8 object-contain" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                Réinitialiser le mot de passe
              </h1>
              <p className="text-gray-400 text-xs">
                Entrez le code reçu par email et définissez votre nouveau mot de passe
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Code OTP */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Code de vérification
                </label>
                <input
                  type="text"
                  placeholder="Entrez le code reçu"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={`${inputClass} tracking-widest text-center`}
                  required
                />
              </div>

              {/* Nouveau mot de passe */}
<div>
  <label className="text-xs font-medium text-gray-600 mb-1.5 block">
    Nouveau mot de passe
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="••••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className={`${inputClass} pr-10`}
      required
    />
    <button type="button" onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  </div>

  {/* ✅ Critères visuels */}
  <PasswordCriteria password={password} />
</div>

              {/* Confirmer mot de passe */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`${inputClass} pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-lg bg-main-gradient btn-gradient disabled:opacity-60 text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Réinitialisation...
                    </>
                  ) : "Réinitialiser le mot de passe"}
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Retour à la{" "}
              <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
                connexion
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}