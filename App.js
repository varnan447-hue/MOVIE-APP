import React, { useEffect, useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import MovieCard from "./components/MovieCard";
import Favorites from "./components/Favorites";
import Splash from "./components/Splash";
import Login from "./components/login";
import Details from "./components/Details";
import Booking from "./components/Booking";
import Bookings from "./components/Bookings";
import Statistics from "./components/Statistics";

import { Routes, Route } from "react-router-dom";

const API_KEY = "c58f337d8f256c7dc0540199334b5f69";
const IMG = "https://image.tmdb.org/t/p/w500";

function App() {
  const [loading, setLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);

  // ✅ NEW: track what mode we're in so we know what to show
  const [searchQuery, setSearchQuery] = useState(""); // active search term
  const [activeGenre, setActiveGenre] = useState(""); // active genre filter

  // 🔥 AUTO SPLASH FIX
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🔥 Trending
  async function fetchTrending() {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
    );
    const data = await res.json();
    setTrending(data.results || []);
  }

  // 🔍 Search — ✅ FIXED: now clears genre, sets searchQuery so UI updates
  async function searchMovie(q) {
    if (!q) return;

    setSearchQuery(q);
    setActiveGenre("");

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&api_key=${API_KEY}`
    );
    const data = await res.json();
    setMovies(data.results || []);
  }

  // 🎭 Genre — ✅ FIXED: clears searchQuery so UI updates
  async function fetchByGenre(type) {
    const map = { Action: 28, Comedy: 35, Drama: 18, Horror: 27 };

    setActiveGenre(type);
    setSearchQuery("");

    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${map[type]}`
    );
    const data = await res.json();
    setMovies(data.results || []);
  }

  // ✅ NEW: clear search and go back to trending
  function clearSearch() {
    setSearchQuery("");
    setActiveGenre("");
    setMovies([]);
  }

  useEffect(() => {
    fetchTrending();
  }, []);

  if (loading) return <Splash onFinish={() => setLoading(false)} />;
  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  // ✅ Are we in search/genre mode?
  const isFiltered = searchQuery !== "" || activeGenre !== "";

  return (
    <>
      <Navbar onSearch={searchMovie} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Genre Buttons — always visible */}
              <h3>🎭 Genres</h3>
              <div>
                {["Action", "Comedy", "Drama", "Horror"].map((g) => (
                  <button
                    key={g}
                    onClick={() => fetchByGenre(g)}
                    style={activeGenre === g ? { outline: "2px solid white" } : {}}
                  >
                    {g}
                  </button>
                ))}
                {/* ✅ Clear button — only shown when filtering */}
                {isFiltered && (
                  <button onClick={clearSearch} style={{ background: "#333" }}>
                    ✕ Clear
                  </button>
                )}
              </div>

              {/* ✅ FIXED: Show search/genre results FIRST when active */}
              {isFiltered ? (
                <>
                  <h2>
                    {searchQuery
                      ? `🔍 Results for "${searchQuery}"`
                      : `🎭 ${activeGenre} Movies`}
                  </h2>
                  {movies.length === 0 ? (
                    <p style={{ padding: "20px" }}>No results found.</p>
                  ) : (
                    <div className="row">
                      {movies.map((m) => (
                        <MovieCard
                          key={m.id}
                          movie={{
                            id: m.id,
                            Title: m.title,
                            Year: m.release_date,
                            Poster: m.poster_path
                              ? IMG + m.poster_path
                              : "https://dummyimage.com/300x450/000/fff&text=No+Image",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* ✅ Only show Trending when NOT searching */
                <>
                  <h2>🔥 Trending Movies</h2>
                  <div className="row">
                    {trending.map((m) => (
                      <MovieCard
                        key={m.id}
                        movie={{
                          id: m.id,
                          Title: m.title,
                          Year: m.release_date,
                          Poster: m.poster_path
                            ? IMG + m.poster_path
                            : "https://dummyimage.com/300x450/000/fff&text=No+Image",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          }
        />

        <Route path="/favorites" element={<Favorites />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/book/:title" element={<Booking />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
    </>
  );
}

export default App;