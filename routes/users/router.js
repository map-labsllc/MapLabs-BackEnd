const express = require('express');

const router = express.Router();
const admin = require('firebase-admin');
const knex = require('../../knex');
const { checkUserPermissions } = require('../authMiddleware');


/* **************************************************
*  GET /users/
*
*  Get a specific user record based on the auth information.
*  Called from login.
*     If found, return user object
*     If not found, return 422
*
*  @headers Authorization: {jwt}
*  @return
     200: { id, fname, ... } - if jwt ok and user was found
     422: "Unauthorized" - if no jwt
     404: "unable to get user, login_service_id: ${login_service_id},
           login_token: ${login_token}, was not found" if no user found

http GET localhost:3001/users/1/ABC_TOKEN_FROM_FIREBASE






TO fix
======
login_service_id is not  pulled out of the URL before being used





***************************************************** */
router.get('/', (req, res, next) => {
  console.log('GET users/:login_service_id/:login_token');

  // get jwt from header, if no jwt then not authorized
  const jwt = req.get('Authorization').replace('Token:', '').trim();
  console.log('headers', req.headers);
  if (!jwt) {
    const error = new Error('Unauthorized');
    error.status = 422;
    return next(error);
  }

  // backdoor, don't do any authorization
  if (jwt === process.env.BACKDOOR_JWT) {

    // get passed params
    const { login_token } = req.params
    const login_service_id = parseInt(req.params.login_service_id, 10)

    // validate params
    if (isNaN(login_service_id) || !login_service_id) {
      const errMsg = `Bad login_service_id param to GET /users service: ${req.params.login_service_id}`;
      console.log("ERROR", errMsg);
      throw new Error(errMsg);
    }

    // lookup user and return user object in
    knex('users')
      .where({ login_token, login_service_id })
      .returning('*')
      .then((users) => {
        console.log("GET -- user: ", users);
        // user not found
        if (!users.length) {
          console.log(`--- ERROR: users get ${req.params.id} -- rec not found`);
          const error = new Error(`unable to get user, login_service_id: ${login_service_id}, login_token: ${login_token}, was not found`);
          error.status = 404;
          throw error;
        }
        // user found
        console.log('success ', users[0]);
        res.status(200).json(users[0]);
      })
      .catch((error) => {
        console.log('caught error ', error);
        next(error);
      });
  }

  // normal auth process
  return admin.auth().verifyIdToken(jwt).then((decodedJwt) => {
    const { email, user_id } = decodedJwt;
    // find user record
    knex('users')
      .where({ email, login_token: user_id })
      .returning('*')
      .then((users) => {
        console.log("GET -- user: ", users);
        // user not found
        if (!users.length) {
          console.log(`--- users get ${req.params.id} -- rec not found`);
          const error = new Error(`unable to get user, login_service_id: ${login_service_id}, login_token: ${login_token}, was not found`);
          error.status = 404;
          return next(error);
        }
        // user found
        console.log('success ', users[0]);
        res.status(200).json(users[0]);
        return;
      })
      .catch((error) => {
        console.log('caught error ', error);
        next(error);
      });
  })
    .catch((error) => {
      console.log('caught error ', error);
      next(error);
    });

});

/* **************************************************
*  PATCH /users/:user_id
*
*  Update curr_module and curr_section fields for user_id
*
*  @param user_id
*  @body curr_module: what is the user's current module, 1-based
*  @body curr_section: what is the user's current in the curr_module, 1-based
*
*  Return
     201 { id, fname, ... }
     500 "Error: PATCH body element in non-numeric"
     500 "Error: PATCH route throw error can't find user_id 7"

http PATCH localhost:3001/users/1 curr_module=2 curr_section=1
***************************************************** */
router.patch('/:user_id', checkUserPermissions, (req, res, next) => {
  console.log("PATCH users");
  console.log("req.body: ", req.body);

  // get passed params and body
  const { user_id } = req.params;
  const { curr_module, curr_section } = req.body;

  // validate params
  if (!curr_module || isNaN(curr_section)) {
    const errMsg = `Missing PATCH req.body element`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }
  const numeric_curr_module = parseInt(curr_module, 10);
  const numeric_curr_section = parseInt(curr_section, 10);
  if (isNaN(numeric_curr_module) || isNaN(numeric_curr_section)) {
    const errMsg = `PATCH body element in non-numeric`;
    console.log("ERROR", errMsg);
    throw new Error(errMsg);
  }

  // update record
  const updateFields = { curr_module, curr_section };
  knex('users')
    .update(updateFields)
    .where('user_id', user_id)
    .returning('*')
    .then((users) => {
      // user not found
      if (!users.length) {
        const errMsg = `PATCH route throw error can't find user_id: ${user_id}`
        console.log(errMsg);
        const error = new Error(errMsg);
        throw error;
      }
      // user found and updated
      res.status(201).json(users[0]);
      return;
    })
    .catch((error) => {
      console.log('caught error ', error);
      next(error);
    });
});

/* **************************************************
*  POST /users
*
*  Add a new user record
*
*  @body fname
*  @body lname
*  @headers Authorization: {jwt}
*
*  @return
     201 { id, fname, ... } - if user found
     500 "Missing POST body element ${fname} ${lname} ${jwt}" - if no fname, lname, or jwt
     500 "error: <db error>" -if db error

http POST localhost:3001/users fname='Susan' lname='Smith' email='smith@gmail.com' jwt=FIREBASE JWT
***************************************************** */
router.post('/', (req, res, next) => {
  console.log("POST users");

  // get passed params and body
  const { fname, lname } = req.body
  const jwt = req.get('Authorization').replace('Token:', '').trim()


  // validate params
  if (!fname || !lname || !jwt) {
    const errMsg = `Missing POST body element ${fname} ${lname} ${jwt}`
    console.log("ERROR", errMsg)
    return next (new Error(errMsg))
  }

  return admin.auth().verifyIdToken(jwt).then((decodedJwt) => {
    const { email, user_id } = decodedJwt
    const newUser = { fname, lname, email, login_token: user_id }
    // add record
    knex('users')
      .insert(newUser)
      .returning('*')
      .then((users) => {
        res.status(201).json(users[0]);
      })
      .catch((error) => {
        console.log('caught error ', error);
        next(error);
      });
  })
    .catch((error) => {
      console.log('caught error ', error);
      next(error);
    })
});

module.exports = router;
