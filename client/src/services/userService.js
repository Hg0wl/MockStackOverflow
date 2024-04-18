import { REACT_APP_API_URL, api } from "./config";

const USER_API_URL = `${REACT_APP_API_URL}/user`;

// To get Questions by id
const getUserById = async (uid) => {
  const res = await api.get(`${USER_API_URL}/getUserById/${uid}`);

  return res.data;
};

const uploadImage = async (file, uid) => {
  /* Is the file an image? */
  if (!file || !file.type.match(/image.*/)) return;

  /* It is! */
  document.body.className = "uploading";

  /* Lets build a FormData object*/
  var fd = new FormData(); 
  fd.append("image", file); // Append the file
  var xhr = new XMLHttpRequest(); // Create the XHR 
  xhr.open("POST", "https://api.imgur.com/3/image.json");
  let pfp = "https://i.pinimg.com/originals/03/3f/fd/033ffd18548bfa8b8645c2576c3f8739.jpg"
  xhr.onload = function () {
    // Big win!
    pfp = JSON.parse(xhr.responseText).data.link;
  };

  xhr.setRequestHeader("Authorization", "Client-ID 486a4056dc8671d");

  /* And now, we send the formdata */
  xhr.send(fd);

  const res = await api.post(`${USER_API_URL}/changeProfilePicture`, {link: pfp, uid: uid})
  return res.data
};

const updateUsername = async (username, uid) => {
    const res = await api.post(`${USER_API_URL}/changeUsername`, {
      username: username,
      uid: uid
    });
    return res.data
}
export { getUserById, uploadImage, updateUsername };
