import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import useVisitorTracking from "./hooks/useVisitorTracking";

import { useTravel } from "./contexts/TravelContext";


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
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/journey/:id" element={<Layout><PackageDetailsPage /></Layout>} />
        <Route path="/custom-tour-enquiry" element={<Layout><CustomTourEnquiryPage /></Layout>} />

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
