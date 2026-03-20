import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/Touticket/AdminLayout";
import PublicLayout from "./components/Touticket/PublicLayout";

// Pages publiques
import SetPassword from "./components/Touticket/SetPassword";
import DetailEvent from "./components/DetailEvent";
import TicketSearch from "./components/TicketSearch";

// Pages publiques Touticket
import CandidatePage from "./components/Touticket/CandidatePage";
import Checkaccount from "./components/Touticket/Checkaccount";
import CreateEventPage from "./components/Touticket/CreateEventPage";
import DasboardTouticket from "./components/Touticket/Dashboard";
import EntityPage from "./components/Touticket/EntityPage";
import EventStatContainer from "./components/Touticket/EventStatContainer";
import ForgotPasswordPage from "./components/Touticket/ForgotPasswordPage";
import HomePage from "./components/Touticket/Home";
import LoginTouticket from "./components/Touticket/Login";
import Register from "./components/Touticket/Register";
import VoteDetail from "./components/Touticket/VoteDetail";

// Pages admin
import Dashboard from "./components/BackOffice/Dashboard";
import EditEvent from "./components/BackOffice/EditEvent";
import QRScanner from "./components/BackOffice/QRScanner";
import StatisticPages from "./components/BackOffice/StatisticPages";
import User from "./components/BackOffice/Users";
import AdminAccount from "./components/Touticket/TouticketComponents/AdminAccount";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />

      <Routes>
        {/* 🌍 ROUTES PUBLIQUES */}
         <Route path="/" element={<HomePage />} />
        <Route element={<PublicLayout />}>
          <Route path="/event/:eventId" element={<DetailEvent />} />
          <Route path="/tickets" element={<TicketSearch />} />
       
          {/* Route pour Touticket */}
          <Route path="/checkaccount" element={<Checkaccount />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginTouticket />} />
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          />
            <Route path="/set-password" element={<SetPassword />} />
          <Route path="/entity/:organizationId" element={<EntityPage />} />
          <Route path="/vote/:id" element={<VoteDetail />} />
          <Route
            path="/vote/:eventId/candidate/:candidateId"
            element={<CandidatePage />}
          />
        </Route>

        {/* 🔐 ROUTES ADMIN (protégées) */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/statistics/:eventId" element={<StatisticPages />} />
          <Route path="/edit-event/:eventId" element={<EditEvent />} />
          <Route path="/admin/account" element={<AdminAccount />} />
          <Route path="/qr-scanner" element={<QRScanner />} />
          <Route path="/admin/users" element={<User />} />

          {/* Route pour Touticket */}
          <Route path="/touticket/dashboard" element={<DasboardTouticket />} />
          <Route
            path="/touticket/dashboard/event/:eventId/statistics"
            element={<EventStatContainer />}
          />
          <Route path="/create-event" element={<CreateEventPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
