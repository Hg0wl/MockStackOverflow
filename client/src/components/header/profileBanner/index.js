import "./index.css";
import { getUserById } from "../../../services/userService";
import { useState, useEffect } from "react";
import { getPreviewText } from "../../../tool";
import { logout } from "../../../services/loginService";

const ProfileBanner = ({ loggedInUser, handleUser, setLoggedInUser }) => {
  let [user, setProfileUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      let res = await getUserById(loggedInUser);
      setProfileUser(res || {});
    };
    fetchData().catch((e) => console.log(e));
  }, [loggedInUser]);

  const handleLogout = async () =>{
    await logout()
    setLoggedInUser("")
  }

  try {
    return (
      <div className="profile-wrapper">
        <div onClick={() => handleUser(user._id)} className="profile-banner">
          <img src={user.profile_pic} className="profile-image"></img>
          <div className="profile-username">
            {getPreviewText(user.username, 15)}
          </div>
          <div className="profile-reputation">{user.reputation}</div>
        </div>
        <img onClick={()=> handleLogout()} className="logout-button" src="https://cdn1.iconfinder.com/data/icons/heroicons-ui/24/logout-512.png"></img>
      </div>
    );
  } catch (error) {
    return <></>;
  }
};

export default ProfileBanner;
