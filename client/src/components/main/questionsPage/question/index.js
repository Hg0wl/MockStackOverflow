import { getPreviewText } from "../../../../tool";
import Author from "./author";
import "./index.css";

const Question = ({ q, clickTag, handleAnswer, handleUser }) => {
    return (
    <div className="question right_padding">
      <div className="postStats">
        <div className="vote-stat">{q.upvotes.length - q.downvotes.length} votes</div>
        <div>{q.answers.length || 0} answers</div>
        <div>{q.views} views</div>
      </div>
      <div className="question_mid">
        <div
          className="postTitle"
          onClick={() => {
            handleAnswer(q._id);
          }}
        >
          {q.title}
        </div>
        <div className="postText">{getPreviewText(q.text)}</div>
        <div className="question_tags">
          {q.tags.map((tag, idx) => {
            return (
              <button
                key={idx}
                className="question_tag_button"
                onClick={(e) => {
                  e.stopPropagation();
                  clickTag(tag.name);
                }}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>
      <Author
        asked_by={q.asked_by}
        handleUser={handleUser}
        ask_date_time={q.ask_date_time}
      ></Author>
    </div>
  );
};

export default Question;
