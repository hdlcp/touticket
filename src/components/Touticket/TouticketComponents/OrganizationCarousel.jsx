// components/OrganizationCarousel.jsx
import { useState, useRef, useEffect } from "react";
import { ImagePlus, Trash2, Upload, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getOrganization,
  addOrganizationImage,
  deleteOrganizationImage,
  updateOrganization,
} from "@/services/organizationService";
import { compressImage, validateImageFile } from "./hooks/compressImage";

export default function OrganizationCarousel() {
  const [org, setOrg]                 = useState(null);
  const [loading, setLoading]         = useState(true);
  const [uploading, setUploading]     = useState(false);
  const [deletingName, setDeletingName] = useState(null);
  const [preview, setPreview]         = useState(null);
  const [file, setFile]               = useState(null);
  const [description, setDescription] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const fileInputRef                  = useRef(null);

  useEffect(() => { fetchOrg(); }, []);

  async function fetchOrg() {
    setLoading(true);
    try {
      const res = await getOrganization();
      if (res.success) setOrg(res.data);
    } catch (e) {
      console.error("Erreur:", e);
    } finally {
      setLoading(false);
    }
  }

  const images = org?.images || [];

  async function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    const { valid, error } = validateImageFile(selected, 5);
    if (!valid) { toast.error(error); e.target.value = ""; return; }
    const compressed = await compressImage(selected);
    setFile(compressed);
    setPreview(URL.createObjectURL(compressed));
  }

  function removePreview() {
    setFile(null); setPreview(null); setDescription("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) { toast.error("Veuillez sélectionner une image"); return; }
    if (!description.trim()) { toast.error("Veuillez entrer une description"); return; }
    setUploading(true);
    try {
      const res = await addOrganizationImage(file, description);
      if (res.success) {
        toast.success("Image ajoutée !");
        removePreview();
        await fetchOrg();
        setCurrentSlide(images.length); // aller à la nouvelle image
      } else {
        toast.error(res.message || "Erreur lors de l'ajout");
      }
    } catch (e) {
      if (e.response) {
        const err = await e.response.json().catch(() => ({}));
        toast.error(err.message || "Erreur");
      } else {
        toast.error("Erreur de connexion");
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(imageName) {
    if (!window.confirm("Supprimer cette image du carrousel ?")) return;
    setDeletingName(imageName);
    try {
      const res = await deleteOrganizationImage([imageName]);
      if (res.success) {
        toast.success("Image supprimée !");
        await fetchOrg();
        setCurrentSlide((p) => Math.max(0, p - 1));
      } else {
        toast.error(res.message || "Erreur lors de la suppression");
      }
    } catch (e) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingName(null);
    }
  }

  const prevSlide = () => setCurrentSlide((p) => (p - 1 + images.length) % images.length);
  const nextSlide = () => setCurrentSlide((p) => (p + 1) % images.length);

  if (loading) return (
    <div className="flex items-center justify-center h-40 bg-gray-50 rounded-xl">
      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <ImagePlus className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Carrousel</h2>
          <p className="text-xs text-gray-400">Images affichées sur votre page publique</p>
        </div>
      </div>

      {/* Carrousel existant */}
      {images.length > 0 ? (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100">
            <img
              src={images[currentSlide]?.url}
              alt={images[currentSlide]?.description}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Description */}
            <h1 className="absolute inset-0 flex items-center justify-center text-white px-4 sm:px-8 font-display text-xl sm:text-3xl md:text-5xl lg:text-6xl text-center leading-tight">
  {images[currentSlide]?.description}
</h1>

            {/* Supprimer */}
            <button
              onClick={() => handleDelete(images[currentSlide]?.name)}
              disabled={deletingName === images[currentSlide]?.name}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors disabled:opacity-60"
            >
              {deletingName === images[currentSlide]?.name
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Trash2 className="w-3.5 h-3.5" />
              }
            </button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Compteur */}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
              {currentSlide + 1} / {images.length}
            </div>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentSlide ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <ImagePlus className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-sm text-gray-400">Aucune image dans le carrousel</p>
        </div>
      )}

      {/* Formulaire ajout */}
      <form onSubmit={handleUpload} className="space-y-4 border-t border-gray-100 pt-5">
        <h3 className="text-sm font-semibold text-gray-700">Ajouter une image</h3>

        {preview ? (
          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
            <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
            <button type="button" onClick={removePreview}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors">
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <input type="file" ref={fileInputRef} accept="image/*"
              onChange={handleFileChange} className="hidden" id="carouselUpload" />
            <label htmlFor="carouselUpload"
              className="flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-gray-200 hover:border-orange-400 hover:bg-orange-50/30 rounded-xl cursor-pointer transition-all group">
              <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-orange-50 border border-gray-200 group-hover:border-orange-200 flex items-center justify-center transition-colors">
                <Upload className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
              </div>
              <span className="text-xs font-medium text-gray-500 group-hover:text-orange-500">Cliquer pour uploader</span>
              <span className="text-[10px] text-gray-300">JPG, PNG — max 5 MB</span>
            </label>
          </>
        )}

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description *</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Cérémonie de remise de diplômes 2026"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
          />
        </div>

        <button type="submit" disabled={uploading || !file || !description.trim()}
          className="w-full h-11 rounded-lg bg-main-gradient btn-gradient disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2">
          {uploading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</>
            : <><ImagePlus className="w-4 h-4" /> Ajouter au carrousel</>
          }
        </button>
      </form>
    </div>
  );
}