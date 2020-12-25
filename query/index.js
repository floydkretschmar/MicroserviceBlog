import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, postId } = data;
    const post = posts[postId];
    const commentIndex = post.comments.findIndex(
      (comment) => comment.id === id
    );
    post.comments[commentIndex] = { ...data };
  }

  console.log(posts);

  res.send({});
});

app.listen(4002, () => {
  console.log("Listening on Port 4002.");
});