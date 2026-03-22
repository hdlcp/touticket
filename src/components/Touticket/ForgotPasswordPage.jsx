import { useState } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import logo from "@/assets/logo/touticket-logo.svg";
import { useNavigate, Link } from "react-router-dom";
import { forgotPasswordRequest } from "@/services/authService";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/services/apiError";

export default function ForgotPasswordPage() {
  const navigate  = useNavigate();
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const validate = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Adresse email invalide");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await forgotPasswordRequest(email); // ✅ appel API
      setSent(true);
    } catch (err) {
      const message = await getApiErrorMessage(err, "Erreur lors de l'envoi");
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

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
                {sent ? "Email envoyé !" : "Mot de passe oublié ?"}
              </h1>
              <p className="text-gray-400 text-xs">
                {sent
                  ? `Un code de réinitialisation a été envoyé à ${email}`
                  : "Entrez votre email pour recevoir un code de réinitialisation"}
              </p>
            </div>

            {/* ── État succès ── */}
            {sent ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-100 rounded-xl p-5 flex flex-col items-center gap-3 text-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Vérifiez votre boîte mail</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Le code expirera dans 30 minutes. Pensez à vérifier vos spams.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => { setEmail(""); setSent(false); }}
                  className="w-full h-11 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 text-sm font-medium transition-all duration-200"
                >
                  Utiliser un autre email
                </button>

                {/* ✅ Redirige vers /set-password avec l'email */}
                <button
                  onClick={() => navigate("/set-password", { state: { email } })}
                  className="w-full h-11 rounded-lg bg-main-gradient btn-gradient text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Entrer le code reçu
                </button>
              </div>
            ) : (
              /* ── Formulaire ── */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Adresse e-mail"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      className={`w-full bg-white border ${error ? "border-red-400" : "border-gray-200"} rounded-lg px-4 py-2.5 pl-10 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-400 transition-colors duration-200`}
                    />
                  </div>
                  {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-lg bg-main-gradient btn-gradient disabled:opacity-60 text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : "Envoyer le code"}
                  </button>

                  <Link
                    to="/login"
                    className="w-full h-11 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la connexion
                  </Link>
                </div>
              </form>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}