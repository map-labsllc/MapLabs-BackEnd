
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
            { value:   "Appreciation of beauty and excellence", list_id },
            { value:   "Bravery", list_id },
            { value:   "Creativity", list_id },
            { value:   "Curiosity", list_id },
            { value:   "Fairness", list_id },
            { value:   "Forgiveness", list_id },
            { value:   "Gratitude", list_id },
            { value:   "Honesty", list_id },
            { value:   "Hope", list_id },
            { value:   "Humility", list_id },
            { value:   "Humor ", list_id },
            { value:   "Judgment", list_id },
            { value:   "Kindness", list_id },
            { value:   "Leadership", list_id },
            { value:   "Love", list_id },
            { value:   "Love of learning", list_id },
            { value:   "Perseverance", list_id },
            { value:   "Perspective", list_id },
            { value:   "Self-regulation", list_id },
            { value:   "Social intelligence", list_id },
            { value:   "Spirituality", list_id },
            { value:   "Teamwork", list_id },
            { value:   "Zest", list_id }
          ]);
        });
    })
    
};
