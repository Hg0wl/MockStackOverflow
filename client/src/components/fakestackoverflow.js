import React, { useEffect } from "react";
import Header from "./header";
import Main from "./main";
import { useState, useCallback } from "react";

export default function fakeStackOverflow() {
  const [search, setSearch] = useState("");
  const [loginState, setLoginState] = useState("");

  const setQuesitonPage = (search = "", title = "All Questions") => {
    //TODO: implement
    console.log("set question page");
  };

  const handleLogin = () => {
    setLoginState("login");
  };

  const handleSignup = () => {
    setLoginState("signup")
  }

  useEffect(() => {if (loginState != "")  {setLoginState("")}}, [loginState])

  return (
    <div id="root">
      <Header
        search={search}
        setQuesitonPage={setQuesitonPage}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
      />
      <Main
        title={"All Questions"}
        search={search}
        setQuesitonPage={setQuesitonPage}
        loginState={loginState}
      />
    </div>
  );
}
