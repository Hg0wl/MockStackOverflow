import "./index.css";
import OrderButton from "./orderButton";

const QuestionHeader = ({
  title_text,
  qcnt,
  setQuestionOrder,
  handleNewQuestion,
}) => {
  return (
    <div className="q_header">
      <div className="header_row">
        <div className="bold_title left-alligned">
          {title_text}
        </div>
        <button
          className="bluebtn right-alligned"
          onClick={() => {
            handleNewQuestion();
          }}
        >
          Ask a Question
        </button>
      </div>
      <div className="header_row underline">
        <div className="left-alligned" id="question_count">{qcnt} questions</div>
        <div className="btns right-alligned">
          {["Newest", "Active", "Unanswered"].map((m, idx) => (
            <OrderButton
              key={idx}
              message={m}
              setQuestionOrder={setQuestionOrder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;
