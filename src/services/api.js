import ky from "ky";
import { toast } from "react-hot-toast";

const api = ky.create({
  prefixUrl: " https://epac-events.alwaysdata.net",
  // ❌ NE PAS mettre Content-Type ici globalement
  // Ky le gère automatiquement selon le type de body
  hooks: {
    beforeRequest: [
      request => {
        const token = localStorage.getItem("token");

        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
        
        // 🔥 Ne mettre Content-Type: application/json QUE si ce n'est pas du FormData
        const body = request.body;
        const isFormData = body instanceof FormData;
        
        if (!isFormData && !request.headers.has("Content-Type")) {
          request.headers.set("Content-Type", "application/json");
        }
      }
    ],

    afterResponse: [
      async (request, options, response) => {
        // 🔥 Gérer les 401 Unauthorized
        if (response.status === 401) {
          console.warn('🔒 Session expirée ou token invalide');
          
          // Supprimer le token
          localStorage.removeItem("token");
          
          // Afficher un message
          toast.error("Session expirée. Veuillez vous reconnecter.");
          
          // Rediriger vers login après un court délai
          setTimeout(() => {
            if (!window.location.pathname.includes('/login')) {
              window.location.href = "/login";
            }
          }, 500);
        }
        
        return response;
      }
    ]
  }
});

export default api;