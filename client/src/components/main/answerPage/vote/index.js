import "./index.css";
import { useState, useEffect } from "react";
import { getUserById } from "../../../../services/userService";

const Vote = ({
  handleUpvote,
  handleDownvote,
  initVotes,
  id,
  initVoteStatus,
  loggedInUser,
  handleLogin,
  handleDelete,
}) => {
  const [votes, updateVotes] = useState(initVotes);
  const [voteStatus, updateVoteStatus] = useState(initVoteStatus);
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      let res = await getUserById(loggedInUser);
      setUser(res || []);
    };

    fetchData().catch((e) => console.log(e));
  }, [loggedInUser]);

  useEffect(() => {
    updateVotes(initVotes)
  }, [initVotes])

  useEffect(() => {
    updateVoteStatus(initVoteStatus)
  }, [initVoteStatus])

  /**
   * Updates the "vote status" of this item
   * Has the effect of changing the rendering to signal if this item has been upvoted/downvoted by the current user
   * @param {*} question the item to check for upvotes/downvotes by the current user
   */
  const changeVoteStatus = (question) => {
    if (question) {
      if (question.upvotes.includes(loggedInUser)) {
        updateVoteStatus("upvote");
      } else if (question.downvotes.includes(loggedInUser)) {
        updateVoteStatus("downvote");
      } else {
        updateVoteStatus("");
      }
    }
  };

  /**
   * Performs the given vote operation and updates the vote status and vote counts if a user is loggged in
   * If no user is logged in, redirects to the login page
   * @param {*} vote the appropreate vote function to perform (handleUpvote or handleDownvote)
   */
  const handleVoteClick = async (vote) => {
    if (loggedInUser != "") {
      let question = await vote(id, loggedInUser);
      updateVotes(question.upvotes.length - question.downvotes.length);
      changeVoteStatus(question);
    } else {
      handleLogin();
    }
  };

  return (
    <div className="vote-buttons">
      <button
        onClick={() => handleVoteClick(handleUpvote)}
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
        onClick={() => handleVoteClick(handleDownvote)}
        className={
          voteStatus == "downvote" ? "selected-vote-button" : "vote-button"
        }
      >
        <svg width={18} height={18}>
          <path d="M1 6h16l-8 8-8-8Z"></path>
        </svg>
      </button>
      {user.reputation >= 10000 ? (
        <img
          onClick={handleDelete}
          className="trash-icon"
          src="https://cdn1.iconfinder.com/data/icons/hawcons/32/699013-icon-27-trash-can-512.png"
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Vote;
