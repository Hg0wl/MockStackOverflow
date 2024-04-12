import "./index.css";

const Author = ({ meta, askby, handleUser }) => {
  return (
    <div
      className={
        meta.startsWith("Asked") ? "author_container" : "author_container_ans"
      }
    >
      <div className="answer_question_meta author_text">{meta}</div>
      <div className="profile_container">
        <img src={askby.profile_pic} className="profile_image"></img>
        <div className="profile_info">
          <div
            className="question_author author_text"
            onClick={() => handleUser(askby._id)}
          >
            {askby.username}
          </div>
          <div className="reputation author_text">{askby.reputation}</div>
        </div>
      </div>
    </div>
  );
};

export default Author;
