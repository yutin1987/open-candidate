
exports.up = knex => knex.schema.createTable('order', (table) => {
  table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
  table.string('type').index();
  table.integer('price');
  table.string('nickname');
  table.string('message');
  table.dateTime('paid_at');
  table.dateTime('created_at');
  table.dateTime('deleted_at');
});

exports.down = knex => knex.schema.dropTable('order');
