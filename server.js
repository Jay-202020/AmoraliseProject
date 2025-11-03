// server.js
const fs = require("fs");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.static(__dirname)); // serve HTML files in same folder
app.use(express.json());

const PORT = 3000;
const DATA_FILE = "./messages.json";

// Load existing messages
let messages = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    messages = JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (err) {
    messages = [];
  }
}

// Save messages to file
function saveMessages() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
}

// Handle socket connections
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Send all messages to newly connected admin or customer
  socket.on("loadMessages", () => {
    socket.emit("loadMessages", messages);
  });

  // Customer sends message
  socket.on("sendMessage", (msgData) => {
    // Avoid duplicates
    if (!messages.some(m => m.time === msgData.time && m.date === msgData.date && m.email === msgData.email && m.message === msgData.message)) {
      messages.push(msgData);
      saveMessages();
      io.emit("newMessage", msgData);
    }
  });

  // Admin replies
  socket.on("adminReply", (reply) => {
    // Avoid duplicates
    if (!messages.some(m => m.time === reply.time && m.date === reply.date && m.email === reply.email && m.message === reply.message)) {
      messages.push(reply);
      saveMessages();
      io.emit("receiveReply", reply);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
