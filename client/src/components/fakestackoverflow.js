import React from "react";
import Header from "./header";
import Main from "./main";
import { useState } from "react";

export default function fakeStackOverflow() {
  const [search, setSearch] = useState("");

  const setQuesitonPage = (search = "", title = "All Questions") => {
    //TODO: implement
    console.log("set question page");
  };

  return (
    <div id="root">
      <Header search={search} setQuesitonPage={setQuesitonPage} />
      <Main
        title={"All Questions"}
        search={search}
        setQuesitonPage={setQuesitonPage}
      />
    </div>
  );
}
