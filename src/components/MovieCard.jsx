import "../css/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext"
import { Link } from "react-router-dom"

function MovieCard({movie}) {
    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext()
    const favorite = isFavorite(movie.id)

    function onFavoriteClick(e) {
        e.preventDefault()
        if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    }

    return (
              
        <div className="movie-card">
        <div className="movie-poster">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
            <div className="movie-overlay">
                <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
                    ♥
                </button>
                
            </div>
        </div>
        <div className="movie-info">
            <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer">
            <h3>{movie.title}</h3>
            </a>
            <p>{movie.release_date?.split("-")[0]}</p>
            <p className="movie-rating">{movie.vote_average?.toFixed(1)}/10</p>
        </div>
    </div>
    
)}


export default MovieCard
