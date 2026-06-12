import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "./asyncHandler.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ApiError(401, "Authorization header missing");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Invalid token format");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = {
    userId: decoded.userId,
  };

  next();
});

export default authMiddleware;
