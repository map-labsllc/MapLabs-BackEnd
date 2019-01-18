const express = require('express');
const router = express.Router();
const knex = require('../../knex');

/* **************************************************
*  GET .../:user_id
*  Get all answers for user_id
*  params:
*     user_id
*  Return object keyed on question_code with value as array of answers
     200: { 3: [ 'ans1, ans2', … ] ,
            4: [ 'ans7, ans8', … ] }
    If there are no answers for user_id, return { }

http GET localhost:3000/answers/1
***************************************************** */
router.get('/:user_id', (req, res, next) => {
  console.log('GET answers/:user_id');

  // validate params
  const user_id = parseInt(req.params.user_id, 10)
  if (isNaN(user_id) || !user_id) {
    const errMsg = `Bad user_id param to GET /answers: ${req.params.user_id}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }

  // lookup all answers for user
  knex('answers')
    .where('user_id', user_id)
    .orderBy(['question_code', 'answer_id']) // group the questions and put in order they were added
    .returning('*')
    .then((answers) => {
      console.log("GET -- answers: ", answers);
      const retVal = {}
      if (answers.length) {
        let currQuestionCode = answers[0].question_code
        let currAnswers = []
        for (let i = 0; i < answers.length; i++) {
          if (answers[i].question_code != currQuestionCode) {
            retVal[currQuestionCode] = currAnswers
            currQuestionCode = answers[i].question_code
            currAnswers = []
          }
          currAnswers.push(answers[i].answer)
        }
        retVal[currQuestionCode] = currAnswers
      }
      res.status(200).json(retVal)
    })
    .catch((error) => {
      console.log('caught error ', error);
      next(error);
    });
});

module.exports = router;
