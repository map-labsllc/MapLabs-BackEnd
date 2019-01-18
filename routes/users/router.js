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
     200: { id, fname, ... }
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
    .then((users) => {
      console.log("GET -- user: ", users);
      if (!users.length) {
        console.log(`--- users get ${req.params.id} -- rec not found`);
        const error = new Error(`unable to get user, login_service_id: ${login_service_id}, token: ${token}, was not found`);
        error.status = 404;
        throw error;
      }
      console.log('success ', users[0]);
      res.status(200).json(users[0])
    })
    .catch((error) => {
      console.log('caught error ', error);
      next(error);
    });
});

/* **************************************************
*  PATCH /
*  Update the module and section complete for user_id
*  @body mod_current
*  @body sec_current
*  Return
*    201 {{ user_id, fname, ... }
*    500 "Error: PATCH body element in non-numeric
*    500 "Error: PATCH route throw error can't find user_id 7"
http PATCH localhost:3000/users/1 mod_complete=2 sec_complete=3
***************************************************** */
router.patch('/:user_id', (req, res, next) => {
  console.log("PATCH users");

  const { user_id } = req.params

  // check params
  const { mod_complete, sec_complete } = req.body
  if (!mod_complete || !sec_complete) {
    const errMsg = `Missing PATCH req.body element`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }
  const numeric_mod_complete = parseInt(mod_complete, 10)
  const numeric_sec_complete = parseInt(sec_complete, 10)
  if (isNaN(numeric_mod_complete) || isNaN(numeric_sec_complete)) {
      const errMsg = `PATCH body element in non-numeric`
      console.log("ERROR", errMsg)
      throw new Error(errMsg)
    }

  // update record
  const updateFields = { mod_complete, sec_complete }
  knex('users')
    .update(updateFields)
    .where('user_id', user_id)
    .returning('*')
    .then((users) => {
      if (!users.length) {
        const errMsg = `PATCH route throw error can't find user_id: ${user_id}`
        console.log(errMsg);
        const error = new Error(errMsg);
        throw error;
      }
      res.status(201).json(users[0]);
      return;
    })
    .catch((error) => {
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
*    201 { id, fname, ... }
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
  const numeric_login_service_id = parseInt(login_service_id, 10)
  if (isNaN(numeric_login_service_id) || !numeric_login_service_id) {
      const errMsg = `Missing or non-numeris POST numeric_login_service_id`
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
    .then((users) => {
      res.status(201).json(users[0]);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
