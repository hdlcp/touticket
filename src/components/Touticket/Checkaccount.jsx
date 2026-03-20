import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { activateAccount } from "@/services/authService.js";
import logo from "@/assets/logo/touticket-logo.svg";

export default function AccountVerification() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || sessionStorage.getItem("auth_email");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Veuillez entrer le code reçu !");
      return;
    }

    setLoading(true);
    try {
      const res = await activateAccount(email, otp);
      const token = res.data?.access_token;

      if (token) {
        localStorage.setItem("token", token);
        sessionStorage.removeItem("auth_email");
        toast.success("Compte vérifié avec succès 🎉");
        navigate("/touticket/dashboard");
      } else {
        toast.error("Code incorrect ou expiré.");
      }
    } catch (error) {
      toast.error(error?.message || "Code incorrect !");
    } finally {
      setLoading(false);
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
                Vérification du compte
              </h1>
              <p className="text-gray-400 text-xs">
                Un code de vérification a été envoyé à{" "}
                <span className="font-medium text-gray-600">{email || "votre email"}</span>
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Code de vérification
                </label>
                <input
                  type="text"
                  placeholder="Entrez le code reçu"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-400 transition-colors duration-200 tracking-widest text-center"
                  required
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors"
                >
                  Renvoyer le code
                </button>
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
                      Vérification...
                    </>
                  ) : "Vérifier le code"}
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              © 2025 Touticket. Tous droits réservés.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}