
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { user_id: 1, fname: 'Sandy', lname: 'Keziah', email: 'sandy@lacuna.com', login_service_id: 1, login_token: 'ABC', curr_module: 1, curr_section: 1, created_at: new Date('2019-01-15 18:00:00 UTC') },
        { user_id: 2, fname: 'Susan', lname: 'Pratt',  email: 'spratt@gmail.com', login_service_id: 1, login_token: 'DEF', curr_module: 1, curr_section: 1, created_at: new Date('2019-01-15 11:00:00 UTC') },
      ])
      .then(() => {
				 // Moves id column (PK) auto-incremented to correct value after inserts
				return knex.raw(`SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users))`)
			})
    });
};
