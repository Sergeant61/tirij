import SimpleSchema from 'simpl-schema';

Stores = new Mongo.Collection('stores');

StoreSchema = new SimpleSchema({
  name: String,

  description: {
    type: String,
    optional: true
  }
});

Stores.attachSchema(StoreSchema);
Stores.softRemovable();
Stores.autoDates();
Stores.lastEditUser();
Stores.createdUser();
Stores.slugify({ field: 'name' });
