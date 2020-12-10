
exports.seed = function(knex) {
  return knex('lists')
    .where({ name: 'wider_influences' })
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
            {value: 'Cities', list_id},
            {value: 'Towns', list_id},
            {value: 'States', list_id},
            {value: 'Countries', list_id},
            {value: 'Neighborhoods', list_id},
            {value: 'Ethnicities', list_id},
            {value: 'Genders', list_id},
            {value: 'Socio-economic sectors', list_id},
            {value: 'Educational groups', list_id},
            {value: 'Industries', list_id},
          ])
        });
    })
    
};
