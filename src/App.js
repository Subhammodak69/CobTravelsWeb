import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TravelProvider } from "./contexts/TravelContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import PackageDetailsPage from "./pages/PackageDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import CustomTourEnquiryPage from "./pages/CustomTourEnquiryPage";
import EnquiriesPage from "./pages/EnquiriesPage";
import TripsPage from "./pages/TripsPage";
import DocumentsPage from "./pages/DocumentsPage";
import WishlistPage from "./pages/WishlistPage";
import ReferralsPage from "./pages/ReferralsPage";
import ToursExplorePage from "./pages/ToursExplorePage";
import InviteLandingPage from "./pages/InviteLandingPage";
import { captureReferralFromUrl } from "./api";
import useVisitorTracking from "./hooks/useVisitorTracking";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import TermsOfServicePage from "./pages/TermsOfService";

import { useTravel } from "./contexts/TravelContext";


function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/invite";
  const hero = {
    "/documents": { image: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=2000&q=90", eyebrow: "Your travel files", title: "Travel,", accent: "organized.", alt: "Travel documents and planning" },
    "/wishlist": { image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2000&q=90", eyebrow: "Saved for later", title: "Journeys worth", accent: "keeping.", alt: "Scenic travel destination" },
    "/referrals": { image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=90", eyebrow: "Bring someone along", title: "Travel is better", accent: "together.", alt: "Friends travelling together" },
  }[location.pathname];
  return (
    <main>
      <Header />
      {hero && <section className="relative flex min-h-[320px] items-end overflow-hidden px-4 pb-14 pt-32 text-white sm:px-6 lg:px-12"><img className="absolute inset-0 h-full w-full object-cover" src={hero.image} alt={hero.alt} /><div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/30" /><div className="relative z-10 max-w-4xl animate-fade-up"><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">{hero.eyebrow}</p><h1 className="font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">{hero.title} <em className="text-amber-300">{hero.accent}</em></h1></div></section>}
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

function ReferralCapture() {
  const location = useLocation();
  useEffect(() => {
    // If not already on /invite page (which has its own dedicated rich landing UX)
    if (location.pathname !== "/invite") {
      const searchParams = new URLSearchParams(location.search);
      const encoded = searchParams.get("r") || searchParams.get("ref");
      if (encoded) {
        captureReferralFromUrl(encoded).finally(() => {
          searchParams.delete("r");
          searchParams.delete("ref");
          const remaining = searchParams.toString();
          window.history.replaceState({}, "", location.pathname + (remaining ? `?${remaining}` : "") + location.hash);
        });
      }
    }
  }, [location.search, location.pathname, location.hash]);
  return null;
}

function ProtectedRoute({ children }) {
  const { isMember, authReady } = useTravel();
  const location = useLocation();

  if (!authReady) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-slate-50 text-slate-500">
        <p>Loading your profile…</p>
      </div>
    );
  }

  if (!isMember) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { isMember, authReady } = useTravel();

  if (!authReady) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-slate-50 text-slate-500">
        <p>Checking authorization…</p>
      </div>
    );
  }

  if (isMember) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <>
      <VisitorTracking />
      <ReferralCapture />
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/tours" element={<Layout><ToursExplorePage /></Layout>} />
        <Route path="/journey/:id" element={<Layout><PackageDetailsPage /></Layout>} />
        <Route path="/custom-tour-enquiry" element={<Layout><CustomTourEnquiryPage /></Layout>} />
        <Route path="/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />
        <Route path="/terms-of-service" element={<Layout><TermsOfServicePage /></Layout>} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/my-enquiries" element={<ProtectedRoute><Layout><EnquiriesPage /></Layout></ProtectedRoute>} />
        <Route path="/my-trips" element={<ProtectedRoute><Layout><TripsPage /></Layout></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><Layout><DocumentsPage /></Layout></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Layout><WishlistPage /></Layout></ProtectedRoute>} />
        <Route path="/referrals" element={<ProtectedRoute><Layout><ReferralsPage /></Layout></ProtectedRoute>} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Layout>
                <AuthPage />
              </Layout>
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Layout>
                <AuthPage />
              </Layout>
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/invite"
          element={
            <Layout>
              <InviteLandingPage />
            </Layout>
          }
        />
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
