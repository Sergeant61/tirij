import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'app.domains.delete',
  mixins: [RoleMixin],
  roles: ['permissions.domains.delete'],
  schema: new SimpleSchema({
    slug: String,
    _id: SimpleSchema.RegEx.Id,
  }),
  run: function (data) {
    this.unblock();
    const { slug, _id } = data

    Domains.softRemove({ _id: _id, slug: slug });
  }
});