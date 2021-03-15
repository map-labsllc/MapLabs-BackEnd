
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
            { value: 'Appreciation of beauty and excellence', list_id },
            { value: 'Bravery and valor', list_id },
            { value: 'Capacity to love and be loved', list_id },
            { value: 'Caution, prudence, and discretion', list_id },
            { value: 'Citizenship, teamwork, and loyalty', list_id },
            { value: 'Creativity, ingenuity, and originality', list_id },
            { value: 'Curiosity and interest in the world', list_id },
            { value: 'Fairness, equity, and justice', list_id },
            { value: 'Forgiveness and mercy', list_id },
            { value: 'Gratitude', list_id },
            { value: 'Honesty, authenticity, and genuineness', list_id },
            { value: 'Hope, optimism, and future-mindedness', list_id },
            { value: 'Humor and playfulness', list_id },
            { value: 'Industry, diligence, and perseverance', list_id },
            { value: 'Judgment, critical thinking, and open-mindedness', list_id },
            { value: 'Kindness and generosity', list_id },
            { value: 'Leadership', list_id },
            { value: 'Love of learning', list_id },
            { value: 'Modesty and humility', list_id },
            { value: 'Perspective wisdom', list_id },
            { value: 'Self-control and self-regulation', list_id },
            { value: 'Social intelligence', list_id },
            { value: 'Spirituality, sense of purpose, and faith', list_id },
            { value: 'Zest, enthusiasm, and energy', list_id },

          ]);
        });
    })
    
};
