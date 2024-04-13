import "./index.css";
import { useState, useEffect } from "react";
import SideBarNav from "./sidebarNav";
import QuestionPage from "./questionsPage";
import TagPage from "./tagPage";
import AnswerPage from "./answerPage";
import NewQuestion from "./newQuestion";
import NewAnswer from "./newAnswer";
import UserProfile from "./userProfile";
import Login from "./loginPage";
import Signup from "./signupPage";

const Main = ({
  search = "",
  title,
  setQuestionPage,
  loginState,
  setLoggedInUser,
  loggedInUser,
  setUid,
  uid,
}) => {
  const [page, setPage] = useState("home");
  const [questionOrder, setQuestionOrder] = useState("newest");
  const [qid, setQid] = useState("");
  let selected = "";
  let content = null;

  const handleQuestions = () => {
    setQuestionPage();
    setPage("home");
    setUid("");
  };

  const handleTags = () => {
    setPage("tag");
    setUid("");
  };

  const handleAnswer = (_qid) => {
    setQid(_qid);
    setPage("answer");
    setUid("");
  };

  const handleLogin = () => {
    setPage("login");
    setUid("");
  };

  const handleSignup = () => {
    setPage("signup");
    setUid("");
  };

  //Will likely need to pass some user id or username
  const handleUser = (_uid) => {
    setUid(_uid);
    setPage("user");
  };

  const clickTag = (tname) => {
    setQuestionPage("[" + tname + "]", tname);
    setPage("home");
  };

  const handleNewQuestion = () => {
    if (loggedInUser != "") {
      setPage("newQuestion");
    } else {
      setPage("login");
    }
  };

  const handleNewAnswer = () => {
    if (loggedInUser != "") {
      setPage("newAnswer");
    } else {
      setPage("login");
    }
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
  } else if (loginState == "logout" && page != "home") {
    handleQuestions();
  }

  useEffect(() => {
    if (uid != "") {
      handleUser(uid);
    }
  }, [uid]);

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
          loggedInUser={loggedInUser}
          handleLogin={handleLogin}
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
      content = (
        <UserProfile
          uid={uid}
          handleAnswer={handleAnswer}
          currentUser={loggedInUser == uid}
          loggedInUser={loggedInUser}
        />
      );
      break;
    }
    case "login": {
      selected = "";
      content = (
        <Login
          handleSignup={handleSignup}
          setLoggedInUser={setLoggedInUser}
          handleQuestions={handleQuestions}
        />
      );
      break;
    }
    case "signup": {
      selected = "";
      content = (
        <Signup
          handleLogin={handleLogin}
          setLoggedInUser={setLoggedInUser}
          handleQuestions={handleQuestions}
        />
      );
      break;
    }
    case "newQuestion": {
      selected = "";
      content = (
        <NewQuestion
          handleQuestions={handleQuestions}
          loggedInUser={loggedInUser}
        />
      );
      break;
    }
    case "newAnswer": {
      selected = "";
      content = (
        <NewAnswer
          qid={qid}
          handleAnswer={handleAnswer}
          loggedInUser={loggedInUser}
        />
      );
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
