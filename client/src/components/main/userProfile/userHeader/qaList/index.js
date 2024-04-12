import "./index.css";
import ListItem from "./listItem";

const QAList = ({ items, handleAnswer }) => {
    try {
  return (
    <div className="list-container">
      {items.map((i, idx) => {
        return (
          <ListItem
            votes={i.votes}
            title={i.title}
            date={i.ask_date_time}
            qid={i._id}
            handleAnswer={handleAnswer}
            key={idx}
          ></ListItem>
        );
      })}
    </div>
  ); } catch (error) {return (<></>)}
};

export default QAList;
