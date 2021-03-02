# MapLabs-BackEnd project

Development runs on port 3001

## Knex migrations and seeds (for initial local setup only)
`
knex migrate:latest

knex seed:run
`

## Deploying to Heroku

`git push heroku master`

## Updating seeds on heroku
`
heroku run knex seed:run --specific=007_add_lists.js
heorku run knex seed:run --specific=008_options_social_influences.js
heorku run knex seed:run --specific=009_options_wider_influences.js
`
