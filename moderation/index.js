import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    let responseData = { ...data };
    responseData.status = responseData.content.includes("orange")
      ? "rejected"
      : "approved";

    await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: responseData,
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("Listening on Port 4003");
});
