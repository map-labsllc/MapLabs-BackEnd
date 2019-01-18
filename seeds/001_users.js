
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { user_id: 1, fname: 'John',  lname: 'Doe',   email: 'jdoe@gmail.com',   login_service_id: 1, token: 'ABC', mod_complete: 0, sec_complete: 0, created_at: new Date('2019-01-15 18:00:00 UTC') },
        { user_id: 2, fname: 'Susan', lname: 'Pratt', email: 'spratt@gmail.com', login_service_id: 1, token: 'DEF', mod_complete: 0, sec_complete: 0, created_at: new Date('2019-01-15 11:00:00 UTC') },
      ])
      .then(() => {
				 // Moves id column (PK) auto-incremented to correct value after inserts
				return knex.raw(`SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users))`)
			})
    });
};
