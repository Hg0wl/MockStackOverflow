import "./index.css";

const SideBarNav = ({ selected = "", handleQuestions, handleTags }) => {
  return (
    <div id="sideBarNav" className="sideBarNav">
      <div
        id="menu_question"
        className={`menu_button ${selected === "q" ? "menu_selected" : ""}`}
        onClick={() => {
          handleQuestions();
        }}
      >
        <div className="menu-button-container">
          <img
            style={{ width: "20%", height: "20%", margin: "0 5% 0 0" }}
            src="https://cdn-icons-png.flaticon.com/512/61/61951.png"
          ></img>
          Questions
        </div>
      </div>
      <div
        id="menu_tag"
        className={`menu_button ${selected === "t" ? "menu_selected" : ""}`}
        onClick={() => {
          handleTags();
        }}
      >
        <div className="menu-button-container">
          <img
            style={{ width: "20%", height: "20%", margin: "0 5% 0 0" }}
            src="https://cdn-icons-png.flaticon.com/512/126/126422.png"
          ></img>
          Tags
        </div>
      </div>
    </div>
  );
};

export default SideBarNav;
