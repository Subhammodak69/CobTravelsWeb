import { useEffect, useRef } from "react";

export default function useScrollReveal() {
  const containerRef = useRef(null);
  useEffect(() => {
    const nodes = containerRef.current?.querySelectorAll("[data-reveal]") ?? [];
    nodes.forEach((node) => node.classList.add("opacity-0", "translate-y-6", "transition-all", "duration-700", "ease-out"));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("opacity-0", "translate-y-6");
        entry.target.classList.add("opacity-100", "translate-y-0");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return containerRef;
}
