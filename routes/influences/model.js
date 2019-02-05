const knex = require('../../knex')

module.exports = {
    create: function(user_id, question_code, {name, belief, category}) {
        return knex('influences')
        .insert({user_id, question_code, name, belief, category })
        .returning('*')
    },
    getOne: function(user_id, question_code) {
        return knex('influences')
        .select('*')
        .where({user_id, question_code})
    }
}