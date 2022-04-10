import { QRUtil } from '../index';
const { QRCodeStyling } = require("qr-code-styling-node/lib/qr-code-styling.common.js");
const nodeCanvas = require("canvas");
const { JSDOM } = require("jsdom");

QRUtil.generateStylingQr = async function (options) {
  const _options = Object.assign(QRUtil.stylingQrOptions, options);

  _options.jsdom = JSDOM;
  _options.nodeCanvas = nodeCanvas;

  const qr = new QRCodeStyling(_options);
  const buffer = await qr.getRawData(_options.type);
  return Buffer.from(buffer).toString('base64');
}