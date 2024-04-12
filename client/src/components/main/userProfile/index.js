import "./index.css";
import UserHeader from "./userHeader";
import QAList from "./userHeader/qaList";
import { getUserById } from "../../../services/userService";
import { useState, useEffect } from "react";

const UserProfile = ({ uid, handleAnswer }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    console.log("Calling useEffect");
    const fetchData = async () => {
      let res = await getUserById(uid);
      setUser(res || []);
    };

    fetchData().catch((e) => console.log(e));
  }, [uid]);

  console.log(user);

  try {
    console.log(user.username);
    return (
      <div className="profile">
        <UserHeader
          picture={user.profile_pic}
          username={user.username}
          joinDate={user.join_date}
          reputation={user.reputation}
        />
        <div className="qaLists left-alligned">
          <div className="qaList">
            <div className="qalist-title">Questions</div>
            <div className="list-subtitle">{user.askList.length}</div>
            <QAList
              /*
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
              ]}*/
              handleAnswer={handleAnswer}
              items={user.askList}
            ></QAList>
          </div>

          <div className="qaList">
            <div className="qalist-title">Answers</div>
            <div className="list-subtitle">{user.ansList.length}</div>
            <QAList
              /*
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
              ]} */
              items={user.ansList}
              handleAnswer={handleAnswer}
            ></QAList>
          </div>
        </div>
      </div>
    );
  } catch {
    return <></>;
  }
};

export default UserProfile;
