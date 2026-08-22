import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { TravelProvider } from "./contexts/TravelContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import PackageDetailsPage from "./pages/PackageDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import SignupPage from "./pages/SignupPage";
import useVisitorTracking from "./hooks/useVisitorTracking";
import { useTravel } from "./contexts/TravelContext";
import "./App.css";
import "./animations.css";
import "./mobile-theme.css";
import "./redesign.css";


function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  return (
    <main>
      <Header />
      {children}
      {!isAuthPage && <Footer />}
    </main>
  );
}

function VisitorTracking() {
  const { user, authReady } = useTravel();
  useVisitorTracking({ customerId: user?.id || "", ready: authReady });
  return null;
}

function AppRoutes() {
  return (
    <>
      <VisitorTracking />
      <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/journey/:id" element={<Layout><PackageDetailsPage /></Layout>} />
      <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
      <Route path="/login" element={<Layout><AuthPage /></Layout>} />
      <Route path="/signup" element={<Layout><AuthPage /></Layout>} />
      <Route path="/signup" element={<Layout><SignupPage /></Layout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TravelProvider>
        <AppRoutes />
      </TravelProvider>
    </BrowserRouter>
  );
}
