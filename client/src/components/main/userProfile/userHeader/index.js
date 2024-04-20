import "./index.css";
import { getMetaData, sanitize } from "../../../../tool";
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

  /**
   * Called when making a change to a user's username
   * If the inputted username is valid, sends a request to the server to update it
   */
  const handleChangeUsername = async () => {
    let nameToSet = sanitize(newUsername.trim());
    setNewUsername(nameToSet);
    
    if (nameToSet == currentUsername) {
      setEditing(false);
      return;
    }

    if (validateUsername(nameToSet)) {
      const res = await updateUsername(nameToSet, loggedInUser);

      if (res.success) {
        setCurrentUsername(nameToSet);
        setEditing(false);
      } else {
        setErrorMessage("Someone else already has that username");
      }
    }
  };

  /**
   * Validates the given username
   *
   * @param {*} nameToSet The username to validate
   * @returns True if the username is valid false otherwise
   */
  const validateUsername = (nameToSet) => {
    if (nameToSet.replace(/\s/g, "") == "") {
      setErrorMessage("New username cannot be empty");
      return false;
    }
    return true;
  };

  /**
   * Sends a request to the server to change the user's profile picture to the inputted picture
   *
   * @param {*} file the new profile picture
   */
  const handleChangeProfilePicture = async (file) => {
    let res = await uploadImage(file, loggedInUser);

    if (res.success) {
      setPicture(res.link);
    }
  };

  /**
   * Renders the username based on if the profile being looked at belongs to the current user or not
   * 
   * @returns a react component representing the usr's username.  
   */
  const renderUsername = () => {
    if (currentUser) {
      if (editingUsername) {
        return (
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
        );
      } else {
        return (
          <div className="edit-username-container">
            <p className="header-username">{currentUsername}</p>
            <div id="startEditing" onClick={() => setEditing(true)}>
              <img
                id="startEditing"
                className="edit-icon"
                src="https://www.svgrepo.com/show/304506/edit-pen.svg"
                alt="Edit Username"
              ></img>
            </div>
          </div>
        );
      }
    }

    return <p className="header-username">{currentUsername}</p>;
  };

  useEffect(() => {
    setPicture(picture);
  }, [picture]);

  useEffect(() => {
    setCurrentUsername(username);
    setNewUsername(username);
    setErrorMessage("");
  }, [username]);

    return (
      <div className="user-header">
        {currentUser ? (
          <label htmlFor="file-upload" className="left-alligned upload-image">
            <img src={pfp} className="header-profile" alt="Profile Picture"></img>
          </label>
        ) : (
          <img src={pfp} className="left-alligned header-profile" alt="Profile Picture"></img>
        )}
        <input
          type="file"
          id="file-upload"
          onChange={(files) =>
            handleChangeProfilePicture(files.target.files[0])
          }
        ></input>
        <div className="user-header-info">
          {renderUsername()}
          <p className="user-header-meta">
            Joined {getMetaData(new Date(joinDate))}
          </p>
          <p className="user-header-meta">{reputation} Reputation</p>
        </div>
      </div>
    );
};

export default UserHeader;
