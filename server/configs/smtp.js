if(Meteor.settings.smtp) {
  const username = Meteor.settings.smtp.username;
  const password = Meteor.settings.smtp.password;
  const server = Meteor.settings.smtp.server;
  const port = Meteor.settings.smtp.port;
  const protocol = Meteor.settings.smtp.protocol;

  process.env.MAIL_URL = protocol + '://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + encodeURIComponent(server) + ':' + port;
}
