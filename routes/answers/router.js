const express = require('express');
const router = express.Router();
const knex = require('../../knex');
const { checkUserPermissions } = require('../authMiddleware')

// Note:
//   Code is the same as /routes/answers/router.js
//   but accesses a different table


/* **************************************************
*  GET answers/:user_id
*
*  Get all answers for user_id.
*  Note: The question_type field is NOT returned to caller but is
*        provided when persisting answers.  question_type exisits
*        for ad hoc SQL queries on answers table, not for the app itself.
*
*  @param user_id
*
*  Return object keyed on question_code with values as 2D array of 1 to 4
   strings, depending on the specific question
     200: { 3: [ [ 'bad!', 'good!', '', '', '', '' ],
                 [ ... ]
               ] ,
            4: [ [ 'honesty', 'thoughts', 'broadly', '', '', '' ],
                 [ ... ]
               ]
          }
     If there are no answers for user_id, return { }

http GET localhost:3001/answers/3
***************************************************** */
router.get('/:user_id', checkUserPermissions, (req, res, next) => {

  console.log('GET answers/:user_id');

  // get passed params
  const user_id = parseInt(req.params.user_id, 10)

  // validate params
  if (Number.isNaN(user_id) || !user_id) {
    const errMsg = `Bad user_id param to GET /answers: ${req.params.user_id}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }

  // lookup all answers for user
  knex('answers')
    .where('user_id', user_id)
    .orderBy(['question_code', 'id']) // group the questions and put in order they were added
    .returning('*')
    .then((answerRecords) => {

      console.log("GET -- answerRecords: ", answerRecords);

      const retVal = {}

      if (answerRecords.length) {
        // build 2D array of strings data structure to return
        let currQuestionCode = answerRecords[0].question_code
        let currAnswerSet = []
        for (let i = 0; i < answerRecords.length; i++) {
          // if we moved to next question, add current answer set to retVal
          if (answerRecords[i].question_code != currQuestionCode) {
            retVal[currQuestionCode] = currAnswerSet
            currQuestionCode = answerRecords[i].question_code
            currAnswerSet = []
          }
          // add answer to the current answer set
          const { field1, field2, field3, field4, field5, field6 } = answerRecords[i]
          currAnswerSet.push( [ field1, field2, field3, field4, field5, field6 ] );
        }
        retVal[currQuestionCode] = currAnswerSet
      }
      console.log("-- retVal:  ", retVal);
      return res.status(200).json(retVal)
    })
    .catch((error) => {
      console.log('caught error ', error);
      next(error);
    });
});

/* **************************************************
*  POST answers/:user_id/:question_code/:question_type
*
*  Add or replace all answers for a question_code for a user_id
*  If there were previous records for question_code / user_id they are deleted first
*
*  @param user_id
*  @param question_code
*  @param question_type -- enumerated value, see frontend for set of contstants.  The reason
                           it's required in POST but not returned by GET is that it's
                           put in the table to facilitate ad hoc SQL queries on the table.

*  @body answers: 2D array of strings:
                   [ [ "value1", "value2", "value3", "value3" ],
                     [ "valueA", "valueB", "valueC", "valueD" ],
                     ... ]
                 Note: Caller only passes as many fields as the question_type uses, ex for a Narrative:
                   [ [ "narrative" ] ]
*
*  Return
     201 { message: "success" }
     500

http POST localhost:3001/answers/2/7/99 answers='[ [ "value1", "value2", "value3", "value3" ], [ "valueA", "valueB", "valueC", "valueD" ] ]'
http POST localhost:3001/answers/2/7/1 answers='[ [ "Narrative" ] ]'
***************************************************** */
router.post('/:user_id/:question_code/:question_type', checkUserPermissions, (req, res, next) => {
// router.post('/:user_id/:question_code/:question_type', (req, res, next) => {
  console.log("POST answers");

  // get params
  const user_id = parseInt(req.params.user_id, 10)
  const question_code = parseInt(req.params.question_code, 10)
  const question_type = parseInt(req.params.question_type, 10)

  // check params
  // -- user_id
  if (Number.isNaN(user_id) || !user_id) {
    const errMsg = `Bad user_id param to POST /answers ${req.params.user_id}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }
  // -- question_code
  if (Number.isNaN(question_code) || !question_code) {
    const errMsg = `Bad question_code param to POST /answers ${req.params.question_code}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }
  // -- question_type
  if (Number.isNaN(question_type) || !question_type) {
    const errMsg = `Bad question_type param to POST /answers ${req.params.question_type}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }

  // -- answers
  let { answers } = req.body
  // console.log('answers: ', answers);

  // this typeof is required to be able to test function with HTTPie
  // -- answers will be a string when called from HTTPie
  // -- answers already parsed back to an array when called from front end with fetch()
  if (typeof answers === 'string')
    answers = JSON.parse(answers)

  // build array of answer records to be inserted into db
  const answerRecords = answers.map(answer => ({
    question_code,
    question_type,
    user_id,
    field1: answer[0],       // required field
    field2: answer[1] || "", // optional field
    field3: answer[2] || "", // optional field
    field4: answer[3] || "", // optional field
    field5: answer[4] || "", // optional field
    field6: answer[5] || "", // optional field
  }))

  // delete any exisiting answers for this question_code and user_id
  knex('answers')
    .where({
      user_id,
      question_code,
    })
    .del()
    .then(() => {
      console.log("inserting answers", answerRecords)
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
