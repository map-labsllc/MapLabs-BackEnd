const express = require('express');
const router = express.Router();
const knex = require('../../knex');

// Note:
//   Code is the same as /routes/from_tos/router.js
//   but accesses a different table


/* **************************************************
*  GET answers/:user_id
*
*  Get answers for all questions for user_id.
*
*  @param user_id
*
*  Return object keyed on question_code with array of answers for value
    200: { 3: [ 'ans1, ans2', … ] ,
           4: [ 'ans7, ans8', … ] }
      If there are no answers for user_id, return { }

http GET localhost:3000/answers/1
***************************************************** */
router.get('/:user_id', (req, res, next) => {
  console.log('GET answers/:user_id');

  // get passed params
  const user_id = parseInt(req.params.user_id, 10)

  // validate params
  if (isNaN(user_id) || !user_id) {
    const errMsg = `Bad user_id param to GET /answers: ${req.params.user_id}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }

  // lookup all answers for user_id
  knex('answers')
    .where('user_id', user_id)
    .orderBy(['question_code', 'answer_id']) // group the questions and put in order they were added
    .returning('*')
    .then((answers) => {
      console.log("GET -- answers: ", answers);
      const retVal = {}
      if (answers.length) {
        // build data structure to return
        let currQuestionCode = answers[0].question_code
        let currAnswers = []
        for (let i = 0; i < answers.length; i++) {
          // if we moved to next question, add current question to the data structure being returned
          if (answers[i].question_code != currQuestionCode) {
            retVal[currQuestionCode] = currAnswers
            currQuestionCode = answers[i].question_code
            currAnswers = []
          }
          currAnswers.push(answers[i].answer)
        }
        // add final question to data structure
        retVal[currQuestionCode] = currAnswers
      }
      res.status(200).json(retVal)
    })
    .catch((error) => {
      console.log('caught error ', error);
      next(error);
    });
});

/* **************************************************
*  POST answers/:user_id/:question_code
*
*  Add or replace all answers for a question_code for a user_id
*  If there were previous answers for question_code / user_id they are deleted first
*
*  @param user_id
*  @param question_code
*  @body answers: array of answer strings: ['ans1', 'ans2', ...]
*
*  Return
     201 { message: "success" }
     500

http POST localhost:3000/answers/1/3 answers='["ans1","ans2"]'
***************************************************** */
router.post('/:user_id/:question_code', (req, res, next) => {
  console.log("POST answers");

  const user_id = parseInt(req.params.user_id, 10)
  const question_code = parseInt(req.params.question_code, 10)

  // check params
  // -- user_id
  if (isNaN(user_id) || !user_id) {
    const errMsg = `Bad user_id param to POST /answers ${req.params.user_id}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }
  // -- question_code
  if (isNaN(question_code) || !question_code) {
    const errMsg = `Bad question_code param to POST /answers ${req.params.question_code}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }
  // -- answers
  let { answers } = req.body
  answers = JSON.parse(answers)
  console.log('answers: ', answers);

  // build array of answer records to be inserted into db
  const answerRecords = answers.map(answer => ({
    question_code,
    user_id,
    answer
  }))

  // delete any exisiting answer for this question_code and user_id
  knex('answers')
    .where({
      user_id,
      question_code,
    })
    .del()
    .then(() => {

      // insert answer records
      knex('answers')
        .insert(answerRecords)
        .then(() => {
          res.status(201).json({"message": "success"});
        })
        .catch((error) => {
          console.log("ERROR inner: ", error);
          next(error);
        })
    })
    .catch((error) => {
      console.log("ERROR: ", error);
      next(error);
    });

});

module.exports = router;
