import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'app.stores.create',
  mixins: [SignedInMixin],
  schema: new SimpleSchema({
    store: StoreSchema
  }),
  run: function (data) {
    this.unblock();
    const { store } = data;
    return ActionStoreCreate(Meteor.userId(), store);
  }
});