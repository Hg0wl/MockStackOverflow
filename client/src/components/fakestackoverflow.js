import React, { useEffect } from "react";
import Header from "./header";
import Main from "./main";
import { useState } from "react";

export default function fakeStackOverflow() {
  const [search, setSearch] = useState("");
  const [mainTitle, setMainTitle] = useState("All Questions");
  const [loginState, setLoginState] = useState("");
  const [loggedInUser, setUser] = useState("")
  const [uid, setUid] = useState("")

  //login states
  const login = "login"
  const signup = "signup"
  const logout = "logout"

  /**
   * Sets the given question page variables
   * 
   * @param {*} search The serach terms inputted by the user to filter the questions by
   * @param {*} title The title to display on the homepage
   */
  const setQuestionPage = (search = "", title = "All Questions") => {
    setSearch(search);
    setMainTitle(title);
  };

  /**
   * Sets uid to the inputted value
   * 
   * @param {*} _uid The value to se uid to 
   */
  const setUserId = (_uid) => {
    setUid(_uid)
  }

  /**
   * Sets the logged in user to the inputted uid
   * 
   * @param {*} uid The user id of the user to log in 
   */
  const setLoggedInUser = (uid) => {
    if (uid == "") {
      setLoginState(logout)
    }
    setUser(uid)
  }

  /**
   * Sets the login state to login
   */
  const handleLogin = () => {
    setLoginState(login);
  };

  /**
   * Sets the login state to signup
   */
  const handleSignup = () => {
    setLoginState(signup);
  };

  useEffect(() => {
    if (loginState != "") {
      setLoginState("");
    }
  }, [loginState]);

  return (
    <div id="root">
      <Header
        search={search}
        setQuestionPage={setQuestionPage}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        loggedInUser={loggedInUser}
        handleUser={setUserId}
        setLoggedInUser={setLoggedInUser}
        
      />
      <Main
        title={mainTitle}
        search={search}
        setQuestionPage={setQuestionPage}
        loginState={loginState}
        setLoggedInUser={setLoggedInUser}
        loggedInUser={loggedInUser}
        setUid={setUserId}
        uid={uid}
      />
    </div>
  );
}
