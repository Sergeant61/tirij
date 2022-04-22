import QRCode from "qrcode";

export const QRUtil = {

  stylingQrOptions: {
    width: 300,
    height: 300,
    type: "svg",
    data: Meteor.absoluteUrl(),
    dotsOptions: {
      color: "#1a3b7d",
      type: "rounded"
    },
    backgroundOptions: {
      color: "#bde5fb",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 20
    }
  },

  generateQr: async function (text, options = { type: 'svg' }) {

    const opts = {
      errorCorrectionLevel: "H",
      quality: options.quality || 1,
      margin: options.margin || 2,
      width: options.width || 500,
      color: {
        dark: options.color?.dark || "#1a3b7d",
        light: options.color?.light || "#bde5fb",
      },
    };

    if (options.type == 'svg') {
      opts.type = 'svg';
      return await QRCode.toString(text, opts);
    }

    if (options.type == 'png') {
      opts.type = 'image/png';
      return await QRCode.toDataURL(text, opts);
    }
  }
}