import { QRUtil } from '../index';
import QRCodeStyling from 'qr-code-styling';

QRUtil.generateStylingQr = async function (options) {
  const _options = Object.assign(QRUtil.stylingQrOptions, options);

  const qr = new QRCodeStyling(_options);
  const buffer = await qr.getRawData(_options.type);
  return Buffer.from(buffer).toString('base64');
}