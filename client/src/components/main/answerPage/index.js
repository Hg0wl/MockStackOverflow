import { useEffect, useState } from "react";
import { getMetaData } from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import "./index.css";
import QuestionBody from "./questionBody";
import { getQuestionById } from "../../../services/questionService";

// Component for the Answers page
const AnswerPage = ({
  qid,
  handleNewQuestion,
  handleNewAnswer,
  clickTag,
  handleUser,
}) => {
  let [question, setQuestion] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      let res = await getQuestionById(qid);
      setQuestion(res || {});
    };
    fetchData().catch((e) => console.log(e));
  }, [qid]);

  const getInitVoteStatus = (item) => {
    if (item.upvotes.includes("661974964d0bb703784662b3")) {
      return "upvote";
    } else if (item.downvotes.includes("661974964d0bb703784662b3")) {
      return "downvote";
    } else {
      return "";
    }
  };

  console.log(question);
  try {
    return (
      <div className="question-container">
        <AnswerHeader
          title_text={question && question.title}
          handleNewQuestion={handleNewQuestion}
          views={question.views}
          ask_date_time={question.ask_date_time}
        />
        <QuestionBody
          views={question && question.views}
          text={question && question.text}
          askby={question && question.asked_by}
          tags={question && question.tags}
          clickTag={clickTag}
          meta={question && getMetaData(new Date(question.ask_date_time))}
          numAnswers={question && question.answers.length}
          handleUser={handleUser}
          qid={qid}
          initVotes={question.upvotes.length - question.downvotes.length}
          initVoteStatus={getInitVoteStatus(question)}
        />
        {question &&
          question.answers &&
          question.answers.map((a, idx) => (
            <Answer
              key={idx}
              text={a.text}
              ansBy={a.ans_by}
              meta={getMetaData(new Date(a.ans_date_time))}
              handleUser={handleUser}
              aid={a._id}
              initVotes={a.upvotes.length - a.downvotes.length}
              initVoteStatus={getInitVoteStatus(a)}
            />
          ))}
        <button
          className="bluebtn ansButton"
          onClick={() => {
            handleNewAnswer();
          }}
        >
          Answer Question
        </button>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <></>;
  }
};

export default AnswerPage;
