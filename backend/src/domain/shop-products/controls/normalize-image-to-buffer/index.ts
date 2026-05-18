const normalizeImageToBuffer = (raw: any): Buffer | null => {
  if (!raw && raw !== 0) return null;
  if (Buffer.isBuffer(raw)) return raw;
  // mongodb Binary (driver) has .buffer
  if (raw && raw.buffer && (raw.buffer instanceof ArrayBuffer || Buffer.isBuffer(raw.buffer))) {
    return Buffer.from(raw.buffer);
  }
  // driver Binary may expose .value or .sub_type etc.
  if (raw && raw._bsontype === 'Binary') {
    const b = (raw as any).buffer ?? (raw as any).value;
    if (b) return Buffer.from(b);
  }
  // If object like { $binary: { base64: '...' } }
  if (raw && raw.$binary && typeof raw.$binary.base64 === 'string') {
    return Buffer.from(raw.$binary.base64, 'base64');
  }
  // If plain base64 string
  if (typeof raw === 'string') {
    // try to detect data URL
    const m = raw.match(/^data:.*;base64,(.*)$/);
    const b64 = m ? m[1] : raw.replace(/^"|"$/g, '').replace(/\s+/g, '');
    try {
      return Buffer.from(b64, 'base64');
    } catch {
      return null;
    }
  }
  // TypedArray / ArrayBuffer
  if (ArrayBuffer.isView(raw)) return Buffer.from((raw as Uint8Array).buffer);
  if (raw instanceof ArrayBuffer) return Buffer.from(raw);
  return null;
};

export default normalizeImageToBuffer;
