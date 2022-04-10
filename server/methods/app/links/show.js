import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'app.links.show',
  mixins: [RoleMixin],
  roles: ['permissions.links.read'],
  schema: new SimpleSchema({
    slug: String,
    _id: SimpleSchema.RegEx.Id,
  }),
  run: async function (data) {
    this.unblock();
    const { slug, _id } = data;

    const link = Links.findOne({ _id: _id, slug: slug });

    if (!link) {
      throw new Meteor.Error(404, 'Short url not found.');
    }

    const shortLinkDomain = Meteor.settings.public.shortLinkDomain;

    const shortLinks = [];
    const longLinks = [];

    shortLinks.push(`https://${shortLinkDomain}/${link.shortId}`);
    shortLinks.push(`${Meteor.absoluteUrl()}l/${link.shortId}`);

    longLinks.push(`https://${shortLinkDomain}/${link.longId}`);
    longLinks.push(`${Meteor.absoluteUrl()}l/${link.longId}`);

    link.shortLinks = shortLinks;
    link.longLinks = longLinks;

    return link;
  }
});


