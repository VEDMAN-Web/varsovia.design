const crypto = require("crypto");
const { sendError } = require("../utils/apiResponse");

/**
 * Timing-safe shared-secret auth for CMS / admin API access.
 * Clients must send header: x-admin-key: <ADMIN_KEY>
 *
 * On success sets req.varsoviaAdmin = true so handlers can return full CMS payloads
 * without requiring ?cms=1 on every write.
 */
function adminAuth(req, res, next) {
  const key = req.headers["x-admin-key"];
  const expected = process.env.ADMIN_KEY || "";

  if (!key || !expected) {
    return sendError(res, 401, { message: "Unauthorized" });
  }

  try {
    const keyHash = crypto.createHash("sha256").update(Buffer.from(String(key))).digest();
    const expectedHash = crypto
      .createHash("sha256")
      .update(Buffer.from(String(expected)))
      .digest();

    if (!crypto.timingSafeEqual(keyHash, expectedHash)) {
      return sendError(res, 401, { message: "Unauthorized" });
    }
  } catch {
    return sendError(res, 401, { message: "Unauthorized" });
  }

  req.varsoviaAdmin = true;
  return next();
}

/**
 * Public GETs stay open. Full CMS shape when:
 * - ?cms=1 is set, or
 * - a valid x-admin-key is provided (so admin clients see hidden rows / multilingual docs).
 */
function requireAdminIfCms(req, res, next) {
  const wantsCms = String(req.query?.cms || "") === "1";
  const hasKey = Boolean(req.headers["x-admin-key"]);
  if (wantsCms || hasKey) {
    return adminAuth(req, res, next);
  }
  return next();
}

module.exports = adminAuth;
module.exports.adminAuth = adminAuth;
module.exports.requireAdminIfCms = requireAdminIfCms;
