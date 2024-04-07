import { getPreviewText } from "../../../../tool";
import Author from "./author";
import "./index.css";

const Question = ({ q, clickTag, handleAnswer }) => {
  return (
    <div
      className="question right_padding"
      onClick={() => {
        handleAnswer(q._id);
      }}
    >
      <div className="postStats">
        <div className="vote-stat">{q.votes} votes</div>
        <div>{q.answers.length || 0} answers</div>
        <div>{q.views} views</div>
      </div>
      <div className="question_mid">
        <div className="postTitle">{q.title}</div>
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
        ask_date_time={q.ask_date_time}
        ask_image={
          "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"
        }
      ></Author>
    </div>
  );
};

export default Question;
