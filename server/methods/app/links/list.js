import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'app.links.list',
  mixins: [RoleMixin],
  roles: ['permissions.links.read'],
  schema: new SimpleSchema({
    slug: String,
    options: { type: QueryOptionsSchema, optional: true }
  }),
  run: function (data) {
    this.unblock();
    const { slug, options } = data

    return FetchByIndex(Links, { slug: slug }, options, null);
  }
});
