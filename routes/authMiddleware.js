const admin = require('firebase-admin')

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

module.exports = {
    checkUserPermissions: function(req, res, next) {
    const jwt = req.cookies.jwt 
    const mapMakerUserId = req.params.user_id
    
    if (!jwt || !mapMakerUserId) {
        const error = new Error('Unauthorized')
        error.status = 422 
        return next(error)
    }
    return admin.auth().verifyIdToken(jwt).then(decodedJwt => {
        const { email, user_id } = decodedJwt
        // add record
        knex('users')
        .where({ email, login_token: user_id, user_id: mapMakerUserId })
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
          return next()
        })
        .catch((error) => {
          console.log('caught error ', error);
          next(error);
        });
      })
    }
}