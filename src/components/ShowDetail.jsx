import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CastList from "./CastList.jsx";
import { statusCheck, NOT_AVAILABLE, RATE_LIMIT_MESSAGE, stripHtml, formatUpdated } from "../utils.js";

const MAX_CAST = 15;

function ShowDetail() {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cast, setCast] = useState([]);
    const [castMessage, setCastMessage] = useState("Loading cast...");

    useEffect(() => {
        setShow(null);
        setError("");
        setLoading(true);

        const controller = new AbortController();

        fetch(`https://api.tvmaze.com/shows/${id}`, { signal: controller.signal })
            .then(statusCheck)
            .then((response) => response.json())
            .then((data) => {
                setShow(data);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === "AbortError") {
                    return;
                }
                setError(err.message);
                setLoading(false);
            });

        return () => controller.abort();
    }, [id]);

    useEffect(() => {
        setCast([]);
        setCastMessage("Loading cast...");

        const controller = new AbortController();

        fetch(`https://api.tvmaze.com/shows/${id}/cast`, { signal: controller.signal })
            .then(statusCheck)
            .then((response) => response.json())
            .then((data) => {
                if (data.length === 0) {
                    setCastMessage(NOT_AVAILABLE);
                    return;
                }
                setCast(data.slice(0, MAX_CAST));
                setCastMessage("");
            })
            .catch((err) => {
                if (err.name === "AbortError") {
                    return;
                }
                if (err.message === RATE_LIMIT_MESSAGE) {
                    setCastMessage("Not available (TVmaze rate limit reached, try again shortly)");
                } else {
                    setCastMessage(NOT_AVAILABLE);
                }
            });

        return () => controller.abort();
    }, [id]);

    if (loading) {
        return <p id="status">Loading show...</p>;
    }

    if (error) {
        return (
            <article className="detail-page">
                <p>Could not load this show. {error}</p>
                <Link className="card-link" to="/">Back to the gallery</Link>
            </article>
        );
    }

    const name = show.name || "Untitled show";

    let summary = `Summary: ${NOT_AVAILABLE}`;
    const summaryText = stripHtml(show.summary);
    if (summaryText !== "") {
        summary = summaryText;
    }

    let genresText = NOT_AVAILABLE;
    if (show.genres && show.genres.length > 0) {
        genresText = show.genres.join(", ");
    }

    let ratingText = NOT_AVAILABLE;
    if (show.rating && show.rating.average) {
        ratingText = `${show.rating.average} / 10`;
    }

    let channelText = NOT_AVAILABLE;
    if (show.network && show.network.name) {
        channelText = show.network.name;
    } else if (show.webChannel && show.webChannel.name) {
        channelText = show.webChannel.name;
    }

    return (
        <article className="detail-page">
            <Link className="card-link" to="/">Back to the gallery</Link>
            <div className="poster-box">
                {show.image && show.image.medium ? (
                    <img src={show.image.medium} alt={`Poster for the TV show ${name}`} />
                ) : (
                    "Poster not available"
                )}
            </div>
            <h2 className="card-title">{name}</h2>
            <p className="card-summary">{summary}</p>
            <p className="card-detail">
                <strong>Premiered: </strong>
                <span>{show.premiered || NOT_AVAILABLE}</span>
            </p>
            <p className="card-detail">
                <strong>Last updated: </strong>
                <span>{formatUpdated(show.updated)}</span>
            </p>
            <p className="card-detail">
                <strong>Genres: </strong>
                <span>{genresText}</span>
            </p>
            <p className="card-detail">
                <strong>Rating: </strong>
                <span>{ratingText}</span>
            </p>
            <p className="card-detail">
                <strong>Status: </strong>
                <span>{show.status || NOT_AVAILABLE}</span>
            </p>
            <p className="card-detail">
                <strong>Network / channel: </strong>
                <span>{channelText}</span>
            </p>
            <h3>Cast</h3>
            {castMessage !== "" ? <p>{castMessage}</p> : <CastList cast={cast} />}
            {show.url && (
                <a className="card-link" href={show.url} target="_blank" rel="noopener">
                    View {name} on TVmaze
                </a>
            )}
        </article>
    );
}

export default ShowDetail