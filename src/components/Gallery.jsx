import ShowList from "./ShowList.jsx";
import ResultsSummary from "./ResultsSummary.jsx";

function Gallery({ query, shows, loading, error, casts, setCasts }) {
    if (query === "") {
        return <p id="status">Please enter a show title or keyword to search.</p>;
    }

    if (loading) {
        return <p id="status" aria-live="polite">{`Searching for "${query}"...`}</p>;
    }

    if (error) {
        return <p id="status">{`Could not load shows. ${error}`}</p>;
    }

    if (shows.length === 0) {
        return (
            <p id="status">
                {`No shows found for "${query}". Try a different title or keyword.`}
            </p>
        );
    }

    return (
        <>
            <ResultsSummary count={shows.length} query={query} />
            <ShowList shows={shows} casts={casts} setCasts={setCasts} />
        </>
    );
}

export default Gallery