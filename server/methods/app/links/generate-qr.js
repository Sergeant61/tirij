import SimpleSchema from 'simpl-schema';
import QRUtil from '../../../../lib/utils/qr-util/qr-barcode';

new ValidatedMethod({
  name: 'app.links.createQr',
  mixins: [RoleMixin],
  roles: ['permissions.links.read'],
  schema: new SimpleSchema({
    slug: String,
    _id: SimpleSchema.RegEx.Id,
    options: Object,
    'options.linkType': {
      type: String,
      allowedValues: ['short', 'long']
    },
    'options.qrType': {
      type: String,
      allowedValues: ['png', 'svg']
    },
    'options.color': {
      type: Object,
      optional: true
    },
    'options.color.dark': String,
    'options.color.light': String,
  }),
  run: async function (data) {
    this.unblock();
    const { slug, _id, options } = data;

    const result = Methods.call('app.links.show', { slug: slug, _id: _id });

    let link = '';
    if (options.linkType == 'short') {
      link = result.shortLinks[0];
    }

    if (options.linkType == 'long') {
      link = result.longLinks[0];
    }

    return await QRUtil.generateQr(link, { type: options.qrType, color: options.color });
  }
});