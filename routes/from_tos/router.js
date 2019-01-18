const express = require('express');
const router = express.Router();
const knex = require('../../knex');

/* **************************************************
*  GET .../:user_id
*  Get all from_tos for user_id
*  params:
*     user_id
*  Return object keyed on question_code with value as array of from/to object
     200: { 3: [ { from: 'bad!', to: 'good!'}, { … } ] ,
            4: [ { from: 'here', to: 'there'}, { … } ] }
    If there are no answers for user_id, return { }

http GET localhost:3000/from_tos/1
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
  knex('from_tos')
    .where('user_id', user_id)
    .orderBy(['from_to_code', 'from_to_id']) // group the questions and put in order they were added
    .returning('*')
    .then((fromTos) => {
      console.log("GET -- from_tos: ", fromTos);
      const retVal = {}
      if (fromTos.length) {
        let currFromToCode = fromTos[0].from_to_code
        let currFromTos = []
        for (let i = 0; i < fromTos.length; i++) {
          if (fromTos[i].from_to_code != currFromToCode) {
            retVal[currFromToCode] = currFromTos
            currFromToCode = fromTos[i].from_to_code
            currFromTos = []
          }
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

module.exports = router;
