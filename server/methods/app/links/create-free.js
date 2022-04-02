import SimpleSchema from 'simpl-schema';
const shortid = require('shortid');
const dayjs = require('dayjs')

new ValidatedMethod({
  name: 'app.links.createFree',
  schema: new SimpleSchema({
    link: LinkSchema.omit('slug', 'shortId', 'expireType', 'longId')
  }),
  run: function (data) {
    this.unblock();
    const { link } = data

    link.slug = 'free';
    link.expireType = 'date';
    link.expireAt = dayjs().add(7, 'day').toDate();
    link.shortId = shortid.generate();
    link.longId = Random.id(50);

    const id = Links.insert(link);
    const _link = Links.findOne({ _id: id });

    const shortLinkDomain = Meteor.settings.public.shortLinkDomain;
    const shortLinks = [];

    shortLinks.push(`https://${shortLinkDomain}/${link.shortId}`);
    shortLinks.push(`${Meteor.absoluteUrl()}l/${link.shortId}`);
    _link.shortLinks = shortLinks;

    return _link;
  }
});