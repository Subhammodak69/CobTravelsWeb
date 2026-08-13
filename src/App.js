import { TravelProvider } from "./contexts/TravelContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import PackageDetailsPage from "./pages/PackageDetailsPage";
import { useTravel } from "./contexts/TravelContext";
import "./App.css";
import "./animations.css";

function TravelApp() {
  const { selectedPackageId } = useTravel();
  return <main><Header />{selectedPackageId ? <PackageDetailsPage /> : <HomePage />}<Footer /></main>;
}

export default function App() {
  return <TravelProvider><TravelApp /></TravelProvider>;
}
