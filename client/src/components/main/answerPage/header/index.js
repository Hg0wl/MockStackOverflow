import "./index.css";
import { getMetaData } from "../../../../tool";

const AnswerHeader = ({
  title_text,
  views,
  ask_date_time,
  handleNewQuestion,
}) => {
  return (
    <div className="q_header">
      <div className="a_header_row">
        <div className="bold_title left-alligned">{title_text}</div>
        <button
          className="bluebtn right-alligned"
          onClick={() => {
            handleNewQuestion();
          }}
        >
          Ask a Question
        </button>
      </div>
      <div className="a_header_second_row underline">
        <div className="left-alligned" id="ask_time">
          Asked {getMetaData(new Date(ask_date_time))}
        </div>
        <div className="left-alligned">
          Viewed {views} times
        </div>
      </div>
    </div>
  );
};

export default AnswerHeader;
