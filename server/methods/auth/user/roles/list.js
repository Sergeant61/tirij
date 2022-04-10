import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'user.roles.list',
  mixins: [RoleMixin],
  roles: ['permissions.users.read'],
  validate: new SimpleSchema({
    userId: { type: SimpleSchema.RegEx.Id }
  }).validator(),
  run: function (data) {
    this.unblock();
    const { userId } = data

    return
    return ActionGetUserRoles(userId);
  }
});