import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'link.list',
  mixins: [RoleMixin],
  roles: ['permissions.link.read'],
  validate: new SimpleSchema({
    options: { type: QueryOptionsSchema, optional: true }
  }).validator(),
  run: function (data) {
    this.unblock();
    const { options } = data

    return FetchByIndex(Links, {}, options, null);
  }
});
