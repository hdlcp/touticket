import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import logo from "@/assets/logo/touticket-logo.svg";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "@/services/authService";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginRequest(email, password);

      if (res?.access_token) {
        localStorage.setItem("token", res.access_token);
        toast.success("Connexion réussie !");
        navigate("/touticket/dashboard");
        return;
      }

      toast("Connexion réussie. Veuillez vérifier votre identité en renseignant le code reçu par mail.");
      sessionStorage.setItem("auth_email", email);
      navigate("/Checkaccount", { state: { email } });

    } catch (err) {
      toast.error("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-400 transition-colors duration-200`;

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
              <h1 className="text-xl font-bold text-gray-900 mb-1">Connexion Organisateur</h1>
              <p className="text-gray-400 text-xs">Accédez à votre espace de gestion</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Adresse e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pl-10 pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300 accent-orange-500" />
                  Se souvenir de moi
                </label>
                <Link to="/forgot-password" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
                  Mot de passe oublié ?
                </Link>
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
                      Connexion...
                    </>
                  ) : "Se connecter"}
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
                Créer une organisation
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}