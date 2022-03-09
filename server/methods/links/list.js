import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'link.list',
  mixins: [RoleMixin],
  roles: ['permissions.link.read'],
  schema: new SimpleSchema({
    options: { type: QueryOptionsSchema, optional: true }
  }),
  run: function (data) {
    this.unblock();
    const { options } = data

    return FetchByIndex(Links, {}, options, null);
  }
});
