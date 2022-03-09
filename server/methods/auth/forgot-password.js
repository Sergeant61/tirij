import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'auth.forgotPassword',
  schema: new SimpleSchema({
    email: String,
  }),
  run: function (data) {
    const user = Accounts.findUserByEmail(data.email);

    if (user) {
      Accounts.sendResetPasswordEmail(user._id, data.email)
    }
  }
});
