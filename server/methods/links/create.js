import SimpleSchema from 'simpl-schema';
const shortid = require('shortid');

new ValidatedMethod({
  name: 'link.create',
  mixins: [RoleMixin],
  roles: ['permissions.link.create'],
  schema: new SimpleSchema({
    link: LinkSchema.omit('userId', 'shortId')
  }),
  run: function (data) {
    this.unblock();
    const { link } = data

    link.userId = Meteor.userId();
    link.shortId = shortid.generate();

    const id = Links.insert(link);
    return Links.findOne({ _id: id });
  }
});