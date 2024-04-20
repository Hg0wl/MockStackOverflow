import { useState } from "react";
import Form from "../baseComponents/form";
import TextArea from "../baseComponents/textarea";

import { sanitize } from "../../../tool";
import { validateHyperlink } from "../../../tool";
import { addAnswer } from "../../../services/answerService";

const NewAnswer = ({ qid, handleAnswer, loggedInUser }) => {
  const [text, setText] = useState("");
  const [textErr, setTextErr] = useState("");

  /**
   * If the inputted answer is valid, sends it to the server and redirects to the
   * corresponding answer page
   *
   * @returns
   */
  const postAnswer = async () => {
    setText(sanitize(text));

    if (!validateAnswer(text)) {
      return;
    }

    const answer = {
      text: text,
      ans_by: loggedInUser,
      ans_date_time: new Date(),
    };

    const res = await addAnswer(qid, answer);
    if (res && res._id) {
      handleAnswer(qid);
    }
  };

  /**
   * Validates the answer text
   * Ensures answer is not empty and has propery hyperlink format
   *
   * @returns true if it is valid, false otherwise
   */
  const validateAnswer = () => {
    if (!text) {
      setTextErr("Answer text cannot be empty");
      return false;
    }
    // Hyperlink Validation
    if (!validateHyperlink(text)) {
      setTextErr("Invalid hyperlink format.");
      return false;
    }
    return true;
  };

  return (
    <Form>
      <TextArea
        title={"Answer Text"}
        id={"answerTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <div className="btn_indicator_container">
        <button
          className="form_postBtn"
          onClick={() => {
            postAnswer();
          }}
        >
          Post Answer
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewAnswer;
