import { useEffect, useState } from "react";
import { getMetaData } from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import "./index.css";
import QuestionBody from "./questionBody";
import { getQuestionById } from "../../../services/questionService";
import { deleteAnswer } from "../../../services/answerService";

// Component for the Answers page
const AnswerPage = ({
  qid,
  handleNewQuestion,
  handleNewAnswer,
  clickTag,
  handleUser,
  loggedInUser,
  handleLogin,
  handleQuestions,
}) => {
  let [question, setQuestion] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      let res = await getQuestionById(qid);
      setQuestion(res || {});
    };
    fetchData().catch((e) => console.log(e));
  }, [qid]);

  /**
   * Returns a string corresponding to the status of the votes of this question
   *
   * @param {*} item The question or answer to check the initial status of
   * @returns "upvote" if the item has been upvoted by the current user
   *          "downvote" if the item has been downvoted by the current user
   *          "" if the item has not been voted on by the current user
   */
  const getInitVoteStatus = (item) => {
    if (item.upvotes && item.downvotes) {
      if (item.upvotes.includes(loggedInUser)) {
        return "upvote";
      } else if (item.downvotes.includes(loggedInUser)) {
        return "downvote";
      } else {
        return "";
      }
    }
    return "";
  };

  /**
   * Renders a list of Answer components to the given question
   *
   * @param {*} question
   */
  const renderAnswers = (question) => {
    return (question &&
      question.answers &&
      question.answers.map((a, idx) => renderAnswer(a, idx)));
  };

  /**
   * Returns an answer React component for the given answer
   *
   * @param {*} a
   */
  const renderAnswer = (a, idx) => {
    return (
      <Answer
        key={idx}
        text={a.text}
        ansBy={a.ans_by}
        meta={getMetaData(new Date(a.ans_date_time))}
        handleUser={handleUser}
        aid={a._id}
        initVotes={a.upvotes.length - a.downvotes.length}
        initVoteStatus={getInitVoteStatus(a)}
        loggedInUser={loggedInUser}
        handleLogin={handleLogin}
        handleDeleteAnswer={async () => {
          const res = await deleteAnswer(a._id);
          if (res.success) {
            let updatedQuestion = await getQuestionById(qid);
            setQuestion(updatedQuestion);
          }
        }}
      />
    );
  };

  return (
    <div className="question-container">
      <AnswerHeader
        title_text={question && question.title}
        handleNewQuestion={handleNewQuestion}
        views={question.views}
        ask_date_time={question.ask_date_time}
      />
      <QuestionBody
        text={question && question.text}
        askBy={question && question.asked_by}
        tagsInit={question && question.tags}
        clickTag={clickTag}
        meta={question && getMetaData(new Date(question.ask_date_time))}
        numAnswers={question && question.answers && question.answers.length}
        handleUser={handleUser}
        qid={qid}
        initVotes={
          question &&
          question.upvotes &&
          question.downvotes &&
          question.upvotes.length - question.downvotes.length
        }
        initVoteStatus={getInitVoteStatus(question)}
        loggedInUser={loggedInUser}
        handleLogin={handleLogin}
        handleQuestions={handleQuestions}
      />
      {renderAnswers(question)}
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
