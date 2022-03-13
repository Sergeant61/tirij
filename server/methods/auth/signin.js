import SimpleSchema from 'simpl-schema';
import { hashSync, compareSync } from 'bcrypt';

new ValidatedMethod({
  name: 'auth.signin',
  schema: new SimpleSchema({
    email: String,
    password: String,
  }),
  run: function (data) {
    const user = Meteor.users.findOne({ 'emails.address': data.email });

    if (!user) {
      ErrorHandler('error', i18n.__('auth.methods', 'userNotFound'));
    }

    const checkPassword = Accounts._checkPassword(user, data.password)

    if (checkPassword.error) {
      ErrorHandler('error', i18n.__('auth.methods', 'userNotFound'));
    }

    const stampedLoginToken = Accounts._generateStampedLoginToken();
    Accounts._insertLoginToken(user._id, stampedLoginToken);

    return {
      userId: user._id,
      token: stampedLoginToken.token,
    };
  }
});
