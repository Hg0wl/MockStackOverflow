import { handleHyperlink } from "../../../../tool";
import Vote from "../vote"
import Author from "../author"
import "./index.css";

// Component for the Answer Page
const Answer = ({ text, ansBy, meta, votes, handleUser }) => {
  return (
    <div className="answer">
      <Vote
        handleDownvote={() => {}}
        handleUpvote={() => {}}
        initVotes={votes}
      ></Vote>
      <div className="answer_body">
        <div id="answerText" className="answerText">
          {handleHyperlink(text)}
        </div>
        <Author
          askby={ansBy}
          meta={"Answered " + meta}
          handleUser={handleUser}
        ></Author>
      </div>
    </div>
  );
};

export default Answer;
