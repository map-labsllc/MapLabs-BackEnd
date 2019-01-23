
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('answers').del()
    .then(function () {
      // Inserts seed entries
      return knex('answers').insert([
        { answer_id:  1, question_code:  1, user_id: 1, answer: '1st_u1_a1' },
        { answer_id:  2, question_code:  1, user_id: 1, answer: '2nd_u1_a1' },
        { answer_id:  3, question_code:  2, user_id: 1, answer: '1st_u1_a2' },
        { answer_id:  4, question_code:  2, user_id: 1, answer: '2nd_u1_a2' },

        // short answers
        { answer_id:  5, question_code: 41, user_id: 1, answer: 'one' },
        { answer_id:  6, question_code: 41, user_id: 1, answer: 'two' },
        { answer_id:  7, question_code: 41, user_id: 1, answer: 'three' },
        { answer_id:  8, question_code: 42, user_id: 1, answer: 'forty-two' },

        // narratives
        { answer_id:  9, question_code: 50, user_id: 1, answer: 'narrative 50' },
        { answer_id: 10, question_code: 51, user_id: 1, answer: 'narrative 51' },
      ])
      .then(() => {
				 // Moves id column (PK) auto-incremented to correct value after inserts
				return knex.raw(`SELECT setval('answers_answer_id_seq', (SELECT MAX(answer_id) FROM answers))`)
			})
    });
};
