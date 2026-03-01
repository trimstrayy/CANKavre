const QRCode = require('qrcode');

async function generateQR(data) {
  try {
    return await QRCode.toDataURL(data);
  } catch (err) {
    throw new Error('Failed to generate QR code');
  }
}

module.exports = { generateQR };