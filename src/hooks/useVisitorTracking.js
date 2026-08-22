import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { endVisitorSession, heartbeatVisitorSession, identifyVisitor, startVisitorSession, trackVisitorEvent } from "../api";

export default function useVisitorTracking({ customerId = "", ready = false } = {}) {
  const location = useLocation();
  const bootstrapRef = useRef(false);
  const sessionRef = useRef(false);

  useEffect(() => {
    if (!ready || bootstrapRef.current) return;
    bootstrapRef.current = true;
    let active = true;
    (async () => {
      await identifyVisitor(customerId);
      if (!active) return;
      const session = await startVisitorSession(window.location.pathname);
      if (active && session) {
        sessionRef.current = true;
        trackVisitorEvent("session_started", window.location.pathname);
      }
    })();
    const heartbeat = window.setInterval(() => { if (sessionRef.current) heartbeatVisitorSession(window.location.pathname, 0); }, 30000);
    const onVisibility = () => { if (document.visibilityState === "visible" && sessionRef.current) heartbeatVisitorSession(window.location.pathname, 0); };
    const onUnload = () => { if (sessionRef.current) endVisitorSession(window.location.pathname); };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onUnload);
    return () => { active = false; window.clearInterval(heartbeat); document.removeEventListener("visibilitychange", onVisibility); window.removeEventListener("beforeunload", onUnload); };
  }, [customerId, ready]);

  useEffect(() => {
    if (sessionRef.current) {
      heartbeatVisitorSession(location.pathname, 1);
      trackVisitorEvent("page_view", location.pathname, { title: document.title });
    }
  }, [location.pathname]);
}
