
exports.seed = function(knex) {
  return knex('lists')
    .where({ name: 'social_influences' })
    .first()
    .then(row => {
      let list_id = row.id

      console.log('populating list_id', list_id)

      return knex('options')
        .where({ list_id }) // delete existing
        .del()
        .then(function () {
          // Inserts seed entries
          return knex('options').insert([
            {value: "Other", list_id, sort: -1},
            {value: 'Affinity groups', list_id},
            {value: 'Artists', list_id},
            {value: 'Civic organizations', list_id},
            {value: 'Clubs', list_id},
            {value: 'Colleges', list_id},
            {value: 'Companies', list_id},
            {value: 'Fraternities/Sororities', list_id},
            {value: 'Jobs', list_id},
            {value: 'Media personalities', list_id},
            {value: 'Philosophers', list_id},
            {value: 'Religious communities', list_id},
            {value: 'Schools', list_id},
            {value: 'Self-help writers', list_id},
            {value: 'Teams', list_id},
            {value: 'Theologians', list_id},
            {value: 'Thought leaders', list_id},
            {value: 'Volunteer activities', list_id},
            {value: 'Youth groups', list_id},
          ])
        });
    })
    
};
