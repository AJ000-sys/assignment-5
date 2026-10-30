import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { statusCheck, NOT_AVAILABLE, RATE_LIMIT_MESSAGE, stripHtml, formatUpdated } from "../utils.js";

const MAX_CAST = 5;

function ShowCard({ show, cachedCast, setCasts }) {
    const [castText, setCastText] = useState(cachedCast || "Loading...");

    useEffect(() => {
        if (cachedCast) {
            return;
        }

        const controller = new AbortController();

        fetch(`https://api.tvmaze.com/shows/${show.id}/cast`, { signal: controller.signal })
            .then(statusCheck)
            .then((response) => response.json())
            .then((cast) => {
                const names = [];
                for (let i = 0; i < cast.length && names.length < MAX_CAST; i++) {
                    if (cast[i].person && cast[i].person.name) {
                        names.push(cast[i].person.name);
                    }
                }

                let text = NOT_AVAILABLE;
                if (names.length > 0) {
                    text = names.join(", ");
                }

                setCastText(text);
                setCasts((c) => ({ ...c, [show.id]: text }));
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    return;
                }
                if (error.message === RATE_LIMIT_MESSAGE) {
                    setCastText("Not available (TVmaze rate limit reached, try again shortly)");
                } else {
                    setCastText(NOT_AVAILABLE);
                }
            });

        return () => controller.abort();
    }, [show.id, cachedCast, setCasts]);

    const name = show.name || "Untitled show";

    let summary = `Summary: ${NOT_AVAILABLE}`;
    const summaryText = stripHtml(show.summary);
    if (summaryText.length > 250) {
        summary = summaryText.slice(0, 250) + "...";
    } else if (summaryText !== "") {
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

    return (
        <article className="card">
            <div className="poster-box">
                {show.image && show.image.medium ? (
                    <img src={show.image.medium} alt={`Poster for the TV show ${name}`} />
                ) : (
                    "Poster not available"
                )}
            </div>
            <h2 className="card-title">
                <Link to={`/shows/${show.id}`}>{name}</Link>
            </h2>
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
                <strong>Main cast: </strong>
                <span>{castText}</span>
            </p>
            {show.url && (
                <a className="card-link" href={show.url} target="_blank" rel="noopener">
                    View {name} on TVmaze
                </a>
            )}
        </article>
    );
}

export default ShowCard