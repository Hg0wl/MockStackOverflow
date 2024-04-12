import "./index.css";
import { useState } from "react";

const Vote = ({
  handleUpvote,
  handleDownvote,
  initVotes,
  id,
  initVoteStatus,
  loggedInUser,
  handleLogin,
}) => {
  const [votes, updateVotes] = useState(initVotes);
  const [voteStatus, updateVoteStatus] = useState(initVoteStatus);

  const changeVoteStatus = (question) => {
    if (question.upvotes.includes(loggedInUser)) {
      updateVoteStatus("upvote");
    } else if (question.downvotes.includes(loggedInUser)) {
      updateVoteStatus("downvote");
    } else {
      updateVoteStatus("");
    }
  };

  return (
    <div className="vote-buttons">
      <button
        onClick={async () => {
          if (loggedInUser != "") {
            let question = await handleUpvote(id, loggedInUser);
            updateVotes(question.upvotes.length - question.downvotes.length);
            changeVoteStatus(question);
          } else {
            handleLogin();
          }
        }}
        className={
          voteStatus == "upvote" ? "selected-vote-button" : "vote-button"
        }
      >
        <svg width={18} height={18}>
          <path d="M1 12h16L9 4l-8 8Z"></path>
        </svg>
      </button>
      <p className="big-vote-count">{votes}</p>
      <button
        onClick={async () => {
          if (loggedInUser != "") {
            let question = await handleDownvote(id, loggedInUser);
            updateVotes(question.upvotes.length - question.downvotes.length);
            changeVoteStatus(question);
          } else {
            handleLogin();
          }
        }}
        className={
          voteStatus == "downvote" ? "selected-vote-button" : "vote-button"
        }
      >
        <svg width={18} height={18}>
          <path d="M1 6h16l-8 8-8-8Z"></path>
        </svg>
      </button>
    </div>
  );
};

export default Vote;
