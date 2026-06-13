import axios from "axios";
import ApiError from "../utils/ApiError.js"

export const getPopularMovies = async () => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/popular",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN.trim()}`,
        },
      },
    );

    return response.data.results.map((movie) => ({
      movieId: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      releaseDate: movie.release_date,
      rating: movie.vote_average,
    }));
  } catch (error) {
    console.error("TMDB Error:", error.message);

    throw new ApiError(503, "Movie service temporarily unavailable");
  }
};

export const getMovieDeck = async (size = 20) => {
  const movies = await getPopularMovies();
  return movies.slice(0, size);
};
