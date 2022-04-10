import SimpleSchema from 'simpl-schema';
import { QRUtil } from '../../../../lib/utils/qr-util/index';

const qrOptionsSchema = new SimpleSchema({
  width: {
    type: SimpleSchema.Integer,
    optional: true
  },
  height: {
    type: SimpleSchema.Integer,
    optional: true
  },
  margin: {
    type: SimpleSchema.Integer,
    optional: true
  },
  type: {
    type: String,
    allowedValues: ['png', 'jpeg', 'webp', 'svg'],
    optional: true
  },
  image: {
    type: SimpleSchema.RegEx.Url,
    optional: true
  },
  qrOptions: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  imageOptions: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  dotsOptions: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  cornersSquareOptions: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  backgroundOptions: {
    type: Object,
    blackbox: true,
    optional: true,
  }
});

new ValidatedMethod({
  name: 'app.links.createQr',
  mixins: [RoleMixin],
  roles: ['permissions.links.read'],
  schema: new SimpleSchema({
    slug: String,
    _id: SimpleSchema.RegEx.Id,
    type: {
      type: String,
      allowedValues: ['short', 'long']
    },
    options: {
      type: qrOptionsSchema,
      optional: true
    },
  }),
  run: async function (data) {
    this.unblock();
    const { slug, _id, type, options } = data;
    const _options = options || { type: 'svg' };

    const result = Meteor.call('app.links.show', { slug: slug, _id: _id });

    if (!result) {
      throw new Meteor.Error(404, 'Short url not found.');
    }

    let link = '';
    if (type == 'short') {
      link = result.shortLinks[0];
    }

    if (type == 'long') {
      link = result.longLinks[0];
    }

    _options.data = link;

    try {
      result.base64 = await QRUtil.generateStylingQr(_options);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
});