import asyncHandler from "../middlewares/asyncHandler.js";
import { getPopularMovies } from "../services/tmdb.service.js";

export const getMovies = asyncHandler(async (req, res) => {
  const movies = await getPopularMovies();

  res.status(200).json({
    success: true,
    movies,
  });
});
