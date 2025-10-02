// lib/socket.js
import { io } from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "https://olympia.haaremy.de", 
  { path: "/socket.io", transports: ["websocket"] }
);

export default socket;
