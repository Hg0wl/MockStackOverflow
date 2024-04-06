import SideBarNav from "./sidebarNav"
import { useState } from "react";


const Main = ({ search = "", title, setQuesitonPage }) => {
const [page, setPage] = useState("home");

    const handleQuestions = () => {
      setQuesitonPage();
      setPage("home");
    };

    const handleTags = () => {
      setPage("tag");
    };

return (
  <div id="main" className="main">
    <SideBarNav
      selected={""}
      handleQuestions={handleQuestions}
      handleTags={handleTags}
    />
    
    {/*Add center content here*/}
  </div>
);
}

export default Main;