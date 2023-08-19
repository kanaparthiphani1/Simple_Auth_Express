const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token =
    req.cookies.token ||
    req.body.token ||
    req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(402).send({ status: "No Access" });
  }
  try {
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    req.body.user = decode;
  } catch (e) {
    return res.status(402).send({ status: "Invalid Token" });
  }

  return next();
};

module.exports = auth;
