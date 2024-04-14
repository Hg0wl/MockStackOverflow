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
  handleDelete
}) => {
  const [votes, updateVotes] = useState(initVotes);
  const [voteStatus, updateVoteStatus] = useState(initVoteStatus);
  const [user, setUser] = useState({});
  useEffect(() => {
    console.log("Calling useEffect");
    const fetchData = async () => {
      let res = await getUserById(loggedInUser);
      setUser(res || []);
    };

    fetchData().catch((e) => console.log(e));
  }, [loggedInUser]);

  const changeVoteStatus = (question) => {
    if (question.upvotes.includes(loggedInUser)) {
      updateVoteStatus("upvote");
    } else if (question.downvotes.includes(loggedInUser)) {
      updateVoteStatus("downvote");
    } else {
      updateVoteStatus("");
    }
  };

  try {
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
        {user.reputation >= 10000 ? (
          <img onClick={handleDelete} className="trash-icon" src="https://cdn1.iconfinder.com/data/icons/hawcons/32/699013-icon-27-trash-can-512.png" />
        ) : (
          <></>
        )}
      </div>
    );
  } catch (error) {
    <></>;
  }
};

export default Vote;
