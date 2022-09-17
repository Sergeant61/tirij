import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'app.domains.create',
  mixins: [RoleMixin],
  roles: ['permissions.domains.create'],
  schema: new SimpleSchema({
    slug: String,
    domain: DomainSchema.omit('slug')
  }),
  run: function (data) {
    this.unblock();
    const { slug, domain } = data

    domain.slug = slug;

    const count = Domains.find({ slug: slug }).count();
    if (count >= 5) {
      throw new Meteor.Error('error', 'You can create up to 5 Domains.');
    }

    const isExistsDomain = Domains.findOne({ slug: slug, host: domain.host }) ? true : false;
    if (isExistsDomain) {
      throw new Meteor.Error('error', 'This domain is already defined.');
    }

    const id = Domains.insert(domain);
    return Domains.findOne({ _id: id });
  }
});