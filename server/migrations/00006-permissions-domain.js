Migrations.add({
  version: 6,
  name: 'İzinler tanimlaniyor: permissions.domain',
  up: function () {
    Roles.createRole('permissions.domains');
    Roles.createRole('permissions.domains.read');
    Roles.createRole('permissions.domains.create');
    Roles.createRole('permissions.domains.update');
    Roles.createRole('permissions.domains.delete');

    Roles.addRolesToParent([
      'permissions.domains.read',
      'permissions.domains.create',
      'permissions.domains.update',
      'permissions.domains.delete',
    ], 'permissions.domains');

    Roles.addRolesToParent([
      'permissions.domains',
    ], 'roles.owned');

    Roles.addRolesToParent([
      'permissions.domains',
    ], 'roles.admin');
  }
});