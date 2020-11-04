# MapLabs-BackEnd project

Development runs on port 3001

# To get started
`npm install`

# Run migrations and seeds
`knex migrate:latest`
`knex seed:run`

# Setup Firebase project
- create project
- Add Authentication - email
- Create Key for service account and get json file
- add json file to ./config
- commit json config

# Heroku Deployment
`heroku run knex migrate:latest`
`heroku run knex seed:run`
`heroku config:set FIREBASE_SERVICE_ACCOUNT_PATH=./config/NAMEOFKEY`
