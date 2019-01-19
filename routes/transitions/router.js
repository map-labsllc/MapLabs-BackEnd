const express = require('express');
const router = express.Router();
const knex = require('../../knex');

// Note:
//   Code is the same as /routes/answers/router.js
//   but accesses a different table


/* **************************************************
*  GET transitions/:user_id
*
*  Get all transitions for user_id.
*
*  @param user_id
*
*  Return object keyed on question_code with value as array of from/to objects
     200: { 3: [ { from: 'bad!', to: 'good!'}, { … } ] ,
            4: [ { from: 'here', to: 'there'}, { … } ] }
    If there are no answers for user_id, return { }

http GET localhost:3001/transitions/1
***************************************************** */
router.get('/:user_id', (req, res, next) => {
  console.log('GET transitions/:user_id');

  // get passed params
  const user_id = parseInt(req.params.user_id, 10)

  // validate params
  if (isNaN(user_id) || !user_id) {
    const errMsg = `Bad user_id param to GET /answers: ${req.params.user_id}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }

  // lookup all form_tos for user
  knex('transitions')
    .where('user_id', user_id)
    .orderBy(['question_code', 'transition_id']) // group the questions and put in order they were added
    .returning('*')
    .then((fromTos) => {
      console.log("GET -- transitions: ", fromTos);
      const retVal = {}
      if (fromTos.length) {
        // build data structure to return
        let currFromToCode = fromTos[0].question_code
        let currFromTos = []
        for (let i = 0; i < fromTos.length; i++) {
          // if we moved to next question, add current question to the data structure being returned
          if (fromTos[i].question_code != currFromToCode) {
            retVal[currFromToCode] = currFromTos
            currFromToCode = fromTos[i].question_code
            currFromTos = []
          }
          // add final question to data structure
          currFromTos.push({ from: fromTos[i].from, to: fromTos[i].to })
        }
        retVal[currFromToCode] = currFromTos
      }
      res.status(200).json(retVal)
    })
    .catch((error) => {
      console.log('caught error ', error);
      next(error);
    });
});

/* **************************************************
*  POST transitions/:user_id/:question_code
*
*  Add or replace all transitions for a question_code for a user_id
*  If there were previous records for question_code / user_id they are deleted first
*
*  @param user_id
*  @param question_code
*  @body transitions: array of transition objects:
                   [ {"from": "here", "to": "there"},
                     {"from": "good", "to": "bad"},
                     ... ]
*
*  Return
     201 { message: "success" }
     500

http POST localhost:3001/transitions/1/7 transitions='[{"from": "here", "to": "there"}, {"from": "good", "to": "bad"}]'
***************************************************** */
router.post('/:user_id/:question_code', (req, res, next) => {
  console.log("POST transitions");

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
  // -- transitions
  let { transitions } = req.body
  console.log('transitions: ', transitions);

  // this typeof is required to be able to test function with HTTPie
  // -- transitions will be a string when called from HTTPie
  // -- transitions already parsed back to an array when called from front end with fetch()
  if (typeof transitions === 'string')
    transitions = JSON.parse(transitions)

  // build array of answer records to be inserted into db
  const fromToRecords = transitions.map(transition => ({
    question_code,
    user_id,
    from: transition.from,
    to: transition.to,
  }))

  // delete any exisiting transitions for this question_code and user_id
  knex('transitions')
    .where({
      user_id,
      question_code,
    })
    .del()
    .then(() => {

      // insert answer records
      knex('transitions')
        .insert(fromToRecords)
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
