import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const processEvent = (type, data) => {
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
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  processEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on Port 4002.");

  await axios
    .get("http://blog-event-bus-srv:4005/events")
    .then((res) => {
      for (let event of res.data) {
        const { type, data } = event;
        console.log(`Processing event ${type}`);
        processEvent(type, data);
      }
    })
    .catch((err) => console.log(err));
});
