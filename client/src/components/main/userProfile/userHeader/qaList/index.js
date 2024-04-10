import "./index.css";
import ListItem from "./listItem";

const QAList = ({ items }) => {
  return (
    <div className="list-container">
      {items.map((i, idx) => {
        return (
          <ListItem
            votes={i.votes}
            title={i.title}
            date={i.ask_date_time}
            key={idx}
          ></ListItem>
        );
      })}
    </div>
  );
};

export default QAList;
