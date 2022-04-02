Migrations.add({
  version: 4,
  name: 'İzinler tanimlaniyor: permissions.user',
  up: function () {
    Roles.createRole('permissions.users');
    Roles.createRole('permissions.users.read');
    Roles.createRole('permissions.users.create');
    Roles.createRole('permissions.users.updateProfile');
    Roles.createRole('permissions.users.updateStatus');
    Roles.createRole('permissions.users.delete');

    Roles.addRolesToParent([
      'permissions.users.read',
      'permissions.users.create',
      'permissions.users.updateProfile',
      'permissions.users.delete',
    ], 'permissions.users');

    Roles.addRolesToParent([
      'permissions.users',
      'permissions.users.updateStatus',
    ], 'roles.admin');
  }
});