import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'app.stores.create',
  mixins: [SignedInMixin],
  schema: new SimpleSchema({
    store: StoreSchema
  }),
  run: function (data) {
    this.unblock();
    const { store } = data

    const userId = Meteor.userId();
    const _id = Stores.insert(store);
    const _store = Stores.findOne({ _id: _id });

    Roles.addUsersToRoles(userId, 'roles.owned', _store.slug);
  }
});