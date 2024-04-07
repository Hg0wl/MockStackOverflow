import { useState } from "react";
import "./index.css"

const Vote = ({ handleUpvote, handleDownvote, initVotes }) => {
  const [votes, updateVotes] = useState(initVotes);

  return (
    <div className="vote-buttons">
      <button onClick={handleUpvote} className="vote-button">
        <svg width={18} height={18}>
          <path d="M1 12h16L9 4l-8 8Z"></path>
        </svg>
      </button>
      <p className="big-vote-count">{votes}</p>
      <button onClick={handleDownvote} className="vote-button">
        <svg width={18} height={18}>
          <path d="M1 6h16l-8 8-8-8Z"></path>
        </svg>
      </button>
    </div>
  );
};

export default Vote;
