Migrations.add({
  version: 3,
  name: 'İzinler tanimlaniyor: permissions.link',
  up: function () {
    Roles.createRole('permissions.links');
    Roles.createRole('permissions.links.read');
    Roles.createRole('permissions.links.create');
    Roles.createRole('permissions.links.update');
    Roles.createRole('permissions.links.delete');

    Roles.addRolesToParent([
      'permissions.links.read',
      'permissions.links.create',
      'permissions.links.update',
      'permissions.links.delete',
    ], 'permissions.links');

    Roles.addRolesToParent([
      'permissions.links',
    ], 'roles.owned');

    Roles.addRolesToParent([
      'permissions.links',
    ], 'roles.admin');
  }
});