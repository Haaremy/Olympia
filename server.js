// server-socket.js
const { createServer } = require("http");
const { Server } = require("socket.io");

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("chat message", () => io.emit("chat message"));
  socket.on("scoreboard", () => io.emit("scoreboard"));
});

server.listen(4000, () => console.log("> Socket.IO ready on http://localhost:4000"));
