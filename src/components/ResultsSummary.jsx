function ResultsSummary({ count, query }) {
    return (
        <p id="status" aria-live="polite">
            {`Showing ${count} result(s) for "${query}".`}
        </p>
    );
}

export default ResultsSummary