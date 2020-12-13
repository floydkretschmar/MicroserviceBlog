import express from "express";
import bodyParser from "body-parser";
import { v4 } from "uuid";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

// get all comments for a post
app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// create a comment on a post
app.post("/posts/:id/comments", (req, res) => {
  const commentId = v4();
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });
  commentsByPostId[req.params.id] = comments;

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log("Listening on Port 4001");
});
