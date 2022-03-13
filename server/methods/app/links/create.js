import SimpleSchema from 'simpl-schema';
const shortid = require('shortid');

new ValidatedMethod({
  name: 'app.links.create',
  mixins: [RoleMixin],
  roles: ['permissions.links.create'],
  schema: new SimpleSchema({
    slug: String,
    link: LinkSchema.omit('slug', 'shortId')
  }),
  run: function (data) {
    this.unblock();
    const { slug, link } = data

    link.slug = slug;
    link.shortId = shortid.generate();

    const id = Links.insert(link);
    return Links.findOne({ _id: id });
  }
});