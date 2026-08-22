import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMe, getAccessToken, refreshSession, logout } from "../api";

const TravelContext = createContext(null);

export function TravelProvider({ children }) {
  const navigate = useNavigate();
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [isMember, setIsMember] = useState(Boolean(getAccessToken()));
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const authBootstrapRef = useRef(false);
  useEffect(() => {
    if (authBootstrapRef.current) return;
    authBootstrapRef.current = true;
    (async () => {
      try {
        let token = getAccessToken();
        if (!token) { await refreshSession(); token = getAccessToken(); }
        if (token) {
          try { const r = await fetchMe(); setUser(r.data); setIsMember(true); }
          catch { setUser(null); setIsMember(false); }
        }
      } finally { setAuthReady(true); }
    })();
  }, []);

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
    isMember, user, setUser, setIsMember, authReady,
    toggleMember: () => isMember ? logout().then(() => { setIsMember(false); setUser(null); }) : navigate("/profile"),
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
