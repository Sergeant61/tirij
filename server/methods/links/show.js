import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'link.show',
  mixins: [RoleMixin],
  roles: ['permissions.link.read'],
  schema: new SimpleSchema({
    _id: SimpleSchema.RegEx.Id,
  }),
  run: async function (data) {
    this.unblock();
    const { _id } = data;

    return Links.findOne({
      _id: _id
    });
  }
});


