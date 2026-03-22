// services/apiError.js
export async function getApiErrorMessage(error, fallback = "Une erreur est survenue") {
  if (error?.response) {
    try {
      const body = await error.response.json();
      return body.message || fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}