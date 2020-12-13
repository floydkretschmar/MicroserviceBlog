import express from "express";
import bodyParser from "body-parser";
import { v4 } from "uuid";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

// get all comments for a post
app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// create a comment on a post
app.post("/posts/:id/comments", async (req, res) => {
  const commentId = v4();
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });
  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: { id: commentId, content, postId: req.params.id },
  });

  res.status(201).send(comments);
});

// Listen for events
app.post("/events", (req, res) => {
  console.log(`Received event ${req.body.type}.`, req.body);
  res.send({});
});

// Open port
app.listen(4001, () => {
  console.log("Listening on Port 4001");
});
