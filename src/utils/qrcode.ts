import QRCode from "qrcode";

export const generateQrisCodeSVG = async (text: string): Promise<string> => {
  return await QRCode.toString(text, {
    type: "svg",
    width: 512,
    margin: 2,
    errorCorrectionLevel: "M",
  });
};
