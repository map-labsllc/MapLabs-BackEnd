
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('narratives').del()
    .then(function () {
      // Inserts seed entries
      return knex('narratives').insert([
        { narrative_id: 1,
          narrative_code: 1,
          user_id: 1,
          narrative: '1st for user_id = 1, narrative_code = 1',
        },
        { narrative_id: 2,
          narrative_code: 1,
          user_id: 1,
          narrative: '2nd for user_id = 1, narrative_code = 1',
        },
        { narrative_id: 3,
          narrative_code: 2,
          user_id: 1,
          narrative: '1st for user_id = 1, narrative_code = 2',
        },
        { narrative_id: 4,
          narrative_code: 2,
          user_id: 1,
          narrative: '2nd for user_id = 1, narrative_code = 2',
        },
      ])
      .then(() => {
				 // Moves id column (PK) auto-incremented to correct value after inserts
				return knex.raw(`SELECT setval('narratives_narrative_id_seq', (SELECT MAX(narrative_id) FROM narratives))`)
			})
    });
};
