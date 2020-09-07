
exports.seed = function(knex) {
  return knex('lists')
    .where({ name: 'relationships' })
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
            {value: "Other", list_id, sort: -1},
            {value: "Brother", list_id},
            {value: "Coach", list_id},
            {value: "Co-worker", list_id},
            {value: "Daughter", list_id},
            {value: "Doctor", list_id},
            {value: "Father", list_id},
            {value: "Friend", list_id},
            {value: "Husband/ex", list_id},
            {value: "Mother", list_id},
            {value: "Parent", list_id},
            {value: "Partner/ex", list_id},
            {value: "Relative", list_id},
            {value: "Religious leader", list_id},
            {value: "Sibling", list_id},
            {value: "Son", list_id},
            {value: "Sister", list_id},
            {value: "Teacher", list_id},
            {value: "Wife/ex", list_id}
          ])
        });
    })
    
};
