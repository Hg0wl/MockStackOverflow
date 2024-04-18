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

  //Pag names
  const home = "home";
  const tag = "tag";
  const answer = "answer";
  const login = "login";
  const logout = "logout";
  const signup = "signup";
  const user = "user";
  const newQuestion = "newQuestion";
  const newAnswer = "newAnswer";

  /**
   * Set the current page to be the home page
   */
  const handleQuestions = () => {
    setQuestionPage();
    setPage(home);
    setUid("");
  };

  /**
   * Sets the current page to the tag page
   */
  const handleTags = () => {
    setPage(tag);
    setUid("");
  };

  /**
   * Sets the current page to the answer page
   * 
   * @param {*} _qid the id of the question whose answer page to render
   */
  const handleAnswer = (_qid) => {
    setQid(_qid);
    setPage(answer);
    setUid("");
  };

  /**
   * Sets the current page to the login page
   */
  const handleLogin = () => {
    setPage(login);
    setUid("");
  };

  /**
   * Sets the current page to the signup page
   */
  const handleSignup = () => {
    setPage(signup);
    setUid("");
  };

  /**
   * Sets the current page to the user page
   * 
   * @param {*} _uid the id of the user whose page to redner
   */
  const handleUser = (_uid) => {
    setUid(_uid);
    setPage(user);
  };

  /**
   * Called when a tag is clicked
   * Filters the question page to render only question with the given tag name and set the page to the home page
   * 
   * @param {*} tname the name of the tag that was clicked
   */
  const clickTag = (tname) => {
    setQuestionPage("[" + tname + "]", tname);
    setPage(home);
  };

  /**
   * Sets the page to the new question page if the user is logged in. Otherwise, sets the page to the login page
   */
  const handleNewQuestion = () => {
    if (loggedInUser != "") {
      setPage(newQuestion);
    } else {
      setPage(login);
    }
  };

  /**
   * Sets the page to the new answer page if the user is logged in. Otherwise, sets the page to the login page
   */
  const handleNewAnswer = () => {
    if (loggedInUser != "") {
      setPage(newAnswer);
    } else {
      setPage(login);
    }
  };

  /** 
   * @param {*} order the sorting order in which the questions should appear as a string
   * @param {*} search any search terms inputted by the user to filter the questions by
   * 
   * @returns A QuestionPage component with the given configurations
   */
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

  useEffect(() => {
    if (uid != "") {
      handleUser(uid);
    }
  }, [uid]);

  /**
   * Sets the content of the main page depending on the page variable
   */
  const setPageContent = () => {
    
    if (loginState == login && page != login) {
      handleLogin();
    } else if (loginState == signup && page != signup) {
      handleSignup();
    } else if (loginState == logout && page != home) {
      handleQuestions();
    }

    switch (page) {
      case home: {
        selected = "q";
        content = getQuestionPage(questionOrder.toLowerCase(), search);
        break;
      }
      case answer: {
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
            handleQuestions={handleQuestions}
          />
        );
        break;
      }
      case tag: {
        selected = "t";
        content = (
          <TagPage clickTag={clickTag} handleNewQuestion={handleNewQuestion} />
        );
        break;
      }
      case user: {
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
      case login: {
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
      case signup: {
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
      case newQuestion: {
        selected = "";
        content = (
          <NewQuestion
            handleQuestions={handleQuestions}
            loggedInUser={loggedInUser}
          />
        );
        break;
      }
      case newAnswer: {
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
  };

  setPageContent();
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
