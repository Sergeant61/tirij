import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'app.stores.list',
  mixins: [SignedInMixin],
  schema: new SimpleSchema({
    options: QueryOptionsSchema
  }),
  run: async function (data) {
    this.unblock();
    const userId = Meteor.userId();

    const isInAdminRole = Roles.userIsInRole(userId, 'roles.admin');
    const query = {};

    if (!isInAdminRole) {
      const roleAssignments = Meteor.roleAssignment.find({
        'user._id': userId,
        $or: [
          { 'role._id': 'permissions.stores.read' },
          { 'inheritedRoles._id': 'permissions.stores.read' }
        ]
      }).fetch();

      const slugs = roleAssignments.map(function (roleAssignment) {
        return roleAssignment.scope;
      });

      query.slug = { $in: slugs };
    }

    return FetchByIndex(Stores, query, data.options, null);
  }
});


