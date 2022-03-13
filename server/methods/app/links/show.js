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

    return Links.findOne({ _id: _id, slug: slug });
  }
});


