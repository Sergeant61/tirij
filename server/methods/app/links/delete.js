import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'app.links.delete',
  mixins: [RoleMixin],
  roles: ['permissions.links.delete'],
  schema: new SimpleSchema({
    slug: String,
    _id: SimpleSchema.RegEx.Id
  }),
  run: async function (data) {
    this.unblock();
    const { slug, _id } = data;

    Links.softRemove({ _id: _id, slug: slug });
  }
});




