import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'user.roles.list',
  mixins: [RoleMixin],
  roles: ['permissions.users.read'],
  schema: new SimpleSchema({
    userId: { type: SimpleSchema.RegEx.Id }
  }),
  run: function (data) {
    this.unblock();
    const { userId } = data

    return
    return ActionGetUserRoles(userId);
  }
});