import express from "express";
import { v4 } from "uuid";
import bodyParser from "body-parser";
import cors from "cors";

// set up bodyparser for request body
const app = express();
app.use(bodyParser.json());
app.use(cors());

// In memory storage
const posts = {};

// Get all posts
app.get("/posts", (req, res) => {
  res.send(posts);
});

// Add a new post
app.post("/posts", (req, res) => {
  const id = v4();
  const { title } = req.body;

  posts[id] = { id, title };

  res.status(201).send(posts[id]);
});

// Listen for requests
app.listen(4000, () => {
  console.log("Listening on Port 4000.");
});
