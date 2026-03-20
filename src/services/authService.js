import api  from "./api";



export const loginRequest = async (credential, password) => {
  return await api.post("api/auth/signin", {
    json: { credential, password },
  }).json();
  
};


export const activateAccount = async (email, otp) => {
  return await api.post("api/auth/account/activate", {
    json: { email, otp_code: Number(otp) },
  }).json();
};

export const forgotPasswordRequest = async (email) => {
  return await api.post("api/auth/password/forgot", {
    json: { email },
  }).json();
};

// services/authService.js
export const resetPasswordRequest = async (email, otp_code, new_password, confirm_new_password) => {
  try {
    return await api.post("api/auth/password/reset", {
      json: {
        email,
        otp_code,
        new_password,
        confirm_new_password,
      },
    }).json();
  } catch (error) {
    // ✅ Lire le message exact de l'API
    if (error.response) {
      const errBody = await error.response.json().catch(() => ({}));
      console.error("❌ Erreur API reset password:", JSON.stringify(errBody, null, 2));
    }
    throw error;
  }
};

// services/authService.js
// services/authService.js
export async function signupRequest(formData) {
  try {
    return await api.post("api/auth/signup", { body: formData }).json();
  } catch (error) {
    if (error.response) {
      const errBody = await error.response.json().catch(() => ({}));
      console.error("❌ Erreur signup:", JSON.stringify(errBody, null, 2));
    }
    throw error;
  }
}