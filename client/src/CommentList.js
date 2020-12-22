import React from "react";

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content = "This comment is currently awaiting moderation.";

    if (comment.status === "rejected") {
      content = "This comment was rejected by the moderator.";
    } else if (comment.status === "approved") {
      content = comment.content;
    }

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
