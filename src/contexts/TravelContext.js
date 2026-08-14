import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const TravelContext = createContext(null);

export function TravelProvider({ children }) {
  const navigate = useNavigate();
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [isMember, setIsMember] = useState(false);

  const goHome = () => { setSelectedPackageId(null); navigate("/"); };
  const goProfile = () => navigate("/profile");

  const selectPackage = (id) => { setSelectedPackageId(id); navigate(`/journey/${id}`); };
  const returnToJourneys = () => { setSelectedPackageId(null); navigate("/"); };

  return (
    <TravelContext.Provider value={{
      goHome, goProfile,
      selectedPackageId, setSelectedPackageId, selectPackage, returnToJourneys,
      isMember, toggleMember: () => setIsMember((v) => !v),
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
