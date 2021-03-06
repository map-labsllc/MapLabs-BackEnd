const admin = require('firebase-admin');
const knex = require('../knex');

module.exports = {

  /* *******************************************************
    checkUserPermissions()

    Tests the authorization header jwt and param user_id
  ******************************************************** */
  checkUserPermissions(req, res, next) {
    console.log("checkUserPermissions()");

    const Authorization = req.get('Authorization')
    if (!Authorization) {
      const error = new Error('Unauthorized');
      error.status = 422;
      return next(error);
    }

    const jwt = req.get('Authorization').replace('Token:', '').trim();
    const mapMakerUserId = +req.params.user_id;

    console.log("-- req.params.user_id: ", req.params.user_id);
    console.log("-- jwt: ", jwt);

    if (!jwt || !mapMakerUserId) {
      console.log("UNAUTHORIZED returning 422: req.params.user_id:", req.params.user_id, " jwt:", jwt);
      const error = new Error('Unauthorized');
      error.status = 422;
      return next(error);
    }

    return admin.auth()
      .verifyIdToken(jwt)
      .then((decodedJwt) => {
        const { email, user_id } = decodedJwt
        // find user record
        knex('users')
          .where({ email, login_token: user_id, id: mapMakerUserId })
          .returning('*')
          .then((users) => {
            console.log("GET -- user: ", users);
            // user not found
            if (!users.length) {
              console.log(`--- users get ${req.params.id} -- rec not found`);
              const error = new Error(`unauthorized`);
              error.status = 422;
              return next(error);
            }
            // user found
            console.log('success ', users[0]);
            return next();
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
  },
};
