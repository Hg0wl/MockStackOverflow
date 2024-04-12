import "./index.css";
import { useState } from "react";

const Vote = ({
  handleUpvote,
  handleDownvote,
  initVotes,
  id,
  initVoteStatus,
}) => {
  const [votes, updateVotes] = useState(initVotes);
  const [voteStatus, updateVoteStatus] = useState(initVoteStatus);

  const changeVoteStatus = (question) => {
    if (question.upvotes.includes("661974964d0bb703784662b3")) {
      updateVoteStatus("upvote");
    } else if (question.downvotes.includes("661974964d0bb703784662b3")) {
      updateVoteStatus("downvote");
    } else {
      updateVoteStatus("");
    }
  };

  return (
    <div className="vote-buttons">
      <button
        onClick={async () => {
          let question = await handleUpvote(id);
          updateVotes(question.upvotes.length - question.downvotes.length);
          changeVoteStatus(question);
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
          let question = await handleDownvote(id);
          updateVotes(question.upvotes.length - question.downvotes.length);
          changeVoteStatus(question);
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
