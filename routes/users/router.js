const express = require('express');
const router = express.Router();
const knex = require('../../knex');
const admin = require('firebase-admin')
const { checkUserPermissions } = require('../authMiddleware')

//see https://firebase.google.com/docs/admin/setup
//set up firebase admin to check jwts
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  }),
  databaseURL: process.env.FIREBASE_DB_URL
})

/* **************************************************
*  GET /users/:login_service_id/:login_token
*
*  Get a specific user record based on the auth information
*     If found, return user object
*     If not found, return 404
*
*   @param login_service_id: enumerated value for login service providing the login_token, Firebase = 1
*   @param login_token: the login_token from the login service used to create the user's record
*
*  Return
     200: { id, fname, ... }
     404: "Error: unable to get user, login_service_id: 1, login_token: ABCD, was not found"

http GET localhost:3001/users/1/ABC
***************************************************** */
router.get('/', (req, res, next) => {
  console.log('GET users/:login_service_id/:login_token');
  const jwt = req.cookies.jwt
  
  if (!jwt) {
    const error = new Error('Unauthorized')
    error.status = 422 
    return next(error)
  }
  
  return admin.auth().verifyIdToken(jwt).then(decodedJwt => {
    const { email, user_id } = decodedJwt
    // add record
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
      res.status(200).json(users[0])
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
  // lookup user 
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
     201 { user_id, fname, ... }
     500 "Error: PATCH body element in non-numeric"
     500 "Error: PATCH route throw error can't find user_id 7"

http PATCH localhost:3001/users/1 curr_module=2 curr_section=1
***************************************************** */
router.patch('/:user_id', checkUserPermissions, (req, res, next) => {
  console.log("PATCH users");
  console.log("req.body: ", req.body);

  // get passed params and body
  const { user_id } = req.params
  const { curr_module, curr_section } = req.body

  // validate params
  // if (!curr_module || !curr_section) {
  //   const errMsg = `Missing PATCH req.body element`
  //   console.log("ERROR", errMsg)
  //   throw new Error(errMsg)
  // }
  const numeric_curr_module = parseInt(curr_module, 10)
  const numeric_curr_section = parseInt(curr_section, 10)
  if (isNaN(numeric_curr_module) || isNaN(numeric_curr_section)) {
      const errMsg = `PATCH body element in non-numeric`
      console.log("ERROR", errMsg)
      throw new Error(errMsg)
    }

  // update record
  const updateFields = { curr_module, curr_section }
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
*  @body email
*  @body jwt
*
*  Return
     201 { id, fname, ... }
     500 "error: insert into \"users\" ...  duplicate key value violates unique constraint"

http POST localhost:3001/users fname='Susan' lname='Smith' email='smith@gmail.com' login_service_id=1 login_token='EFD'
***************************************************** */
router.post('/', (req, res, next) => {
  console.log("POST users");

  // get passed params and body
  const { fname, lname, jwt } = req.body

  // validate params
  if (!fname || !lname || !jwt) {
    const errMsg = `Missing POST body element`
    console.log("ERROR", errMsg)
    return next (new Error(errMsg))
  }

  return admin.auth().verifyIdToken(jwt).then(decodedJwt => {
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
