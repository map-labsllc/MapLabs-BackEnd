const express = require('express');

const router = express.Router();
const knex = require('../../knex');
const { checkUserPermissions } = require('../authMiddleware');

// return all lists
router.get('/', (req, res, next) => {
  console.log(`GET lists`);

  knex('options')
    .select('lists.name', 'options.id', 'options.value')
    .join('lists', {'lists.id': 'options.list_id'})
    .orderBy(['lists.name', 'options.sort', 'options.value'])
    .returning('*')
    .then((data) => {
      console.log(data)

      // group by list
      let lists = data.reduce((acc, row) => {
        let {name, id, value} = row
        if (!acc[name]) acc[name] = []
        acc[name].push({id, value})
        return acc
      }, {})

      return res.status(200).json(lists)
    })
    .catch((error) => {
      console.log('caught error ', error);
      next(error);
    });

});

module.exports = router;
