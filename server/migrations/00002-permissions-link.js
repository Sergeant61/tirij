Migrations.add({
  version: 2,
  name: 'İzinler tanimlaniyor: permissions.link',
  up: function () {
    Roles.createRole('permissions.link');
    Roles.createRole('permissions.link.read');
    Roles.createRole('permissions.link.create');
    Roles.createRole('permissions.link.update');
    Roles.createRole('permissions.link.delete');

    Roles.addRolesToParent([
      'permissions.link.read',
      'permissions.link.create',
      'permissions.link.update',
      'permissions.link.delete',
    ], 'permissions.link');

    Roles.addRolesToParent([
      'permissions.link.read',
    ], 'roles.user');

    Roles.addRolesToParent([
      'permissions.link',
    ], 'roles.admin');
  }
});