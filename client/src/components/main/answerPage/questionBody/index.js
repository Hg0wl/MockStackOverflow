import "./index.css";
import React from "react";
import Vote from "../vote";
import Author from "../author";
import { handleHyperlink } from "../../../../tool";

// Component for the Question's Body
const QuestionBody = ({
  text,
  askby,
  tags,
  meta,
  clickTag,
  numAnswers,
  handleUser,
}) => {
  return (
    <div id="questionBody" className="questionBody right_padding">
      <div className="answer_question_text">
        <Vote
          handleDownvote={() => {}}
          handleUpvote={() => {}}
          initVotes={0}
        ></Vote>

        <div className="question-body">
          {handleHyperlink(text)}
          <div className="answer_question_right">
            <div className="question_tags">
              {tags.map((tag, idx) => {
                return (
                  <button
                    key={idx}
                    className="question_tag_button_full"
                    onClick={(e) => {
                      e.stopPropagation();
                      clickTag(tag.name);
                    }}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
            <Author
              askby={askby}
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
