import "./index.css"
import { getMetaData, getPreviewText } from "../../../../../../tool";


const ListItem = ({votes, title, date}) => {
    return (
      <div className="list-item-container">
        <div className="list-votes">
          <>{votes}</>
        </div>
        <div className="list-title">{getPreviewText(title, 60)}</div>
        <div className="list-meta">{getMetaData(date)}</div>
      </div>
    );
}

export default ListItem