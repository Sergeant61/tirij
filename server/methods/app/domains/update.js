import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'app.domains.update',
  mixins: [RoleMixin],
  roles: ['permissions.domains.update'],
  schema: new SimpleSchema({
    slug: String,
    _id: SimpleSchema.RegEx.Id,
    domain: DomainSchema.omit('slug')
  }),
  run: function (data) {
    this.unblock();
    const { slug, _id, domain } = data

    domain.slug = slug;

    const id = Domains.update({ _id: _id, slug: slug }, {
      $set: domain
    });

    return Domains.findOne({ _id: id });
  }
});