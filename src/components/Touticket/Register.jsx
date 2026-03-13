import { useState, useRef } from "react";
import { Mail, Lock, Eye, EyeOff, Building, ImagePlus, X, ArrowLeft, Loader2 } from "lucide-react";
import logo from "@/assets/logo/touticket-logo.svg";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [coverPreview, setCoverPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    entityName: "",
    entityDescription: "",
    coverImage: null,
  });

  const [errors, setErrors] = useState({});

  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validateStep1 = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = "Requis";
    if (!formData.lastName.trim()) e.lastName = "Requis";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Email invalide";
    if (formData.password.length < 8) e.password = "8 caractères minimum";
    if (formData.password !== formData.confirmPassword) e.confirmPassword = "Les mots de passe ne correspondent pas";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    update("coverImage", file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeCover = () => {
    update("coverImage", null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (validateStep1()) setStep(2);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      navigate("/admin/dashboard");
    }, 1500);
  };

  const inputClass = (field) =>
    `w-full bg-white border ${errors[field] ? "border-red-400" : "border-gray-200"} rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-400 transition-colors duration-200`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-4">
                <img src={logo} alt="TOUTICKET" className="h-10 w-10 object-contain" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {step === 1 ? "Créer un compte" : "Votre organisation"}
              </h1>
              <p className="text-gray-400 text-xs">
                {step === 1 ? "Étape 1/2 — Informations personnelles" : "Étape 2/2 — Informations de l'organisation"}
              </p>

              {/* Progress */}
              <div className="flex gap-2 justify-center mt-4">
                <div className="h-1 w-16 rounded-full bg-main-gradient" />
                <div className={`h-1 w-16 rounded-full transition-colors duration-300 ${step === 2 ? "bg-main-gradient" : "bg-gray-200"}`} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ── STEP 1 ── */}
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1.5 block">Prénom</label>
                      <input
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => update("firstName", e.target.value)}
                        className={inputClass("firstName")}
                      />
                      {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1.5 block">Nom</label>
                      <input
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => update("lastName", e.target.value)}
                        className={inputClass("lastName")}
                      />
                      {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={`${inputClass("email")} pl-10`}
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => update("password", e.target.value)}
                        className={`${inputClass("password")} pl-10 pr-10`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Confirmer le mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => update("confirmPassword", e.target.value)}
                        className={`${inputClass("confirmPassword")} pl-10 pr-10`}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Nom de l'organisation</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        placeholder="Ex: ENA, EPAC, UAC..."
                        value={formData.entityName}
                        onChange={(e) => update("entityName", e.target.value)}
                        className={`${inputClass("entityName")} pl-10`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
                    <textarea
                      placeholder="Décrivez brièvement votre organisation..."
                      rows={3}
                      value={formData.entityDescription}
                      onChange={(e) => update("entityDescription", e.target.value)}
                      className={`${inputClass("entityDescription")} resize-none`}
                      required
                    />
                  </div>

                  {/* Cover image upload */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                      Photo de présentation
                    </label>

                    {coverPreview ? (
                      <div className="relative rounded-xl overflow-hidden aspect-video border border-gray-200">
                        <img src={coverPreview} alt="Aperçu" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <button
                          type="button"
                          onClick={removeCover}
                          className="absolute top-2 right-2 w-7 h-7 bg-white hover:bg-red-50 border border-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
                        >
                          <X className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <p className="absolute bottom-2 left-3 text-white text-xs drop-shadow">
                          {formData.coverImage?.name}
                        </p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-video border-2 border-dashed border-gray-200 hover:border-orange-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-orange-400 transition-all duration-200 group bg-gray-50 hover:bg-orange-50/30"
                      >
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 group-hover:border-orange-200 flex items-center justify-center transition-colors duration-200 shadow-sm">
                          <ImagePlus className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium">Cliquer pour uploader une image</span>
                        <span className="text-[10px] text-gray-300">JPG, PNG — max 5 MB</span>
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </div>

                  {/* Avantages */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-2">En créant votre organisation, vous pourrez :</p>
                    <ul className="space-y-1.5">
                      {["Créer des événements de vote", "Gérer vos candidats", "Suivre les votes et revenus"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-main-gradient flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center gap-2 w-12 h-11 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-400 hover:text-gray-600 transition-all duration-200 flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-11 rounded-lg bg-main-gradient btn-gradient disabled:opacity-60 text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Création...
                    </>
                  ) : step === 1 ? "Continuer" : "Créer mon organisation"}
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Déjà un compte ?{" "}
              <Link to="/touticket/admin/login" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}