import "./index.css"
import { getMetaData, getPreviewText } from "../../../../../../tool";


const ListItem = ({votes, title, date, qid, handleAnswer}) => {
    return (
      <div className="list-item-container">
        <div className="list-votes">
          <>{votes}</>
        </div>
        <div className="list-title" onClick={() => handleAnswer(qid)}>{getPreviewText(title, 60)}</div>
        <div className="list-meta">{getMetaData(new Date(date))}</div>
      </div>
    );
}

export default ListItem