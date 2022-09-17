import SimpleSchema from 'simpl-schema';
const ip = require("ip");

new ValidatedMethod({
  name: 'app.domains.list',
  mixins: [RoleMixin],
  roles: ['permissions.domains.read'],
  schema: new SimpleSchema({
    slug: String,
    options: QueryOptionsSchema
  }),
  run: function (data) {
    this.unblock();
    const { slug, options } = data

    const result = FetchByIndex(Domains, { slug: slug }, options, null);
    result.serverIp = ip.address();

    return result;
  }
});
