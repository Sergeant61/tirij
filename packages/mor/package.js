Package.describe({
  name: 'bordo:mor',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.11.1');
  api.use('ecmascript');
  api.use('mongo');
  api.use('meteorhacks:picker');
  api.use('mdg:validated-method');
  api.use('tmeasday:check-npm-versions');
  api.use('bordo:picker-rate-limiter');
  api.use('bordo:create-user');
  api.use('bordo:auto-dates');

  api.addFiles('./lib/collection/api-keys.js', ['server']);
  api.addFiles('./lib/index.js', ['client', 'server']);
  api.addFiles('swagger-util.js', ['server']);
  api.addFiles('mor.js', ['server']);
  api.export('MORAPIProducts', 'server');
});

Npm.depends({
  'array-query': '0.1.2'
});