import "./index.css";
import Vote from "../vote";
import Author from "../author";
import { handleHyperlink, sanitize } from "../../../../tool";
import { useState, useEffect } from "react";
import { getUserById } from "../../../../services/userService";
import { removeTag, addTags } from "../../../../services/questionService";
import {
  upvoteQuestion,
  downvoteQuestion,
  deleteQuestion,
} from "../../../../services/questionService";

// Component for the Question's Body
const QuestionBody = ({
  text,
  askBy,
  tagsInit,
  meta,
  clickTag,
  numAnswers,
  handleUser,
  qid,
  initVotes,
  initVoteStatus,
  loggedInUser,
  handleLogin,
  handleQuestions,
}) => {
  const [user, setUser] = useState({});
  const [editingTags, setEditing] = useState(false);
  const [tags, setTags] = useState(tagsInit);
  const [tagText, setTagText] = useState("");
  const [tagErr, setTagErr] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let res = await getUserById(loggedInUser);
      setUser(res || []);
    };

    fetchData().catch((e) => console.log(e));
  }, [loggedInUser]);

  useEffect(() => {
    setTags(tagsInit);
  }, [tagsInit]);

  /**
   * Deletes the current question from the server and returns to the home page if successful
   */
  const handleDeleteQuestion = async () => {
    let res = await deleteQuestion(qid);
    if (res.success) handleQuestions();
  };

  /**
   * Used for editing tags
   * Parses text input and if it is valid adds those tags to this question
   */
  const handleTagText = async () => {
    if (tagText != null) {
      let newTags = tagText
        .split(" ")
        .filter((tag) => tag.trim() != "")
        .map((tag) => sanitize(tag));

      if (!validateTags(newTags, tags)) {
        return;
      }

      let res = await addTags(newTags, qid);
      if (res.success) {
        setTags(res.tags);
        setTagText("");
        setEditing(false);
        console.log("Setting rendering to false");
        setTagErr("");
      } else {
        setTagErr("Something went wrong :(");
      }
    }
  };

  /**
   * Validates that the given list of tags is valid
   *
   * @param {*} newTags A list of strings representing new tags to be added to the question
   * @returns true if the list of tags is valid, false otherwise
   */
  const validateTags = (newTags) => {
    if (newTags.length + tags.length > 5) {
      setTagErr("Cannot have more than 5 tags");
      return false;
    }

    for (let tag of newTags) {
      if (tag.length > 20) {
        setTagErr("New tag length cannot be more than 20");
        return false;
      }
    }

    return true;
  };

  /**
   * Logic for what should happen when clicking a tag
   * If currently editing tags, deletes the tag
   * Otherwise, redirects to home page to view other questions with the same tag
   *
   * @param {*} e The action event for the click
   */
  const handleClickTag = async (e, tag) => {
    e.stopPropagation();
    if (editingTags) {
      let res = await removeTag(qid, tag._id);
      if (res.success) {
        setTags(res.tags);
      }
    } else {
      clickTag(tag.name);
    }
  };

  /**
   * Renderst the tag buttons
   * @returns A list of react components representing tag buttons
   */
  const renderTags = () => {
    console.log(tags);
    if (tags != null) {
      return tags.map((tag, idx) => {
        return (
          <button
            key={idx}
            className={
              editingTags
                ? "question_tag_button_full tag-strikethrough"
                : "question_tag_button_full"
            }
            onClick={async (e) => handleClickTag(e, tag)}
          >
            {tag.name}
          </button>
        );
      });
    }
  };

  /**
   * If the current user has more that 10,000 reputation, rendersthe appropriat ui
   * If the user is currently editing the tags, renders an text input box and "Done" button
   * Otherwise renders a button that allows the user to start editing
   * @returns A react component representing a field to edit tags
   */
  const renderEditTags = () => {
    if (user.reputation >= 10000) {
      if (editingTags) {
        return (
          <>
            <input
              className="new-tag-input"
              onChange={(e) => setTagText(e.target.value)}
            ></input>
            <button
              className="edit-confirm"
              onClick={() => {
                handleTagText();
              }}
            >
              Done
            </button>
            <p className="edit-tag-error">{tagErr}</p>
          </>
        );
      } else {
        return (
          <button
            className="question_tag_button_full"
            onClick={() => setEditing(true)}
          >
            <img
              className="tag-edit"
              src="https://www.svgrepo.com/show/304506/edit-pen.svg"
            />
          </button>
        );
      }
    }
    return <></>;
  };

  return (
    <div id="questionBody" className="questionBody right_padding">
      <div className="answer_question_text">
        <Vote
          handleDownvote={downvoteQuestion}
          handleUpvote={upvoteQuestion}
          initVotes={initVotes}
          id={qid}
          initVoteStatus={initVoteStatus}
          loggedInUser={loggedInUser}
          handleLogin={handleLogin}
          handleDelete={handleDeleteQuestion}
        ></Vote>

        <div className="question-body">
          {handleHyperlink(text)}
          <div className="answer_question_right">
            <div className="question_tags">
              {renderTags()}
              {renderEditTags()}
            </div>
            <Author
              username={askBy && askBy.username}
              profile_pic={askBy && askBy.profile_pic}
              aid={askBy && askBy._id}
              reputation={askBy && askBy.reputation}
              meta={"Asked " + meta}
              handleUser={handleUser}
            ></Author>
            <div className="num_answers">
              {numAnswers} {numAnswers != 1 ? "Answers" : "Answer"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBody;
