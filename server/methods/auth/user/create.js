import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'user.create',
  schema: new SimpleSchema({
    emailAddress: String,
    password: String,
    profile: UserProfileSchema.omit('isAdmin'),
  }),
  run: function (data) {
    this.unblock();
    const { emailAddress, password, profile } = data

    Accounts.createUser({
      email: emailAddress,
      password: password,
      profile: profile
    });
  }
});