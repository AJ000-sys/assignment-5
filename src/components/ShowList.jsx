import ShowCard from "./ShowCard.jsx";

function ShowList({ shows, casts, setCasts }) {
    return (
        <section id="gallery" className="gallery" aria-label="Search results">
            {shows.map((show) => (
                <ShowCard
                    key={show.id}
                    show={show}
                    cachedCast={casts[show.id]}
                    setCasts={setCasts}
                />
            ))}
        </section>
    );
}

export default ShowList