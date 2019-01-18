const express = require('express');
const router = express.Router();
const knex = require('../../knex');

// Note:
//   Code is the same as /routes/answers/router.js
//   but accesses a different table


/* **************************************************
*  GET from_tos/:user_id
*
*  Get all from_tos for user_id.
*
*  @param user_id
*
*  Return object keyed on question_code with value as array of from/to objects
     200: { 3: [ { from: 'bad!', to: 'good!'}, { … } ] ,
            4: [ { from: 'here', to: 'there'}, { … } ] }
    If there are no answers for user_id, return { }

http GET localhost:3000/from_tos/1
***************************************************** */
router.get('/:user_id', (req, res, next) => {
  console.log('GET from_tos/:user_id');

  // get passed params
  const user_id = parseInt(req.params.user_id, 10)

  // validate params
  if (isNaN(user_id) || !user_id) {
    const errMsg = `Bad user_id param to GET /answers: ${req.params.user_id}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }

  // lookup all form_tos for user
  knex('from_tos')
    .where('user_id', user_id)
    .orderBy(['from_to_code', 'from_to_id']) // group the questions and put in order they were added
    .returning('*')
    .then((fromTos) => {
      console.log("GET -- from_tos: ", fromTos);
      const retVal = {}
      if (fromTos.length) {
        // build data structure to return
        let currFromToCode = fromTos[0].from_to_code
        let currFromTos = []
        for (let i = 0; i < fromTos.length; i++) {
          // if we moved to next question, add current question to the data structure being returned
          if (fromTos[i].from_to_code != currFromToCode) {
            retVal[currFromToCode] = currFromTos
            currFromToCode = fromTos[i].from_to_code
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
*  POST from_tos/:user_id/:question_code
*
*  Add or replace all from_tos for a from_to_code for a user_id
*  If there were previous records for from_to_code / user_id they are deleted first
*
*  @param user_id
*  @param from_to_code
*  @body from_tos: array of from_to objects:
                   [ {"from": "here", "to": "there"},
                     {"from": "good", "to": "bad"},
                     ... ]
*
*  Return
     201 { message: "success" }
     500

http POST localhost:3000/from_tos/1/3 from_tos='[{"from": "here", "to": "there"}, {"from": "good", "to": "bad"}]'
***************************************************** */
router.post('/:user_id/:from_to_code', (req, res, next) => {
  console.log("POST from_tos");

  const user_id = parseInt(req.params.user_id, 10)
  const from_to_code = parseInt(req.params.from_to_code, 10)

  // check params
  // -- user_id
  if (isNaN(user_id) || !user_id) {
    const errMsg = `Bad user_id param to POST /answers ${req.params.user_id}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }
  // -- from_to_code
  if (isNaN(from_to_code) || !from_to_code) {
    const errMsg = `Bad from_to_code param to POST /answers ${req.params.from_to_code}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }
  // -- from_tos
  let { from_tos } = req.body
  from_tos = JSON.parse(from_tos)
  console.log('from_tos: ', from_tos);

  // build array of answer records to be inserted into db
  const fromToRecords = from_tos.map(from_to => ({
    from_to_code,
    user_id,
    from: from_to.from,
    to: from_to.to,
  }))

  // delete any exisiting from_tos for this from_to_code and user_id
  knex('from_tos')
    .where({
      'user_id': user_id,
      'from_to_code': from_to_code,
    })
    .del()
    .then(() => {

      // insert answer records
      knex('from_tos')
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
