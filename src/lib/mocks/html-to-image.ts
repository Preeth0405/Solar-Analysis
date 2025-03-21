// Mock implementation of html-to-image
export const toPng = async () => 'data:image/png;base64,';
export const toJpeg = async () => 'data:image/jpeg;base64,';
export const toBlob = async () => new Blob();
export const toCanvas = async () => document.createElement('canvas');
