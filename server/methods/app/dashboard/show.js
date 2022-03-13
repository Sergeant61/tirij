import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
  name: 'app.dashboard.show',
  mixins: [SignedInMixin],
  schema: new SimpleSchema({
    slug: String,
  }),
  run: async function (data) {
    this.unblock();
    const { slug } = data;

    const obj = {
      shortenedUrls: {
        never: 0,
        date: 0,
        count: 0,
      }
    }

    obj.shortenedUrls.never = Links.find({ expireType: 'never', slug: slug }).count();
    obj.shortenedUrls.date = Links.find({ expireType: 'date', slug: slug }).count();
    obj.shortenedUrls.count = Links.find({ expireType: 'count', slug: slug }).count();

    return obj;
  }
});


