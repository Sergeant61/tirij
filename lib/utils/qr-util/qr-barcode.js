import QRCode from "qrcode";

export default QRUtil = {
  generateQr: async function (text, options = { type: 'svg' }) {

    const opts = {
      errorCorrectionLevel: "H",
      quality: options.quality || 1,
      margin: options.margin || 2,
      width: options.width || 500,
      color: {
        dark: options.color?.dark || "#b54726",
        light: options.color?.light || "#dfdfd7",
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
  },
}