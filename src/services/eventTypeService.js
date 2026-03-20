// services/eventTypeService.js
import api from "./api";

export async function getEventTypes() {
  return await api.get("api/event-type/all").json();
}