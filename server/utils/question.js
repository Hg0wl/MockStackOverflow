const Tag = require("../models/tags");
const Question = require("../models/questions");

const getQuestions = () => {
  return Question.find({})
    .populate("answers")
    .populate("tags")
    .populate("asked_by");
};

const addTag = async (tname) => {
  let tag = await Tag.findOne({ name: { $eq: tname } });

  if (tag != null) {
    return tag._id;
  }

  let newTag = new Tag({ name: tname });
  if (tname == "javascript") {
    newTag._id = "65e9a5c2b26199dbcc3e6dc8";
  }
  newTag.save();
  return newTag._id;
};

const getQuestionsByOrder = async (order) => {
  let qlist = await getQuestions();
  if (order == "active") {
    qlist = getActiveQuestion(qlist);
  } else if (order == "unanswered") {
    qlist = getUnansweredQuestion(qlist);
  } else {
    qlist = getNewestQuestion(qlist);
  }
  return qlist;
};

const filterQuestionsBySearch = (qlist, search) => {
  let searchTags = parseTags(search);
  let searchKeyword = parseKeyword(search);

  const res = qlist.filter((q) => {
    if (searchKeyword.length == 0 && searchTags.length == 0) {
      return true;
    } else if (searchKeyword.length == 0) {
      return checkTagInQuestion(q, searchTags);
    } else if (searchTags.length == 0) {
      return checkKeywordInQuestion(q, searchKeyword);
    } else {
      return (
        checkKeywordInQuestion(q, searchKeyword) ||
        checkTagInQuestion(q, searchTags)
      );
    }
  });

  return res;
};

const parseTags = (search) => {
  return (search.match(/\[([^\]]+)\]/g) || []).map((word) => word.slice(1, -1));
};

const parseKeyword = (search) => {
  return search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];
};

const checkTagInQuestion = (q, taglist) => {
  for (let tag of taglist) {
    for (let tid of q.tags) {
      if (tag == tid.name) {
        return true;
      }
    }
  }

  return false;
};

const checkKeywordInQuestion = (q, keywordlist) => {
  for (let w of keywordlist) {
    if (
      q.title.toLowerCase().includes(w.toLowerCase()) ||
      q.text.toLowerCase().includes(w.toLowerCase())
    ) {
      return true;
    }
  }

  return false;
};

const getUnansweredQuestion = (questions) => {
  return getNewestQuestion(questions).filter((q) => q.answers.length == 0);
};

const getActiveQuestion = (questions) => {
  questions.forEach((q) => {
    q.answers.forEach((a) => {
      if (q.newAnsDate == null || q.newAnsDate < a.ans_date_time) {
        q.newAnsDate = a.ans_date_time;
      }
    });
  });

  return getNewestQuestion(questions).sort((a, b) => {
    if (!a.newAnsDate) {
      return 1;
    } else if (!b.newAnsDate) {
      return -1;
    }

    if (a.newAnsDate > b.newAnsDate) {
      return -1;
    } else if (a.newAnsDate < b.newAnsDate) {
      return 1;
    } else {
      return 0;
    }
  });
};

const getNewestQuestion = (questions) => {
  return questions.sort((a, b) => {
    if (a.ask_date_time > b.ask_date_time) {
      return -1;
    } else if (a.ask_date_time < b.ask_date_time) {
      return 1;
    } else {
      return 0;
    }
  });
};

const getTagById = (id, tags) => {
  for (let t of tags) {
    if (t.tid == id) {
      return t;
    }
  }

  return null;
};

module.exports = { addTag, getQuestionsByOrder, filterQuestionsBySearch, getTagById };
