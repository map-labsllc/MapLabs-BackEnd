
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { user_id: 1,
          fname: 'John',
          lname: 'Doe',
          email: 'jdoe@gmail.com',
          login_service: 1,
          token: 'FGJKGJDFK4534GGFD',
          mod_complete: 0,
          created_at: new Date('2019-01-15 18:00:00 UTC')
        },
        { user_id: 2,
          fname: 'Susan',
          lname: 'Pratt',
          email: 'spratt@gmail.com',
          login_service: 1,
          token: 'DERGET67D',
          mod_complete: 0,
          created_at: new Date('2019-01-15 1:00:00 UTC')
        },
      ]);
    });
};
