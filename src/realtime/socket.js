import { io } from "socket.io-client";
import { BASE_API, getAccessToken, visitorId, visitorSessionId } from "../api";

const REALTIME_BASE = BASE_API || "https://coochbehar-travels.onrender.com";

export function createVisitorSocket({ customerId = "", page = "" } = {}) {
  const socket = io(REALTIME_BASE, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    auth: {
      token: getAccessToken() || undefined,
      visitor_id: visitorId() || undefined,
      session_id: visitorSessionId() || undefined,
      customer_id: customerId || undefined,
      current_url: page || window.location.pathname,
      source: "web",
      device: "web",
    },
  });

  socket.connect();
  return socket;
}

export function createNotificationSocket(token, onMessage) {
  if (!token || typeof WebSocket === "undefined") return null;

  const base = REALTIME_BASE.replace(/^http/, "ws");
  const socket = new WebSocket(`${base}/api/v1/notifications/ws?token=${encodeURIComponent(token)}`);

  socket.onmessage = (event) => {
    try {
      onMessage?.(JSON.parse(event.data));
    } catch {
      // Ignore malformed messages so one server event cannot break the app.
    }
  };

  return socket;
}
