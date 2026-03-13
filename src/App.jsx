import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./components/Touticket/PublicLayout";

// Pages publiques
import Checkaccount from "./components/BackOffice/Checkaccount";
import ForgotPassword from "./components/BackOffice/ForgotPassword";
import Login from "./components/BackOffice/Login";
import SetPassword from "./components/BackOffice/SetPassword";
import DetailEvent from "./components/DetailEvent";
import Home from "./components/Home";
import TicketSearch from "./components/TicketSearch";

// Pages publiques Touticket
import HomePage from "./components/Touticket/Home";
import Register from "./components/Touticket/Register";
import LoginTouticket from "./components/Touticket/Login";
import ForgotPasswordPage from "./components/Touticket/ForgotPasswordPage";
import EntityPage from "./components/Touticket/EntityPage";
import VoteDetail from "./components/Touticket/VoteDetail";
import CandidatePage from "./components/Touticket/CandidatePage";



// Pages admin
import AdminAccount from "./components/BackOffice/AdminAccount";
import CreateEvent from "./components/BackOffice/CreateEvent";
import Dashboard from "./components/BackOffice/Dashboard";
import EditEvent from "./components/BackOffice/EditEvent";
import QRScanner from "./components/BackOffice/QRScanner";
import StatisticPages from "./components/BackOffice/StatisticPages";
import User from "./components/BackOffice/Users";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />

      <Routes>
        {/* 🌍 ROUTES PUBLIQUES */}
        <Route element={<PublicLayout />}>
          <Route path="/"  element={<HomePage />}  />
          <Route path="/event/:eventId" element={<DetailEvent />} />
          <Route path="/tickets" element={<TicketSearch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/checkaccount" element={<Checkaccount />} />
          {/* Route pour Touticket */}
          <Route path="/touticket" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/touticket/admin/login" element={<LoginTouticket />} />
          <Route path="/touticket/admin/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/entity/:entityId" element={<EntityPage />} />
          <Route path="/vote/:id" element={<VoteDetail />} />
          <Route path="/entity/:entitySlug/event/:eventId/candidate/:candidateId" element={<CandidatePage />} />

          


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
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/admin/account" element={<AdminAccount />} />
          <Route path="/qr-scanner" element={<QRScanner />} />
          <Route path="/admin/users" element={<User />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
