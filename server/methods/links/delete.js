import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'link.delete',
  mixins: [RoleMixin],
  roles: ['permissions.link.delete'],
  schema: new SimpleSchema({
    _id: SimpleSchema.RegEx.Id
  }),
  run: async function (data) {
    this.unblock();
    const { _id } = data;
    const userId = Meteor.userId();

    Links.softRemove({ _id: _id, userId:userId });
  }
});




