const knex = require('../../knex')

module.exports = {
    create: async function({user_id, question_code, transition}) {
        const existing = await knex('transitions').where({user_id, question_code})
        if (existing) {
            return knex('transitions')
            .where({user_id, question_code})
            .del()
            .then(() => {
                return knex('transitions')
                .insert({user_id, question_code, transition})
            })
        } 
        return knex('transitions')
        .insert({user_id, question_code, transition})
    },
    getOne: function({user_id, question_code}) {
        return knex('transitions')
        .where({user_id, question_code})
    }
}