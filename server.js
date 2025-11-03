<<<<<<< HEAD
const fs = require("fs");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
const DATA_FILE = "./messages.json";

// Load existing messages from file
let messages = [];
if (fs.existsSync(DATA_FILE)) {
  messages = JSON.parse(fs.readFileSync(DATA_FILE));
}

// Helper to save messages
function saveMessages() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
}

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // Send all saved messages to admin when requested
  socket.on("loadMessages", () => {
    socket.emit("loadMessages", messages);
  });

  // Register new user (optional)
  socket.on("registerUser", (user) => {
    console.log("User registered:", user);
  });

  // Customer sends message
  socket.on("sendMessage", (msg) => {
    messages.push(msg);       // Save message
    saveMessages();
    io.emit("newMessage", msg);  // Broadcast to admin
  });

  // Admin sends reply
  socket.on("adminReply", (msg) => {
    messages.push(msg);       // Save reply
    saveMessages();
    io.emit("receiveReply", msg);  // Send to customer
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
=======
const fs = require("fs");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
const DATA_FILE = "./messages.json";

// Load existing messages from file
let messages = [];
if (fs.existsSync(DATA_FILE)) {
  messages = JSON.parse(fs.readFileSync(DATA_FILE));
}

// Helper to save messages
function saveMessages() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
}

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // Send all saved messages to admin when requested
  socket.on("loadMessages", () => {
    socket.emit("loadMessages", messages);
  });

  // Register new user (optional)
  socket.on("registerUser", (user) => {
    console.log("User registered:", user);
  });

  // Customer sends message
  socket.on("sendMessage", (msg) => {
    messages.push(msg);       // Save message
    saveMessages();
    io.emit("newMessage", msg);  // Broadcast to admin
  });

  // Admin sends reply
  socket.on("adminReply", (msg) => {
    messages.push(msg);       // Save reply
    saveMessages();
    io.emit("receiveReply", msg);  // Send to customer
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
>>>>>>> b2b789e (new)
