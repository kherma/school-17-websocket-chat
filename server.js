// =====================
// Imports
// =====================

const express = require("express");
const path = require("path");
const db = require("./db");

// =====================
// Server Settings
// =====================

const port = 8000;
const app = express();

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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
