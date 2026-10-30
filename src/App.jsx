import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import SearchForm from "./components/SearchForm.jsx";
import Gallery from "./components/Gallery.jsx";
import ShowDetail from "./components/ShowDetail.jsx";
import { statusCheck } from "./utils.js";
import "./App.css";

const DEFAULT_QUERY = "office";
const MAX_RESULTS = 10;

function App() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [casts, setCasts] = useState({});
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    setShows([]);
    setError("");

    if (query === "") {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then(statusCheck)
      .then((response) => response.json())
      .then((results) => {
        setShows(results.slice(0, MAX_RESULTS).map((result) => result.show));
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
  }, [query, retry]);

  function handleSearch(newQuery) {
    if (newQuery !== query) {
      setQuery(newQuery);
    } else if (error !== "") {
      // same term after a failed request: try again
      setRetry(retry + 1);
    }
  }

  return (
    <>
      <header className="site-header">
        <h1>TVmaze Show Gallery</h1>
        <Routes>
          <Route
            path="/"
            element={<SearchForm initialValue={query} disabled={loading} onSearch={handleSearch} />}
          />
        </Routes>
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Gallery
                query={query}
                shows={shows}
                loading={loading}
                error={error}
                casts={casts}
                setCasts={setCasts}
              />
            }
          />
          <Route path="/shows/:id" element={<ShowDetail />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <p>
          Data provided by{" "}
          <a href="https://www.tvmaze.com/" target="_blank" rel="noopener">TVmaze.com</a>,
          licensed under{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>.
          See the{" "}
          <a href="https://www.tvmaze.com/api#licensing" target="_blank" rel="noopener">
            TVmaze API licensing terms
          </a>.
        </p>
      </footer>
    </>
  );
}

export default App