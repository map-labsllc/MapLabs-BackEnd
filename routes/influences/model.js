const knex = require('../../knex')

module.exports = {
    create: async function(user_id, question_code, influence) {
        return knex('influences')
        .insert({user_id, question_code, influence})
    },
    getOne: function(user_id, question_code) {
        return knex('influences')
        .where({user_id, question_code})
    }
}