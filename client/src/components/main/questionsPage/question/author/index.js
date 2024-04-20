import { getMetaData } from "../../../../../tool";
import "./index.css";

const Author = ({ asked_by, ask_date_time, handleUser }) => {
  return (
    <div className="lastActivity">
      <img src={asked_by.profile_pic} className="question-page-image" alt="Profile Picture"></img>
      <div className="question_author" onClick={() => handleUser(asked_by._id)}>
        {asked_by.username}
      </div>
      <div>&nbsp;</div>
      <div className="question_meta">
        asked {getMetaData(new Date(ask_date_time))}
      </div>
    </div>
  );
};

export default Author;
