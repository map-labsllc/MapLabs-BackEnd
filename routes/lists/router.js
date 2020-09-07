const express = require('express');

const router = express.Router();
const knex = require('../../knex');
const { checkUserPermissions } = require('../authMiddleware');

router.get('/:list_name', (req, res, next) => {
  let { list_name } = req.params
  console.log(`GET lists/${list_name}`);

  // validate params
  if (!list_name) {
    const errMsg = `Bad list_name param to GET /lists: ${list_name}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }

  knex('options')
    .select('options.id', 'options.value')
    .join('lists', {'lists.id': 'options.list_id'})
    .where('lists.name', list_name)
    .orderBy(['options.sort, options.value'])
    .returning('*')
    .then((data) => {
      console.log(data)
      return res.status(200).json(data)
    })
    .catch((error) => {
      console.log('caught error ', error);
      next(error);
    });

});

module.exports = router;
