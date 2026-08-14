import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TravelProvider } from "./contexts/TravelContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import PackageDetailsPage from "./pages/PackageDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";
import "./animations.css";


function Layout({ children }) {
  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/home" element={<Layout><HomePage /></Layout>} />
      <Route path="/journey/:id" element={<Layout><PackageDetailsPage /></Layout>} />
      <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
      {/* Catch-all → splash */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
