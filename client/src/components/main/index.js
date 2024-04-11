import "./index.css";
import { useState } from "react";
import SideBarNav from "./sidebarNav";
import QuestionPage from "./questionsPage";
import TagPage from "./tagPage";
import AnswerPage from "./answerPage";
import NewQuestion from "./newQuestion";
import NewAnswer from "./newAnswer";
import UserProfile from "./userProfile";
import Login from "./loginPage";
import Signup from "./signupPage";

const Main = ({ search = "", title, setQuestionPage, loginState }) => {
  const [page, setPage] = useState("home");
  const [questionOrder, setQuestionOrder] = useState("newest");
  const [qid, setQid] = useState("");
  let selected = "";
  let content = null;

  const handleQuestions = () => {
    setQuestionPage();
    setPage("home");
  };

  const handleTags = () => {
    setPage("tag");
  };

  const handleAnswer = (_qid) => {
    setQid(_qid);
    setPage("answer");
  };

  const handleLogin = () => {
    setPage("login");
  };

  const handleSignup = () => {
    setPage("signup");
  };

  //Will likely need to pass some user id or username
  const handleUser = () => {
    setPage("user");
  };

  const clickTag = (tname) => {
    setQuestionPage("[" + tname + "]", tname);
    setPage("home");
  };

  const handleNewQuestion = () => {
    setPage("newQuestion");
  };

  const handleNewAnswer = () => {
    setPage("newAnswer");
  };

  const getQuestionPage = (order = "newest", search = "") => {
    return (
      <QuestionPage
        title_text={title}
        order={order}
        search={search}
        setQuestionOrder={setQuestionOrder}
        clickTag={clickTag}
        handleAnswer={handleAnswer}
        handleNewQuestion={handleNewQuestion}
        handleUser={handleUser}
        questionOrder={questionOrder}
      />
    );
  };

  if (loginState == "login" && page != "login") {
    handleLogin();
  } else if (loginState == "signup" && page != "signup") {
    handleSignup();
  }

  switch (page) {
    case "home": {
      selected = "q";
      content = getQuestionPage(questionOrder.toLowerCase(), search);
      break;
    }
    case "answer": {
      selected = "";
      content = (
        <AnswerPage
          qid={qid}
          handleNewQuestion={handleNewQuestion}
          handleNewAnswer={handleNewAnswer}
          clickTag={clickTag}
          handleUser={handleUser}
        />
      );
      break;
    }
    case "tag": {
      selected = "t";
      content = (
        <TagPage clickTag={clickTag} handleNewQuestion={handleNewQuestion} />
      );
      break;
    }
    case "user": {
      selected = "";
      content = <UserProfile handleAnswer={handleAnswer} />;
      break;
    }
    case "login": {
      selected = "";
      content = <Login handleSignup={handleSignup} />;
      break;
    }
    case "signup": {
      selected = "";
      content = <Signup handleLogin={handleLogin} />;
      break;
    }
    case "newQuestion": {
      selected = "";
      content = <NewQuestion handleQuestions={handleQuestions} />;
      break;
    }
    case "newAnswer": {
      selected = "";
      content = <NewAnswer qid={qid} handleAnswer={handleAnswer} />;
      break;
    }

    default:
      selected = "q";
      content = getQuestionPage();
      break;
  }

  return (
    <div id="main" className="main">
      <SideBarNav
        selected={selected}
        handleQuestions={handleQuestions}
        handleTags={handleTags}
      />

      {content}
    </div>
  );
};

export default Main;
