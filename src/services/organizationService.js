// services/organizationService.js
import api from "./api";

export async function getAllOrganizations({ page = 1, perPage = 10, q = "" } = {}) {
  const params = { page, per_page: perPage };
  if (q) params.q = q;

  return await api.get("api/public/organization/all", { searchParams: params }).json();
}

export async function getOrganizationById(organizationId) {
  const res = await getAllOrganizations({ perPage: 100 });
  if (!res.success) throw new Error("Impossible de charger les organisations");
  const org = res.data.items.find((o) => o.id === organizationId);
  if (!org) throw new Error("Organisation introuvable");
  return { success: true, data: org };
}

export async function getOrganization() {
  return await api.get("api/user/organization/get").json();
}

export async function updateOrganization({ name, description }) {
  return await api.patch("api/user/organization/update", {
    json: { name, description },
  }).json();
}

export async function addOrganizationImage(file, description) {
  const data = new FormData();
  data.append("file", file);
  data.append("description", description);
  return await api.put("api/user/organization/image/add", { body: data }).json();
}

export async function deleteOrganizationImage(fileNames) {
  return await api.post("api/user/organization/image/delete", {
    json: { file_names: fileNames },
  }).json();
}