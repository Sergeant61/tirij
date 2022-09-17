import SimpleSchema from 'simpl-schema';

Domains = new Mongo.Collection('domains');

DomainSchema = new SimpleSchema({
  slug: String,
  host: SimpleSchema.RegEx.Domain
});

Domains.attachSchema(DomainSchema);
Domains.softRemovable();
Domains.autoDates();
Domains.lastEditUser();
Domains.createdUser();
