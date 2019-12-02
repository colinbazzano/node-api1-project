// implement your API here
const express = require("express");

const db = require("./data/db.js");

const server = express();

server.use(express.json());

// this is to see if the server is properly up and running
server.get("/", (req, res) => {
  res.send({ api: "up and running..." });
});

// POST!
server.post("/api/users", (req, res) => {
  const userData = req.body;

  if (!userData.name || !userData.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  db.insert(userData)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log("error on POST /api/users", error);
      res.status(500).json({ errorMessage: "error adding the user" });
    });
});

const port = 5000;
server.listen(port, () => {
  console.log(`** API is running on port ${port} **`);
});
