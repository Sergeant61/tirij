import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'app.stores.show',
  mixins: [RoleMixin],
  roles: ['permissions.stores.read'],
  schema: new SimpleSchema({
    slug: String
  }),
  validate: function () { },
  run: async function (data) {
    this.unblock();
    return Stores.findOne({ slug: data.slug });
  }
});


