import { handleHyperlink } from "../../../../tool";
import Vote from "../vote"
import Author from "../author"
import "./index.css";

// Component for the Answer Page
const Answer = ({ text, ansBy, meta, votes }) => {
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
          meta={"Answered " +meta}
          reputation={0}
          img={
            "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"
          }
        ></Author>
      </div>
    </div>
  );
};

export default Answer;
