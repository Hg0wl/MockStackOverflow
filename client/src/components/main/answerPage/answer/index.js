import { handleHyperlink } from "../../../../tool";
import Vote from "../vote";
import Author from "../author";
import "./index.css";

import {
  upvoteAnswer,
  downvoteAnswer,
} from "../../../../services/answerService";

// Component for the Answer Page
const Answer = ({
  text,
  ansBy,
  meta,
  handleUser,
  aid,
  initVotes,
  initVoteStatus,
  loggedInUser,
  handleLogin,
  handleDeleteAnswer
}) => {
  return (
    <div className="answer">
      <Vote
        handleDownvote={downvoteAnswer}
        handleUpvote={upvoteAnswer}
        initVotes={initVotes}
        id={aid}
        initVoteStatus={initVoteStatus}
        loggedInUser={loggedInUser}
        handleLogin={handleLogin}
        handleDelete={handleDeleteAnswer}
      ></Vote>
      <div className="answer_body">
        <div id="answerText" className="answerText">
          {handleHyperlink(text)}
        </div>
        <Author
          username={ansBy && ansBy.username}
          profile_pic={ansBy && ansBy.profile_pic}
          aid={ansBy && ansBy.reputation}
          reputation={ansBy && ansBy.reputation}
          meta={"Answered " + meta}
          handleUser={handleUser}
        ></Author>
      </div>
    </div>
  );
};

export default Answer;
