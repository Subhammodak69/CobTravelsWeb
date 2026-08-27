import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <>
      <footer className="flex flex-col gap-3 bg-slate-950 px-6 py-8 text-xs font-medium tracking-wide text-white/60 sm:flex-row sm:items-center sm:justify-between lg:px-16">
        <span>© 2026 Coochbehar Travel</span>
        <span>Explore · Identify · Reinvent</span>
        <span>info@coochbehartravel.com</span>
      </footer>
    </>
  );
}
