import "./index.css";
import { getMetaData, getPreviewText } from "../../../../../../tool";

const ListItem = ({ votes, title, date, qid, handleAnswer }) => {
  /**
   * Formats metadata to fit into the ui
   * 
   * @param {*} date the date as a string
   * @returns a shorter version of the inputted string cutting off everyting after "at"
   */
  const getSmallerMetaData = (date) => {
    let string = getMetaData(new Date(date));

    if (string.includes("at")) {
      return string.substring(0, string.indexOf("at") - 1);
    }

    return string;
  };

  return (
    <div className="list-item-container">
      <div className="list-votes">
        <>{votes}</>
      </div>
      <div className="list-title" onClick={() => handleAnswer(qid)}>
        {getPreviewText(title, 60)}
      </div>
      <div className="list-meta">{getSmallerMetaData(date)}</div>
    </div>
  );
};

export default ListItem;
