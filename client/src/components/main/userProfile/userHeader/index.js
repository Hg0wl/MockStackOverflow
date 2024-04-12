import "./index.css";
import { getMetaData } from "../../../../tool";


const UserHeader = ({ picture, username, joinDate, reputation }) => {
    try {
  return (
    <div className="user-header">
      <img src={picture} className="header-profile left-alligned"></img>
      <div className="user-header-info">
        <p className="header-username">{username}</p>
        <p className="user-header-meta">Joined {getMetaData(new Date(joinDate))}</p>
        <p className="user-header-meta">{reputation} Reputation</p>
      </div>
    </div>
  ); } catch (error) {return (<></>)}
};

export default UserHeader;
