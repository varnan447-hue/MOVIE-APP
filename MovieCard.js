import React from "react";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <img src={movie.Poster} alt="poster" />

      <h5>{movie.Title}</h5>
      <p>{movie.Year}</p>

      <button onClick={() => navigate(`/details/${movie.id}`)}>
        Details
      </button>

      <button onClick={() => navigate(`/book/${movie.Title}`)}>
        🎟
      </button>
    </div>
  );
}

export default MovieCard;