import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import HowItWorks from "./pages/HowItWorks";
import ForPhotographers from "./pages/ForPhotographers";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import PhotographerDashboard from "./pages/Dashboard/PhotographerDashboard";
import ClientDashboard from "./pages/Dashboard/ClientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/for-photographers" element={<ForPhotographers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/photographer"
          element={
            <ProtectedRoute allowedRole="photographer">
              <PhotographerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/client"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;