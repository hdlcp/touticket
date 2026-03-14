// components/VoteEventForm.jsx
import { useState, useRef } from "react";
import { Calendar, Clock, MapPin, Upload, Save, X, Plus, Trash2 } from "lucide-react";
import { searchAddress } from "./EventForm";

export default function VoteEventForm({
  initialData = {},
  mode = "create",
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    event_type: initialData.event_type || "",
    locationDesc: initialData.locationDesc || "",
    addressInput: initialData.addressInput || "",
    startDate: initialData.startDate || "",
    startTime: initialData.startTime || "",
    endDate: initialData.endDate || "",
    endTime: initialData.endTime || "",
    minVotePrice: initialData.minVotePrice || "",
  });

  const [imagePreview, setImagePreview] = useState(initialData.image || null);
  const [images, setImages] = useState([]);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [candidates, setCandidates] = useState(initialData.candidates || []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddressChange = async (e) => {
    const value = e.target.value;
    setForm({ ...form, addressInput: value });
    if (value.length < 3) { setAddressSuggestions([]); return; }
    setIsSearching(true);
    try {
      const results = await searchAddress(value);
      setAddressSuggestions(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectAddress = (item) => {
    setForm({ ...form, addressInput: item.label });
    setAddressSuggestions([]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImages(files);
    setImagePreview(URL.createObjectURL(files[0]));
  };

  const removeImage = () => { setImagePreview(null); setImages([]); };

  // ── Candidates ──
  const addCandidate = () => {
    setCandidates([...candidates, {
      id: `tmp-${Date.now()}`,
      firstName: "", lastName: "", field: "", age: "",
      description: "", photos: [], photoPreviews: [],
    }]);
  };

  const removeCandidate = (id) => setCandidates(candidates.filter(c => c.id !== id));

  const updateCandidate = (id, field, value) =>
    setCandidates(candidates.map(c => c.id === id ? { ...c, [field]: value } : c));

  const handleCandidatePhoto = (id, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const previews = files.map(f => URL.createObjectURL(f));
    setCandidates(candidates.map(c =>
      c.id === id ? { ...c, photos: files, photoPreviews: previews } : c
    ));
  };

  const removeCandidatePhoto = (candidateId, photoIndex) => {
    setCandidates(candidates.map(c => {
      if (c.id !== candidateId) return c;
      const photos = c.photos.filter((_, i) => i !== photoIndex);
      const photoPreviews = c.photoPreviews.filter((_, i) => i !== photoIndex);
      return { ...c, photos, photoPreviews };
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    images.forEach(f => formData.append("images", f));
    await onSubmit(formData, candidates);
  };

  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4";
  const inputClass = "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500";
  const labelClass = "text-sm font-medium text-gray-700 mb-1 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">

      {/* ── Infos générales ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Informations de l'événement</h2>
          <p className="text-sm text-gray-400">Tous les champs marqués * sont obligatoires</p>
        </div>

        {/* Nom */}
        <div>
          <label className={labelClass}>Nom de l'événement *</label>
          <input name="name" value={form.name} onChange={handleChange}
            className={inputClass} placeholder="Ex: Miss ENA 2026" required />
        </div>

        {/* Type */}
        <div>
          <label className={labelClass}>Type d'événement *</label>
          <select name="event_type" value={form.event_type} onChange={handleChange}
            className={inputClass} required>
            <option value="">Choisissez le type</option>
            <option value="Miss">Élection Miss</option>
            <option value="Mister">Élection Mister</option>
            <option value="Talent">Concours de talents</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        {/* Image */}
        <div>
          <label className={labelClass}>Image de couverture *</label>
          <div className="space-y-3">
            {imagePreview && (
              <div className="relative w-full h-48 border-2 border-gray-200 rounded-lg overflow-hidden">
                <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                <button type="button" onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors">
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <input type="file" id="coverUpload" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <label htmlFor="coverUpload"
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition-colors w-full justify-center">
                <Upload size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">
                  {imagePreview ? "Changer l'image" : "Cliquer pour uploader"}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            rows={4} className={inputClass} required />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Date de début *",  name: "startDate", type: "date",  icon: true },
            { label: "Heure de début *", name: "startTime", type: "time",  icon: false },
            { label: "Date de fin *",    name: "endDate",   type: "date",  icon: true },
            { label: "Heure de fin *",   name: "endTime",   type: "time",  icon: false },
          ].map(({ label, name, type, icon }) => (
            <div key={name}>
              <label className={labelClass}>{label}</label>
              <div className="relative">
                {icon ? <Calendar className={iconClass} /> : <Clock className={iconClass} />}
                <input type={type} name={name} value={form[name]} onChange={handleChange}
                  className={`${inputClass} pl-10`} required />
              </div>
            </div>
          ))}
        </div>

        {/* Adresse GPS */}
        <div className="relative">
          <label className={labelClass}>Adresse complète (GPS) *</label>
          <input name="addressInput" value={form.addressInput} onChange={handleAddressChange}
            className={inputClass} placeholder="Ex: Palais des Congrès, Cotonou, Bénin" required />
          {isSearching && <p className="text-xs text-gray-400 mt-1">Recherche...</p>}
          {addressSuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full rounded-md mt-1 shadow-lg max-h-56 overflow-auto">
              {addressSuggestions.map((item, i) => (
                <li key={i} onClick={() => handleSelectAddress(item)}
                  className="px-3 py-2 text-sm hover:bg-orange-50 cursor-pointer border-b last:border-b-0">
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Lieu description */}
        <div>
          <label className={labelClass}>Description du lieu *</label>
          <div className="relative">
            <MapPin className={iconClass} />
            <input name="locationDesc" value={form.locationDesc} onChange={handleChange}
              className={`${inputClass} pl-10`} placeholder="Ex: Amphithéâtre ENA, Cotonou" required />
          </div>
        </div>

        {/* Prix minimum du vote */}
        <div>
          <label className={labelClass}>Prix minimum du vote (FCFA) *</label>
          <input type="number" name="minVotePrice" value={form.minVotePrice} onChange={handleChange}
            className={inputClass} placeholder="500" min="1" required />
        </div>
      </div>

      {/* ── Candidates ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Candidates</h2>
            <p className="text-sm text-gray-400">Ajoutez les candidates participant à l'événement</p>
          </div>
          <button type="button" onClick={addCandidate}
            className="flex items-center gap-2 border border-orange-500 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Plus size={16} />
            Ajouter
          </button>
        </div>

        {candidates.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
            <p className="text-sm text-gray-400">
              Aucune candidate. Cliquez sur "Ajouter" pour commencer.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {candidates.map((candidate, index) => (
              <div key={candidate.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50 relative">

                {/* Header candidate */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">Candidate #{index + 1}</h3>
                  <button type="button" onClick={() => removeCandidate(candidate.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Prénom + Nom */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Prénom *</label>
                      <input value={candidate.firstName}
                        onChange={e => updateCandidate(candidate.id, "firstName", e.target.value)}
                        className={inputClass} placeholder="Prénom" required />
                    </div>
                    <div>
                      <label className={labelClass}>Nom *</label>
                      <input value={candidate.lastName}
                        onChange={e => updateCandidate(candidate.id, "lastName", e.target.value)}
                        className={inputClass} placeholder="Nom" required />
                    </div>
                  </div>

                  {/* Filière + Âge */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Filière / Domaine *</label>
                      <input value={candidate.field}
                        onChange={e => updateCandidate(candidate.id, "field", e.target.value)}
                        className={inputClass} placeholder="Ex: Administration Publique" required />
                    </div>
                    <div>
                      <label className={labelClass}>Âge *</label>
                      <input type="number" value={candidate.age}
                        onChange={e => updateCandidate(candidate.id, "age", e.target.value)}
                        className={inputClass} placeholder="22" min="1" required />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className={labelClass}>Description *</label>
                    <textarea value={candidate.description}
                      onChange={e => updateCandidate(candidate.id, "description", e.target.value)}
                      rows={3} className={inputClass} placeholder="Courte biographie..." required />
                  </div>

                  {/* Photos */}
                  <div>
                    <label className={labelClass}>Photos *</label>
                    <div className="flex flex-wrap gap-3">
                      {/* Aperçus */}
                      {candidate.photoPreviews?.map((preview, i) => (
                        <div key={i} className="relative w-20 h-24 rounded-lg overflow-hidden border border-gray-200">
                          <img src={preview} alt={`Photo ${i+1}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeCandidatePhoto(candidate.id, i)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600">
                            <X size={10} />
                          </button>
                        </div>
                      ))}

                      {/* Bouton upload */}
                      {(candidate.photoPreviews?.length || 0) < 3 && (
                        <>
                          <input type="file" id={`photos-${candidate.id}`} accept="image/*"
                            multiple onChange={e => handleCandidatePhoto(candidate.id, e)} className="hidden" />
                          <label htmlFor={`photos-${candidate.id}`}
                            className="w-20 h-24 border-2 border-dashed border-gray-300 hover:border-orange-400 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-orange-50 transition-colors">
                            <Upload size={16} className="text-gray-400" />
                            <span className="text-[10px] text-gray-400">Photo</span>
                          </label>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Maximum 3 photos par candidate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="grid grid-cols-2 gap-4 pb-8">
        <button type="button" onClick={() => window.history.back()}
          className="border border-gray-300 shadow-sm hover:bg-gray-50 px-6 py-2.5 rounded-lg text-gray-700 font-medium transition-colors">
          Annuler
        </button>
        <button type="submit" disabled={loading}
          className="bg-main-gradient btn-gradient flex gap-2 items-center justify-center text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-60">
          <Save className="w-4 h-4" />
          {loading ? "Enregistrement..." : "Créer l'événement"}
        </button>
      </div>
    </form>
  );
}
