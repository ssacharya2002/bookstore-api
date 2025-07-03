import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-key");

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Please authenticate" });
  }
};
