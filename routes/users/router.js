var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/* **************************************************
*  GET .../:login_service_id/:token
*  params:
*     login_service_id:
*     token: 
*  Lookup user:
*     If found, return user object
*     If not found, return user = "null"
*  Return
     200: {
        user: { id, fname, ... },
      }
     404: {
        user: null
      }
http GET localhost:3000/users/1/ABC
***************************************************** */
router.get('/:login_service_id/:token', (req, res, next) => {
  let oResponse = {
    user: null,
  }

  // validate params
  const loginServiceId = parseInt(req.params.login_service_id, 10)
  const { token } = req.params
  if (isNaN(loginServiceId) || !loginServiceId) {
    const errMsg = `Bad login_service_id param to GET /users service: ${req.params.login_service_id}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }
  if (!token) {
    const errMsg = `Bad token param to GET /users service: ${token}`
    console.log("ERROR", errMsg)
    throw new Error(errMsg)
  }

  console.log('success:', );
});

module.exports = router;
