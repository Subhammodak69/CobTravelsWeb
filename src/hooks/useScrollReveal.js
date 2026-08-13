import { useEffect, useRef } from "react";

export default function useScrollReveal() {
  const containerRef = useRef(null);
  useEffect(() => {
    const nodes = containerRef.current?.querySelectorAll("[data-reveal]") ?? [];
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return containerRef;
}
