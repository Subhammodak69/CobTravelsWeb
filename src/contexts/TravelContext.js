import { createContext, useContext, useState } from "react";

const TravelContext = createContext(null);

export function TravelProvider({ children }) {
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const selectPackage = (id) => setSelectedPackageId(id);
  const returnToJourneys = () => setSelectedPackageId(null);
  return <TravelContext.Provider value={{ selectedPackageId, selectPackage, returnToJourneys, isMember, toggleMember: () => setIsMember((value) => !value) }}>{children}</TravelContext.Provider>;
}

export function useTravel() {
  const context = useContext(TravelContext);
  if (!context) throw new Error("useTravel must be used inside TravelProvider");
  return context;
}
