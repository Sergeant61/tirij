import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'link.create',
  mixins: [RoleMixin],
  roles: ['permissions.link.create'],
  validate: new SimpleSchema({
    link: LinkSchema.omit('userId')
  }).validator(),
  run: function (data) {
    this.unblock();
    const { link } = data

    link.userId = Meteor.userId();

    const id = Links.insert(link);
    return Links.findOne({ _id: id });
  }
});