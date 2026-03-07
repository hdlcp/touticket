import api from "./api";

export const createTicket = async (data) => {
  try {
    return await api.post("api/ticket/create", { json: data }).json();
  } catch (error) {
    const errorBody = await error.response?.json();
    console.log("📛 Erreur ticket détaillée:", errorBody);
    throw new Error(errorBody?.message || "Erreur ticket 500");
  }
};
export const updateTicket = async (ticketId, ticketData) => {
  return await api.put(`api/ticket/${ticketId}/update`, {
    json: ticketData,
  }).json();
};

export const deleteTicket = async (ticketId) => {
  return await api.delete(`api/ticket/${ticketId}/delete`).json();
};

// Étape 1 : Demander le code de vérification
export const requestVerificationCode = async (email) => {
   return await api.post('api/public/ticket-code-request', {
        json: { email }
      }).json();
  };

    // Étape 2 : Récupérer tous les tickets avec le code
  export const getAllTickets = async (email, code) => {
     return await api.post('api/purchase/all', {
        json: { email, code }
      }).json();  
  };
