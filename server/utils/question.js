const Tag = require("../models/tags");
const Question = require("../models/questions");

/**
 * @returns A list of every Question object stored in the database
 */
const getQuestions = () => {
  return Question.find({})
    .populate("answers")
    .populate("tags")
    .populate("asked_by");
};

/**
 * Adds the given tag to the database if it is not there already
 *
 * @param {*} tname The name of the tag to add
 * @returns The id of the Tag object with the given name
 */
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

/**
 * @param {*} order The order to sort the questions in. Should be either "active", "unanswered", or "newest"
 * @returns A list of all Question objects in the database sorted by the given order
 */
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

/**
 * @param {*} qlist The list of questions to sort
 * @param {*} search The string to filter the questions by
 * @returns The given list of questions filtered with the given search criteria
 */
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

/**
 * Finds tags in the given search criteria
 *
 * @param {*} search The search criteria to find tags in
 * @returns A list of tags found in the given search criteria
 */
const parseTags = (search) => {
  return (search.match(/\[([^\]]+)\]/g) || []).map((word) => word.slice(1, -1));
};

/**
 * Finds keywords in the given search criteria
 *
 * @param {*} search The search criteria to find keywords in
 * @returns A list of keywords found in the given serach criteria
 */
const parseKeyword = (search) => {
  return search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];
};

/**
 * Returns true if the given qusetion has one of the tags in the given list of tags
 *
 * @param {*} q The question to check for tags in
 * @param {*} taglist The list of tags to check for
 * @returns True if the given question contains one of the tags and false otherwise.
 */
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

/**
 * Checks to see if the given question contains any of the given keywords
 *
 * @param {*} q The question to check for keywords
 * @param {*} keywordlist The list of keywords to check for
 * @returns True if the given question has one of the given keywords and false otherwise
 */
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

/**
 * Filters the given list of questions for questions that are unanswered
 *
 * @param {*} questions The list of questions to filter
 * @returns A list of questions containing only unanswered questions
 */
const getUnansweredQuestion = (questions) => {
  return getNewestQuestion(questions).filter((q) => q.answers.length == 0);
};

/**
 * @param {*} questions The list of questions to sors
 * @returns The given list of quetsion sorted by their most recent answer dates
 */
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

/**
 * @param {*} questions The list of questions to sort
 * @returns The given list of questions sorted by the time they were asked
 */
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

/**
 * @param {*} id The id to search for
 * @param {*} tags The list of tags to search in
 * @returns Finds the tag in the given list that has the given id. Returns null if such a tag is not found.
 */
const getTagById = (id, tags) => {
  for (let t of tags) {
    if (t.tid == id) {
      return t;
    }
  }

  return null;
};

module.exports = {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
  getTagById,
};
