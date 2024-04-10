import "./index.css";

const OrderButton = ({ message, setQuestionOrder, questionOrder }) => {
  return (
    <button
      className={message.toLowerCase() == questionOrder.toLowerCase() ? "btn-select":"btn"}
      onClick={() => {
        setQuestionOrder(message);
      }}
    >
      {message}
    </button>
  );
};

export default OrderButton;
