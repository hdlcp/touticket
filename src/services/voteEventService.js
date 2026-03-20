import api from "./api";

export async function createVoteEvent(formFields, candidates, coverFile) {
  if (!coverFile) throw new Error("Une image de couverture est requise.");

  const data = new FormData();

  data.append("name",               formFields.name);
  data.append("description",        formFields.description);
  data.append("event_type_id",      formFields.event_type_id);
  data.append("started_at",         formFields.started_at);
  data.append("ended_at",           formFields.ended_at);
  data.append("place_maps_url",     formFields.mapsUrl);
  data.append("place_description",  formFields.locationDesc);
  data.append("minimum_vote_price", formFields.minVotePrice);
  data.append("cover",              coverFile);

  // ✅ Candidat + ses photos ensemble, dans le même ordre
 const candidatesStr = candidates
  .map((c) => JSON.stringify({
    firstname:   c.firstName,
    lastname:    c.lastName,
    field:       c.field,
    age:         Number(c.age),
    description: c.description,
  }))
  .join(",");

data.append("candidates", candidatesStr);

// Photos par candidat
candidates.forEach((candidate, index) => {
  candidate.photos?.forEach((photo) => {
    data.append(`candidate_photos_${index}`, photo);
  });
});

  console.log("📤 FormData final :");
  for (let [key, value] of data.entries()) {
    console.log(`  ${key}:`, value instanceof File ? value.name : value);
  }

  try {
    return await api.post("api/event/voting/create", { body: data }).json();
  } catch (error) {
    if (error.response) {
      const errBody = await error.response.json();
      console.error("❌ Erreur API :", JSON.stringify(errBody, null, 2));
    }
    throw error;
  }
}

export async function getPublicCandidateById(candidateId) {
  return await api.get(`api/candidate/${candidateId}/get`).json();
}