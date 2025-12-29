import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PartnerRegister from "./pages/PartnerRegister";
import Feed from "./pages/Feed";
import Saved from "./pages/Saved";
import FoodPartnerProfile from "./pages/FoodPartnerProfile";
import PartnerDashboard from "./pages/PartnerDashboard";
import PartnerUpload from "./pages/PartnerUpload";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/food-partner/register" element={<PartnerRegister />} />

            {/* User Protected Routes */}
            <Route
              path="/feed"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <Feed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <Saved />
                </ProtectedRoute>
              }
            />
            <Route
              path="/food-partner/:id"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <FoodPartnerProfile />
                </ProtectedRoute>
              }
            />

            {/* Food Partner Protected Routes */}
            <Route
              path="/partner/dashboard"
              element={
                <ProtectedRoute allowedRoles={['foodPartner']}>
                  <PartnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/partner/upload"
              element={
                <ProtectedRoute allowedRoles={['foodPartner']}>
                  <PartnerUpload />
                </ProtectedRoute>
              }
            />

            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
