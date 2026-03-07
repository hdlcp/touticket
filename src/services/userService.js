import api from "./api";

export const getUserProfile = () => api.get("api/user/profile").json();
export const updateUserProfile = (data) => api.put("api/user/profile/update", { json: data }).json();
export const updatePassword = (data) => api.put("api/user/password/update", { json: data }).json();
export const deleteAccount = () => api.delete("api/user/account/delete").json();
export const uploadAvatar = (formData) =>
  api.post("api/user/avatar/define", { body: formData }).json();
export const deleteAvatar = () =>
  api.delete("api/user/avatar/delete").json();

export const getAllUsers = async (params = {}) => {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page);
  if (params.per_page) searchParams.append('per_page', params.per_page);
  if (params.q) searchParams.append('q', params.q);
  if (params.q_email) searchParams.append('q_email', params.q_email);
  if (params.q_name) searchParams.append('q_name', params.q_name);
  if (params.q_username) searchParams.append('q_username', params.q_username);
  if (params.sort_field) searchParams.append('sort_field', params.sort_field);
  if (params.sort_direction) searchParams.append('sort_direction', params.sort_direction);
  
  return await api.get(`api/user/all?${searchParams.toString()}`).json();
};

export const deleteUser = async (userId) => {
  return await api.delete(`api/user/${userId}`).json();
};

export const addAdmin = async (data) => {
  try {
    return await api.post("api/user/admin/add", { json: data }).json();
  } catch (error) {
    const errorBody = await error.response?.json();
    console.log("📛 Erreur addAdmin détaillée:", errorBody);
    throw new Error(errorBody?.message || "Erreur ajout admin");
  }
};