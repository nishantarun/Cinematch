import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "./asyncHandler.js";
import User from "../models/User.js";

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

  const user = await User.findById(decoded.userId).select("username");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  req.user = {
    userId: decoded.userId,
    username: user.username,
  };

  next();
});

export default authMiddleware;
