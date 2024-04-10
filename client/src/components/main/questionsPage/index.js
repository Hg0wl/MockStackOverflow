import "./index.css";
import QuestionHeader from "./header";
import Question from "./question";

import { getQuestionsByFilter } from "../../../services/questionService";
import { useEffect, useState } from "react";

const QuestionPage = ({
  title_text = "All Questions",
  order,
  search,
  setQuestionOrder,
  clickTag,
  handleAnswer,
  handleNewQuestion,
  handleUser,
  questionOrder,
}) => {
  const [qlist, setQlist] = useState([]);
  //For now using a hardcoded value for testing
  /*
  const [qlist, setQlist] = useState([
    {
      answers: [],
      views: 0,
      votes: 0,
      title: "Test Question",
      text: "Here is a question. It is a very good question. So good in fact that is is deserving of a preamble to introduce it. A preamble that only an author worthy of writing could pen of course. An author such as I, Blue Toad from the game Super Mario 3D World (and not any of the other Toads, please try not to get us confused. Anyway, can anywone tell me the answer to this homework problem?",
      tags: [{ name: "java" }, { name: "junit" }],
      asked_by: "Blue Toad",
      ask_date_time: new Date(),
    },
    {
      answers: [],
      views: 500,
      votes: 100,
      title: "Another Test Question",
      text: "Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi Yoshi ",
      tags: [{ name: "yoshi" }],
      asked_by: "Yoshi",
      ask_date_time: new Date(),
    },
  ]);
 */
  //This is how we shuold read questions from the database

  useEffect(() => {
    const fetchData = async () => {
      let res = await getQuestionsByFilter(order, search);
      setQlist(res || []);
    };

    fetchData().catch((e) => console.log(e));
  }, [order, search]);

  console.log(qlist);

  return (
    <div className="question-container">
      <QuestionHeader
        title_text={title_text}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
        handleNewQuestion={handleNewQuestion}
        questionOrder={questionOrder}
      />
      <div id="question_list" className="question_list">
        {qlist.map((q, idx) => (
          <Question
            q={q}
            key={idx}
            clickTag={clickTag}
            handleAnswer={handleAnswer}
            handleUser={handleUser}
          />
        ))}
      </div>
      {title_text === "Search Results" && !qlist.length && (
        <div className="bold_title right_padding">No Questions Found</div>
      )}
    </div>
  );
};

export default QuestionPage;
