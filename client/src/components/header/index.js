import "./index.css"
import { useState } from "react"
import LoginButtons from "./loginButtons"

const Header = ({ search, setQuestionPage, handleLogin, handleSignup }) => {
  const [val, setVal] = useState(search);
  return (
    <div className="header_container">
      <div className="purpleLine"></div>
      <div id="header" className="header">
        <div></div>
        <img className="logo" src="https://i.imgur.com/iC106zH.png"></img>
        <div id="searchBar">
          <input
            className="search_bar"
            placeholder="Search ..."
            type="text"
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setQuestionPage(e.target.value, "Search Results");
              }
            }}
          />
        </div>
        {/*Add if statement to check if user is logged in*/}
        <LoginButtons handleLogin={handleLogin} handleSignup={handleSignup} />
      </div>
    </div>
  );
};

export default Header