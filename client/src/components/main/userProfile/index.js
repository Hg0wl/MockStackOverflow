import "./index.css";
import UserHeader from "./userHeader";
import QAList from "./userHeader/qaList";
import { getUserById } from "../../../services/userService";
import { useState, useEffect } from "react";

const UserProfile = ({ uid, handleAnswer, currentUser, loggedInUser }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      let res = await getUserById(uid);
      setUser(res || []);
    };

    fetchData().catch((e) => console.log(e));
  }, [uid]);

  return (
    <div className="profile">
      <UserHeader
        picture={user && user.profile_pic}
        username={user && user.username}
        joinDate={user && user.join_date}
        reputation={user && user.reputation}
        currentUser={currentUser}
        loggedInUser={loggedInUser}
      />
      <div className="qaLists left-alligned">
        <div className="qaList">
          <div className="qalist-title">Questions</div>
          <div className="list-subtitle">{user.askList ? user.askList.length : 0}</div>
          <QAList
            handleAnswer={handleAnswer}
            items={user && user.askList}
          ></QAList>
        </div>
        <div className="qaList">
          <div className="qalist-title">Answers</div>
          <div className="list-subtitle">{user.ansList ? user.ansList.length : 0}</div>
          <QAList
            items={user && user.ansList}
            handleAnswer={handleAnswer}
          ></QAList>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
