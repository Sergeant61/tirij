import SimpleSchema from 'simpl-schema';

Links = new Mongo.Collection('links');

LinkClickCountSchema = new SimpleSchema({
  max: {
    type: Number,
    optional: true
  },

  count: {
    type: Number,
    optional: true
  }
});

LinkSchema = new SimpleSchema({
  longUrl: SimpleSchema.RegEx.Url,
  slug: String,
  shortId: String,
  longId: String,

  expireType: {
    type: String,
    allowedValues: ['never', 'count', 'date']
  },

  expireAt: {
    type: Date,
    optional: true
  },

  clickCount: {
    type: LinkClickCountSchema,
    optional: true
  },
});

Links.attachSchema(LinkSchema);
Links.softRemovable();
Links.autoDates();
Links.lastEditUser();
Links.createdUser();