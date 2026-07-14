import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_KEY = "c58f337d8f256c7dc0540199334b5f69";
const IMG = "https://image.tmdb.org/t/p/w500";

function Details() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
      );

      const data = await res.json();
      setMovie(data);
    }

    fetchData();
  }, [id]);

  if (!movie)
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>{movie.title}</h1>

      <img
        src={
          movie.poster_path
            ? IMG + movie.poster_path
            : "https://dummyimage.com/300x450"
        }
        alt="poster"
      />

      <p style={{ marginTop: "20px" }}>{movie.overview}</p>
    </div>
  );
}

export default Details;