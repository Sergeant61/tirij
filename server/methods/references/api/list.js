import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'references.apis.list',
  validate: new SimpleSchema({}).validator(),
  run: function () {
    this.unblock();
    return {
      apis: MORAPIProducts
    };
  }
});