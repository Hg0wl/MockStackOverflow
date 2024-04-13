import "./index.css"
import { getMetaData, getPreviewText } from "../../../../../../tool";


const ListItem = ({votes, title, date, qid, handleAnswer}) => {
    const getSmallerMetaData = (date) => {
        let string = getMetaData(new Date(date));

        if (string.includes("at")) {
            return string.substring(0, string.indexOf("at") - 1)
        } 

        return string
    } 

    return (
      <div className="list-item-container">
        <div className="list-votes">
          <>{votes}</>
        </div>
        <div className="list-title" onClick={() => handleAnswer(qid)}>{getPreviewText(title, 60)}</div>
        <div className="list-meta">{getSmallerMetaData(date)}</div>
      </div>
    );
}

export default ListItem