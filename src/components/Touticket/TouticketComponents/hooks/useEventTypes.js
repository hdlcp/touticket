// hooks/useEventTypes.js
import { useState, useEffect } from "react";
import { getEventTypes } from "@/services/eventTypeService";

export function useEventTypes() {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventTypes()
      .then((res) => {
        if (res.success) setEventTypes(res.data.event_types_data);
      })
      .catch((e) => console.error("Erreur chargement types:", e))
      .finally(() => setLoading(false));
  }, []);

  return { eventTypes, loading };
}