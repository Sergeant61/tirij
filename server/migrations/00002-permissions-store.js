Migrations.add({
  version: 2,
  name: 'İzinler tanimlaniyor: permissions.store',
  up: function () {
    Roles.createRole('permissions.stores');
    Roles.createRole('permissions.stores.read');
    Roles.createRole('permissions.stores.create');
    Roles.createRole('permissions.stores.update');
    Roles.createRole('permissions.stores.delete');

    Roles.addRolesToParent([
      'permissions.stores.read',
      'permissions.stores.create',
      'permissions.stores.update',
      'permissions.stores.delete',
    ], 'permissions.stores');

    Roles.addRolesToParent([
      'permissions.stores',
    ], 'roles.owned');

    Roles.addRolesToParent([
      'permissions.stores',
    ], 'roles.admin');
  }
});