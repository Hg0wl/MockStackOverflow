import { getMetaData } from "../../../../../tool";
import "./index.css";

const Author = ({ asked_by, ask_date_time, ask_image, handleUser }) => {
  return (
    <div className="lastActivity">
      <img src={ask_image} className="question-page-image"></img>
      <div className="question_author" onClick={() => handleUser()}>{asked_by}</div>
      <div>&nbsp;</div>
      <div className="question_meta">
        asked {getMetaData(new Date(ask_date_time))}
      </div>
    </div>
  );
};

export default Author;
