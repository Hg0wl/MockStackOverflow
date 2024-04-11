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

  let [question, setQuestion] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      let res = await getQuestionById(qid);
      setQuestion(res || {});
    };
    fetchData().catch((e) => console.log(e));
  }, [qid]);

  try  {
  return <div className="question-container">
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
          />
          {question &&
            question.answers &&
            question.answers.map((a, idx) => (
              <Answer
                key={idx}
                text={a.text}
                ansBy={a.ans_by}
                meta={getMetaData(new Date(a.ans_date_time))}
                votes={a.votes}
                handleUser={handleUser}
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
        </div>;
  } catch {
    return <></>
  }
};

export default AnswerPage;
