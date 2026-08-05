/**
 * @deprecated Admin API no longer uses a shared ADMIN_KEY.
 * CMS routes are open to configured CORS origins + admin rate limits.
 * Re-enable secret-based auth here when the admin panel adds its own login.
 */
function adminAuth(_req, _res, next) {
  next();
}

module.exports = adminAuth;
