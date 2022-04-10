import SimpleSchema from 'simpl-schema';

ApiKeys = new Mongo.Collection('api-keys');

ApiKeySchema = new SimpleSchema({
  publicKey: String,
  secretKey: String,
  secretKeyLastPrefix: String,
});

ApiKeys.attachSchema(ApiKeySchema);
ApiKeys.autoDates();
ApiKeys.createdUser();
