import "./index.css";
import { useState } from "react";
import LoginButtons from "./loginButtons";
import ProfileBanner from "./profileBanner";

const Header = ({
  search,
  setQuestionPage,
  handleLogin,
  handleSignup,
  loggedInUser,
  handleUser,
  setLoggedInUser,
}) => {
  const [val, setVal] = useState(search);

  /**
   * Initiates the search in for the querried questions and sets the home page accordingly
   *
   * @param {*} e The event from the search bar
   */
  const onEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setQuestionPage(e.target.value, "Search Results");
    }
  };

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
              onKeyDown={(e) => onEnter(e)}
            />
          </div>
          {loggedInUser == "" ? (
            <LoginButtons
              handleLogin={handleLogin}
              handleSignup={handleSignup}
            />
          ) : (
            <ProfileBanner
              loggedInUser={loggedInUser}
              handleUser={handleUser}
              setLoggedInUser={setLoggedInUser}
            ></ProfileBanner>
          )}
        </div>
      </div>
  );
};

export default Header;
