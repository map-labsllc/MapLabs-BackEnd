const express = require('express');
const router = express.Router();
const knex = require('../../knex');
const fs = require('fs');

const FILE_NAME = './public/lifeDescriptions.json'


/* **************************************************
*  GET lifeDescriptions
*
*  Get array of Life Descriptors
*  Alternatives, this file is in /public so the file can be
*    loaded directly "http GET localhost:3001/lifeDescriptions.json"
*
*  Return
    200:
      [
        { order: 1,
          descr: 'My life # feel full of meaning',
          a: 'does',
          b: 'does not'
        },
        { order: 2,
          descr: 'I # feel happy',
          a: 'often',
          b: 'rarely'
        },
        ...
       ]

http GET localhost:3001/lifeDescriptions
***************************************************** */
router.get('', (req, res, next) => {
  console.log('GET lifeDescriptions');

  var fs = require('fs');
  var obj;
  fs.readFile(FILE_NAME, 'utf8', function (err, data) {
    // if (err) throw err;
    if (err) {
      console.log('caught err ', err);
      next(err);
      return;
    }

    obj = JSON.parse(data);
    console.log("parsed");
    console.log("obj: ", obj);

    res.status(200).json(obj)
  })
});

module.exports = router;
