import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import SplashScreen from "@/components/SplashScreen";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Events from "./pages/Events";
import Downloads from "./pages/Downloads";
import PressReleases from "./pages/PressReleases";
import Notice from "./pages/Notice";
import Membership from "./pages/Membership";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import VerifyEmail from "./pages/VerifyEmail";
import EventRegistration from "./pages/EventRegistration";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import AdminScanner from "./pages/AdminScanner";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type Props = { isAdminHost?: boolean };

const App = ({ isAdminHost = false }: Props) => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      {isAdminHost ? (
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
              <BrowserRouter>
                <Routes>
                  {isAdminHost && <Route path="/auth" element={<Auth />} />}
                  {isAdminHost && <Route path="/verify-email" element={<VerifyEmail />} />}
                  <Route
                    path="*"
                    element={
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/programs" element={<Programs />} />
                          <Route path="/events" element={<Events />} />
                          <Route path="/events/:id/register" element={<EventRegistration />} />
                          <Route path="/events/:id/register/success" element={<RegistrationSuccess />} />
                          <Route path="/downloads" element={<Downloads />} />
                          <Route path="/press-releases" element={<PressReleases />} />
                          <Route path="/notice" element={<Notice />} />
                          <Route path="/membership" element={<Membership />} />
                          {isAdminHost && <Route path="/admin" element={<Admin />} />}
                          {isAdminHost && <Route path="/admin/scan" element={<AdminScanner />} />}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Layout>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      ) : (
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
            <BrowserRouter>
              <Routes>
                <Route
                  path="*"
                  element={
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/programs" element={<Programs />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/events/:id/register" element={<EventRegistration />} />
                        <Route path="/events/:id/register/success" element={<RegistrationSuccess />} />
                        <Route path="/downloads" element={<Downloads />} />
                        <Route path="/press-releases" element={<PressReleases />} />
                        <Route path="/notice" element={<Notice />} />
                        <Route path="/membership" element={<Membership />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      )}
    </QueryClientProvider>
  );
};

export default App;