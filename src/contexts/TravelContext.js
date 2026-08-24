import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMe, getAccessToken, refreshSession, logout, setOnUnauthorized } from "../api";

const TravelContext = createContext(null);

export function TravelProvider({ children }) {
  const navigate = useNavigate();
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [status, setStatus] = useState("unknown"); // "unknown" | "authenticated" | "anonymous"
  const [isMember, setIsMember] = useState(false);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const authBootstrapRef = useRef(false);

  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      setIsMember(false);
      setStatus("anonymous");
    });
  }, []);

  const refreshUser = async () => {
    try {
      let token = getAccessToken();
      if (!token) {
        const ok = await refreshSession();
        if (ok) token = getAccessToken();
      }
      if (token) {
        try {
          const r = await fetchMe();
          const userData = r?.data?.user || r?.data || null;
          setUser(userData);
          setIsMember(true);
          setStatus("authenticated");
          return userData;
        } catch {
          setUser(null);
          setIsMember(false);
          setStatus("anonymous");
          return null;
        }
      } else {
        setUser(null);
        setIsMember(false);
        setStatus("anonymous");
        return null;
      }
    } finally {
      setAuthReady(true);
    }
  };

  useEffect(() => {
    if (authBootstrapRef.current) return;
    authBootstrapRef.current = true;
    refreshUser();
  }, []);

  const loginSuccess = async (authResponse) => {
    const rawUser = authResponse?.data?.user || authResponse?.user || authResponse?.data || null;
    setIsMember(true);
    setStatus("authenticated");
    if (rawUser && (rawUser.name || rawUser.email || rawUser.id)) {
      setUser(rawUser);
    }
    // Fetch full fresh profile
    try {
      const meRes = await fetchMe();
      const userData = meRes?.data?.user || meRes?.data || rawUser;
      if (userData) setUser(userData);
    } catch {
      // Keep existing rawUser if fetchMe fails
    }
  };

  const handleLogout = async (all = false) => {
    try {
      await logout(all);
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setUser(null);
      setIsMember(false);
      setStatus("anonymous");
      navigate("/login");
    }
  };

  const goHome = () => { setSelectedPackageId(null); navigate("/"); };
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };
  const goProfile = () => navigate("/profile");

  const selectPackage = (id) => { setSelectedPackageId(id); navigate(`/journey/${id}`); };
  const returnToJourneys = () => { setSelectedPackageId(null); navigate("/"); };

  return (
    <TravelContext.Provider value={{
      goHome, goBack, goProfile,
      selectedPackageId, setSelectedPackageId, selectPackage, returnToJourneys,
      status, isMember, user, setUser, setIsMember, authReady,
      refreshUser, loginSuccess, handleLogout,
      toggleMember: () => (isMember ? handleLogout() : navigate("/login")),
    }}>
      {children}
    </TravelContext.Provider>
  );
}

export function useTravel() {
  const context = useContext(TravelContext);
  if (!context) throw new Error("useTravel must be used inside TravelProvider");
  return context;
}

