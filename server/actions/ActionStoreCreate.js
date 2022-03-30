ActionStoreCreate = function (userId, store) {
  const _id = Stores.insert(store);
  const _store = Stores.findOne({ _id: _id });

  Roles.addUsersToRoles(userId, 'roles.owned', _store.slug);
  return _store;
}