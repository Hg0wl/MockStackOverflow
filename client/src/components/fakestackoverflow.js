import React from "react";
import Header from "./header";
import { useState } from "react";

export default function fakeStackOverflow() {
    const [search, setSearch] = useState("");

    const setQuesitonPage = (search = "", title = "All Questions") => {
      console.log("set question page")
    };

    return (
      <div>
        <Header search={search} setQuesitonPage={setQuesitonPage} />
      </div>
    );
}
