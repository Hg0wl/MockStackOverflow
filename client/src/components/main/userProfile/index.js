import "./index.css";
import UserHeader from "./userHeader";
import QAList from "./userHeader/qaList";

const UserProfile = ({ user }) => {
  return (
    <div className="profile">
      <UserHeader
        picture="https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"
        username="Blue Toad"
        joinDate={new Date()}
        reputation={200}
      />
      <div className="qaLists left-alligned">
        <div className="qaList">
          <div className="qalist-title">Questions</div>
          <div className="list-subtitle">2</div>
          <QAList
            items={[
              { votes: 10, title: "Acid Hues", ask_date_time: new Date() },
              {
                votes: 30,
                title: "Calamari Inkantation",
                ask_date_time: new Date(),
              },
              {
                votes: 450,
                title:
                  "Some arbitrarally long title idk I can't think of anything else popopopopopopopoppopopopopopop",
                ask_date_time: new Date(),
              },
            ]}
          ></QAList>
        </div>

        <div className="qaList">
          <div className="qalist-title">Answers</div>
          <div className="list-subtitle">2</div>
          <QAList
            items={[
              { votes: 10, title: "Acid Hues", ask_date_time: new Date() },
              {
                votes: 30,
                title: "Calamari Inkantation",
                ask_date_time: new Date(),
              },
              {
                votes: 450,
                title:
                  "Some arbitrarally long title idk I can't think of anything else popopopopopopopoppopopopopopop",
                ask_date_time: new Date(),
              },
            ]}
          ></QAList>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
