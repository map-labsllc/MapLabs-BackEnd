const knex = require('../../knex')

module.exports = {
    create: function({user_id, narrative_code, narrative}) {
        return knex('narratives')
        .insert({user_id, narrative_code, narrative})
    },
    update: function({user_id, narrative_code, narrative}) {
        return knex('narratives')
        .where({user_id, narrative_code})
        .update({narrative})
    }
}