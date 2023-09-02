const { isTokenValid } = require("../services/userServices");
const CustomError = require("../errors");
// middleware for authentication checking for tokens
const authenticationUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication failed");
  }
  try {
    const payload = isTokenValid({ token });
    // this req.user will be accessed in the next middleware easily
    req.user = { ...payload, role: payload.role, is_admin: payload.is_admin };
    next();
  } catch (err) {
    throw new CustomError.UnauthenticatedError("Authentication ");
  }
};

module.exports = { authenticationUser };
