import crypto from "crypto";
import "server-only";

// Integrated Encryption Scheme
const AGL = "aes-256-cbc"; // Key length in 32 bytes
// https://generate-random.org/encryption-key-generator?count=1&bytes=32&cipher=aes-256-cbc&string=&password=

export const symmetricEncrypt = (data: string) => {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) throw new Error("Encryption key not found");
  const keyBuffer = Buffer.from(key, "hex");
  if (keyBuffer.length !== 32) {
    throw new Error(
      `Invalid key length: Expected 32 bytes, got ${keyBuffer.length}`
    );
  }
  const iv = crypto.randomBytes(16);

  const ciper = crypto.createCipheriv(AGL, Buffer.from(key, "hex"), iv);

  // abcd => d32d
  let encrypted = ciper.update(data);
  encrypted = Buffer.concat([encrypted, ciper.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const symmetricDecrypt = (encrypted: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("Encryption key not found");
  const textParts = encrypted.split(":");
  const iv = Buffer.from(textParts.shift() as string, "hex");
  const encryptedText = Buffer.from(textParts.join(":"));
  const decipher = crypto.createDecipheriv(AGL, Buffer.from(key, "hex"), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
