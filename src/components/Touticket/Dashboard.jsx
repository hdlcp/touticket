import { useState } from "react";
import DashboardPage from "./TouticketComponents/DashboardPage";

import {
  ticketStats,
  voteStats,
  ticketEvents,
  voteEvents,
  eventPrices
} from "./TouticketComponents/dashboardData";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardPage
      concertStats={ticketStats}
      voteStats={voteStats}
      concertEvents={ticketEvents}
      voteEvents={voteEvents}
      eventPrices={eventPrices}
      onEventClick={(id) => navigate(`/event/${id}`)}
      onEventEdit={(id) => navigate(`/edit-event/${id}`)}
      onEventDelete={(id) => console.log("delete", id)}
    />
  );
}