import { useEffect, useState } from "react";
import { getMetaData } from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import "./index.css";
import QuestionBody from "./questionBody";
//import { getQuestionById } from "../../../services/questionService";

// Component for the Answers page
const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer, clickTag, handleUser }) => {
  const [question, setQuestion] = useState({
    answers: [
      {
        text: "For the love of glob, please stop asking homework questions",
        ans_by: "Red Toad",
        ans_date_time: new Date(),
        votes: 0
      },
      {
        text: "L + ratio",
        ans_by: "Yellow Toad",
        ans_date_time: new Date(),
        votes: 100
      },
    ],
    views: 0,
    votes: 0,
    title: "Test Question",
    text: "Here is a question. It is a very good question. So good in fact that is is deserving of a preamble to introduce it. A preamble that only an author worthy of writing could pen of course. An author such as I, Blue Toad from the game Super Mario 3D World (and not any of the other Toads, please try not to get us confused. Anyway, can anywone tell me the answer to this homework problem?",
    tags: [{ name: "java" }, { name: "junit" }],
    asked_by: "Blue Toad",
    ask_date_time: new Date(),
  });
  /*
  useEffect(() => {
    const fetchData = async () => {
      let res = await getQuestionById(qid);
      setQuestion(res || {});
    };
    fetchData().catch((e) => console.log(e));
  }, [qid]);
  */
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
        handleUser = {handleUser}
      />
      {question &&
        question.answers &&
        question.answers.map((a, idx) => (
          <Answer
            key={idx}
            text={a.text}
            ansBy={a.ans_by}
            meta={getMetaData(new Date(a.ans_date_time))}
            votes = {a.votes}
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
    </div>
  );
};

export default AnswerPage;
