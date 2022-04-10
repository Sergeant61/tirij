import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'roles.list',
  mixins: [SignedInMixin],
  validate: new SimpleSchema({}).validator(),
  run: function () {
    this.unblock();

    return {
      roles: Meteor.roles.find({ _id: { $regex: /^roles\./ } }).fetch(),
      permissions: Meteor.roles.find({ _id: { $regex: /^permissions\./ } }).fetch()
    }
  }
});
