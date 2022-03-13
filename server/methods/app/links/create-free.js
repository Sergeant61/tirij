import SimpleSchema from 'simpl-schema';
const shortid = require('shortid');

new ValidatedMethod({
  name: 'app.links.createFree',
  schema: new SimpleSchema({
    link: LinkSchema.omit('slug', 'shortId', 'expireType')
  }),
  run: function (data) {
    this.unblock();
    const { link } = data

    link.slug = 'free';
    link.expireType = 'never';
    link.shortId = shortid.generate();

    const id = Links.insert(link);
    return Links.findOne({ _id: id });
  }
});