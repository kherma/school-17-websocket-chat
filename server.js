// =====================
// Imports
// =====================

const express = require("express");
const path = require("path");
const socket = require("socket.io");
const data = require("./db");

// =====================
// Server Settings
// =====================

const port = 8000;
const app = express();
const { messages, users } = data;

// =====================
// Middleware
// =====================
app.use(express.static(path.join(__dirname + "/client")));

// =====================
// Endpoints
// =====================

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.use((req, res) => {
  res.status(404).send({ message: "Error 404, not found" });
});

// =====================
// Start Server
// =====================
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const io = socket(server);

io.on("connection", (socket) => {
  console.log("New client! Its id – " + socket.id);
  socket.on("join", (username) => {
    console.log("Oh, I've got new user  " + username.name);
    users.push({ ...username, id: socket.id });
    console.log(users);
  });
  socket.on("message", (message) => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit("message", message);
  });
  socket.on("disconnect", () => {
    console.log("Oh, socket " + socket.id + " has left");
    const index = users.indexOf(users.find((user) => user.id === socket.id));
    users.splice(index, 1);
  });
  console.log("I've added a listener on message and disconnect events \n");
});
