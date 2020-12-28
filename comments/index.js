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

  comments.push({ id: commentId, content, status: "pending" });
  commentsByPostId[req.params.id] = comments;

  await axios.post("http://blog-event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: { id: commentId, content, status: "pending", postId: req.params.id },
  });

  res.status(201).send(comments);
});

// Listen for events
app.post("/events", async (req, res) => {
  console.log(`Received event ${req.body.type}.`, req.body);
  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    await axios.post("http://blog-event-bus-srv:4005/events", {
      type: "CommentUpdated",
      data: { ...comment, postId },
    });
  }

  res.send({});
});

// Open port
app.listen(4001, () => {
  console.log("Listening on Port 4001");
});
