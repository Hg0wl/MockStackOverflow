import { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import TextArea from "../baseComponents/textarea";
import "./index.css";
import { validateHyperlink } from "../../../tool";

import { addQuestion } from "../../../services/questionService";

const NewQuestion = ({ handleQuestions, loggedInUser }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");

  const [titleErr, setTitleErr] = useState("");
  const [textErr, setTextErr] = useState("");
  const [tagErr, setTagErr] = useState("");

  /**
   * Validates the inputted question and, if valid, sends the data to the server
   * and redirects to the questions page
   */
  const postQuestion = async () => {
    let tags = tag.split(" ").filter((tag) => tag.trim() != "");

    let validTitle = validateTitleText();
    let validTags = validateTags(tags);
    let validText = validateText();

    if (!(validTitle && validTags && validText)) return;

    const question = {
      title: title,
      text: text,
      tags: tags,
      asked_by: loggedInUser,
      ask_date_time: new Date(),
    };

    const res = await addQuestion(question);
    if (res && res._id) {
      handleQuestions();
    }
  };

  /**
   * Validates the title text by ensuring it is not empty and does not exceed 100 characters
   *
   * @returns true if the title text is valid, false otherwise
   */
  const validateTitleText = () => {
    console.log("validating title");
    if (!title) {
      setTitleErr("Title cannot be empty");
      return false;
    } else if (title.length > 100) {
      setTitleErr("Title cannot be more than 100 characters");
      return false;
    }

    return true;
  };

  /**
   * Validates the body text by ensuring it is not empty and hyperlink formats are valid
   *
   * @returns true if the body text is valid, false otherwise
   */
  const validateText = () => {
    console.log("validating text");

    if (!text) {
      setTextErr("Question text cannot be empty");
      return false;
    }

    //Hyperlink validation
    if (!validateHyperlink(text)) {
      setTextErr("Invalid hyperlink format.");
      return false;
    }

    return true;
  };

  /**
   * Validates that the inputted tags are valid by ensuring there are less than 6 of them
   * and none of their lengths exceeds 20 characters.
   *
   * @param {*} tags a list of tag strings to validate
   * @returns true if all tags are valid, false otherwise
   */
  const validateTags = (tags) => {
    console.log("validating tags");

    if (tags.length > 5) {
      setTagErr("Cannot have more than 5 tags");
      return false;
    }

    for (let tag of tags) {
      if (tag.length > 20) {
        setTagErr("New tag length cannot be more than 20");
        return false;
      }
    }

    return true;
  };

  return (
    <Form>
      <Input
        title={"Question Title"}
        hint={"100 character limit"}
        id={"formTitleInput"}
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <TextArea
        title={"Question Text"}
        hint={"Add details"}
        id={"formTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <Input
        title={"Tags"}
        hint={"Add keywords separated by whitespace"}
        id={"formTagInput"}
        val={tag}
        setState={setTag}
        err={tagErr}
      />
      <div className="btn_indicator_container">
        <button
          className="form_postBtn"
          onClick={() => {
            postQuestion();
          }}
        >
          Post Question
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewQuestion;
