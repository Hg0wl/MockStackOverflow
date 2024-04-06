import "./index.css"
import { useState } from "react"
import LoginButtons from "./loginButtons"

const Header = ({search, setQuestionPage}) => {
    const [val, setVal] = useState(search)
    return (
      <div id="header" className="header">
        <div></div>
        <img src="https://i.imgur.com/iC106zH.png"></img>
        <div id="searchBar">
          <input
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
        <LoginButtons />
      </div>
    );
}

export default Header