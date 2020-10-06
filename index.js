const express = require("express");
const { port } = require("./config");

const app = express();

app.get("/api/home", (req, res) => {
  res.send("Welcome to the E-commerce endpoint!");
});

app.listen(port, () => {
  console.log("Api stated on port ", port);
});
