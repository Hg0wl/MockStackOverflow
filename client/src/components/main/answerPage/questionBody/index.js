import "./index.css";
import Vote from "../vote";
import Author from "../author";
import { handleHyperlink } from "../../../../tool";
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
  console.log(`Asked by: ${askBy}`);
  const [user, setUser] = useState({});
  const [editingTags, setEditing] = useState(false);
  const [tags, setTags] = useState(tagsInit);
  const [tagText, setTagText] = useState("")
  const [tagErr, setTagErr] = useState("")

  useEffect(() => {
    console.log("Calling useEffect");
    const fetchData = async () => {
      let res = await getUserById(loggedInUser);
      setUser(res || []);
    };

    fetchData().catch((e) => console.log(e));
  }, [loggedInUser]);

  const handleDeleteQuestion = async () => {
    let res = await deleteQuestion(qid);
    if (res.success) handleQuestions();
  };

  const handleTagText = async () => {
    let newTags = tagText.split(" ").filter((tag) => tag.trim() != "");
    if (newTags.length + tags.length > 5) {
      setTagErr("Cannot have more than 5 tags");
      return;
    }

    for (let tag of newTags) {
      if (tag.length > 20) {
        setTagErr("New tag length cannot be more than 20");
        return;
      }
    }

    let res = await addTags(newTags, qid)
    if (res.success) {
      setTags(res.tags)
      setEditing(false)
      setTagErr("")
    } else {
      setTagErr("Something went wrong :(")
    }
  }

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
              {tags.map((tag, idx) => {
                return (
                  <button
                    key={idx}
                    className={
                      editingTags
                        ? "question_tag_button_full tag-strikethrough"
                        : "question_tag_button_full"
                    }
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (editingTags) {
                        let res = await removeTag(qid, tag._id)
                        console.log(res)
                        if (res.success) {
                          setTags(res.tags)
                        }
                      } else {
                        clickTag(tag.name);
                      }
                    }}
                  >
                    {tag.name}
                  </button>
                );
              })}
              {user.reputation >= 10000 ? (
                editingTags ? (
                  <>
                    <input className="new-tag-input" onChange={(e) => setTagText(e.target.value)}></input>
                    <button
                      className="edit-confirm"
                      onClick={() => {
                        handleTagText()
                      }}
                    >
                      Done
                    </button> <p className="edit-tag-error">{tagErr}</p>
                  </>
                ) : (
                  <button
                    className="question_tag_button_full"
                    onClick={() => setEditing(true)}
                  >
                    <img
                      className="tag-edit"
                      src="https://www.svgrepo.com/show/304506/edit-pen.svg"
                    />
                  </button>
                )
              ) : (
                <></>
              )}
            </div>
            <Author
              askBy={askBy}
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
