
exports.seed = function(knex) {
  return knex('lists')
    .where({ name: 'strengths' })
    .first()
    .then(row => {
      let list_id = row.id

      console.log('population list_id', list_id)

      return knex('options')
        .where({ list_id }) // delete existing
        .del()
        .then(function () {
          // Inserts seed entries
          return knex('options').insert([
            { value:   "appreciation of beauty and excellence", list_id },
            { value:   "bravery", list_id },
            { value:   "creativity", list_id },
            { value:   "curiosity", list_id },
            { value:   "fairness", list_id },
            { value:   "forgiveness", list_id },
            { value:   "gratitude", list_id },
            { value:   "honesty", list_id },
            { value:   "hope", list_id },
            { value:   "humility", list_id },
            { value:   "humor ", list_id },
            { value:   "judgment", list_id },
            { value:   "kindness", list_id },
            { value:   "leadership", list_id },
            { value:   "love", list_id },
            { value:   "love of learning", list_id },
            { value:   "perseverance", list_id },
            { value:   "perspective", list_id },
            { value:   "prudence", list_id },
            { value:   "self-regulation", list_id },
            { value:   "social intelligence", list_id },
            { value:   "spirituality", list_id },
            { value:   "teamwork", list_id },
            { value:   "zest", list_id }
          ]);
        });
    })
    
};
