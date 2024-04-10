import React, { useEffect } from "react";
import Header from "./header";
import Main from "./main";
import { useState } from "react";

export default function fakeStackOverflow() {
  const [search, setSearch] = useState("");
  const [mainTitle, setMainTitle] = useState("All Questions");
  const [loginState, setLoginState] = useState("");

  const setQuestionPage = (search = "", title = "All Questions") => {
    setSearch(search);
    setMainTitle(title);
  };

  const handleLogin = () => {
    setLoginState("login");
  };

  const handleSignup = () => {
    setLoginState("signup");
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
      />
      <Main
        title={mainTitle}
        search={search}
        setQuestionPage={setQuestionPage}
        loginState={loginState}
      />
    </div>
  );
}
