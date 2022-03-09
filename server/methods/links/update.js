import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'link.update',
  mixins: [RoleMixin],
  roles: ['permissions.link.update'],
  schema: new SimpleSchema({
    _id: SimpleSchema.RegEx.Id,
    link: LinkSchema
  }),
  run: function (data) {
    this.unblock();
    const { _id, link } = data

    const id = Links.update({ _id: _id }, {
      $set: link
    });

    return Links.findOne({ _id: id });
  }
});







