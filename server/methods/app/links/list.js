import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'app.links.list',
  mixins: [RoleMixin],
  roles: ['permissions.links.read'],
  schema: new SimpleSchema({
    slug: String,
    options: QueryOptionsSchema
  }),
  run: function (data) {
    this.unblock();
    const { slug, options } = data

    const result = FetchByIndex(Links, { slug: slug }, options, null);
    const shortLinkDomain = Meteor.settings.public.shortLinkDomain;

    const domains = Domains.find({ slug: slug, }).fetch();

    result.data = result.data.map(link => {
      const shortLinks = [];
      const longLinks = [];

      shortLinks.push(`https://${shortLinkDomain}/${link.shortId}`);
      shortLinks.push(`${Meteor.absoluteUrl()}l/${link.shortId}`);

      longLinks.push(`https://${shortLinkDomain}/${link.longId}`);
      longLinks.push(`${Meteor.absoluteUrl()}l/${link.longId}`);

      domains.forEach(domain => {
        shortLinks.push(`https://${domain.host}/${link.shortId}`);
        longLinks.push(`https://${domain.host}/${link.longId}`);
      });

      link.shortLinks = shortLinks;
      link.longLinks = longLinks;

      return link;
    });

    return result;
  }
});
