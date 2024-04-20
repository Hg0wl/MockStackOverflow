import "./index.css";
import ListItem from "./listItem";

const QAList = ({ items, handleAnswer }) => {
  /**
   * Renders the list of items as ListItems if items is not null
   * 
   * @returns A list of ListItem components 
   */
  const renderItems = () => {
    if (items) {
      return items.map((i, idx) => {
        return (
          <ListItem
            votes={i.upvotes.length - i.downvotes.length}
            title={i.title}
            date={i.ask_date_time}
            qid={i._id}
            handleAnswer={handleAnswer}
            key={idx}
          ></ListItem>
        );
      });
    } else {
      return <></>;
    }
  };

  return <div className="list-container">{renderItems()}</div>;
};

export default QAList;
