import "./index.css";
import { getMetaData } from "../../../../tool";
import { useEffect, useState } from "react";
import { uploadImage, updateUsername } from "../../../../services/userService";

const UserHeader = ({
  picture,
  username,
  joinDate,
  reputation,
  currentUser,
  loggedInUser,
}) => {
  const [editingUsername, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newUsername, setNewUsername] = useState(username);
  const [currentUsername, setCurrentUsername] = useState(username);
  const [pfp, setPicture] = useState(picture);

  const handleChangeUsername = async () => {
    setNewUsername(newUsername.trim());
    let nameToSet = newUsername.trim();
    if (nameToSet == currentUsername) {
      setEditing(false);
    } else if (nameToSet.replace(/\s/g, "") == "") {
      setErrorMessage("New username cannot be empty");
    } else {
      const res = await updateUsername(nameToSet, loggedInUser);

      if (res.success) {
        setCurrentUsername(nameToSet);
        setEditing(false);
      } else {
        setErrorMessage("Someone else already has that username");
      }
    }
  };

  const handleChangeProfilePicture = async (file) => {
    let res = await uploadImage(file, loggedInUser);

    if (res.success) {
      setPicture(res.link);
    }
  };

  useEffect(() => {setPicture(picture);}, [picture])

  useEffect(() => {
    setCurrentUsername(username);
    setNewUsername(username);
    setErrorMessage("")
  }, [username]);

  try {
    return (
      <div className="user-header">
        {currentUser ? (
          <label htmlFor="file-upload" className="left-alligned upload-image">
            <img src={pfp} className="header-profile"></img>
          </label>
        ) : (
          <img src={pfp} className="left-alligned header-profile"></img>
        )}
        <input
          type="file"
          id="file-upload"
          onChange={(files) =>
            handleChangeProfilePicture(files.target.files[0])
          }
        ></input>
        <div className="user-header-info">
          {currentUser ? (
            editingUsername ? (
              <div className="username-input-container">
                <input
                  id="newUsernameInput"
                  className="username-input"
                  defaultValue={currentUsername}
                  placeholder="Enter Username..."
                  onChange={(e) => setNewUsername(e.target.value)}
                ></input>
                <button
                  id="changeProfileDoneBtn"
                  className="username-input-buttons"
                  onClick={() => handleChangeUsername()}
                >
                  Done
                </button>
                <button
                  id="changeProfileCancelBtn"
                  className="username-input-buttons"
                  onClick={() => {
                    setEditing(false);
                    setNewUsername(currentUsername);
                  }}
                >
                  Cancel
                </button>
                <p className="username-error-profile">{errorMessage}</p>
              </div>
            ) : (
              <div className="edit-username-container">
                <p className="header-username">{currentUsername}</p>
                <div id="startEditing" onClick={() => setEditing(true)}>
                  <img
                    id="startEditing"
                    className="edit-icon"
                    src="https://www.svgrepo.com/show/304506/edit-pen.svg"
                  ></img>
                </div>
              </div>
            )
          ) : (
            <p className="header-username">{currentUsername}</p>
          )}
          <p className="user-header-meta">
            Joined {getMetaData(new Date(joinDate))}
          </p>
          <p className="user-header-meta">{reputation} Reputation</p>
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <></>;
  }
};

export default UserHeader;
