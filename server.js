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

  // User Join
  socket.on("join", (username) => {
    console.log("Oh, I've got new user  " + username.name);

    // Add new user to users database
    users.push({ ...username, id: socket.id });

    // Emit message to other users about new user
    socket.broadcast.emit("message", {
      author: "Chat Bot",
      content: `${username.name} has joined the conversation!`,
    });
  });

  // User sent message
  socket.on("message", (message) => {
    console.log("Oh, I've got something from " + socket.id);

    // Add new message to message database
    messages.push(message);

    // Emit new message to other users
    socket.broadcast.emit("message", message);
  });

  // User disconnect
  socket.on("disconnect", () => {
    console.log("Oh, socket " + socket.id + " has left");

    // Find index of disconnected user
    const index = users.indexOf(users.find((user) => user.id === socket.id));

    // Emit message to other users that user left
    index !== -1 &&
      socket.broadcast.emit("message", {
        author: "Chat Bot",
        content: `${users[index].name} has left the conversation... :(`,
      });

    // Remove user from users databse
    users.splice(index, 1);
  });
  console.log("I've added a listener on message and disconnect events \n");
});
