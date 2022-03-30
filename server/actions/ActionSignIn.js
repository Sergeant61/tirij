ActionSignIn = function (email, password) {
  const user = Meteor.users.findOne({ 'emails.address': email });

  if (!user) {
    ErrorHandler('error', i18n.__('auth.methods', 'userNotFound'));
  }

  const checkPassword = Accounts._checkPassword(user, password);

  if (checkPassword.error) {
    ErrorHandler('error', i18n.__('auth.methods', 'userNotFound'));
  }

  const stampedLoginToken = Accounts._generateStampedLoginToken();
  Accounts._insertLoginToken(user._id, stampedLoginToken);

  stampedLoginToken.userId = user._id;
  return stampedLoginToken;
}