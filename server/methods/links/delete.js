import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'link.delete',
  mixins: [RoleMixin],
  roles: ['permissions.link.delete'],
  validate: new SimpleSchema({
    _id: SimpleSchema.RegEx.Id
  }).validator(),
  run: async function (data) {
    this.unblock();
    const { _id } = data;

    Links.softRemove({ _id: _id });
  }
});




