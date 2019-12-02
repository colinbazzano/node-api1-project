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
      .json({ error: "Please provide name and bio for the user." });
  }

  db.insert(userData)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log("error on POST /api/users", error);
      res.status(500).json({
        error: "There was an error while saving the user to the database."
      });
    });
});

// GET!
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

// GET! ~by id~
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(user => {
      user
        ? res.status(200).json(user)
        : res.status(404).json({
            message: "The user with the specified ID does not exist. "
          });
    })
    .catch(error => {
      console.log("error on GET /api/users/:id");
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

// DELETE!
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(removed => {
      removed
        ? res.status(200).json({ message: "Successfully removed.", removed })
        : res
            .status(404)
            .json({ message: "The user with specified ID does not exist." });
    })
    .catch(error => {
      res.status(500).json({ error: "The user could not be removed" });
    });
});

// PUT!
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const userData = req.body;

  if (!userData.name && !userData.bio) {
    res
      .status(400)
      .json({ error: "Please provide name and bio for the user." });
  } else {
    db.update(id, userData)
      .then(updated => {
        updated
          ? db.findById(id).then(user => res.status(200).json(user))
          : res.status(404).json({
              message: "The user with the specified ID does not exist."
            });
      })
      .catch(error =>
        res
          .status(500)
          .json({ error: "The user information could not be modified." })
      );
  }
});

const port = 5000;
server.listen(port, () => {
  console.log(`** API is running on port ${port} **`);
});
