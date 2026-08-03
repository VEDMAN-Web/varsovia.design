const crypto = require("crypto");
const { sendError } = require("../utils/apiResponse");

/**
 * Timing-safe admin key verification.
 * Uses crypto.timingSafeEqual to prevent timing-based brute-force attacks
 * where an attacker could determine the key length/prefix by measuring response time.
 */
function adminAuth(req, res, next) {
  const key = req.headers["x-admin-key"];
  const expected = process.env.ADMIN_KEY || "";

  if (!key || !expected) {
    return sendError(res, 401, { message: "Unauthorized" });
  }

  try {
    // Buffers must be equal length for timingSafeEqual — pad/hash to same length
    const keyBuf      = Buffer.from(key);
    const expectedBuf = Buffer.from(expected);

    // If lengths differ, the key is wrong — but still run comparison to avoid
    // length-based timing leak by comparing hashes (fixed 32-byte output)
    const keyHash      = crypto.createHash("sha256").update(keyBuf).digest();
    const expectedHash = crypto.createHash("sha256").update(expectedBuf).digest();

    if (!crypto.timingSafeEqual(keyHash, expectedHash)) {
      return sendError(res, 401, { message: "Unauthorized" });
    }
  } catch {
    return sendError(res, 401, { message: "Unauthorized" });
  }

  next();
}

module.exports = adminAuth;
