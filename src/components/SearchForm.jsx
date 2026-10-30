import { useState } from "react";

function SearchForm({ initialValue, disabled, onSearch }) {
    const [inputValue, setInputValue] = useState(initialValue);

    function handleSubmit(event) {
        event.preventDefault();
        onSearch(inputValue.trim());
    }

    return (
        <form id="search-form" onSubmit={handleSubmit}>
            <label htmlFor="search-input">Search shows by title or keyword</label>
            <div className="search-row">
                <input
                    type="text"
                    id="search-input"
                    name="q"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                />
                <button type="submit" disabled={disabled}>Search</button>
            </div>
        </form>
    );
}

export default SearchForm