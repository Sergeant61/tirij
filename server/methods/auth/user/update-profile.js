import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'user.updateProfile',
  mixins: [RoleMixin],
  roles: ['permissions.users.updateProfile'],
  schema: new SimpleSchema({
    firstName: String,
    lastName: String
  }),
  run: function (data) {
    this.unblock();
    const { firstName, lastName} = data;

    const userId = Meteor.userId();

    Meteor.users.update({ _id: userId }, {
      $set: {
        'profile.firstName': firstName,
        'profile.lastName': lastName
      }
    })
  }
});



