import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'app.links.update',
  mixins: [RoleMixin],
  roles: ['permissions.links.update'],
  schema: new SimpleSchema({
    slug: String,
    _id: SimpleSchema.RegEx.Id,
    link: LinkSchema.omit('slug', 'shortId', 'longId')
  }),
  run: function (data) {
    this.unblock();
    const { slug, _id, link } = data;

    const id = Links.update({ _id: _id, slug: slug }, {
      $set: link
    });

    return Links.findOne({ _id: id });
  }
});







