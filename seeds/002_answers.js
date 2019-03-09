exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('answers').del()
    .then(() => {
      // Inserts seed entries
      return knex('answers').insert([
        { answer_id:  1, user_id: 2, question_code:  1, question_type: 1, field1:  'narrative' },
        { answer_id:  2, user_id: 2, question_code:  2, question_type: 2, field1:  'short A1', field2: 'short A2' },
        { answer_id:  3, user_id: 2, question_code:  2, question_type: 2, field1:  'short B1', field2: 'short B2' },
        { answer_id:  4, user_id: 2, question_code:  3, question_type: 99, field1: 'all A1',   field2: 'All A2',   field3: 'All A3',     field4: 'All A4', field5: 'All A5', field6: 'All A6' },
        { answer_id:  5, user_id: 2, question_code:  3, question_type: 99, field1: 'all B1',   field2: 'All B2',   field3: 'All B3',     field4: 'All B4', field5: 'All B5', field6: 'All B6' },
        { answer_id:  7, user_id: 3, question_code: 901, question_type: 7, field1: 'honesty',  field2: 'positive', field3: 'embodiment', field4: '' },
        { answer_id:  8, user_id: 3, question_code: 901, question_type: 7, field1: 'honesty',  field2: 'negative', field3: 'impediment', field4: '' },
        { answer_id:  9, user_id: 3, question_code: 210, question_type: 6, field1: 'personal', field2: 'brother',  field3: 'John',       field4: 'Balance', field5: 'supportive' },
        { answer_id: 10, user_id: 3, question_code: 210, question_type: 6, field1: 'personal', field2: 'mother',   field3: 'Beth',       field4: 'Charity', field5: 'inhibiting' },
        { answer_id: 11, user_id: 3, question_code: 210, question_type: 6, field1: 'social',   field2: 'coach',    field3: 'Steve',      field4: 'Courage', field5: 'supportive' },
      ])
    .then(() => {
			 // Moves id column (PK) auto-incremented to correct value after inserts
			return knex.raw(`SELECT setval('answers_answer_id_seq', (SELECT MAX(answer_id) FROM answers))`)
		})
  });
};
