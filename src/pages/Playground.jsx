import { useState } from "react";
import MovieCard from "../components/MovieCard";
import { discoverMovies } from "../services/api";
import "../css/Playground.css";

// small set of genres for dropdown - IDs according to TMDB
const GENRES = [
  { id: "", name: "Any" },
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 10749, name: "Romance" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Science Fiction" },
];

// common sort options
const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "popularity.desc", label: "Most popular" },
  { value: "release_date.desc", label: "Newest" },
  { value: "vote_average.desc", label: "Highest rated" },
];

function Playground() {
  // search panel state
  const [params, setParams] = useState({
    primary_release_year: "",
    with_genres: "",
    "vote_average.gte": "",
    sort_by: "",
  });
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleSearch = async (searchParams) => {
    // skip if almost all fields empty
    if (
      !searchParams.primary_release_year &&
      !searchParams.with_genres &&
      !searchParams["vote_average.gte"] &&
      !searchParams.sort_by
    ) {
      // no query – make sure we're not stuck in loading mode
      setLoading(false);
      return;
    }

    // clear previous results & error so UI can reflect new search
    setMovies([]);
    setError(null);

    setLoading(true);
    try {
      const results = await discoverMovies(searchParams);
      // ensure array
      setMovies(Array.isArray(results) ? results : []);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to search movies...");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(params);
  };


  const renderPanel = (
    params,
    onChange,
    onSubmit,
    movies,
    error,
    loading
  ) => (
    <div className="panel">
      <form onSubmit={onSubmit} className="search-form">
        <input
          type="number"
          name="primary_release_year"
          placeholder="Year"
          className="search-input"
          value={params.primary_release_year}
          onChange={onChange}
        />
        <select
          name="with_genres"
          value={params.with_genres}
          onChange={onChange}
          className="search-input"
        >
          {GENRES.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.1"
          min="0"
          max="10"
          name="vote_average.gte"
          placeholder="Min rating"
          className="search-input"
          value={params["vote_average.gte"]}    
          onChange={onChange}
        />
        <select
          name="sort_by"
          value={params.sort_by}
          onChange={onChange}
          className="search-input"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button type="submit" className="search-button" disabled={loading}>
          Search
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <div className="movies-grid">
        {loading && <div className="loading">Loading...</div>}
        {/* guard against undefined/null or non-array results */}
        {(movies || []).length === 0 && !loading && <div>No movies found</div>}
        {(movies || []).map((m, idx) =>
          m ? <MovieCard movie={m} key={m.id || idx} /> : null
        )}
      </div>
    </div>
  );

  return (
    <>
    <div className="playground">
      <h1>Movie Playground</h1>
    </div>
    <div className="playground-panels">
      {renderPanel(params, onChange, onSubmit, movies, error, loading)}
    </div>
    </>
  );
}

export default Playground;