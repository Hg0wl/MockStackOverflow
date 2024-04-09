import { useEffect, useState } from "react";
import "./index.css";
import Tag from "./tag";
//import { getTagsWithQuestionNumber } from "../../../services/tagService";

const TagPage = ({ clickTag, handleNewQuestion }) => {
  const [tlist, setTlist] = useState([
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java-script", qcnt: 200 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 },
    { name: "java", qcnt: 1 }
  ]);

  // Should use this to read questions from server
  /*
  useEffect(() => {
    const fetchData = async () => {
      let res = await getTagsWithQuestionNumber();
      setTlist(res || []);
    };

    fetchData().catch((e) => console.log(e));
  }, []); */
  return (
    <div className="q_header">
      <div className="header_row">
        <div className="bold_title left-alligned">Tags</div>
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
        <div className="left-alligned" id="question_count">
          {tlist.length} Tags
        </div>
      </div>
      <div className="tag_list right_padding">
        {tlist.map((t, idx) => (
          <Tag key={idx} t={t} clickTag={clickTag} />
        ))}
      </div>
    </div>
  );
};

export default TagPage;
