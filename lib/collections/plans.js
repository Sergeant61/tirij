import SimpleSchema from 'simpl-schema';

Plans = new Mongo.Collection('plans');

PlanSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  
  slug: String,

  type: {
    type: String,
    allowedValues: ['free', 'basic', 'pro', 'forever']
  },

  description: {
    type: String,
    optional: true
  }
});

Plans.attachSchema(PlanSchema);
Plans.softRemovable();
Plans.autoDates();
Plans.lastEditUser();
Plans.createdUser();
