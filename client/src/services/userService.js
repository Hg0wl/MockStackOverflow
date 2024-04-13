import { REACT_APP_API_URL, api } from "./config";

const USER_API_URL = `${REACT_APP_API_URL}/user`;

// To get Questions by id
const getUserById = async (uid) => {
  console.log("Calling get question by id!");
  const res = await api.get(`${USER_API_URL}/getUserById/${uid}`);

  return res.data;
};

const uploadImage = (file) => {
  console.log(file);
  console.log(file.type.match(/image.*/));
  /* Is the file an image? */
  if (!file || !file.type.match(/image.*/)) return;

  /* It is! */
  document.body.className = "uploading";

  /* Lets build a FormData object*/
  var fd = new FormData(); // I wrote about it: https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
  fd.append("image", file); // Append the file
  var xhr = new XMLHttpRequest(); // Create the XHR (Cross-Domain XHR FTW!!!) Thank you sooooo much imgur.com
  xhr.open("POST", "https://api.imgur.com/3/image.json"); // Boooom!
  xhr.onload = function () {
    // Big win!
    console.log(JSON.parse(xhr.responseText).data.link);
  };

  xhr.setRequestHeader("Authorization", "Client-ID 486a4056dc8671d");

  /* And now, we send the formdata */
  xhr.send(fd);

  console.log(fd);
};

const updateUsername = async (username, uid) => {
    const res = await api.post(`${USER_API_URL}/changeUsername`, {
      username: username,
      uid: uid
    });
    return res.data
}
export { getUserById, uploadImage, updateUsername };
