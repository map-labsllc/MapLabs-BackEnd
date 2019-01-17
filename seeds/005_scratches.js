
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('scratches').del()
    .then(function () {
      // Inserts seed entries
      return knex('scratches').insert([
        { scratch_id: 1,
          scratch_code: 1,
          user_id: 1,
          scratch: '1st for user_id = 1, scratch_code = 1',
        },
        { scratch_id: 2,
          scratch_code: 1,
          user_id: 1,
          scratch: '2nd for user_id = 1, scratch_code = 1',
        },
        { scratch_id: 3,
          scratch_code: 2,
          user_id: 1,
          scratch: '1st for user_id = 1, scratch_code = 2',
        },
        { scratch_id: 4,
          scratch_code: 2,
          user_id: 1,
          scratch: '2nd for user_id = 1, scratch_code = 2',
        },
      ]);
    });
};
