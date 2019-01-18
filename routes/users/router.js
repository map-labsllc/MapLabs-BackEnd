const express = require('express');
const router = express.Router();
const knex = require('../../knex');

const controller = require('./controller')


/* **************************************************
*  GET .../:login_service_id/:token
*  Get a user record
*  params:
*     login_service_id: the enumerated value for the login service providing the token
*     token: the token from the login service used to create the user's record
*  Lookup user:
*     If found, return user object
*     If not found, return user = "null"
*  Return
     200: { user: { id, fname, ... } }
     404: "Error: unable to get user, login_service_id: 1, token: ABCD, was not found"

http GET localhost:3000/users/1/ABC
***************************************************** */
router.get('/:login_service_id/:token', (req, res, next) => {
  console.log('GET users/:login_service_id/:token');

  // validate params
  const login_service_id = parseInt(req.params.login_service_id, 10)
  const { token } = req.params
  if (isNaN(login_service_id) || !login_service_id) {
    const errMsg = `Bad login_service_id param to GET /users service: ${req.params.login_service_id}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }

  // lookup user
  knex('users')
    .where({ token, login_service_id })
    .returning('*')
    .then((user) => {
      console.log("GET -- user: ", user);
      if (!user.length) {
        console.log(`--- users get ${req.params.id} -- rec not found`);
        const error = new Error(`unable to get user, login_service_id: ${login_service_id}, token: ${token}, was not found`);
        error.status = 404;
        throw error;
      }
      console.log('success ', user[0]);
      res.status(200).json({ user: user[0] })
    })
    .catch((error) => {
      console.log('caught error ', error);
      next(error);
    });
});


/* **************************************************
*  POST /
*  Add a new user record
*  @body fname
*  @body lname
*  @body email
*  @body login_service_id
*  @body token
*  Return
*    201 { user: { id, fname, ... } }
*    500 "error: insert into \"users\" ...  duplicate key value violates unique constraint"
http POST localhost:3000/users fname='Susan' lname='Smith' email='smith@gmail.com' login_service_id=1 token='EFD'
***************************************************** */
router.post('/', (req, res, next) => {
  console.log("POST users");

  // check params
  const { fname, lname, email, login_service_id, token } = req.body
  if (!fname || !lname || !email || !login_service_id || !token) {
    const errMsg = `Missing POST body element`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }
  const numeric_login_service_id = parseInt(login_service_id)
  if (isNaN(numeric_login_service_id) || !numeric_login_service_id) {
      const errMsg = `Missing POST body element`
      console.log("ERROR", errMsg)
      throw new Error(errMsg)
    }

  // add record
  const newUser = { fname, lname, email, login_service_id, token }

  // console.log("");
  // console.log("POST inserting: ", newUser);
  // console.log("");

  knex('users')
    .insert(newUser)
    .returning('*')
    .then((data) => {
      res.status(201).json({ user: data[0] });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
